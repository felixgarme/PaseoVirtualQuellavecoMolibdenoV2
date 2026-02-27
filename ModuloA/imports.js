import("../resources/js/tools/ocultar.js")
  .then(() => {
      
    setTimeout(() => {
      const objetos = [
        "LentesSeguridadHombre",
        "Box001",
        "Box002",
        "Object006",
        "Object005",
        "ProtectorAuditivoHombre",
        "Chaleco",
        "Object004",
        "Object002",
        "11_MascaraSiliconada",
        "Object0021",
        "stiker"
        
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
import("../resources/js/tools/pregunta.js");
import("../resources/js/tools/infoOBJ.js");
import("../resources/js/tools/html.js");
import("../resources/js/tools/limitesuelo.js");
//Rendimiento
import("../resources/js/rendiminiento/objNoVisibles.js")
