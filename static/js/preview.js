document.addEventListener('DOMContentLoaded', () => {
    let idsParaBorrar = [];

    // 1. Lógica para borrar imágenes existentes
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-borrar')) {
            const id = e.target.getAttribute('data-id');
            const index = e.target.getAttribute('data-index');
            
            idsParaBorrar.push(id);
            document.getElementById('imagenes_a_borrar').value = idsParaBorrar.join(',');
            
            const wrapper = document.getElementById('wrapper-' + id);
            if (wrapper) {
                wrapper.innerHTML = `<input type="file" name="imagen_${index}" accept="image/*" style="width: 100%;">`;
            }
        }
    });

    // 2. Lógica de vista previa para nuevos archivos
    document.addEventListener('change', function(e) {
        if (e.target.type === 'file') {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    let container = e.target.parentElement;
                    let existingImg = container.querySelector('img');
                    
                    if (existingImg) {
                        existingImg.src = event.target.result;
                    } else {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        img.style.width = '80px';
                        img.style.height = '80px';
                        img.style.objectFit = 'cover';
                        container.prepend(img);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    });

    // 3. Lógica para copiar enlace de compartir
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-share')) {
            const btn = e.target.closest('.btn-share');
            const url = window.location.origin + btn.getAttribute('data-url');

            navigator.clipboard.writeText(url).then(() => {
                // Notificación superior "Enlace copiado!"
                const notif = document.createElement('div');
                notif.textContent = "✅ Enlace copiado!";
                notif.style.position = "fixed";
                notif.style.top = "20px";
                notif.style.left = "50%";
                notif.style.transform = "translateX(-50%)";
                notif.style.background = "#4caf50"; // verde elegante
                notif.style.color = "#fff";
                notif.style.padding = "10px 18px";
                notif.style.borderRadius = "6px";
                notif.style.fontSize = "0.95rem";
                notif.style.fontWeight = "600";
                notif.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                notif.style.zIndex = "9999";
                document.body.appendChild(notif);

                setTimeout(() => notif.remove(), 2000);
            });
        }
    });
});
