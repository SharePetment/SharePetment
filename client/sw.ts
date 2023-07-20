/* eslint-disable @typescript-eslint/no-explicit-any */
// install event
self.addEventListener('install', () => {
  console.log('[Service Worker] installed');
});

// activate event
self.addEventListener('activate', e => {
  console.log('[Service Worker] actived', e);
});

// fetch event
self.addEventListener('fetch', (e: any) => {
  console.log('[Service Worker] fetched resource ' + e.request.url);
});
