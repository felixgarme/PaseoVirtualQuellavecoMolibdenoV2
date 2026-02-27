import("../resources/js/tools/etiquetas.js").then(() => {
    // 3. Este bloque se ejecuta solo cuando "imports.js" terminó de cargar
    etiquetas("botonesE", "Botones", null, true, null, "botones");
    etiquetas("luzE", "Luz", null, true, null, "luz");
    etiquetas("pantallaE", "Pantalla", null, true, null, "pantalla");
    
    console.log("Módulos cargados y etiquetas inicializadas.");
  })
  .catch(err => {
    // Es buena práctica manejar errores de carga (archivo no encontrado, etc.)
    console.error("Error al cargar imports.js:", err);
  });
