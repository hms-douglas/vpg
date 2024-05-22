"use strict";

(function() {
    const CACHE_VERSION = "v1";

    const FILES_TO_BE_CACHED = [
        "index.html",
        "manifest.json", 
        "css/style.css", 
        "css/font.css", 
        "font/Lato.ttf", 
        "font/Lato.otf", 
        "font/Lato.woff2", 
        "font/RobotoMono.ttf", 
        "font/RobotoMono.otf", 
        "font/RobotoMono.woff2",
        "js/app.js", 
        "js/jszip.js",
        "img/btn/donate_paypal.svg",
        "img/btn/github.png",
        "img/favicon/favicon.ico",
        "img/watermark.svg",
    ];

    self.addEventListener("install", function(ev) {
        ev.waitUntil(
            caches.open(CACHE_VERSION)
            .then(function(cache) {
                cache.addAll(FILES_TO_BE_CACHED);   
            })
            .then(function() {
                self.skipWaiting();
            })
        );
    });

    self.addEventListener("activate", function(ev) {
        ev.waitUntil(
            caches.keys().then(function(cacheVersions) {
                return Promise.all(
                    cacheVersions.map(function(cache) {
                        if(cache !== CACHE_VERSION) {
                            return caches.delete(cache);
                        }
                    })
                );
            })
        );
    });

    self.addEventListener("fetch", function(ev) {
        ev.respondWith(async function() {
            try {
                //cache first
                const cachedResponse = await caches.match(ev.request);
            
                if(cachedResponse) {
                    return cachedResponse;
                }

                //network if not cached, and add the file to cache
                const networkResponse = await fetch(ev.request);

                const cache = await caches.open(CACHE_VERSION);

                await cache.put(ev.request, networkResponse.clone());

                console.info("Auto cached: " + ev.request.url)

                return networkResponse;
            } catch(error) {
                //try the cache again
                const cacheResponse = await caches.match(ev.request);
                
                if(cacheResponse) {
                    return cacheResponse;
                }
            }
        }());
    });
})();