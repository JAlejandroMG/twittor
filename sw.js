//~ Manifest JSON
//~ https://web.dev/add-manifest/

//~ Imports
importScripts('js/sw-utils.js');

const DYNAMIC_CACHE = 'dynamic-cache-v1';
const IMMUTABLE_CACHE = 'immutable-cache-v1';
const STATIC_CACHE = 'static-cache-v2';

const APP_SHELL = [
	'/',
	'css/style.css',
	'img/avatars/hulk.jpg',
	'img/avatars/ironman.jpg',
	'img/avatars/spiderman.jpg',
	'img/avatars/thor.jpg',
	'img/avatars/wolverine.jpg',
	'img/favicon.ico',
	'index.html',
	'js/app.js',
	'js/sw-utils.js',
];

const LIB_SHELL = [
	'css/animate.css',
	'js/libs/jquery.js',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
];


self.addEventListener('install', e => {
	const cacheImmutable = caches.open(IMMUTABLE_CACHE)
		.then(cache => cache.addAll(LIB_SHELL));
	const cacheStatic = caches.open(STATIC_CACHE)
		.then(cache => cache.addAll(APP_SHELL));

	e.waitUntil(Promise.all([cacheImmutable, cacheStatic]));
});

self.addEventListener('activate', e => {
	const cachesRemained = caches.keys()
		.then(keys => {
			keys.forEach(key => {
				if (key !== STATIC_CACHE && key.includes('static')) {
					return caches.delete(key);
				}
			});
		});

	e.waitUntil(cachesRemained);
});

self.addEventListener('fetch', e => {
	const resCache = caches.match(e.request)
		.then(res => {
			if (res) {
				return res;
			} else {
				return fetch(e.request)
					.then(newRes => {
						return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
					});
			}
		});

	e.respondWith(resCache);
});
