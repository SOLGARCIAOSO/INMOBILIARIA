document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar íconos
    lucide.createIcons();

    // 2. Acordeones
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');
            if (content.style.display === 'block') {
                content.style.display = 'none';
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.display = 'block';
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // 3. Simulador de Crédito (Corregido)
    // 3. Simulador de Crédito (Final)
    const contenedorSimulador = document.getElementById('simulador-credito');
    
    // Solo ejecutamos si el contenedor existe en esta página
    if (contenedorSimulador) {
        const precioInmueble = parseFloat(contenedorSimulador.dataset.precio);

        function calcular() {
            const pCi = document.getElementById('slider-ci').value;
            const plazoAnios = document.getElementById('slider-plazo').value;
            const tasaPorcentaje = document.getElementById('slider-tasa').value; // Nueva tasa
            
            // Actualizar etiquetas visuales
            document.getElementById('val-ci').innerText = pCi + "%";
            document.getElementById('val-plazo').innerText = plazoAnios + " años";
            document.getElementById('val-tasa').innerText = tasaPorcentaje + "%";
            
            // Cálculos
            const ci = precioInmueble * (pCi / 100);
            const valCredito = precioInmueble - ci;
            const nMeses = plazoAnios * 12;
            const i = parseFloat(tasaPorcentaje) / 100; // Tasa dinámica desde el slider
            
            // Cálculo de cuota fija
            const cuotaMensual = valCredito * (i * Math.pow(1 + i, nMeses)) / (Math.pow(1 + i, nMeses) - 1);
            
            // Formateo a moneda COP
            const formatter = new Intl.NumberFormat('es-CO', { 
                style: 'currency', currency: 'COP', maximumFractionDigits: 0 
            });
            
            document.getElementById('res-cuota').innerText = formatter.format(cuotaMensual);
            document.getElementById('res-credito').innerText = formatter.format(valCredito);
            document.getElementById('res-ci').innerText = formatter.format(ci);
        }

        // Listeners para todos los sliders
        document.getElementById('slider-ci').addEventListener('input', calcular);
        document.getElementById('slider-plazo').addEventListener('input', calcular);
        document.getElementById('slider-tasa').addEventListener('input', calcular); // Nuevo listener
        
        // Ejecución inicial
        calcular();
    }
});