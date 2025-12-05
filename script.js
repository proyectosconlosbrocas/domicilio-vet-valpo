// Inicializar AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// Botón Volver Arriba
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    if (!backToTopButton) return;

    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Volver arriba al hacer click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Manejo del formulario de contacto con feedback
function initContactForm() {
    const form = document.getElementById('contactForm');
    const messageDiv = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Mostrar spinner y deshabilitar botón
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-block';
        messageDiv.className = 'form-message';
        messageDiv.textContent = '';

        // Simular envío (aquí integrarías con tu backend)
        try {
            // Simular delay de envío
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mostrar mensaje de éxito
            messageDiv.className = 'form-message success show';
            messageDiv.textContent = '¡Mensaje enviado exitosamente! Te contactaremos pronto.';

            // Limpiar formulario
            form.reset();

            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                messageDiv.classList.remove('show');
            }, 5000);

        } catch (error) {
            // Mostrar mensaje de error
            messageDiv.className = 'form-message error show';
            messageDiv.textContent = 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.';
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnSpinner.style.display = 'none';
        }
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
  let lastScroll = 0;
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
    if (currentScroll > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }

    lastScroll = currentScroll;
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

  // Manejar envío del formulario de contacto
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Mostrar estado de envío
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Enviando...';
      submitBtn.style.opacity = '0.7';

      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const pet = document.getElementById('pet').value;
      const message = document.getElementById('message').value;

      const whatsappMessage = `Hola, mi nombre es ${name}. Mi mascota se llama ${pet}. ${message}. Mi teléfono es ${phone}.`;
      const whatsappURL = `https://wa.me/56965222368?text=${encodeURIComponent(whatsappMessage)}`;

      // Simular un pequeño delay para mejor UX
      setTimeout(() => {
        window.open(whatsappURL, '_blank');

        // Mostrar éxito
        submitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>¡Enviado!';
        submitBtn.style.background = 'var(--success-color)';

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.opacity = '1';
          submitBtn.style.background = '';
        }, 2000);
      }, 500);
    });
  }

  
  // Llamar a las funciones de inicialización
  initBackToTop();
  initContactForm();
});