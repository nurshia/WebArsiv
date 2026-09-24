/* Çevrimdışı önbellek: sayfa bir kez açıldıktan sonra okul ağı kesilse de çalışır.
   Sürüm değiştiğinde eski önbellek silinir. */
var CACHE = "ww1-v2";
var FILES = ["./", "index.html", "style.css", "app.js", "data.js", "events.js", "lines.js", "lesson.js",
  "canakkale.js", "canakkale-geo.js", "canakkale-g.webp", "canakkale-n.webp", "geo.js", "relief.webp", "fonts/atkinson.woff2", "fonts/serif.woff2", "fonts/serif-italic.woff2",
  "fonts/barlow-500.woff2", "fonts/barlow-600.woff2", "fonts/barlow-700.woff2"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
/* önce ağ (güncel sürüm), ağ yoksa önbellek */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r && r.ok) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cp); }); }
    return r;
  }).catch(function () {
    return caches.match(e.request, {ignoreSearch: true}).then(function (m) { return m || caches.match("index.html"); });
  }));
});
