/**
 * API DE ETIQUETAS PARA VERGE3D (Versión Extendida con Flechas Dinámicas)
 * --------------------------------------------------------------
 * 1. Etiqueta normal:
 * etiquetas("Cubo", "Mi Título", "Descripción");
 *
 * 2. Etiqueta con Rayos X:
 * etiquetas("Motor", "Título", "Desc", true);
 *
 * 3. Etiqueta con Código JS:
 * etiquetas("Motor", "Título", "Desc", true, "alert('Hola')");
 *
 * 4. Etiqueta CON FLECHA hacia otro objeto:
 * etiquetas("Etiqueta_Anchor", "Motor V8", "Detalles...", true(x-ray), null(codigo js), "Motor_Pieza_Real");
 * * 5. Limpiar todo:
 * quitarEtiquetas();
 */

(function () {
  // CONFIGURACIÓN
  const CSS_PATH = "../../resources/css/etiquetas.css";

  // Herramientas reutilizables (Memoria optimizada)
  const raycaster = new v3d.Raycaster();
  const vecPos = new v3d.Vector3(); // Posición objeto etiqueta
  const vecTarget = new v3d.Vector3(); // Posición objeto destino flecha
  const vecDir = new v3d.Vector3();
  const vecCam = new v3d.Vector3();
  const vecScreen = new v3d.Vector3();

  // =========================================================
  // --- NUEVO: Funciones Globales para recibir la señal ---
  // =========================================================

  // Inicializar color por defecto (puedes cambiar esto si tu app arranca en modo oscuro)
  document.documentElement.style.setProperty("--arrow-color", "#000000");

  window.darck = function () {
    // Cambia la variable CSS a BLANCO (Solo afecta a la línea)
    document.documentElement.style.setProperty("--arrow-color", "#ffffff");
    console.log("Flechas cambiadas a modo oscuro (Blanco)");
  };

  window.light = function () {
    // Cambia la variable CSS a NEGRO (Solo afecta a la línea)
    document.documentElement.style.setProperty("--arrow-color", "#000000");
    console.log("Flechas cambiadas a modo claro (Negro)");
  };
  // =========================================================

  // Inyectar CSS básico y el nuevo estilo para la flecha
  function importarCSS() {
    if (!document.querySelector(`link[href*="etiquetas.css"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS_PATH;
      document.head.appendChild(link);
    }

    // Estilos específicos para la flecha dinámica (inyectado en JS)
    if (!document.getElementById("css-etiquetas-flechas")) {
      const style = document.createElement("style");
      style.id = "css-etiquetas-flechas";

      style.innerHTML = `
                .annotation-line {
                    position: absolute;
                    height: 4.0px; 
                    /* Color dinámico de la línea controlado por JS */
                    background-color: var(--arrow-color, #000000); 
                    transform-origin: 0 50%;
                    pointer-events: none;
                    z-index: 0; 
                    box-shadow: 0 0 4px rgba(0,0,0,0.5);
                    transition: background-color 0.3s ease; 
                }

                /* CAMBIO AQUÍ: PUNTA DE FLECHA CIRCULAR 
                   (Círculo blanco con relleno negro)
                */
                .annotation-line::after {
                    content: '';
                    position: absolute;
                    /* Ajuste para centrar el círculo al final de la línea */
                    right: -7px; 
                    /* Cálculo vertical: (4px linea - 14px circulo) / 2 = -5px */
                    top: -5px;   
                    
                    /* Tamaño del círculo */
                    width: 10px; 
                    height: 10px; 
                    
                    /* Forma circular */
                    border-radius: 50%;
                    
                    /* COLORES FIJOS SOLICITADOS */
                    background-color: #000000; /* Relleno NEGRO */
                    border: 4px solid #ffffff; /* Borde BLANCO */
                    
                    /* Sombra para profundidad */
                    box-shadow: 0 0 3px rgba(0,0,0,0.5);
                    z-index: 1;
                }

                .annotation-line.oculta {
                    opacity: 0.1;
                }
            `;
      document.head.appendChild(style);
    }
  }

  importarCSS();

  function esHijoDe(child, parent) {
    let curr = child;
    while (curr) {
      if (curr === parent) return true;
      curr = curr.parent;
    }
    return false;
  }

  /**
   * @param {string} id Nombre del objeto donde nace la etiqueta.
   * @param {string} t Título.
   * @param {string} [d] Descripción.
   * @param {boolean} [xray=false] Oclusión.
   * @param {string|function} [codigoJS=null] Click callback.
   * @param {string} [idObjetoDestino=null] (NUEVO) Nombre del objeto al que apunta la flecha.
   */
  window.etiquetas = (
    id,
    t,
    d,
    xray = false,
    codigoJS = null,
    idObjetoDestino = null
  ) => {
    const app = window.v3d?.apps?.[0];
    if (!app) return console.error("Verge3D no cargado"), null;

    const obj = app.scene.getObjectByName(id);
    if (!obj) return console.error(`Objeto Origen "${id}" no encontrado`), null;

    // Búsqueda del objeto destino para la flecha
    let targetObj = null;
    let elLine = null; // Elemento DOM de la línea

    if (idObjetoDestino) {
      targetObj = app.scene.getObjectByName(idObjetoDestino);
      if (!targetObj) {
        console.warn(
          `Objeto destino para flecha "${idObjetoDestino}" no encontrado.`
        );
      } else {
        // Crear el DOM para la línea
        elLine = document.createElement("div");
        elLine.className = "annotation-line";
        (app.container || document.body).appendChild(elLine);
      }
    }

    // Crear elemento DOM Etiqueta
    const el = document.createElement("div");
    el.className = "annotation";
    el.id = `tag-${id.replace(/\W/g, "_")}`;
    el.innerHTML = `
            <div class="annotation-content">
                <h3>${t}</h3>
                ${d ? `<p>${d}</p>` : ""}
            </div>
        `;

    if (!d || d.trim() === "") el.classList.add("sin-descripcion");

    (app.container || document.body).appendChild(el);

    // Click Handler
    el.onclick = (e) => {
      e.stopPropagation();
      if (codigoJS) {
        try {
          typeof codigoJS === "function" ? codigoJS() : eval(codigoJS);
        } catch (err) {
          console.error("Error JS etiqueta:", err);
        }
      }
      if (typeof cambio !== "undefined") cambio();
      const proc = v3d.puzzles?.procedures?.[id];
      if (proc) proc();
    };

    // LOOP DE ACTUALIZACIÓN
    const update = () => {
      if (!el.isConnected) return;

      // 1. Calcular posición de la ETIQUETA (Origen)
      obj.updateMatrixWorld();
      app.camera.updateMatrixWorld();

      vecPos.setFromMatrixPosition(obj.matrixWorld);
      app.camera.getWorldPosition(vecCam);

      // Proyectar origen a pantalla
      vecScreen.copy(vecPos).project(app.camera);

      const isInFront = vecScreen.z < 1;

      if (isInFront) {
        const cvs = app.renderer.domElement;
        // Coordenadas X, Y del origen (punta de la etiqueta) en píxeles
        const x = (vecScreen.x * 0.5 + 0.5) * cvs.clientWidth;
        const y = (-(vecScreen.y * 0.5) + 0.5) * cvs.clientHeight;

        // --- LOGICA RAYOS X ---
        let estaTapado = false;
        if (xray) {
          vecDir.subVectors(vecPos, vecCam).normalize();
          raycaster.set(vecCam, vecDir);
          const dist = vecCam.distanceTo(vecPos);
          const intersects = raycaster.intersectObjects(
            app.scene.children,
            true
          );

          for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].distance >= dist - 0.1) break;
            if (
              !esHijoDe(intersects[i].object, obj) &&
              intersects[i].object.visible
            ) {
              estaTapado = true;
              break;
            }
          }
        }

        // Aplicar visibilidad/clases a la etiqueta
        if (estaTapado) {
          el.classList.add("etiqueta-oculta");
          if (elLine) elLine.classList.add("oculta");
        } else {
          el.classList.remove("etiqueta-oculta");
          if (elLine) elLine.classList.remove("oculta");
        }

        el.style.display = "block";
        const s = el.matches(":hover") ? 1.05 : 1;
        // Mueve la etiqueta
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(
          1
        )}px, 0px) translate(-50%, -100%) scale(${s})`;

        // --- LOGICA DE LA FLECHA (NUEVO) ---
        if (elLine && targetObj) {
          // Calcular posición del DESTINO
          targetObj.updateMatrixWorld();
          vecTarget.setFromMatrixPosition(targetObj.matrixWorld);

          // Reusamos vecScreen para proyectar el destino
          // Nota: x, y arriba son el ORIGEN. Ahora calculamos tx, ty (DESTINO)
          vecScreen.copy(vecTarget).project(app.camera);

          // Si el destino está detrás de la cámara, ocultar línea
          if (vecScreen.z >= 1) {
            elLine.style.display = "none";
          } else {
            elLine.style.display = "block";

            const tx = (vecScreen.x * 0.5 + 0.5) * cvs.clientWidth;
            const ty = (-(vecScreen.y * 0.5) + 0.5) * cvs.clientHeight;

            // Matemáticas para dibujar la línea entre (x,y) y (tx,ty)
            const deltaX = tx - x;
            const deltaY = ty - y;
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            elLine.style.width = `${length}px`;
            // translate3d pone el inicio de la linea en la base de la etiqueta
            // rotate la gira hacia el destino
            elLine.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`;
          }
        }
      } else {
        // Si la etiqueta está detrás de la cámara
        el.style.display = "none";
        if (elLine) elLine.style.display = "none";
      }
    };

    // Registrar en loop de renderizado
    if (app.renderCallbacks) {
      app.renderCallbacks.push(update);
    } else {
      const loop = () => {
        update();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    console.log(
      `Etiqueta creada: ${id} ${
        targetObj ? "-> Flecha a: " + idObjetoDestino : ""
      }`
    );

    return {
      dom: el,
      domArrow: elLine,
      eliminar: () => {
        el.remove();
        if (elLine) elLine.remove(); // Eliminar flecha también
        const i = app.renderCallbacks?.indexOf(update);
        if (i > -1) app.renderCallbacks.splice(i, 1);
      },
    };
  };

  // Utilidad global limpiar
  window.quitarEtiquetas = () => {
    document.querySelectorAll(".annotation").forEach((e) => e.remove());
    document.querySelectorAll(".annotation-line").forEach((e) => e.remove()); // Limpiar flechas
  };
})();
