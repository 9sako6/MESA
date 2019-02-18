// (source: https://github.com/nwtgck/nipp/blob/develop/service-worker.js)
// (from: https://murashun.jp/blog/20171210-01.html)

const CACHE_NAME = 'MESA_2019_01';
// TODO: Hard code
const CACHE_FILE = [
  './',
  './index.html',
  './favicon.ico',
  // AMP
  "https://cdn.ampproject.org/v0.js",
  // ace editor
  "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.0/ace.js",
  // jquery
  "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js",
  // fontawesome
  "https://use.fontawesome.com/releases/v5.6.1/css/all.css"
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_FILE);
    })
   );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(cacheName) {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      // Clone request
      let ReqClone = event.request.clone();
      return fetch(ReqClone).then(function(response) {
        if (!response ||
            response.status !== 200 ||
            response.type !== 'basic') {
          return response;
        }

        // Clone response
        let ResClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, ResClone);
        });
        return response;
      });
    })
  );
});
