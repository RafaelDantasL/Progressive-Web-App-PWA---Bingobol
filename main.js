// Nome do cache e arquivos a serem armazenados
const CACHE_NAME = 'acertos-online-cache-v1';
const urlsToCache = [
  '/',
  'https://www.acertosonline.com/p/app.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/icon512_maskable.png',
  '/icon512_rounded.png',
  '/offline.html'  // Caminho relativo do offline.html que será armazenado no cache
];

// Evento de instalação do service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de busca
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Se a rede falhar, retorna a página offline do cache
      return caches.match(event.request).then(response => {
        return response || caches.match('/offline.html');
      });
    })
  );
});

// Evento de ativação
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);  // Remove caches antigos
          }
        })
      );
    })
  );
});
