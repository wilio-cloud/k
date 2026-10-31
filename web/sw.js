// Kindle Calm Hub - Offline Cache-First Service Worker
var CACHE_NAME = "kindle-calm-hub-v1";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/eink.css",
  "./js/data.js",
  "./js/storage.js",
  "./js/games/sudoku.js",
  "./js/games/motle.js",
  "./js/games/rusc.js",
  "./js/games/nonogram.js",
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
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});
