
/**
 * CAPITAL GROUP — detalle.js
 * Lightbox con galería completa, navegación, teclado y swipe
 */

document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // =========================================
    // LIGHTBOX
    // =========================================
    const imagenes = Array.from(document.querySelectorAll('.gallery-item'));
    if (!imagenes.length) return;

    let indiceActual = 0;

    // Corregir el contador del overlay con el número real de fotos ocultas
    // (las visibles en la galería son imagen principal + 1 miniatura = 2)
    const galNum = document.querySelector('.gal-num');
    if (galNum) {
        const totalFotos = imagenes.length;
        const fotosOcultas = totalFotos - 2; // principal + 1 miniatura visible
        galNum.textContent = fotosOcultas > 0 ? `+${fotosOcultas}` : '';
    }

    // Crear estructura del lightbox
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <div class="lb-overlay"></div>
        <div class="lb-wrapper">
            <div class="lb-top">
                <span class="lb-contador">1 / ${imagenes.length}</span>
                <button class="lb-close" title="Cerrar">✕</button>
            </div>
            <div class="lb-main">
                <button class="lb-nav lb-prev" title="Anterior">&#8592;</button>
                <img class="lb-img" src="" alt="">
                <button class="lb-nav lb-next" title="Siguiente">&#8594;</button>
            </div>
            <div class="lb-thumbs"></div>
        </div>
    `;
    document.body.appendChild(lightbox);

    // Miniaturas
    const thumbsContainer = lightbox.querySelector('.lb-thumbs');
    imagenes.forEach((img, i) => {
        const thumb = document.createElement('img');
        thumb.src = img.src;
        thumb.alt = img.alt;
        thumb.className = 'lb-thumb';
        thumb.addEventListener('click', () => abrirEn(i));
        thumbsContainer.appendChild(thumb);
    });

    const lbImg      = lightbox.querySelector('.lb-img');
    const lbContador = lightbox.querySelector('.lb-contador');
    const lbThumbs   = lightbox.querySelectorAll('.lb-thumb');

    function abrirEn(i) {
        indiceActual = (i + imagenes.length) % imagenes.length;
        lbImg.src = imagenes[indiceActual].src;
        lbImg.alt = imagenes[indiceActual].alt;
        lbContador.textContent = `${indiceActual + 1} / ${imagenes.length}`;
        lbThumbs.forEach((t, idx) => t.classList.toggle('activa', idx === indiceActual));
        lbThumbs[indiceActual]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        lightbox.classList.add('abierto');
        document.body.style.overflow = 'hidden';
    }

    function cerrar() {
        lightbox.classList.remove('abierto');
        document.body.style.overflow = '';
    }

    // Abrir al clicar imágenes de galería
    imagenes.forEach((img, i) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => abrirEn(i));
    });

    // Clic en overlay "+X fotos" abre desde la 3ra imagen
    document.querySelectorAll('.gal-ver-mas').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => abrirEn(2));
    });

    // Navegación
    lightbox.querySelector('.lb-prev').addEventListener('click', () => abrirEn(indiceActual - 1));
    lightbox.querySelector('.lb-next').addEventListener('click', () => abrirEn(indiceActual + 1));
    lightbox.querySelector('.lb-close').addEventListener('click', cerrar);
    lightbox.querySelector('.lb-overlay').addEventListener('click', cerrar);

    // Teclado
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('abierto')) return;
        if (e.key === 'ArrowRight') abrirEn(indiceActual + 1);
        if (e.key === 'ArrowLeft')  abrirEn(indiceActual - 1);
        if (e.key === 'Escape')     cerrar();
    });

    // Swipe táctil
    let touchStartX = 0;
    lbImg.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lbImg.addEventListener('touchend', e => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (delta > 50)  abrirEn(indiceActual - 1);
        if (delta < -50) abrirEn(indiceActual + 1);
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
