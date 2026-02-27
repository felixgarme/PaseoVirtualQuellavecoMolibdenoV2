window.avatar = (function() {
    let contenedor, envolturaVideo, videoEl, audioEl, burbujaTexto, btnPausa;
    let temporizadorRespaldo; 

    const iconoPausa = '<svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    const iconoPlay = '<svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M8 5v14l11-7z"/></svg>';

    function aplicarEstilosResponsivos() {
        if (!contenedor) return;
        
        const esMovil = window.innerWidth <= 950;
        const esHechado = window.innerWidth > window.innerHeight;
        const estaVisible = contenedor.style.opacity === '1';

        if (esMovil && esHechado) {
            contenedor.style.top = '15px';
            contenedor.style.left = '15px';
            contenedor.style.maxWidth = '40vw';
            
            envolturaVideo.style.width = '70px';
            envolturaVideo.style.height = '70px';
            
            burbujaTexto.style.fontSize = '12px';
            burbujaTexto.style.padding = '8px 12px';
            burbujaTexto.style.marginLeft = '10px';
            burbujaTexto.style.maxWidth = 'calc(40vw - 80px)';
            
            contenedor.style.transform = estaVisible ? 'translateX(0px)' : 'translateX(-120%)';

        } else if (esMovil && !esHechado) {
            contenedor.style.top = '15px';
            contenedor.style.left = '15px';
            contenedor.style.maxWidth = '90vw';
            
            envolturaVideo.style.width = '100px'; 
            envolturaVideo.style.height = '100px';
            
            burbujaTexto.style.fontSize = '16px'; 
            burbujaTexto.style.padding = '12px 18px';
            burbujaTexto.style.marginLeft = '12px';
            burbujaTexto.style.maxWidth = 'calc(90vw - 120px)';
            
            contenedor.style.transform = estaVisible ? 'translateX(0px)' : 'translateX(-120%)';

        } else {
            contenedor.style.top = '50%';
            contenedor.style.left = '30px';
            contenedor.style.maxWidth = 'none';

            envolturaVideo.style.width = '190px';
            envolturaVideo.style.height = '190px';

            burbujaTexto.style.fontSize = '20px';
            burbujaTexto.style.padding = '18px 28px';
            burbujaTexto.style.marginLeft = '20px';
            burbujaTexto.style.maxWidth = '350px';

            contenedor.style.transform = estaVisible ? 'translateY(-50%) translateX(0px)' : 'translateY(-50%) translateX(-120px)';
        }
    }

    function ocultarAvatar() {
        contenedor.style.opacity = '0';
        aplicarEstilosResponsivos(); 
    }

    function mostrarAvatar() {
        contenedor.style.opacity = '1';
        aplicarEstilosResponsivos(); 
    }

    function inicializarUI() {
        if (contenedor) return;

        contenedor = document.createElement('div');
        contenedor.style.position = 'fixed';
        contenedor.style.zIndex = '9999';
        contenedor.style.display = 'flex';
        contenedor.style.flexDirection = 'row';
        contenedor.style.alignItems = 'center'; // Modificado: Alinea la burbuja al centro del avatar
        contenedor.style.fontFamily = '"Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        contenedor.style.pointerEvents = 'none'; 
        
        contenedor.style.opacity = '0';
        contenedor.style.transition = 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'; 

        envolturaVideo = document.createElement('div');
        envolturaVideo.style.position = 'relative';
        envolturaVideo.style.flexShrink = '0'; 

        videoEl = document.createElement('video');
        videoEl.src = '../../resources/video/avatarA.mp4';
        videoEl.style.width = '100%';
        videoEl.style.height = '100%';
        videoEl.style.borderRadius = '50%';
        videoEl.style.objectFit = 'cover';
        videoEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        videoEl.style.border = '5px solid #ffffff';
        videoEl.muted = true; 
        videoEl.loop = true;

        btnPausa = document.createElement('button');
        btnPausa.innerHTML = iconoPausa; 
        btnPausa.style.position = 'absolute';
        btnPausa.style.bottom = '10%';
        btnPausa.style.right = '10%';
        btnPausa.style.width = '36px'; 
        btnPausa.style.height = '36px';
        btnPausa.style.borderRadius = '50%';
        btnPausa.style.border = '2px solid rgba(255, 255, 255, 0.5)';
        btnPausa.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        btnPausa.style.backdropFilter = 'blur(4px)';
        btnPausa.style.cursor = 'pointer';
        btnPausa.style.pointerEvents = 'auto'; 
        btnPausa.style.display = 'flex';
        btnPausa.style.justifyContent = 'center';
        btnPausa.style.alignItems = 'center';
        btnPausa.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        btnPausa.style.transition = 'all 0.2s ease';

        btnPausa.onmouseenter = () => {
            btnPausa.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            btnPausa.style.transform = 'scale(1.05)';
        };
        btnPausa.onmouseleave = () => {
            btnPausa.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            btnPausa.style.transform = 'scale(1)';
        };

        btnPausa.onclick = () => {
            if (audioEl.paused) {
                audioEl.play();
                videoEl.play();
                btnPausa.innerHTML = iconoPausa;
            } else {
                audioEl.pause();
                videoEl.pause();
                btnPausa.innerHTML = iconoPlay;
            }
        };

        audioEl = document.createElement('audio');

        audioEl.onended = () => {
            ocultarAvatar(); 
        };

        burbujaTexto = document.createElement('div');
        burbujaTexto.style.backgroundColor = '#031795'; // Modificado: Fondo azul
        burbujaTexto.style.color = '#ffffff'; // Modificado: Texto blanco para contraste
        burbujaTexto.style.fontFamily = '"AA Smart Sans", sans-serif'; // Modificado: Fuente añadida
        burbujaTexto.style.borderRadius = '24px 24px 24px 4px';
        burbujaTexto.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)'; 
        burbujaTexto.style.textAlign = 'left';
        burbujaTexto.style.fontWeight = '600'; // Modificado: Equivalente a SemiBold
        burbujaTexto.style.lineHeight = '1.4';
        
        envolturaVideo.appendChild(videoEl);
        envolturaVideo.appendChild(btnPausa);
        
        contenedor.appendChild(envolturaVideo);
        contenedor.appendChild(burbujaTexto);
        document.body.appendChild(contenedor);

        window.addEventListener('resize', aplicarEstilosResponsivos);
        aplicarEstilosResponsivos();
    }

    return function(mensaje, urlAudio, permitirPausa = true) {
        inicializarUI();

        if (temporizadorRespaldo) clearTimeout(temporizadorRespaldo);

        burbujaTexto.textContent = mensaje;
        btnPausa.innerHTML = iconoPausa;
        
        if (permitirPausa === false) {
            btnPausa.style.display = 'none';
        } else {
            btnPausa.style.display = 'flex';
        }
        
        setTimeout(() => {
            mostrarAvatar(); 
        }, 50);

        if (urlAudio) {
            audioEl.src = urlAudio;
            videoEl.play().catch(e => console.log("Video bloqueado", e));
            audioEl.play().catch(e => console.log("Audio bloqueado", e));
        } else {
            videoEl.play().catch(e => console.log("Video bloqueado", e));
            temporizadorRespaldo = setTimeout(() => {
                ocultarAvatar();
            }, 4000);
        }
    };
})();