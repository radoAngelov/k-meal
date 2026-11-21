const CACHE = 'k-meal-v3'
const ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png']

self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())
))

self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('k-meal-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
))

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true }).then(r => r || (e.request.mode === 'navigate' ? c.match('./') : fetch(e.request)))))
})
