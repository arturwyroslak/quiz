// This is a basic service worker file.
// For a production app, you would add caching strategies and other features here.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // event.waitUntil(
  //   caches.open('v1').then((cache) => {
  //     return cache.addAll([
  //       '/',
  //       '/index.html',
  //       // etc.
  //     ]);
  //   })
  // );
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching...');
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     return response || fetch(event.request);
  //   })
  // );
});
