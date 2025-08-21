const CACHE_NAME = 'singlebackgammon-cache-v1';

self.addEventListener('install', () => {
  console.log('Service Worker: install event');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: activate event');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`Service Worker: removing old cache ${key}`);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      fetch(event.request)
        .then((response) => {
          console.log('Service Worker: network fetch', event.request.url);
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => {
          console.warn('Service Worker: fetch failed, using cache', event.request.url);
          return cache.match(event.request);
        })
    )
  );
});
