import("../resources/js/tools/ocultar.js")
  .then(() => {
      
    setTimeout(() => {
      const objetos = [
        "",
      ];

      objetos.forEach(obj => {
        try {
          ocultar(obj);
        } catch (error) {
          console.error(`No se pudo ocultar ${obj}:`, error);
        }
      });

     
    }, 1);
  })
  .catch(err => {
    console.error("Error al cargar el módulo de ocultar:", err);
  });
// tools
import("../resources/js/tools/avatar.js");
import("../resources/js/tools/infoOBJ.js");
import("../resources/js/tools/pregunta.js");
import("../resources/js/tools/html.js");
import("../resources/js/tools/limitesuelo.js");
import("../resources/js/tools/humos.js");
import("../resources/js/tools/zona.js");
import("../resources/js/tools/camino.js");
import("../resources/js/tools/caminodir.js");
//Rendimiento
import("../resources/js/rendiminiento/objNoVisibles.js")
