
// Inicializar AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

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

  // Contador animado para estadísticas
  const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 20);
  };

  // Observador para activar contador cuando sea visible
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 0.5 });

  // Observar todos los contadores
  document.querySelectorAll('.stat-number').forEach(counter => {
    counterObserver.observe(counter);
  });

  // Cambiar estilo de navbar al hacer scroll
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // Manejar envío del formulario de contacto
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const pet = document.getElementById('pet').value;
      const message = document.getElementById('message').value;
      
      const whatsappMessage = `Hola, mi nombre es ${name}. Mi mascota se llama ${pet}. ${message}. Mi teléfono es ${phone}.`;
      const whatsappURL = `https://wa.me/56965222368?text=${encodeURIComponent(whatsappMessage)}`;
      
      window.open(whatsappURL, '_blank');
      contactForm.reset();
    });
  }

  // Función para cargar el feed de Instagram
  function loadInstagramFeed() {
    const instagramPostsContainer = document.getElementById('instagram-posts');
    if (!instagramPostsContainer) return;

    fetch('instagram_posts.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          showInstagramPlaceholder(instagramPostsContainer);
          return;
        }

        let totalPosts = data.length;
        let failedCount = 0;

        data.forEach(post => {
          const imageUrl = post.image_local_url || post.url;
          const postUrl = post.post_page_url || 'https://www.instagram.com/domicilio.vet.valpo/';
          
          if (!imageUrl) {
            console.warn('Instagram post skipped: no image URL', post);
            failedCount++;
            checkAllFailed();
            return;
          }

          const colDiv = document.createElement('div');
          colDiv.className = 'col-6 col-md-4 col-lg-4';

          const imgLink = document.createElement('a');
          imgLink.href = postUrl;
          imgLink.target = "_blank";
          imgLink.rel = "noopener noreferrer";
          imgLink.className = "instagram-post-link";

          const img = document.createElement('img');
          img.src = imageUrl;
          img.alt = "Publicación de Instagram";
          img.className = 'img-fluid rounded shadow-sm instagram-post-img';
          img.onerror = function() {
            console.warn('Instagram image failed to load:', imageUrl);
            colDiv.style.display = 'none';
            failedCount++;
            checkAllFailed();
          };

          imgLink.appendChild(img);
          colDiv.appendChild(imgLink);
          instagramPostsContainer.appendChild(colDiv);
        });

        function checkAllFailed() {
          if (failedCount >= totalPosts) {
            showInstagramPlaceholder(instagramPostsContainer);
          }
        }
      })
      .catch(error => {
        console.error('Error al cargar el feed de Instagram:', error);
        showInstagramPlaceholder(instagramPostsContainer);
      });
  }

  function showInstagramPlaceholder(container) {
    container.innerHTML = `
      <div class="col-12 text-center py-4">
        <p class="text-muted">Visita nuestro Instagram para ver las últimas publicaciones</p>
        <a href="https://www.instagram.com/domicilio.vet.valpo/" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary">
          <i class="bi bi-instagram me-2"></i>Ver en Instagram
        </a>
      </div>
    `;
  }

  // Llamar a la función para cargar el feed de Instagram
  loadInstagramFeed();

});
