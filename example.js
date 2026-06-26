main.js:
document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. Inicializar iconos Lucide
    // =========================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // =========================================
    // 2. Menú móvil — con overlay y gestos
    // =========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar    = document.querySelector('.sidebar');

    // Crear overlay dinámicamente (evita duplicarlo en cada template)
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function abrirSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // evita scroll de fondo
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function cerrarSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    if (menuToggle && sidebar) {
        menuToggle.setAttribute('aria-expanded', 'false');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.contains('active') ? cerrarSidebar() : abrirSidebar();
        });

        // Cerrar al hacer clic en el overlay
        overlay.addEventListener('click', cerrarSidebar);

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                cerrarSidebar();
                menuToggle.focus();
            }
        });

        // Cerrar al redimensionar a pantalla grande
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                cerrarSidebar();
            }
        });

        // Swipe: deslizar a la derecha abre el menú, a la izquierda lo cierra
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);

            // Sólo si el movimiento horizontal supera el vertical (no es scroll)
            if (deltaY > 60) return;

            // Swipe derecha desde el borde izquierdo → abrir
            if (deltaX > 60 && touchStartX < 40 && !sidebar.classList.contains('active')) {
                abrirSidebar();
            }

            // Swipe izquierda → cerrar
            if (deltaX < -60 && sidebar.classList.contains('active')) {
                cerrarSidebar();
            }
        }, { passive: true });
    }

    // =========================================
    // 3. Aviso de Cookies
    // =========================================
    const consentOverlay = document.getElementById('cookie-consent');
    const acceptBtn      = document.getElementById('accept-cookies');
    const politicsLink   = consentOverlay ? consentOverlay.querySelector('a') : null;

    function mostrarCookies() {
        if (!consentOverlay) return;
        consentOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function ocultarCookies() {
        if (!consentOverlay) return;
        consentOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Mostrar si no ha aceptado previamente
    if (consentOverlay && localStorage.getItem('cookiesAccepted') !== 'true') {
        mostrarCookies();
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            ocultarCookies();
        });
    }

    // Al ir a políticas también se considera aceptado
    if (politicsLink) {
        politicsLink.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // =========================================
    // 4. Marcar enlace activo en sidebar
    // =========================================
    const currentPath = window.location.pathname;
    document.querySelectorAll('.sidebar a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

});