document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar los íconos de Lucide
    lucide.createIcons();

    // 2. Lógica para los acordeones
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');

            // Alternar visibilidad (display: block/none)
            if (content.style.display === 'block') {
                content.style.display = 'none';
                // Regresar el ícono a su posición original
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                // Cerrar otros acordeones si quisieras un efecto tipo "acordeón único"
                // document.querySelectorAll('.accordion-content').forEach(c => c.style.display = 'none');
                
                content.style.display = 'block';
                // Rotar el ícono 180 grados
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
});