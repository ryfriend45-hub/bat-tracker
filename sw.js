// sw.js — Service Worker for Bat Tracker PWA
const CACHE = 'bat-tracker-v1';
const PRECACHE = ['/', '/index.html', '/manifest.json'];

// Install: cache shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - App shell (html/css/js/fonts) → cache first, network fallback
// - API calls (fangraphs, mlb, statsapi) → network first, cache fallback (5 min stale)
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  const isAPI = url.hostname.includes('fangraphs') ||
                url.hostname.includes('statsapi') ||
                url.hostname.includes('mlb.com') ||
                url.pathname.startsWith('/.netlify/functions/');

  if (isAPI) {
    // Network first with 5-second timeout, fall back to stale cache
    e.respondWith(
      Promise.race([
        fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]).catch(() => caches.match(e.request))
    );
  } else {
    // Cache first for app shell
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
