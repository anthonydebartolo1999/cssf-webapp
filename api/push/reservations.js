const webPush = require("web-push");
const {
  buildReservationPushPayload,
  deactivateSubscription,
  getRequiredEnv,
  getReservationFromWebhook,
  isAuthorizedWebhookRequest,
  listActiveSubscriptions,
  readJsonBody,
  sendJson,
} = require("./_shared");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { error: "Method not allowed" });
  }

  if (!isAuthorizedWebhookRequest(request)) {
    return sendJson(response, 401, { error: "Unauthorized webhook" });
  }

  try {
    webPush.setVapidDetails(
      process.env.WEB_PUSH_SUBJECT || "mailto:staff@cssf.local",
      getRequiredEnv("WEB_PUSH_VAPID_PUBLIC_KEY"),
      getRequiredEnv("WEB_PUSH_VAPID_PRIVATE_KEY"),
    );

    const body = await readJsonBody(request);
    const reservation = getReservationFromWebhook(body);

    if (!reservation?.id) {
      return sendJson(response, 400, { error: "Reservation payload missing" });
    }

    const subscriptions = await listActiveSubscriptions("staff");
    const notificationPayload = JSON.stringify(buildReservationPushPayload(reservation));
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
          await deactivateSubscription(row.endpoint, "staff");
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
    return sendJson(response, 500, { error: error?.message || "Push delivery failed" });
  }
};
