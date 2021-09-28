// Based on
// https://developers.google.com/codelabs/pwa-training/pwa03--going-offline

// Choose a cache name
const cacheName = 'cache-28-09-2021';

// List the files to precache
const precacheResources = [
  '/',
  '/manifest.webmanifest',
  '/index.html',
  '/assets/css/reset.css',
  '/assets/css/app.css',
  '/assets/css/app-header.css',
  '/assets/css/app-section-clippings.css',
  '/assets/css/app-sidebar.css',
  '/assets/img/favicon/android-chrome-512x512.png',
  '/assets/img/favicon/android-chrome-192x192.png',
  '/assets/img/favicon/favicon-32x32.png',
  '/assets/img/favicon/favicon-16x16.png',
  '/assets/img/favicon/maskable-icon.png',
  '/assets/img/favicon/apple-touch-icon.png',
  '/assets/js/kc2json-web.js',
  '/assets/js/app-sidebar-buttons.js',
  '/assets/js/app-render.js',
  '/assets/js/app-input-file.js',
  '/assets/js/app-button-menu-mobile.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/'
    + 'font-awesome.min.css',
  'https://fonts.googleapis.com/css2?family=Varela+Round&display=swap'
];

// When the service worker is installing,
// open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(caches.open(cacheName)
    .then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
});

// When there's an incoming fetch request,
// try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
  // console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});

// Based on MDN docs
// Deleting old caches
self.addEventListener('activate', (event) => {
  const cacheKeeplist = [cacheName];
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});