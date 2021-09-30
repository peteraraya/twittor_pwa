
// guardar caché dinamico
function actualizaCacheDinamico(dynamicCache, req, res ) {
  
  if (res.ok) {
    // es decir la res tiene data y debemos almacenarla

    caches.open(dynamicCache).then(cache => {
      // 1. Almacenar en la cache el request
      cache.put(req, res.clone());
      return res.clone();

    });

  } else {
    // Si falla el cache y la red : va venir un problema de conexión
    return res;

  }



}