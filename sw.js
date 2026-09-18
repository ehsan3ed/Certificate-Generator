const CACHE_NAME = "certificate-studio-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/themes.js",
  "./vendor/qrcode.min.js",
  "./vendor/html2canvas.min.js",
  "./vendor/jspdf.umd.min.js",
  "./assets/pandenik-logo.png",
  "./assets/pandenik-logo-transparent.png",
  "./assets/template-reference.png",
  "./assets/theme-classic-navy.png",
  "./assets/theme-emerald-gold.png",
  "./assets/theme-burgundy-rose.png",
  "./assets/theme-midnight-silver.png",
  "./assets/theme-sand-copper.png",
  "./assets/theme-ocean-teal.png",
  "./assets/theme-indigo-ivory.png",
  "./assets/theme-forest-brass.png",
  "./assets/theme-royal-purple.png",
  "./assets/theme-persian-turquoise.png",
  "./assets/theme-modern-slate.png",
  "./assets/theme-coral-cream.png",
  "./assets/theme-ivory-bronze.png",
  "./assets/theme-charcoal-copper.png",
  "./assets/theme-sage-linen.png",
  "./assets/theme-wine-champagne.png",
  "./assets/theme-arctic-platinum.png",
  "./assets/theme-terracotta-sand.png",
  "./assets/theme-teal-pearl.png",
  "./assets/theme-espresso-gold.png",
  "./assets/theme-navy-filigree.png",
  "./assets/theme-emerald-atelier.png",
  "./assets/theme-burgundy-atelier.png",
  "./assets/theme-frame-classic-navy.png",
  "./assets/theme-frame-emerald-gold.png",
  "./assets/theme-frame-burgundy-rose.png",
  "./assets/theme-frame-midnight-silver.png",
  "./assets/theme-frame-sand-copper.png",
  "./assets/theme-frame-ocean-teal.png",
  "./assets/theme-frame-indigo-ivory.png",
  "./assets/theme-frame-forest-brass.png",
  "./assets/theme-frame-royal-purple.png",
  "./assets/theme-frame-persian-turquoise.png",
  "./assets/theme-frame-modern-slate.png",
  "./assets/theme-frame-coral-cream.png",
  "./assets/theme-frame-ivory-bronze.png",
  "./assets/theme-frame-charcoal-copper.png",
  "./assets/theme-frame-sage-linen.png",
  "./assets/theme-frame-wine-champagne.png",
  "./assets/theme-frame-arctic-platinum.png",
  "./assets/theme-frame-terracotta-sand.png",
  "./assets/theme-frame-teal-pearl.png",
  "./assets/theme-frame-espresso-gold.png",
  "./assets/theme-frame-navy-filigree.png",
  "./assets/theme-frame-emerald-atelier.png",
  "./assets/theme-frame-burgundy-atelier.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
