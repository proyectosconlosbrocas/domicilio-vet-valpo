
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
    fetch('instagram_posts.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const instagramPostsContainer = document.getElementById('instagram-posts');
        if (instagramPostsContainer) {
          data.forEach(post => {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-6 col-md-4 col-lg-4'; // Bootstrap grid for responsive layout

            const imgLink = document.createElement('a');
            imgLink.href = post.url; // Assuming post.url is the direct link to the Instagram post
            imgLink.target = "_blank";
            imgLink.rel = "noopener noreferrer";
            imgLink.className = "instagram-post-link";

            const img = document.createElement('img');
            img.src = post.url; // The image URL from our JSON
            img.alt = "Publicación de Instagram";
            img.className = 'img-fluid rounded shadow-sm instagram-post-img';

            imgLink.appendChild(img);
            colDiv.appendChild(imgLink);
            instagramPostsContainer.appendChild(colDiv);
          });
        }
      })
      .catch(error => console.error('Error al cargar el feed de Instagram:', error));
  }

  // Llamar a la función para cargar el feed de Instagram
  loadInstagramFeed();

});
