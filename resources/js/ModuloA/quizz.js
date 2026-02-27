(function() {
    // ==========================================
    // 1. DATOS DEL QUIZ
    // ==========================================
    const items = [
        { name: "Casco con visera y barbiquejo", procedure: "casco", correct: true, ids: ["Object004", "Object002"], audio: "../resources/audio/equipo/casco.wav", video: "videos/casco.mp4", image: "../resources/img/equipo/casco.png" },
        { name: "Lentes de seguridad", procedure: "lentes", correct: true, ids: ["LentesSeguridadHombre"], audio: "../resources/audio/equipo/lentes.wav", video: "videos/lentes.mp4", image: "../resources/img/equipo/lentes.png" },
        { name: "Zapatos de seguridad", procedure: "zapatos", correct: true, ids: [], audio: "../resources/audio/equipo/zapatos.wav", video: "videos/zapatos.mp4", image: "../resources/img/equipo/zapatos.png" },
        { name: "Bloqueador solar", procedure: "bloqueador", correct: true, ids: [], audio: "../resources/audio/equipo/bloqueador.wav", video: "videos/bloqueador.gif", image: "../resources/img/equipo/bloqueador.png" },
        { name: "Chaleco con cinta reflectiva", procedure: "chaleco", correct: true, ids: ["Chaleco"], audio: "../resources/audio/equipo/chaleco.wav", video: "videos/chaleco.mp4", image: "../resources/img/equipo/chaleco.png" },
        { name: "Protección auditiva", procedure: "audifonos", correct: true, ids: ["ProtectorAuditivoHombre", "Object005", "Object006"], audio: "../resources/audio/equipo/audifonos.wav", video: "videos/audifono.mp4", image: "../resources/img/equipo/auditivo.png" },
        { name: "Respirador para partículas", procedure: "respirador", correct: true, ids: ["11_MascaraSiliconada", "Box001", "Box002"], audio: "../resources/audio/equipo/respirador.wav", video: "videos/respiador.mp4", image: "../resources/img/equipo/respirador.png" },
    ].sort(() => Math.random() - 0.5);

    let state = {
        isLocked: false,
        count: 0,
        requiredTotal: items.filter(it => it.correct).length,
        cursoCompletado: localStorage.getItem("moduloA_completado") === "true"
    };

    let DOM = {};

    // ==========================================
    // 2. INYECCIÓN DE ESTILOS DE PANTALLA DIVIDIDA
    // ==========================================
    function injectSplitScreenStyles() {
        if (document.getElementById("quiz-split-styles")) return;
        
        const style = document.createElement("style");
        style.id = "quiz-split-styles";
        style.textContent = `
            /* Contenedor principal de Verge3D */
            #v3d-container {
                transition: width 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), margin-left 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
                width: 100vw; /* Ancho por defecto */
            }

            /* Clase que se aplica al activar el Quiz (Pantalla Dividida) */
            #v3d-container.split-screen-active {
                width: 40vw !important; /* El 3D ocupa el 40% */
                margin-left: 0 !important;
            }

            /* Contenedor del Quiz */
            #quiz-wrapper {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                pointer-events: none; z-index: 10000;
            }

            /* Pantalla de Inicio (Botón Empezar) */
            .start-container {
                position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;
                display: flex; align-items: center; justify-content: center; gap: 20px;
                background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
                pointer-events: auto; transition: opacity 0.3s ease;
            }

            /* Panel del Quiz (El 60% derecho) */
            .quiz-panel {
                position: absolute; top: 0; right: 0;
                width: 60vw; /* El Quiz ocupa el 60% */
                height: 100vh;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: -5px 0 25px rgba(0,0,0,0.1);
                transform: translateX(100%); /* Oculto a la derecha */
                transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
                display: flex; flex-direction: column;
                padding: 30px; box-sizing: border-box;
                pointer-events: none;
                overflow-y: auto;
            }

            .quiz-panel.panel-active {
                transform: translateX(0); /* Desliza hacia adentro */
                pointer-events: auto;
            }

            /* Responsivo para móviles (apilado en lugar de lado a lado) */
            @media (max-width: 900px) {
                #v3d-container.split-screen-active {
                    width: 100vw !important;
                    height: 40vh !important; /* 3D arriba */
                }
                .quiz-panel {
                    width: 100vw;
                    height: 60vh; /* Quiz abajo */
                    top: auto; bottom: 0; right: auto; left: 0;
                    transform: translateY(100%);
                    border-radius: 20px 20px 0 0;
                }
                .quiz-panel.panel-active {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // 3. LÓGICA DEL COMPONENTE
    // ==========================================
    function construirUI() {
        const wrapper = document.createElement("div");
        wrapper.id = "quiz-wrapper";
        wrapper.innerHTML = `
            <div class="start-container" id="screen-start">
                <button class="btn-start" id="btn-run">Empezar Quiz</button>
                ${state.cursoCompletado ? `<button class="btn-skip" id="btn-skip">Saltar</button>` : ""}
            </div>
            <div class="quiz-panel" id="panel-right">
                <div class="quiz-header">
                    <h2>Selección de Equipo</h2>
                    <p>Encuentra los elementos de seguridad requeridos.</p>
                </div>
                <div class="items-list" id="list-target"></div>
                <div class="progress-label" id="label-status">Progreso: 0 / ${state.requiredTotal}</div>
                <button class="btn-continue" id="btn-continue" style="display: none;">Continuar</button>
            </div>
        `;
        document.body.appendChild(wrapper);

        DOM = {
            wrapper: document.getElementById("quiz-wrapper"),
            listTarget: document.getElementById("list-target"),
            statusLabel: document.getElementById("label-status"),
            btnContinue: document.getElementById("btn-continue"),
            btnSkip: document.getElementById("btn-skip"),
            btnRun: document.getElementById("btn-run"),
            panelRight: document.getElementById("panel-right"),
            screenStart: document.getElementById("screen-start"),
            v3dContainer: document.getElementById("v3d-container")
        };
    }

    // Forza un evento de resize en la ventana para que el canvas de Verge3D (o Three.js) se ajuste al nuevo tamaño (40%)
    function forzarAjusteCanvas3D() {
        let tiempoInicio = Date.now();
        function ajustar() {
            window.dispatchEvent(new Event('resize'));
            if (Date.now() - tiempoInicio < 600) { // Sigue ajustando durante la transición CSS (0.5s)
                requestAnimationFrame(ajustar);
            }
        }
        ajustar();
    }

    function ejecutarProcedimientoV3D(nombreProcedimiento) {
        if (typeof v3d !== 'undefined' && v3d.puzzles?.procedures?.[nombreProcedimiento]) {
            v3d.puzzles.procedures[nombreProcedimiento]();
        }
    }

    function revisarProgreso() {
        if (state.count >= state.requiredTotal && !state.isLocked) {
            DOM.btnContinue.style.display = "block";
            DOM.statusLabel.style.display = "none";
        }
    }

    function cerrarQuiz() {
        DOM.panelRight.classList.remove("panel-active");
        if (DOM.v3dContainer) {
            DOM.v3dContainer.classList.remove("split-screen-active");
        }
        forzarAjusteCanvas3D();
        ejecutarProcedimientoV3D("continuar");

        setTimeout(() => {
            if (DOM.wrapper) DOM.wrapper.remove();
        }, 600);
    }

    // ==========================================
    // 4. CREACIÓN DE TARJETAS
    // ==========================================
    function crearTarjeta(item) {
        const row = document.createElement("div");
        row.className = "option-row";
        // HTML simplificado para el ejemplo, asume que tienes el CSS de las tarjetas cargado
        row.innerHTML = `
            <div class="option-inner">
                <div class="option-front">
                    <img src="${item.image}" class="option-thumb" alt="${item.name}">
                    <div class="option-title">${item.name}</div>
                </div>
            </div>
        `;

        row.onclick = () => {
            if (state.isLocked || row.dataset.counted) return;

            // Simulación de acierto
            if (item.correct) {
                row.style.border = "3px solid #27ae60"; // CSS inline por simplicidad
                state.count++;
                row.dataset.counted = "true";
                DOM.statusLabel.textContent = `Progreso: ${state.count} / ${state.requiredTotal}`;
                
                ejecutarProcedimientoV3D(item.procedure);
                if (item.ids && window.mostrar) item.ids.forEach(id => window.mostrar(id));
                revisarProgreso();
            }
        };
        return row;
    }

    // ==========================================
    // 5. API PÚBLICA (window.inicio)
    // ==========================================
    window.inicio = function() {
        if (document.getElementById("quiz-wrapper")) return; // Evita inicialización múltiple

        // Reset estado por si se llama varias veces
        state.count = 0;
        state.isLocked = false;

        injectSplitScreenStyles();
        construirUI();

        // Eventos de inicio
        DOM.btnRun.onclick = () => {
            DOM.screenStart.style.opacity = "0"; // Desvanece el overlay negro
            
            // Activa el modo Split Screen
            if (DOM.v3dContainer) {
                DOM.v3dContainer.classList.add("split-screen-active");
            }
            DOM.panelRight.classList.add("panel-active");
            
            // Avisa al motor 3D que el tamaño cambió
            forzarAjusteCanvas3D();

            setTimeout(() => {
                DOM.screenStart.style.display = "none";
                items.forEach(item => DOM.listTarget.appendChild(crearTarjeta(item)));
            }, 300);
        };

        DOM.btnContinue.onclick = () => {
            localStorage.setItem("moduloA_completado", "true");
            cerrarQuiz();
        };

        if (DOM.btnSkip) {
            DOM.btnSkip.onclick = cerrarQuiz;
        }
    };

})();