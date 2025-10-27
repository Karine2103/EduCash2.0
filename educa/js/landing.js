// landing.js: pequena interação do formulário e smooth-scroll
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // simple lead form handling (fake, client-side)
  const form = document.getElementById('lead-form');
  const msg = document.getElementById('form-msg');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name')?.trim();
      const email = data.get('email')?.trim();
      if (!name || !email) {
        msg.textContent = 'Por favor preencha nome e e-mail.';
        msg.style.color = '#e74c3c';
        return;
      }
      // success feedback (replace by actual POST to backend later)
      msg.textContent = 'Obrigado! Em breve entraremos em contato.';
      msg.style.color = '#2a9d43';
      form.reset();
    });
  }
});
