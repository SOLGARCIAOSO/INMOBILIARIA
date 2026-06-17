document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const input = form.querySelector('input[type="file"]');
            if (input && input.files.length > 6) {
                alert("Por favor, selecciona máximo 6 imágenes.");
                e.preventDefault();
            }
        });
    }
});