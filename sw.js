// Archivo de Service Worker

importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// Todo lo que este en inmutable nosotros no lo vamos a modificar
// El appshell es el corazon de la aplicación : lo que deberia estar caergado lo más rapido posible
const APP_SHELL = [
  '/',
  '/index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-utils.js'
];

// El appshell inmutable : sera todo lo que no se va modificar jamás
const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js',
];

// Instalación
self.addEventListener('install', e => {

  const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
    cache.addAll(APP_SHELL));

  const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
    cache.addAll(APP_SHELL_INMUTABLE));


  // Finaliza
  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


// Activate - pwaactivate + tab
// Proceso para borrar los sw cada vez que haga un cambio
self.addEventListener('activate', e => {
  // Verificamos si la version del sw es la misma no debemos hacer nada
  // Si hay una diferencia borramos el cache statico
  const respuesta = caches.keys().then(keys => {

    keys.forEach(key => {

      // static-v4 : borro todos los caches que sean dynamics
      if (key !== STATIC_CACHE && key.includes('static')) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta)
});

// Evento Fetch - pwa

self.addEventListener('fetch', e => {

  // Verificar si existe la request
  const respuesta = caches.match(e.request).then(res => {
    
    // verificamos si la respuesta existe
    if (res) {
      return res;
    } else {
      // si no existe la respuesta 
      return fetch(e.request).then(newRes => {
        return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes )
      })
    }

  });


  e.respondWith(respuesta);
});
