(function() {
    let contenedorGlobal = null;
    let botonGlobal = null;
    let tarjetasAbiertas = []; 

    function manejarResize() {
        if (!contenedorGlobal) return;
        const esMovil = window.innerWidth <= 768;

        contenedorGlobal.style.right = esMovil ? '15px' : '30px';
        contenedorGlobal.style.left = 'auto'; 
        contenedorGlobal.style.top = '45%'; 
        contenedorGlobal.style.transform = 'translateY(-50%)'; 
        contenedorGlobal.style.width = 'auto'; 
        
        const zonaSegura = esMovil ? 'calc(100vh - 140px)' : 'calc(100vh - 180px)';
        contenedorGlobal.style.maxHeight = zonaSegura; 
        
        contenedorGlobal.style.alignItems = 'flex-end';

        if (botonGlobal) {
            botonGlobal.style.bottom = esMovil ? '20px' : '40px';
            botonGlobal.style.padding = esMovil ? '10px 20px' : '12px 30px';
            botonGlobal.style.fontSize = esMovil ? '16px' : '18px';
        }

        actualizarTamanos();
    }

    function inicializarUI() {
        if (contenedorGlobal) return;
        
        contenedorGlobal = document.createElement('div');
        contenedorGlobal.style.position = 'fixed';
        contenedorGlobal.style.zIndex = '10000';
        contenedorGlobal.style.display = 'flex';
        contenedorGlobal.style.flexDirection = 'column';
        contenedorGlobal.style.gap = '15px'; 
        contenedorGlobal.style.overflowY = 'auto';
        contenedorGlobal.style.pointerEvents = 'none';
        contenedorGlobal.style.msOverflowStyle = 'none';
        contenedorGlobal.style.scrollbarWidth = 'none';
        document.body.appendChild(contenedorGlobal);

        botonGlobal = document.createElement('button');
        botonGlobal.innerHTML = 'Continuar <kbd style="margin-left: 10px; font-family: monospace; font-size: 14px; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.4); display: flex; align-items: center; gap: 4px;">&#8629; Enter</kbd>';
        botonGlobal.style.position = 'fixed';
        botonGlobal.style.left = '50%';
        botonGlobal.style.transform = 'translateX(-50%)';
        botonGlobal.style.backgroundColor = '#2563eb';
        botonGlobal.style.color = 'white';
        botonGlobal.style.border = 'none';
        botonGlobal.style.borderRadius = '30px';
        botonGlobal.style.cursor = 'pointer';
        botonGlobal.style.fontWeight = 'bold';
        botonGlobal.style.zIndex = '10005'; 
        botonGlobal.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
        botonGlobal.style.transition = 'all 0.3s ease';
        botonGlobal.style.display = 'none';
        botonGlobal.style.alignItems = 'center';
        botonGlobal.style.justifyContent = 'center';
        botonGlobal.style.whiteSpace = 'nowrap'; 

        botonGlobal.onmouseenter = () => {
            botonGlobal.style.backgroundColor = '#1d4ed8';
            botonGlobal.style.transform = 'translateX(-50%) scale(1.05)';
        };
        botonGlobal.onmouseleave = () => {
            botonGlobal.style.backgroundColor = '#2563eb';
            botonGlobal.style.transform = 'translateX(-50%) scale(1)';
        };

        botonGlobal.onclick = window.closehtml;

        document.body.appendChild(botonGlobal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && botonGlobal && botonGlobal.style.display !== 'none') {
                e.preventDefault();
                window.closehtml();
            }
        });

        window.addEventListener('resize', manejarResize);
        manejarResize();
    }

    function actualizarTamanos() {
        if (!contenedorGlobal) return;
        
        const tarjetas = contenedorGlobal.children;
        const cantidad = tarjetas.length;
        const esMovil = window.innerWidth <= 768;
        const zonaSegura = esMovil ? 'calc(100vh - 140px)' : 'calc(100vh - 180px)';

        for (let i = 0; i < cantidad; i++) {
            tarjetas[i].style.width = 'fit-content'; 
            tarjetas[i].style.maxWidth = esMovil ? '90vw' : '40vw';

            const iframe = tarjetas[i].querySelector('iframe');
            if (iframe) {
                iframe.style.height = esMovil ? '60vh' : 'auto';
                iframe.style.maxHeight = zonaSegura;
                iframe.style.minHeight = esMovil ? '250px' : `min(480px, ${zonaSegura})`;
                iframe.style.width = '100%'; 
            }
        }
        
        if (cantidad > 0) {
            botonGlobal.style.display = 'flex';
        } else {
            botonGlobal.style.display = 'none';
        }
    }

    window.html = function(url, transparente = false) {
        inicializarUI();

        const nombreArchivo = url.split('/').pop().split('.')[0];
        const esVideo = url.match(/\.(mp4|webm|ogg)$/i);
        const esHtml = url.match(/\.(html|htm)$/i);
        const esImagen = !esVideo && !esHtml;
        const esMovil = window.innerWidth <= 768;
        const zonaSegura = esMovil ? 'calc(100vh - 140px)' : 'calc(100vh - 180px)';

        const tarjeta = document.createElement('div');
        tarjeta.style.position = 'relative';
        
        tarjeta.style.backgroundColor = (transparente || esImagen) ? 'transparent' : '#000';
        tarjeta.style.boxShadow = (transparente || esImagen) ? 'none' : '0 15px 35px rgba(0,0,0,0.4)';
        
        tarjeta.style.borderRadius = '16px';
        tarjeta.style.overflow = 'hidden';
        tarjeta.style.pointerEvents = 'auto';
        
        tarjeta.style.opacity = '0';
        tarjeta.style.transform = 'translateX(100px)';
        tarjeta.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        tarjeta.style.display = 'flex';
        tarjeta.style.flexDirection = 'column';

        let mediaEl;
        
        if (esHtml) {
            mediaEl = document.createElement('iframe');
            mediaEl.src = url;
            mediaEl.style.width = '100%';
            mediaEl.style.border = 'none';
            mediaEl.style.display = 'block';
            if (transparente) {
                mediaEl.style.backgroundColor = 'transparent';
                mediaEl.allowTransparency = "true";
            }
        } else if (esVideo) {
            mediaEl = document.createElement('video');
            mediaEl.src = url;
            mediaEl.controls = true;
            mediaEl.autoplay = true;
            mediaEl.muted = true;
            mediaEl.style.width = '100%';
            mediaEl.style.height = 'auto';
            mediaEl.style.maxHeight = zonaSegura; 
            mediaEl.style.display = 'block';
            if (transparente) mediaEl.style.backgroundColor = 'transparent';
        } else {
            mediaEl = document.createElement('img');
            mediaEl.src = url;
            
            mediaEl.style.width = 'auto'; 
            mediaEl.style.height = 'auto';
            mediaEl.style.maxWidth = '100%'; 
            mediaEl.style.maxHeight = zonaSegura;
            
            mediaEl.style.objectFit = 'contain';
            mediaEl.style.display = 'block';
            
            if (!transparente) {
                mediaEl.style.borderRadius = '16px';
                mediaEl.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
            }
        }

        const cerrarTarjeta = () => {
            tarjeta.style.opacity = '0';
            tarjeta.style.transform = 'translateX(100px)';
            
            setTimeout(() => {
                if (tarjeta.parentNode) {
                    contenedorGlobal.removeChild(tarjeta);
                    actualizarTamanos(); 
                }
                
                if (typeof v3d !== 'undefined' && v3d.puzzles && v3d.puzzles.procedures[nombreArchivo]) {
                    v3d.puzzles.procedures[nombreArchivo]();
                } else {
                    console.warn(`Verge3D: Procedimiento "${nombreArchivo}" no encontrado.`);
                }
            }, 300); 
        };

        tarjetasAbiertas.push({ cerrar: cerrarTarjeta });

        tarjeta.appendChild(mediaEl);
        contenedorGlobal.appendChild(tarjeta);

        actualizarTamanos();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                tarjeta.style.opacity = '1';
                tarjeta.style.transform = 'translate(0, 0)';
            });
        });
    };

    window.closehtml = function() {
        const funcionesCierre = tarjetasAbiertas.map(item => item.cerrar);
        tarjetasAbiertas = []; 
        
        if (botonGlobal) botonGlobal.style.display = 'none';

        funcionesCierre.forEach(cerrarFunc => {
            cerrarFunc();
        });
    };
})();