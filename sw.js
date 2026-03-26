const CACHE_NAME = 'puntos-v1';
// Archivos necesarios para que la app funcione offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // Si añadieras imágenes locales o CSS externo, irían aquí
];

// Instalación: Guarda los archivos estáticos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting()) // Fuerza la activación inmediata
  );
});

// Activación: Limpia cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim()) // Toma control de las pestañas abiertas
  );
});

// Intercepción de peticiones: Sirve desde caché si está offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
  );
});
