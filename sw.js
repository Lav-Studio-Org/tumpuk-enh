// Offline cache. The app shell is cached on install; everything else (atlases,
// audio, level data) is cached the first time it loads and refreshed in the
// background. Bump CACHE on every release (docs/RELEASE.md).
const CACHE = 'tumpuk-v1.0.1';
const SHELL = [
  './',
  'index.html',
  'index.css',
  'css/ui.css',
  'index.js',
  'manifest.js',
  'manifest.webmanifest',
  'dist/melonjs.module.js',
  'dist/melon-runtime.module.js',
  'dist/physics/matter-adapter.js',
  'icon-192.png',
  'ui/logo.webp',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Audio may be requested with Range headers; let the network handle those.
  if (req.headers.has('range')) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(req);
      const net = fetch(req)
        .then((res) => { if (res.ok && res.status === 200) cache.put(req, res.clone()); return res; })
        .catch(() => hit);
      return hit || net;
    })
  );
});
