document.addEventListener('DOMContentLoaded', () => {

    // 1. Inicializar iconos Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.getElementById('close-menu');

    // Mover sidebar al body para evitar problemas de posicionamiento
    if (sidebar) {
        document.body.appendChild(sidebar);
    }

    if (menuToggle && sidebar) {
        // Crear overlay dinámicamente
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }

        function toggleMenu(abrir) {
            if (abrir) {
                sidebar.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                menuToggle.setAttribute('aria-expanded', 'true');
                menuToggle.style.visibility = 'hidden';
            } else {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.style.visibility = 'visible';
            }
        }

        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.addEventListener('click', () => toggleMenu(true));
        if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
        overlay.addEventListener('click', () => toggleMenu(false));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) toggleMenu(false);
        });

        // Swipe
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
            if (deltaY > 60) return;
            if (deltaX > 60 && touchStartX < 40 && !sidebar.classList.contains('active')) toggleMenu(true);
            if (deltaX < -60 && sidebar.classList.contains('active')) toggleMenu(false);
        }, { passive: true });
    }

    // 3. Aviso de Cookies
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

    if (consentOverlay && localStorage.getItem('cookiesAccepted') !== 'true') {
        mostrarCookies();
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            ocultarCookies();
        });
    }

    if (politicsLink) {
        politicsLink.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // 4. Marcar enlace activo en sidebar
    const currentPath = window.location.pathname;
    document.querySelectorAll('.sidebar a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

});