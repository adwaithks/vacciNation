self.addEventListener('install', (e) => {
    console.log('Service Worker Install');
});

self.addEventListener('fetch', function(event) {
    console.log('Fetching data');
});
  
