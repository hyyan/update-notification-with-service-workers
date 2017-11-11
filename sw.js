let cacheName = 'cache-v1';

self.addEventListener('install', (e) => {

  let cache = caches.open(cacheName).then((c) => {
    c.addAll([
      '/index.css'
    ]);
  });

  e.waitUntil(cache);
});

self.addEventListener('fetch', (e) => {

  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) return response;
      return fetch(e.request);
    })
  );
});

self.addEventListener('activate', (e) => {

  e.waitUntil(
    caches.keys().then((keys) => {
      keys
        .filter((key) => key.startsWith('cache-') && key !== cacheName)
        .map((key) => { caches.delete(key) });
    })
  )
});

self.addEventListener('message',(e) => {

  if(e.data.action === 'update') {
    self.skipWaiting();
  }
})
