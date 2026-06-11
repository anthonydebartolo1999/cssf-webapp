const PUSH_SCOPES = new Set(["staff", "public"]);

function sendJson(response, statusCode, payload) {
  response.status(statusCode);
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.send(JSON.stringify(payload));
}

async function readJsonBody(request) {
  if (!request.body) return {};
  if (typeof request.body === "object") return request.body;

  try {
    return JSON.parse(request.body);
  } catch {
    return {};
  }
}

function getEnv(name) {
  return process.env[name] || "";
}

function getRequiredEnv(name) {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getSupabaseRestUrl(pathname) {
  const baseUrl = getRequiredEnv("SUPABASE_URL").replace(/\/$/, "");
  return `${baseUrl}/rest/v1/${pathname.replace(/^\//, "")}`;
}

function getSupabaseAuthUrl(pathname) {
  const baseUrl = getRequiredEnv("SUPABASE_URL").replace(/\/$/, "");
  return `${baseUrl}/auth/v1/${pathname.replace(/^\//, "")}`;
}

function getSupabaseHeaders() {
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

function normalizeSubscriptionPayload(body) {
  const subscription = body?.subscription;
  const endpoint = subscription?.endpoint || "";
  const p256dhKey = subscription?.keys?.p256dh || "";
  const authKey = subscription?.keys?.auth || "";
  const scope = String(body?.scope || "").trim().toLowerCase();

  if (!endpoint || !p256dhKey || !authKey || !PUSH_SCOPES.has(scope)) {
    return null;
  }

  return {
    endpoint,
    subscription,
    p256dh_key: p256dhKey,
    auth_key: authKey,
    scope,
    device_label: String(body?.deviceLabel || "").slice(0, 120),
    user_agent: String(body?.userAgent || "").slice(0, 500),
    active: true,
    last_seen_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

async function upsertSubscription(payload) {
  const response = await fetch(`${getSupabaseRestUrl("push_subscriptions")}?on_conflict=endpoint,scope`, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Supabase subscription upsert failed: ${response.status}`);
  }
}

async function listActiveSubscriptions(scope) {
  if (!PUSH_SCOPES.has(scope)) {
    throw new Error("Invalid push scope");
  }

  const response = await fetch(
    `${getSupabaseRestUrl("push_subscriptions")}?select=endpoint,subscription,p256dh_key,auth_key,scope&id=not.is.null&scope=eq.${scope}&active=is.true`,
    {
      headers: getSupabaseHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase subscription fetch failed: ${response.status}`);
  }

  const rows = await response.json();
  return Array.isArray(rows) ? rows : [];
}

async function deactivateSubscription(endpoint, scope) {
  const response = await fetch(
    `${getSupabaseRestUrl(`push_subscriptions?endpoint=eq.${encodeURIComponent(endpoint)}&scope=eq.${scope}`)}`,
    {
      method: "PATCH",
      headers: {
        ...getSupabaseHeaders(),
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        active: false,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase subscription deactivate failed: ${response.status}`);
  }
}

function isAuthorizedWebhookRequest(request) {
  const secret = getEnv("PUSH_WEBHOOK_SECRET");
  if (!secret) return true;

  const headerSecret = request.headers["x-webhook-secret"];
  const bearerToken = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  return headerSecret === secret || bearerToken === secret;
}

function getReservationFromWebhook(body) {
  return body?.record || body?.new || body?.reservation || body;
}

async function getUserFromAccessToken(accessToken) {
  if (!accessToken) return null;

  const response = await fetch(getSupabaseAuthUrl("user"), {
    headers: {
      apikey: getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function isStaffUser(userId) {
  if (!userId) return false;

  const response = await fetch(
    `${getSupabaseRestUrl(`staff_members?select=user_id&user_id=eq.${encodeURIComponent(userId)}&active=is.true&limit=1`)}`,
    {
      headers: getSupabaseHeaders(),
    },
  );

  if (!response.ok) {
    return false;
  }

  const rows = await response.json();
  return Array.isArray(rows) && rows.length > 0;
}

async function requireStaffSession(request) {
  const bearerToken = request.headers.authorization?.replace(/^Bearer\s+/i, "") || "";
  const user = await getUserFromAccessToken(bearerToken);

  if (!user?.id) {
    return null;
  }

  const allowed = await isStaffUser(user.id);
  return allowed ? user : null;
}

function buildReservationPushPayload(reservation) {
  const guestCount = Number(reservation?.guests) || 0;
  const guestLabel = guestCount === 1 ? "persona" : "persone";
  const name = reservation?.name || "Nuovo tavolo";
  const day = reservation?.day || "";
  const slot = reservation?.slot || "";

  return {
    title: "Nuova prenotazione CSSF",
    body: `${name} - ${guestCount} ${guestLabel}, ${day} ore ${slot}`,
    tag: reservation?.id || `reservation-${Date.now()}`,
    url: "/gestione.html#prenotazioni",
    icon: "/icons/app-icon-192.png",
    badge: "/icons/app-icon-192.png",
  };
}

function buildBroadcastPushPayload(payload) {
  const title = String(payload?.title || "").trim().slice(0, 80) || "Aggiornamento CSSF";
  const body = String(payload?.message || "").trim().slice(0, 240);
  const targetUrl = String(payload?.targetUrl || "/index.html").trim() || "/index.html";

  if (!body) {
    return null;
  }

  return {
    title,
    body,
    tag: `broadcast-${Date.now()}`,
    url: targetUrl.startsWith("/") ? targetUrl : `/${targetUrl}`,
    icon: "/icons/app-icon-192.png",
    badge: "/icons/app-icon-192.png",
  };
}

module.exports = {
  PUSH_SCOPES,
  buildReservationPushPayload,
  buildBroadcastPushPayload,
  deactivateSubscription,
  getEnv,
  getRequiredEnv,
  getReservationFromWebhook,
  getUserFromAccessToken,
  isAuthorizedWebhookRequest,
  isStaffUser,
  listActiveSubscriptions,
  normalizeSubscriptionPayload,
  readJsonBody,
  requireStaffSession,
  sendJson,
  upsertSubscription,
};
