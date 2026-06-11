const { getEnv, sendJson } = require("./_shared");

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    return sendJson(response, 405, { error: "Method not allowed" });
  }

  const publicKey = getEnv("WEB_PUSH_VAPID_PUBLIC_KEY");
  if (!publicKey) {
    return sendJson(response, 503, { error: "Push not configured" });
  }

  return sendJson(response, 200, { publicKey });
};
