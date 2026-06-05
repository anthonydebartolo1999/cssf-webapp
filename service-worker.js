const CACHE_NAME = "cssf-pwa-v142";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./mappa.html",
  "./truck.html",
  "./vota.html",
  "./prenota.html",
  "./programma.html",
  "./recensioni.html",
  "./privacy.html",
  "./gestione.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest?v=20260605-icon2",
  "./manifest-staff.webmanifest?v=20260605-staff",
  "./assets/locandina-2026.jpeg",
  "./sfondo home.png",
  "./planimetria.jpg?v=20260604-2207",
  "./assets/hero-locandina-wide.jpeg",
  "./icons/icon.svg",
  "./icons/app-icon-192.png",
  "./icons/app-icon-512.png",
  "./icons/logo-photoroom.png?v=20260605-logo",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        const pathname = new URL(event.request.url).pathname;
        return caches.match(pathname.endsWith("/gestione.html") || pathname.endsWith("/staff.html") ? "./gestione.html" : "./index.html");
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const clone = response.clone();
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    }),
  );
});
