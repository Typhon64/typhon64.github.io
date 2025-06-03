const CACHE_NAME = 'typhon64-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/script/script.js',
  '/script/resume.js',
  '/media/favicon.webp',
  '/media/pfp.jpg',
  '/media/profile-banner.jpg',
  '/page/resume.html',
  '/css/resume.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
  'https://fonts.cdnfonts.com/css/sf-mono',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js',
  'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js'
];

// Service Worker installation and cache pre-population
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened successfully');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to open cache or add URLs: ', err);
      })
  );
  // Force the waiting service worker to become active
  self.skipWaiting();
});

// Network-first strategy with cache fallback for HTML requests
// Cache-first strategy for static assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip browser extension requests and third-party requests
  if (url.origin !== self.location.origin && 
      !url.href.includes('fonts.googleapis.com') && 
      !url.href.includes('fonts.cdnfonts.com') && 
      !url.href.includes('cdnjs.cloudflare.com') &&
      !url.href.includes('cdn.jsdelivr.net')) {
    return;
  }
  
  // For HTML pages: network-first strategy
  if (event.request.mode === 'navigate' || 
      event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to store in cache
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If not in cache, serve the index page as fallback
              return caches.match('/index.html');
            });
        })
    );
    return;
  }
  
  // For static assets: cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return from cache and update cache in background
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, networkResponse.clone());
                });
              return networkResponse;
            })
            .catch(() => { /* Ignore network errors */ });
          
          // Fetch in background, but return cached response immediately
          fetchPromise.catch(() => console.log('Background fetch failed, but cached response available'));
          return cachedResponse;
        }
        
        // If not in cache, get from network and cache
        return fetch(event.request)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(() => {
            // For images, return a placeholder if available
            if (event.request.destination === 'image') {
              return caches.match('/media/placeholder.svg');
            }
          });
      })
  );
});

// Clean up old caches
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
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
}); 
