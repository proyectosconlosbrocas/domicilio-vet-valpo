// Inicializar AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// Feed de Instagram: carga instagram_posts.json (generado por instagram_fetcher.py)
// y renderiza un grid de miniaturas. Es tolerante a ambos formatos que ese script
// puede producir (image_local_url + post_page_url, o solo url) y a que el archivo
// no exista o esté vacío. Las URLs directas del CDN de Instagram son firmadas y
// caducan a los pocos días, y Instagram suele bloquear el hotlinking por CORS: si
// una imagen falla se oculta solo esa miniatura, y si fallan todas se oculta el
// grid completo y queda únicamente el botón "Síguenos en Instagram".
function initInstagramFeed() {
  const grid = document.getElementById('instagramGrid');
  if (!grid) return;

  fetch('instagram_posts.json')
    .then(response => (response.ok ? response.json() : []))
    .then(posts => {
      if (!Array.isArray(posts) || posts.length === 0) return;

      let loadedCount = 0;
      let failedCount = 0;
      const total = posts.length;

      posts.forEach(post => {
        const imageUrl = post.image_local_url || post.url;
        if (!imageUrl) {
          failedCount++;
          return;
        }

        const link = document.createElement('a');
        link.className = 'instagram-grid-item';
        link.href = post.post_page_url || 'https://www.instagram.com/domicilio.vet.valpo/';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'Ver publicación en Instagram');

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Publicación de Domicilio Vet Valpo en Instagram';
        img.loading = 'lazy';

        img.addEventListener('load', () => {
          loadedCount++;
        });

        img.addEventListener('error', () => {
          failedCount++;
          link.remove();
          // Si ya se resolvieron todas y ninguna cargó, ocultar el grid vacío
          if (failedCount === total && loadedCount === 0) {
            grid.innerHTML = '';
          }
        });

        link.appendChild(img);
        grid.appendChild(link);
      });
    })
    .catch(() => {
      // Sin conexión, archivo ausente o JSON inválido: no se muestra el grid,
      // el botón de seguir sigue disponible.
    });
}

// Manejo del formulario de contacto: arma el mensaje y abre WhatsApp,
// con feedback visual (spinner + mensaje de estado) durante el envío.
function initContactForm() {
    const form = document.getElementById('contactForm');
    const messageDiv = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const pet = document.getElementById('pet').value;
        const message = document.getElementById('message').value;

        // Mostrar spinner y deshabilitar botón mientras se prepara el envío
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-block';
        messageDiv.className = 'form-message';
        messageDiv.textContent = '';

        const whatsappMessage = `Hola, mi nombre es ${name}. Mi mascota se llama ${pet}. ${message}. Mi teléfono es ${phone}.`;
        const whatsappURL = `https://wa.me/56965222368?text=${encodeURIComponent(whatsappMessage)}`;

        // Pequeño delay para mejor UX antes de abrir WhatsApp
        setTimeout(() => {
            window.open(whatsappURL, '_blank');

            // Mostrar mensaje de éxito real (el usuario fue redirigido a WhatsApp)
            messageDiv.className = 'form-message success show';
            messageDiv.textContent = '¡Listo! Te estamos redirigiendo a WhatsApp para continuar la conversación.';

            form.reset();

            // Restaurar botón
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnSpinner.style.display = 'none';

            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                messageDiv.classList.remove('show');
            }, 5000);
        }, 800);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  // Cerrar menú móvil al hacer clic en un enlace
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });

  // Cambiar estilo de navbar al hacer scroll y mostrar botón volver arriba
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Mostrar/ocultar botón volver arriba
    if (backToTopBtn) {
      if (currentScroll > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  // Funcionalidad del botón volver arriba
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Inicializar formulario de contacto y feed de Instagram
  initContactForm();
  initInstagramFeed();
});
