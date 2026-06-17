document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // 1. Inicializar iconos
    // =========================
console.log("MAIN CARGADO");

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // =========================
    // 2. Menú móvil
    // =========================
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // =========================
// 3. Aviso de Cookies
// =========================
const consentOverlay = document.getElementById('cookie-consent');
const acceptBtn = document.getElementById('accept-cookies');
// Buscamos el enlace directamente dentro del contenedor del modal
const politicsLink = consentOverlay ? consentOverlay.querySelector('a') : null;

function abrirModal() {
    if (!consentOverlay) return;
    consentOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    if (!consentOverlay) return;
    consentOverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Mostrar al cargar si no ha aceptado
if (consentOverlay && localStorage.getItem('cookiesAccepted') !== 'true') {
    abrirModal();
}

// Botón Aceptar
if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cerrarModal();
    });
}

// Enlace Ver Políticas: Guarda aceptación automáticamente
if (politicsLink) {
    politicsLink.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        // Al hacer clic, el usuario navega a la nueva página.
        // Al volver, la cookie ya estará guardada y no verá el modal.
    });
}


});