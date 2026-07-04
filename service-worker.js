// service-worker.js — mínimo para que la app sea instalable
const CACHE = 'esmeraldas-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([
      './',
      './index.html',
      './manifest.json'
    ]))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((llaves) =>
      Promise.all(llaves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Las llamadas a la API de Apps Script siempre van a la red (nunca cache)
  if (event.request.url.indexOf('script.google.com') !== -1) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
