// Kindle Calm Hub - Offline-Capable Service Worker (v3: Network-first with offline cache fallback)
var CACHE_NAME = "kindle-calm-hub-v4";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/eink.css",
  "./js/storage.js",
  "./js/ui.js",
  "./js/games/vides.js",
  "./js/games/decennis.js",
  "./js/games/fundador.js",
  "./js/games/crianca.js",
  "./js/games/minesweeper.js",
  "./js/app.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (k) {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(function (networkRes) {
        if (networkRes && networkRes.status === 200) {
          var copy = networkRes.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, copy);
          });
        }
        return networkRes;
      })
      .catch(function () {
        return caches.match(event.request);
      })
  );
});
