const CACHE_NAME = 'haqibat-almumin-v1';
const urlsToCache = [
  '/Quran.github.io/',
  '/Quran.github.io/index.html',
  '/Quran.github.io/style.css',
  '/Quran.github.io/script.js',
  '/Quran.github.io/icon-180.png',
  '/Quran.github.io/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ تم فتح الكاش');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
