// script-kids.js — controle de sidebar, perfil, busca e tema
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // === Sidebar (compatível com "side", "side-panel" ou "barra-lateral") ===
  const menuBtn = document.getElementById('menu-btn');
  const side = document.getElementById('side') || document.querySelector('.side-panel') || document.querySelector('.barra-lateral');
  // botão de fechar pode ser close-side (nova) ou close-btn (antiga) ou .close-side
  const closeSide = document.getElementById('close-side') || document.getElementById('close-btn') || (side && side.querySelector('#close-side, #close-btn, .close-side'));

  // === Perfil / popup (suporta popup moderno ou perfil embutido no header antigo) ===
  const userBtn = document.getElementById('user-btn');
  const profilePopup = document.getElementById('profile-popup') || document.querySelector('.cabecalho .perfil') || document.querySelector('.perfil');
  const closePopup = document.getElementById('close-popup') || (profilePopup && profilePopup.querySelector('.popup-close, .botao-fechar'));

  // === Busca (form) ===
  const searchForm = document.querySelector('.search-wrap') || document.querySelector('.formulario-pesquisa');
  const searchBtn = document.getElementById('search-btn') || document.querySelector('.icon-btn[aria-label="Pesquisar"], .fa-search');

  // === Tema (opcional) ===
  const toggleBtn = document.getElementById('toggle-btn') || document.querySelector('[data-toggle-theme]');
  const cabecalho = document.querySelector('.site-header') || document.querySelector('.cabecalho');
  const rodape = document.querySelector('.site-footer') || document.querySelector('.rodape');

  // Helper: set aria-hidden safely
  function setAriaHidden(el, hidden) {
    if (!el) return;
    try { el.setAttribute('aria-hidden', hidden ? 'true' : 'false'); } catch(e){}
  }

  // ---------- Sidebar handlers ----------
  if (menuBtn && side) {
    menuBtn.addEventListener('click', (e) => {
      // toggle both classes for compatibility com CSS antigo/novo
      side.classList.toggle('open');
      side.classList.toggle('ativo');
      body.classList.toggle('ativo'); // usado por css antigo
      setAriaHidden(side, !side.classList.contains('open') && !side.classList.contains('ativo'));
    });
  }

  if (closeSide) {
    closeSide.addEventListener('click', () => {
      side?.classList.remove('open');
      side?.classList.remove('ativo');
      body.classList.remove('ativo');
      setAriaHidden(side, true);
    });
  }

  // If user clicks outside the side panel on mobile, close it (optional)
  document.addEventListener('click', (e) => {
    if (!side) return;
    const isOpen = side.classList.contains('open') || side.classList.contains('ativo');
    if (!isOpen) return;
    // ignore clicks inside the side
    if (side.contains(e.target) || (menuBtn && menuBtn.contains(e.target))) return;
    side.classList.remove('open', 'ativo');
    body.classList.remove('ativo');
    setAriaHidden(side, true);
  });

  // ---------- Perfil / popup handlers ----------
  if (userBtn && profilePopup && profilePopup.classList.contains('popup') === false) {
    // old-style header profile (scales in/out)
    userBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      profilePopup.classList.toggle('ativo');
    });
    // close when clicking outside old header profile
    document.addEventListener('click', (ev) => {
      if (!profilePopup) return;
      if (profilePopup.contains(ev.target) || (userBtn && userBtn.contains(ev.target))) return;
      profilePopup.classList.remove('ativo');
    });
  } else if (userBtn && profilePopup && profilePopup.classList.contains('popup')) {
    // new popup dialog style
    userBtn.addEventListener('click', () => {
      const opened = profilePopup.classList.toggle('open');
      setAriaHidden(profilePopup, !opened);
    });

    if (closePopup) {
      closePopup.addEventListener('click', () => {
        profilePopup.classList.remove('open');
        setAriaHidden(profilePopup, true);
      });
    }

    // close with ESC or clicking outside the popup-card
    profilePopup.addEventListener('click', (ev) => {
      if (ev.target === profilePopup) {
        profilePopup.classList.remove('open');
        setAriaHidden(profilePopup, true);
      }
    });
  }

  // ---------- Busca (mobile toggle) ----------
  if (searchBtn && searchForm) {
    searchBtn.addEventListener('click', (ev) => {
      // se for um botão submit dentro do form, não prevenir comportamento normal
      if (searchBtn.tagName.toLowerCase() === 'button' && searchBtn.type === 'submit') return;
      ev.stopPropagation();
      searchForm.classList.toggle('ativo');
    });

    // prevent closing when clicking inside form
    searchForm.addEventListener('click', (e) => e.stopPropagation());
  }

  // ---------- Tema claro/escuro (opcional) ----------
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      body.classList.toggle('escuro');
      side?.classList.toggle('escuro');
      cabecalho?.classList.toggle('escuro');
      rodape?.classList.toggle('escuro');
      // swap icon if it uses FontAwesome classes
      if (toggleBtn.classList.contains('fa-sun')) {
        toggleBtn.classList.remove('fa-sun');
        toggleBtn.classList.add('fa-moon');
      } else if (toggleBtn.classList.contains('fa-moon')) {
        toggleBtn.classList.remove('fa-moon');
        toggleBtn.classList.add('fa-sun');
      }
    });
  }

  // ---------- Keyboard shortcuts / global listeners ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // close side
      side?.classList.remove('open','ativo','escuro');
      body.classList.remove('ativo','escuro');
      // close profile popup
      if (profilePopup) {
        profilePopup.classList.remove('open');
        profilePopup.classList.remove('ativo');
        setAriaHidden(profilePopup, true);
      }
      // close search form
      searchForm?.classList.remove('ativo');
    }
  });

  // avoid errors if some elements are missing: simply do nothing
});