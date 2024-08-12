// Nome do cache e arquivos a serem armazenados
const CACHE_NAME = 'acertos-Online-cache-v1';
const urlsToCache = [
  '/',
  'https://www.acertosonline.com/p/app.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/icon512_maskable.png',
  '/icon512_rounded.png'
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
  const url = new URL(event.request.url);

  // Verifica se a solicitação é para o feed RSS do Blogger
  if (url.origin === 'https://www.acertosonline.com' && url.pathname.includes('/feeds/posts/default')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          return response; // Retorna do cache se disponível
        }
        return fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // Requisições normais: verifica o cache primeiro
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response; // Retorna do cache se disponível
          }
          return fetch(event.request); // Faz uma requisição à rede se não estiver no cache
        })
    );
  }
});

// Evento de ativação
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Remove caches antigos
          }
        })
      );
    })
  );
});
