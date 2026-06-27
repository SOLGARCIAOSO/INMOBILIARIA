// script.js

// --- Toggle del menú lateral en móviles ---
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");

  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }
});

// --- Animación de iconos al hacer hover ---
document.querySelectorAll("section h2 i, .valor i").forEach(icon => {
  icon.addEventListener("mouseenter", () => {
    icon.style.transform = "scale(1.2)";
    icon.style.transition = "transform 0.3s ease, color 0.3s ease";
    icon.style.color = "#ffd700"; // dorado más brillante
  });
  icon.addEventListener("mouseleave", () => {
    icon.style.transform = "scale(1)";
    icon.style.color = "var(--accent-gold)";
  });
});

// --- Buscador: alerta con el término ingresado ---
const buscadorForm = document.querySelector(".buscador");
if (buscadorForm) {
  buscadorForm.addEventListener("submit", e => {
    e.preventDefault();
    const input = buscadorForm.querySelector("input");
    if (input.value.trim() !== "") {
      alert(`Buscando: ${input.value}`);
    } else {
      alert("Por favor ingresa un término de búsqueda.");
    }
  });
}

// --- Botón CTA: efecto de pulsación ---
const ctaBtn = document.querySelector(".btn-principal");
if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    ctaBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      ctaBtn.style.transform = "scale(1)";
    }, 150);
  });
}
