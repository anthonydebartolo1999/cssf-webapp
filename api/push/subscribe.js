const { normalizeSubscriptionPayload, readJsonBody, sendJson, upsertSubscription } = require("./_shared");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { error: "Method not allowed" });
  }

  try {
    const body = await readJsonBody(request);
    const payload = normalizeSubscriptionPayload(body);

    if (!payload) {
      return sendJson(response, 400, { error: "Invalid subscription payload" });
    }

    await upsertSubscription(payload);
    return sendJson(response, 200, { ok: true });
  } catch (error) {
    return sendJson(response, 500, { error: error?.message || "Push subscription failed" });
  }
};
