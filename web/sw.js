// Kindle Calm Hub - Service Worker v5 (Network-first with no-cache reload when online)
var CACHE_NAME = "kindle-calm-hub-v5";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.json?v=5",
  "./css/eink.css?v=5",
  "./js/storage.js?v=5",
  "./js/ui.js?v=5",
  "./js/games/vides.js?v=5",
  "./js/games/decennis.js?v=5",
  "./js/games/fundador.js?v=5",
  "./js/games/crianca.js?v=5",
  "./js/games/minesweeper.js?v=5",
  "./js/app.js?v=5"
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
    fetch(event.request, { cache: "no-cache" })
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
        return caches.match(event.request, { ignoreSearch: true });
      })
  );
});
