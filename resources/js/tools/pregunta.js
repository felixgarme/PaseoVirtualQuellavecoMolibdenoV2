window.pregunta = (function() {
    let fondoOscuro, cajaModal, imagenAvatar, elementoTexto, contenedorBotones, btnOpcion1, btnOpcion2;
    let modalAbierto = false; // Variable para saber si escuchar al teclado o no

    // Iconos SVG puros para las flechas
    const iconoFlechaIzquierda = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="margin-right: 8px;"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>';
    const iconoFlechaDerecha = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="margin-left: 8px;"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>';

    function inicializarUI() {
        if (fondoOscuro) return;

        // 1. Fondo oscuro
        fondoOscuro = document.createElement('div');
        fondoOscuro.style.position = 'fixed';
        fondoOscuro.style.top = '0';
        fondoOscuro.style.left = '0';
        fondoOscuro.style.width = '100vw';
        fondoOscuro.style.height = '100vh';
        fondoOscuro.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        fondoOscuro.style.backdropFilter = 'blur(5px)';
        fondoOscuro.style.zIndex = '10000'; 
        fondoOscuro.style.display = 'flex';
        fondoOscuro.style.justifyContent = 'center';
        fondoOscuro.style.alignItems = 'center';
        fondoOscuro.style.opacity = '0';
        fondoOscuro.style.pointerEvents = 'none';
        fondoOscuro.style.transition = 'opacity 0.3s ease';
        fondoOscuro.style.fontFamily = '"Segoe UI", Roboto, Helvetica, Arial, sans-serif';

        // 2. Caja modal
        cajaModal = document.createElement('div');
        cajaModal.style.backgroundColor = '#ffffff';
        cajaModal.style.padding = '30px 40px';
        cajaModal.style.borderRadius = '16px';
        cajaModal.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        cajaModal.style.textAlign = 'center';
        cajaModal.style.maxWidth = '400px';
        cajaModal.style.width = '90%';
        cajaModal.style.display = 'flex';
        cajaModal.style.flexDirection = 'column';
        cajaModal.style.alignItems = 'center';
        cajaModal.style.transform = 'translateY(20px) scale(0.95)';
        cajaModal.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

        // 3. Imagen del Avatar
        imagenAvatar = document.createElement('img');
        imagenAvatar.src = '../../resources/img/avatar.png'; // <-- Ruta de tu imagen
        imagenAvatar.style.width = '80px';
        imagenAvatar.style.height = '80px';
        imagenAvatar.style.borderRadius = '50%';
        imagenAvatar.style.objectFit = 'cover';
        imagenAvatar.style.marginBottom = '20px';
        imagenAvatar.style.border = '3px solid #e5e7eb';
        imagenAvatar.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';

        // 4. Texto
        elementoTexto = document.createElement('h3');
        elementoTexto.style.margin = '0 0 25px 0';
        elementoTexto.style.color = '#1f2937';
        elementoTexto.style.fontSize = '22px';
        elementoTexto.style.fontWeight = '600';
        elementoTexto.style.lineHeight = '1.4';

        // 5. Contenedor de botones
        contenedorBotones = document.createElement('div');
        contenedorBotones.style.display = 'flex';
        contenedorBotones.style.gap = '15px';
        contenedorBotones.style.width = '100%';
        contenedorBotones.style.justifyContent = 'center';

        // Estilos base para los botones (ahora usan flex para centrar icono y texto)
        const estilizarBoton = (btn, colorFondo, colorTexto) => {
            btn.style.flex = '1';
            btn.style.padding = '12px 20px';
            btn.style.border = 'none';
            btn.style.borderRadius = '8px';
            btn.style.fontSize = '16px';
            btn.style.fontWeight = '600';
            btn.style.cursor = 'pointer';
            btn.style.backgroundColor = colorFondo;
            btn.style.color = colorTexto;
            btn.style.transition = 'all 0.2s ease';
            btn.style.display = 'flex';            // NUEVO: Flexbox
            btn.style.alignItems = 'center';       // NUEVO: Centrado vertical de icono/texto
            btn.style.justifyContent = 'center';   // NUEVO: Centrado horizontal
            
            btn.onmouseenter = () => btn.style.transform = 'translateY(-2px)';
            btn.onmouseleave = () => btn.style.transform = 'translateY(0)';
            btn.onmousedown = () => btn.style.transform = 'translateY(1px)';
        };

        // 6. Botones
        btnOpcion1 = document.createElement('button');
        estilizarBoton(btnOpcion1, '#3b82f6', '#ffffff');

        btnOpcion2 = document.createElement('button');
        estilizarBoton(btnOpcion2, '#e5e7eb', '#374151');

        // Ensamblaje
        contenedorBotones.appendChild(btnOpcion1);
        contenedorBotones.appendChild(btnOpcion2);
        
        cajaModal.appendChild(imagenAvatar); 
        cajaModal.appendChild(elementoTexto);
        cajaModal.appendChild(contenedorBotones);
        
        fondoOscuro.appendChild(cajaModal);
        document.body.appendChild(fondoOscuro);

        // 7. Evento global de TECLADO (Flechas Izquierda / Derecha)
        document.addEventListener('keydown', (e) => {
            if (!modalAbierto) return; // Si la pregunta no está en pantalla, ignorar

            if (e.key === 'ArrowLeft') {
                e.preventDefault(); // Evita que la pantalla haga scroll
                btnOpcion1.click(); // Simula el clic en el botón 1
            } else if (e.key === 'ArrowRight') {
                e.preventDefault(); 
                btnOpcion2.click(); // Simula el clic en el botón 2
            }
        });
    }

    function ocultarModal() {
        fondoOscuro.style.opacity = '0';
        cajaModal.style.transform = 'translateY(20px) scale(0.95)';
        fondoOscuro.style.pointerEvents = 'none';
        modalAbierto = false; // Desactivar controles de teclado
    }

    function ejecutarProcedimientoV3D(nombreProcedimiento) {
        if (typeof v3d !== 'undefined' && v3d.puzzles && v3d.puzzles.procedures && v3d.puzzles.procedures[nombreProcedimiento]) {
            v3d.puzzles.procedures[nombreProcedimiento]();
        } else {
            console.warn(`Verge3D: Procedimiento "${nombreProcedimiento}" no encontrado.`);
        }
    }

    // API Principal
    return function(idPregunta, pregunta, textoOpcion1, textoOpcion2) {
        inicializarUI();

        elementoTexto.textContent = pregunta;
        
        // Inyectar HTML con el SVG y el texto
        btnOpcion1.innerHTML = iconoFlechaIzquierda + `<span>${textoOpcion1}</span>`;
        btnOpcion2.innerHTML = `<span>${textoOpcion2}</span>` + iconoFlechaDerecha;

        fondoOscuro.style.pointerEvents = 'auto';
        modalAbierto = true; // Activar controles de teclado
        
        setTimeout(() => {
            fondoOscuro.style.opacity = '1';
            cajaModal.style.transform = 'translateY(0) scale(1)';
        }, 10);

        btnOpcion1.onclick = () => {
            ocultarModal();
            ejecutarProcedimientoV3D(idPregunta + "1");
        };

        btnOpcion2.onclick = () => {
            ocultarModal();
            ejecutarProcedimientoV3D(idPregunta + "2");
        };
    };
})();