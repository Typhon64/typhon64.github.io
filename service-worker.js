const CACHE_NAME = 'typhon64-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/favicon.png',
  '/404.html' // Çevrimdışı durum için fallback sayfası
];

// Service Worker'ı yükleme ve temel dosyaları önbelleğe alma
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to open cache or add urls: ', err);
      })
  );
});

// İstekleri yakalama ve önbellekten hizmet verme
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Önbellekte varsa, önbellekten yanıt dön
        if (response) {
          return response;
        }
        // Önbellekte yoksa, ağdan getirmeyi dene
        return fetch(event.request).catch(() => {
          // Ağ hatası durumunda (çevrimdışı) fallback sayfasını göster
          if (event.request.mode === 'navigate') { // Sadece sayfa navigasyonları için
            return caches.match('/404.html');
          }
        });
      })
  );
});

// Eski önbellekleri temizleme
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 