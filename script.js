/* ==========================================
   IPOP — JavaScript Functionality
   ========================================== */

document.addEventListener('DOMContentLoaded', function () {
  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Handle contact form submission with Formspree
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});

/**
 * Handle contact form submission with Formspree
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Validate form data
  const name = formData.get('name')?.trim();
  const email = formData.get('email')?.trim();
  const message = formData.get('message')?.trim();
  const subject = formData.get('subject')?.trim();

  if (!name || !email || !message) {
    showNotification('Completa tots els camps obligatoris.', 'error');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Email inválid. Verifica el format.', 'error');
    return;
  }

  // Send via Formspree using fetch (no redirect)
  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        showNotification(
          '✓ Missatge enviat correctament. Rebràs una resposta aviat.',
          'success'
        );
        form.reset();
        console.log('Email sent successfully to jordanroig23@gmail.com');
      } else {
        showNotification('Error al enviar. Intenta-ho més tard.', 'error');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      showNotification('Error de connexió. Verifica la teva connexió.', 'error');
    });
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Apply inline styles
  const bgColor = type === 'success' ? '#1a1a1a' : '#2a2a2a';
  const borderColor = type === 'success' ? '#b794f6' : '#ff6b6b';
  const textColor = type === 'success' ? '#b794f6' : '#ff6b6b';

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background-color: ${bgColor};
    border: 1px solid ${borderColor};
    color: ${textColor};
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    border-radius: 4px;
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
    max-width: 400px;
  `;

  document.body.appendChild(notification);

  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Add animation keyframes to document
 */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(styleSheet);
