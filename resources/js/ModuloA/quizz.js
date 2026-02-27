(function() {
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
    let resizeObserver;

    function injectSplitScreenStyles() {
        if (document.getElementById("quiz-split-styles")) return;
        
        const style = document.createElement("style");
        style.id = "quiz-split-styles";
        style.textContent = `
            #quiz-wrapper {
                font-family: 'AA Smart Sans', sans-serif !important;
                color: #031795 !important;
                position: fixed !important;
                top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;
                pointer-events: none !important; z-index: 10000 !important;
            }

            .quiz-header h2 {
                font-weight: bold !important;
                color: #031795 !important;
                margin-bottom: 5px;
            }

            .quiz-header p, .progress-label, .option-title {
                color: #031795 !important;
            }

            .progress-label {
                font-weight: bold;
                text-align: center;
                margin-top: 20px;
                font-size: 18px;
            }

            #v3d-container {
                position: fixed !important; 
                transition: width 0.5s ease, height 0.5s ease !important;
                z-index: 1 !important;
            }

            .quiz-panel {
                position: absolute !important; 
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(10px) !important;
                transition: transform 0.5s ease !important;
                display: flex !important; 
                flex-direction: column !important;
                padding: 30px !important; 
                box-sizing: border-box !important;
                pointer-events: none;
                overflow-y: auto !important;
            }

            .quiz-panel.panel-active {
                pointer-events: auto !important;
            }

            .start-container {
                position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;
                display: flex; align-items: center; justify-content: center; gap: 20px;
                background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
                pointer-events: auto; transition: opacity 0.3s ease;
            }

            .items-list {
                display: grid;
                gap: 15px;
                margin-top: 20px;
            }

            @media (orientation: landscape) {
                #v3d-container.split-screen-active {
                    top: 0 !important;
                    right: 0 !important;
                    left: auto !important;
                    width: 40% !important; 
                    height: 100vh !important;
                    object-fit: contain !important;
                }
                .quiz-panel {
                    top: 0 !important; 
                    left: 0 !important; 
                    right: auto !important;
                    width: 60vw !important; 
                    height: 100vh !important;
                    box-shadow: 5px 0 25px rgba(0,0,0,0.15) !important;
                    transform: translateX(-100%); /* Oculto a la izquierda */
                }
                .quiz-panel.panel-active {
                    transform: translateX(0) !important; 
                }
                .items-list {
                    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                }
            }

            @media (orientation: portrait) {
                #v3d-container.split-screen-active {
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 40vh !important; /* 3D Arriba */
                }
                .quiz-panel {
                    width: 100vw !important;
                    height: 60vh !important; /* Quiz Abajo */
                    top: auto !important; 
                    bottom: 0 !important; 
                    left: 0 !important;
                    transform: translateY(100%); /* Oculto abajo */
                    border-radius: 20px 20px 0 0 !important;
                    box-shadow: 0 -5px 25px rgba(0,0,0,0.15) !important;
                }
                .quiz-panel.panel-active {
                    transform: translateY(0) !important; /* Sube desde abajo */
                }
                .items-list {
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                }
            }
        `;
        document.head.appendChild(style);
    }

    function construirUI() {
        const wrapper = document.createElement("div");
        wrapper.id = "quiz-wrapper";
        wrapper.innerHTML = `
            <div class="start-container" id="screen-start">
                <button class="btn-start" id="btn-run" style="padding: 15px 30px; font-size: 18px; font-weight: bold; font-family: 'AA Smart Sans', sans-serif; background: #031795; color: white; border: none; border-radius: 50px; cursor: pointer;">Empezar Quiz</button>
                ${state.cursoCompletado ? `<button class="btn-skip" id="btn-skip" style="padding: 15px 30px; font-size: 18px; font-weight: bold; font-family: 'AA Smart Sans', sans-serif; background: rgba(255,255,255,0.2); color: white; border: 2px solid white; border-radius: 50px; cursor: pointer;">Saltar</button>` : ""}
            </div>
            <div class="quiz-panel" id="panel-main">
                <div class="quiz-header">
                    <h2>Selección de Equipo</h2>
                    <p>Encuentra los elementos de seguridad requeridos.</p>
                </div>
                <div class="items-list" id="list-target"></div>
                <div class="progress-label" id="label-status">Progreso: 0 / ${state.requiredTotal}</div>
                <button class="btn-continue" id="btn-continue" style="display: none; padding: 15px 30px; font-size: 18px; font-weight: bold; font-family: 'AA Smart Sans', sans-serif; background: #27ae60; color: white; border: none; border-radius: 50px; cursor: pointer; align-self: center; margin-top: 20px;">Continuar</button>
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
            panelMain: document.getElementById("panel-main"),
            screenStart: document.getElementById("screen-start"),
            v3dContainer: document.getElementById("v3d-container")
        };
    }

    function iniciarObservadorDeRedimension() {
        if (!DOM.v3dContainer || resizeObserver) return;
        resizeObserver = new ResizeObserver(() => window.dispatchEvent(new Event('resize')));
        resizeObserver.observe(DOM.v3dContainer);
    }

    function detenerObservadorDeRedimension() {
        if (resizeObserver && DOM.v3dContainer) {
            resizeObserver.unobserve(DOM.v3dContainer);
            resizeObserver.disconnect();
            resizeObserver = null;
        }
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
        DOM.panelMain.classList.remove("panel-active");
        if (DOM.v3dContainer) DOM.v3dContainer.classList.remove("split-screen-active");
        
        ejecutarProcedimientoV3D("continuar");

        setTimeout(() => {
            if (DOM.wrapper) DOM.wrapper.remove();
            detenerObservadorDeRedimension(); 
        }, 600);
    }

    function crearTarjeta(item) {
        const row = document.createElement("div");
        row.className = "option-row";
        row.innerHTML = `
            <div class="option-inner" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor:pointer; height: 100%; border: 3px solid transparent; transition: all 0.3s ease;">
                <div class="option-front" style="display: flex; flex-direction: column; height: 100%;">
                    <div style="flex: 1; padding: 10px; display: flex; justify-content: center; align-items: center; background: #f8f9fa;">
                        <img src="${item.image}" alt="${item.name}" style="max-width: 100%; max-height: 100px; object-fit: contain;">
                    </div>
                    <div class="option-title" style="padding: 10px; text-align: center; font-weight: bold; font-size: 13px; border-top: 1px solid #eee;">
                        ${item.name}
                    </div>
                </div>
            </div>
        `;

        row.onclick = () => {
            if (state.isLocked || row.dataset.counted) return;

            if (item.correct) {
                row.querySelector('.option-inner').style.borderColor = "#27ae60"; 
                row.querySelector('.option-inner').style.background = "#eafaf1";
                
                state.count++;
                row.dataset.counted = "true";
                DOM.statusLabel.textContent = `Progreso: ${state.count} / ${state.requiredTotal}`;
                
                ejecutarProcedimientoV3D(item.procedure);
                if (item.ids && window.mostrar) item.ids.forEach(id => window.mostrar(id));
                
                if (item.audio) {
                    state.isLocked = true;
                    const sound = new Audio(item.audio);
                    
                    const unlockUI = () => {
                        state.isLocked = false;
                        revisarProgreso();
                    };

                    sound.play().catch(e => {
                        console.error("Error al reproducir audio:", e);
                        unlockUI();
                    });
                    sound.onended = unlockUI;
                } else {
                    revisarProgreso();
                }
            }
        };
        return row;
    }

    window.inicio = function() {
        if (document.getElementById("quiz-wrapper")) return;

        state.count = 0;
        state.isLocked = false;

        injectSplitScreenStyles();
        construirUI();

        DOM.btnRun.onclick = () => {
            DOM.screenStart.style.opacity = "0"; 
            
            iniciarObservadorDeRedimension();

            if (DOM.v3dContainer) DOM.v3dContainer.classList.add("split-screen-active");
            DOM.panelMain.classList.add("panel-active");
            
            setTimeout(() => {
                DOM.screenStart.style.display = "none";
                items.forEach(item => DOM.listTarget.appendChild(crearTarjeta(item)));
            }, 300);
        };

        DOM.btnContinue.onclick = () => {
            localStorage.setItem("moduloA_completado", "true");
            cerrarQuiz();
        };

        if (DOM.btnSkip) DOM.btnSkip.onclick = cerrarQuiz;
    };

})();