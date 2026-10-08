// LenhaPro — Service Worker
// Muda a versão sempre que publicares uma alteração para forçar a atualização no telemóvel.
const VERSAO = 'lenhapro-v18';

const ESSENCIAIS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// Bibliotecas externas que podem ficar em cache (têm versão fixa no URL)
const CDN_CACHE = ['cdn.jsdelivr.net', 'www.gstatic.com'];

// Nunca intercetar: dados e login do Firebase (o próprio Firestore gere o modo offline)
const NUNCA = ['firestore.googleapis.com', 'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com', 'firebaseapp.com', 'apis.google.com', 'accounts.google.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ESSENCIAIS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (NUNCA.some(h => url.hostname.includes(h))) return;

  // Páginas da app: rede primeiro (para teres sempre a versão nova), cache se estiveres sem rede
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req).then(r => {
        if (r.ok) { const c = r.clone(); caches.open(VERSAO).then(ca => ca.put(req, c)); }
        return r;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Bibliotecas (Bootstrap, Chart.js, Firebase): cache primeiro
  if (CDN_CACHE.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(r => {
        if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(VERSAO).then(ca => ca.put(req, c)); }
        return r;
      }))
    );
  }
});
