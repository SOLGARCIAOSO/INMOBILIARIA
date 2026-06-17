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
                // Reemplaza la imagen por un input file nuevo
                wrapper.innerHTML = `<input type="file" name="imagen_${index}" accept="image/*" style="width: 100%;">`;
            }
        }
    });

    // 2. Lógica de vista previa para nuevos archivos
    // Escucha cualquier cambio en los inputs de archivos que hemos creado
    document.addEventListener('change', function(e) {
        if (e.target.type === 'file') {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Si ya hay una vista previa, la reemplazamos, si no, creamos una
                    let container = e.target.parentElement;
                    let existingImg = container.querySelector('img');
                    
                    if (existingImg) {
                        existingImg.src = event.target.result;
                    } else {
                        // Insertamos la miniatura encima del input file
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
});