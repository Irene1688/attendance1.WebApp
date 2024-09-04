const CACHE_NAME = 'v1';
const urlsToCache = [
    '/'
    // 添加其他需要缓存的资源
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    // 不处理身份验证相关的请求
    if (event.request.url.includes('/Account/') ||
        event.request.url.includes('/Login') ||
        new URL(event.request.url).pathname === '/') {
        return;
    }

    event.respondWith(
        fetch(event.request, { redirect: 'follow' })
            .then(function (response) {
                // 不缓存重定向响应
                if (response.redirected) {
                    return response;
                }

                // 检查是否为成功的响应（状态码在 200-299 之间）
                if (response.ok) {
                    // 克隆响应，因为它只能被使用一次
                    const responseToCache = response.clone();

                    // 打开缓存并存储响应
                    caches.open(CACHE_NAME)
                        .then(function (cache) {
                            cache.put(event.request, responseToCache);
                        });
                }
                return response;
            })
            .catch(function () {
                // 如果网络请求失败，尝试从缓存中获取
                return caches.match(event.request)
                    .then(function (response) {
                        // 如果在缓存中找到响应，则返回它
                        if (response) {
                            return response;
                        }
                        // 如果缓存中没有，且是导航请求，返回离线页面
                        //if (event.request.mode === 'navigate') {
                        //    return caches.match('/offline.html');
                        //}
                        // 对于其他类型的请求，可以返回一个简单的错误响应
                        return new Response('Network error occurred', {
                            status: 408,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});

// 清理旧缓存
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
//const CACHE_NAME = `attendane-app-v1`;

//// Use the install event to pre-cache all initial resources.
//self.addEventListener('install', event => {
//    event.waitUntil((async () => {
//        const cache = await caches.open(CACHE_NAME);
//        cache.addAll([
//            '/'
//        ]);
//        // Use individual add calls to handle potential errors
//        //try {
//        //    await cache.add('/');
//        //} catch (error) {
//        //    console.error('Failed to add / to cache:', error);
//        //}

//        //try {
//        //    await cache.add('/Account/CheckLogin.cshtml');
//        //} catch (error) {
//        //    console.error('Failed to add /Account/CheckLogin.cshtml to cache:', error);
//        //}

//        //try {
//        //    await cache.add('/Login.cshtml');
//        //} catch (error) {
//        //    console.error('Failed to add /Login.cshtml to cache:', error);
//        //}
//    })());
//});

//self.addEventListener('fetch', event => {
//    event.respondWith((async () => {
//        const cache = await caches.open(CACHE_NAME);

//        // Get the resource from the cache.
//        //const cachedResponse = await cache.match(event.request);
//        //if (cachedResponse) {
//        //    return cachedResponse;
//        //} else {
//        try
//        {
//                // If the resource was not in the cache, try the network.
//                //const fetchResponse = await fetch(event.request);
//                const fetchResponse = await fetch(event.request, { redirect: 'follow' });

//                // Check if the response is a redirect.
//                if (fetchResponse.type === 'opaqueredirect') {
//                    return Response.redirect(fetchResponse.url);
//                }

//                // Save the resource in the cache and return it.
//                cache.put(event.request, fetchResponse.clone());
//                return fetchResponse;
//            } catch (e) {
//                // The network failed.
//            }
//        //}
//    })());
//});