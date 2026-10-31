// Kindle Calm Hub - Service Worker v6 (Network-first with no-cache reload when online)
var CACHE_NAME = "kindle-calm-hub-v6";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.json?v=6",
  "./css/eink.css?v=6",
  "./js/storage.js?v=6",
  "./js/ui.js?v=6",
  "./js/data/vides_data.js?v=6",
  "./js/data/decennis_data.js?v=6",
  "./js/data/fundador_data.js?v=6",
  "./js/data/crianca_data.js?v=6",
  "./js/games/vides.js?v=6",
  "./js/games/decennis.js?v=6",
  "./js/games/fundador.js?v=6",
  "./js/games/crianca.js?v=6",
  "./js/games/minesweeper.js?v=6",
  "./js/app.js?v=6"
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
