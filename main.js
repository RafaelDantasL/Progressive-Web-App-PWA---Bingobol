// Nome do cache e arquivos a serem armazenados
const CACHE_NAME = 'acertos-Online-cache-v1';
const urlsToCache = [
  '/',
  'https://www.acertosonline.com/p/app.html',
  '/styles/main.css',  // Adicione aqui todos os recursos que deseja armazenar em cache
  '/scripts/main.js',  // Adicione aqui todos os recursos que deseja armazenar em cache
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
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;  // Retorna do cache se disponível
        }
        return fetch(event.request);  // Faz uma requisição à rede se não estiver no cache
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
