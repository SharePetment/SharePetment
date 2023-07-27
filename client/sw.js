/* eslint-disable @typescript-eslint/no-explicit-any */
// install event
self.addEventListener('install', () => {
  console.log('[Service Worker] installed');
});

// activate event
self.addEventListener('activate', () => {
  console.log('[Service Worker] actived');
});

// fetch event
self.addEventListener('fetch', () => {
  console.log('[Service Worker] fetched resource ');
});
