const webPush = require("web-push");
const {
  buildBroadcastPushPayload,
  deactivateSubscription,
  getRequiredEnv,
  listActiveSubscriptions,
  readJsonBody,
  requireStaffSession,
  sendJson,
} = require("./_shared");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { error: "Method not allowed" });
  }

  try {
    const staffUser = await requireStaffSession(request);
    if (!staffUser) {
      return sendJson(response, 401, { error: "Staff session required" });
    }

    webPush.setVapidDetails(
      process.env.WEB_PUSH_SUBJECT || "mailto:staff@cssf.local",
      getRequiredEnv("WEB_PUSH_VAPID_PUBLIC_KEY"),
      getRequiredEnv("WEB_PUSH_VAPID_PRIVATE_KEY"),
    );

    const body = await readJsonBody(request);
    const payload = buildBroadcastPushPayload(body);
    if (!payload) {
      return sendJson(response, 400, { error: "Broadcast payload missing" });
    }

    const subscriptions = await listActiveSubscriptions("public");
    const notificationPayload = JSON.stringify(payload);
    let sent = 0;
    let removed = 0;

    for (const row of subscriptions) {
      const subscription = row.subscription || {
        endpoint: row.endpoint,
        keys: {
          p256dh: row.p256dh_key,
          auth: row.auth_key,
        },
      };

      try {
        await webPush.sendNotification(subscription, notificationPayload);
        sent += 1;
      } catch (error) {
        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await deactivateSubscription(row.endpoint, "public");
          removed += 1;
          continue;
        }

        throw error;
      }
    }

    return sendJson(response, 200, {
      ok: true,
      sent,
      removed,
    });
  } catch (error) {
    return sendJson(response, 500, { error: error?.message || "Broadcast push failed" });
  }
};
