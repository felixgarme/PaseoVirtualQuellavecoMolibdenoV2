document.addEventListener("DOMContentLoaded", () => {
  function inicio() {
    if (document.getElementById("quiz-wrapper")) return;

    let isLocked = false;

    const items = [
      {
        name: "Casco con visera y barbiquejo",
        procedure: "casco",
        correct: true,
        ids: ["Object004", "Object002"],
        audio: "../resources/audio/equipo/casco.wav",
        video: "videos/casco.mp4",
        image: "../resources/img/equipo/casco.png",
      },
      {
        name: "Lentes de seguridad",
        procedure: "lentes",
        correct: true,
        ids: ["LentesSeguridadHombre"],
        audio: "../resources/audio/equipo/lentes.wav",
        video: "videos/lentes.mp4",
        image: "../resources/img/equipo/lentes.png",
      },
      {
        name: "Zapatos de seguridad",
        procedure: "zapatos",
        correct: true,
        ids: [],
        audio: "../resources/audio/equipo/zapatos.wav",
        video: "videos/zapatos.mp4",
        image: "../resources/img/equipo/zapatos.png",
      },
      {
        name: "Bloqueador solar",
        procedure: "bloqueador",
        correct: true,
        ids: [],
        audio: "../resources/audio/equipo/bloqueador.wav",
        video: "videos/bloqueador.gif",
        image: "../resources/img/equipo/bloqueador.png",
      },
      {
        name: "Chaleco con cinta reflectiva",
        procedure: "chaleco",
        correct: true,
        ids: ["Chaleco"],
        audio: "../resources/audio/equipo/chaleco.wav",
        video: "videos/chaleco.mp4",
        image: "../resources/img/equipo/chaleco.png",
      },
      {
        name: "Protección auditiva",
        procedure: "audifonos",
        correct: true,
        ids: ["ProtectorAuditivoHombre", "Object005", "Object006"],
        audio: "../resources/audio/equipo/audifonos.wav",
        video: "videos/audifono.mp4",
        image: "../resources/img/equipo/auditivo.png",
      },
      {
        name: "Respirador para partículas",
        procedure: "respirador",
        correct: true,
        ids: ["11_MascaraSiliconada", "Box001", "Box002"],
        audio: "../resources/audio/equipo/respirador.wav",
        video: "videos/respiador.mp4",
        image: "../resources/img/equipo/respirador.png",
      },
    ].sort(() => Math.random() - 0.5);

    document.body.classList.add("blur-background");
    const wrapper = document.createElement("div");
    wrapper.id = "quiz-wrapper";

    // NUEVO: Verificar si el usuario ya completó el curso anteriormente
    const cursoCompletado =
      localStorage.getItem("moduloA_completado") === "true";
    let botonSaltarHTML = "";

    if (cursoCompletado) {
      botonSaltarHTML = `
            <button class="btn-skip" id="btn-skip">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
              Saltar
            </button>
          `;
    }

    wrapper.innerHTML = `
          <div class="start-container" id="screen-start">
            <button class="btn-start" id="btn-run">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="currentColor"></path></svg>
              Empezar
            </button>
            ${botonSaltarHTML}
          </div>
          <div class="quiz-panel" id="panel-left">
            <div class="quiz-header">
              <h2>Seguridad Técnica</h2>
              <p>Seleccione los elementos requeridos.</p>
            </div>
            <div class="items-list" id="list-target"></div>
            <div class="progress-label" id="label-status">Progreso: 0 / 0</div>
            <button class="btn-continue" id="btn-continue">Continuar</button>
          </div>
        `;
    document.body.prepend(wrapper);

    const listTarget = document.getElementById("list-target");
    const statusLabel = document.getElementById("label-status");
    const btnContinue = document.getElementById("btn-continue");
    const btnSkip = document.getElementById("btn-skip");
    const v3dContainer = document.getElementById("v3d-container");
    let count = 0;
    const requiredTotal = items.filter((it) => it.correct).length;
    statusLabel.textContent = `Progreso: 0 / ${requiredTotal}`;

    const fluidResizeCanvas = () => {
      let startTime = Date.now();
      const resizeStep = () => {
        window.dispatchEvent(new Event("resize"));
        if (Date.now() - startTime < 500) {
          requestAnimationFrame(resizeStep);
        }
      };
      resizeStep();
    };

    const checkCompletion = () => {
      if (count >= requiredTotal && !isLocked) {
        btnContinue.style.display = "inline-flex";
        statusLabel.style.display = "none";
      } else {
        btnContinue.style.display = "none";
        if (count < requiredTotal) statusLabel.style.display = "block";
      }
    };

    // LÓGICA DE BOTÓN CONTINUAR
    btnContinue.onclick = () => {
      // NUEVO: Guardar en memoria que el quizz fue completado
      localStorage.setItem("moduloA_completado", "true");

      const panelLeft = document.getElementById("panel-left");

      // 1. Ocultar el panel con la animación fluida
      panelLeft.classList.remove("panel-active");

      // 2. Expandir el 3D con animación fluida
      v3dContainer.classList.remove("split-screen-active");
      fluidResizeCanvas();

      // 3. Llamar al procedure "continuar" de Verge3D
      try {
        if (
          window.v3d &&
          v3d.puzzles &&
          v3d.puzzles.procedures &&
          v3d.puzzles.procedures["continuar"]
        ) {
          v3d.puzzles.procedures["continuar"]();
          console.log("Procedure 'continuar' ejecutado correctamente.");
        }
      } catch (e) {
        console.error(
          "Error al ejecutar el procedure 'continuar' de Verge3D:",
          e,
        );
      }

      // 4. (Opcional) Eliminar el DOM después de que acabe la animación (500ms)
      setTimeout(() => {
        if (wrapper) wrapper.remove();
      }, 500);
    };

    // NUEVO: LÓGICA DE BOTÓN SALTAR
    if (btnSkip) {
      btnSkip.onclick = () => {
        document.body.classList.remove("blur-background");

        // Ejecutar el procedure "continuar" directamente
        try {
          if (
            window.v3d &&
            v3d.puzzles &&
            v3d.puzzles.procedures &&
            v3d.puzzles.procedures["continuar"]
          ) {
            v3d.puzzles.procedures["continuar"]();
            console.log(
              "Procedure 'continuar' ejecutado correctamente desde Saltar.",
            );
          }
        } catch (e) {
          console.error(
            "Error al ejecutar el procedure 'continuar' de Verge3D:",
            e,
          );
        }

        // Eliminar el wrapper inmediatamente
        if (wrapper) wrapper.remove();
      };
    }

    const createOptionNode = (item) => {
      const row = document.createElement("div");
      row.className = "option-row";

      const inner = document.createElement("div");
      inner.className = "option-inner";

      const front = document.createElement("div");
      front.className = "option-front";
      front.innerHTML = `
            <div class="cell-thumb"><img src="${item.image}" class="option-thumb"></div>
            <div class="cell-title"><div class="option-title">${item.name}</div></div>
          `;

      const back = document.createElement("div");
      back.className = "option-back";

      let mediaElement = null;
      
      // LÓGICA DE MEDIOS MODIFICADA CON FALLBACK
      if (item.video) {
        const isGif = item.video.toLowerCase().endsWith(".gif");
        if (isGif) {
          mediaElement = document.createElement("img");
          mediaElement.src = item.video;
          mediaElement.className = "card-media";
          // Fallback en caso de que el GIF no cargue
          mediaElement.onerror = function() {
            this.onerror = null; // Evita bucles si la imagen también fallara
            this.src = item.image;
          };
        } else {
          mediaElement = document.createElement("video");
          mediaElement.src = item.video;
          mediaElement.loop = true;
          mediaElement.muted = true;
          mediaElement.playsInline = true;
          mediaElement.className = "card-media";
          
          // Fallback en caso de que el VIDEO no cargue
          mediaElement.onerror = () => {
            const fallbackImg = document.createElement("img");
            fallbackImg.src = item.image;
            fallbackImg.className = "card-media";
            back.replaceChild(fallbackImg, mediaElement);
            mediaElement = fallbackImg; // Actualiza la referencia para evitar errores en onclick
          };
        }
        back.appendChild(mediaElement);
      } else {
        // Fallback por si la propiedad 'video' viene vacía
        mediaElement = document.createElement("img");
        mediaElement.src = item.image;
        mediaElement.className = "card-media";
        back.appendChild(mediaElement);
      }

      inner.appendChild(front);
      inner.appendChild(back);
      row.appendChild(inner);

      row.onclick = () => {
        if (isLocked) return;

        row.classList.toggle("is-flipped");
        const isFlipped = row.classList.contains("is-flipped");

        if (mediaElement && mediaElement.tagName === "VIDEO") {
          isFlipped ? mediaElement.play() : mediaElement.pause();
        }

        if (item.correct && isFlipped) {
          front.classList.add("is-correct");
          back.classList.add("is-correct");

          if (!row.dataset.counted) {
            count++;
            row.dataset.counted = "true";
            statusLabel.textContent = `Progreso: ${count} / ${requiredTotal}`;
          }

          if (item.procedure) {
            try {
              if (
                window.v3d &&
                v3d.puzzles &&
                v3d.puzzles.procedures &&
                v3d.puzzles.procedures[item.procedure]
              ) {
                v3d.puzzles.procedures[item.procedure]();
              }
            } catch (e) {
              console.error("Error al ejecutar el procedure de Verge3D:", e);
            }
          }

          if (item.ids && window.mostrar) {
            item.ids.forEach((id) => {
              window.mostrar(id);
            });
          }
        }

        if (item.audio && isFlipped) {
          isLocked = true;
          checkCompletion();

          listTarget.classList.add("is-playing");
          row.classList.add("active-audio");

          const sound = new Audio(item.audio);
          sound.play().catch(() => {
            isLocked = false;
            listTarget.classList.remove("is-playing");
            row.classList.remove("active-audio");
            checkCompletion();
          });

          sound.onended = () => {
            isLocked = false;
            listTarget.classList.remove("is-playing");
            row.classList.remove("active-audio");
            checkCompletion();
          };
        } else {
          checkCompletion();
        }
      };
      return row;
    };

    document.getElementById("btn-run").onclick = () => {
      document.body.classList.remove("blur-background");
      document.getElementById("screen-start").style.opacity = "0";

      setTimeout(() => {
        document.getElementById("screen-start").style.display = "none";

        // Animación de entrada del panel: desliza y contrae el 3D a la vez
        document.getElementById("panel-left").classList.add("panel-active");
        v3dContainer.classList.add("split-screen-active");

        fluidResizeCanvas();

        items.forEach((item) => {
          listTarget.appendChild(createOptionNode(item));
        });
      }, 300);
    };
  }
  window.inicio = inicio;
});