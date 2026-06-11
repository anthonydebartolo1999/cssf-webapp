const CACHE_NAME = "cssf-pwa-v171";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./mappa.html",
  "./prenota.html",
  "./vota.html",
  "./programma.html",
  "./recensioni.html",
  "./privacy.html",
  "./truck.html",
  "./gestione.html",
  "./staff.html",
  "./manifest.webmanifest?v=20260605-icon2",
  "./manifest-staff.webmanifest?v=20260606-staff-v2",
  "./styles.css?v=20260611-homepremium-v169",
  "./app.js?v=20260611-pwa-v171",
  "./icons/app-icon-192.png",
  "./icons/app-icon-512.png",
  "./icons/logo-photoroom.png?v=20260605-logo",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("cssf-pwa-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  if (shouldCacheAsset(request, url)) {
    event.respondWith(handleStaticAssetRequest(request));
  }
});

self.addEventListener("push", (event) => {
  const payload = parsePushPayload(event.data);
  const title = payload.title || "Nuova prenotazione CSSF";
  const body = payload.body || "E' arrivata una nuova prenotazione staff.";
  const notificationOptions = {
    body,
    icon: payload.icon || "icons/app-icon-192.png",
    badge: payload.badge || "icons/app-icon-192.png",
    tag: payload.tag || "cssf-staff-reservation",
    data: {
      url: payload.url || "/gestione.html#prenotazioni",
    },
  };

  event.waitUntil(self.registration.showNotification(title, notificationOptions));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(event.notification.data?.url || "/gestione.html#prenotazioni", self.location.origin).href;
  event.waitUntil(focusOrOpenClient(targetUrl));
});

async function handleNavigationRequest(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (
      (await cache.match(request, { ignoreSearch: true })) ||
      (await cache.match("./index.html")) ||
      Response.error()
    );
  }
}

async function handleStaticAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkFetch;
}

function shouldCacheAsset(request, url) {
  if (request.destination === "style" || request.destination === "script" || request.destination === "image") {
    return true;
  }

  return (
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".webmanifest") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg")
  );
}

function parsePushPayload(data) {
  if (!data) return {};

  try {
    return data.json();
  } catch {
    return { body: data.text() };
  }
}

async function focusOrOpenClient(targetUrl) {
  const clients = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  for (const client of clients) {
    if (client.url === targetUrl || client.url.startsWith(`${self.location.origin}/gestione.html`)) {
      await client.focus();
      if ("navigate" in client) {
        await client.navigate(targetUrl);
      }
      return;
    }
  }

  await self.clients.openWindow(targetUrl);
}
