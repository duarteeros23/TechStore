// ── SCRIPT.JS — Eros Tienda Virtual ──

// ── 1. TEMA CLARO/OSCURO ──
(function () {
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.classList.add('light-mode');
    if (btn) btn.textContent = '🌙';
  }
  if (btn) {
    btn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-mode');
      btn.textContent = isLight ? '🌙' : '☀️';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }
})();

// ── 2. NAV ACTIVO ──
(function () {
  const links = document.querySelectorAll('nav a');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── 3. TARJETAS INTERACTIVAS (index.html) ──
(function () {
  const tarjetas = document.querySelectorAll('.tarjeta');
  if (!tarjetas.length) return;

  const mensajes = {
    0: '¡Todos nuestros productos cuentan con garantía oficial. ¡Compra con confianza!',
    1: '📦 Enviamos a todo Guatemala. ¡Tu pedido llega en 2 a 5 días hábiles!',
    2: '🛠️ Nuestro equipo técnico está disponible de lunes a sábado, 8:00 a 18:00 hrs.',
  };

  tarjetas.forEach((card, i) => {
    card.addEventListener('click', () => {
      // cambio de color al hacer clic
      card.style.borderColor = '#4f8ef7';
      card.style.background = 'rgba(79,142,247,0.08)';
      setTimeout(() => {
        card.style.borderColor = '';
        card.style.background = '';
      }, 1200);

      // mostrar mensaje en el DOM (no alert, más moderno)
      mostrarToast(mensajes[i] || '¡Gracias por tu interés!');
    });
  });
})();

// ── 4. COUNTER ANIMADO (index.html) ──
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el, target) => {
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 16);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target, parseInt(entry.target.dataset.count));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ── 5. EFECTO HOVER EN TABLA (servicios.html) ──
(function () {
  const rows = document.querySelectorAll('table tbody tr');
  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.querySelectorAll('td').forEach(td => {
        td.style.color = 'var(--text)';
      });
    });
    row.addEventListener('mouseleave', () => {
      row.querySelectorAll('td').forEach(td => {
        td.style.color = '';
      });
    });
  });
})();

// ── 6. FILTRO DE TABLA (servicios.html) ──
(function () {
  const input = document.getElementById('filtro-servicios');
  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    const rows = document.querySelectorAll('table tbody tr');
    let visible = 0;
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const match = text.includes(query);
      row.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    // actualizar contador
    const counter = document.getElementById('resultado-filtro');
    if (counter) {
      counter.textContent = query
        ? `${visible} servicio${visible !== 1 ? 's' : ''} encontrado${visible !== 1 ? 's' : ''}`
        : '';
    }
  });
})();

// ── 7. VALIDACIÓN DE FORMULARIO (contacto.html) ──
(function () {
  const form = document.getElementById('form-contacto');
  if (!form) return;

  const campos = {
    nombre:   { min: 3,  msg: 'El nombre debe tener al menos 3 caracteres.' },
    correo:   { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Ingresa un correo electrónico válido.' },
    telefono: { regex: /^[\d\s\-+()]{7,}$/, msg: 'Ingresa un teléfono válido (mínimo 7 dígitos).' },
    servicio: { required: true, msg: 'Selecciona un servicio de interés.' },
    mensaje:  { min: 10, msg: 'El mensaje debe tener al menos 10 caracteres.' },
  };

  function validarCampo(id) {
    const el    = document.getElementById(id);
    const errEl = document.getElementById('err-' + id);
    const regla = campos[id];
    if (!el || !errEl) return true;

    let ok = true;
    const val = el.value.trim();

    if (regla.required && !val) {
      ok = false;
    } else if (regla.min && val.length < regla.min) {
      ok = false;
    } else if (regla.regex && !regla.regex.test(val)) {
      ok = false;
    }

    if (!ok) {
      el.classList.add('error');
      errEl.textContent = regla.msg;
      errEl.classList.add('visible');
    } else {
      el.classList.remove('error');
      errEl.classList.remove('visible');
    }
    return ok;
  }

  // validar al salir del campo
  Object.keys(campos).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validarCampo(id));
    if (el) el.addEventListener('input', () => {
      if (el.classList.contains('error')) validarCampo(id);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const resultados = Object.keys(campos).map(id => validarCampo(id));
    const todoValido = resultados.every(Boolean);

    if (!todoValido) {
      mostrarToast('⚠️ Por favor corrige los errores antes de enviar.', 'error');
      return;
    }

    // Simular envío
    const btn = form.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Enviar mensaje';
      form.reset();

      // Mostrar éxito en el DOM
      const ok = document.getElementById('success-msg');
      if (ok) {
        ok.classList.add('visible');
        ok.textContent = `✅ ¡Gracias! Tu mensaje fue enviado correctamente. Te contactaremos pronto.`;
        setTimeout(() => ok.classList.remove('visible'), 5000);
      }

      mostrarToast('¡Mensaje enviado con éxito!', 'success');
    }, 1200);
  });
})();

// ── 8. TOAST / NOTIFICACIÓN DOM ──
function mostrarToast(msg, tipo = 'info') {
  let toast = document.getElementById('toast-global');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-global';
    toast.style.cssText = `
      position: fixed; bottom: 5rem; left: 50%; transform: translateX(-50%) translateY(20px);
      background: var(--card); border: 1px solid var(--border);
      color: var(--text); font-family: 'DM Sans', sans-serif;
      font-size: 14px; padding: 12px 24px; border-radius: 50px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4); z-index: 9999;
      opacity: 0; transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      white-space: nowrap; max-width: 90vw; text-align: center;
    `;
    document.body.appendChild(toast);
  }

  const colors = {
    info:    'var(--accent)',
    success: '#63d251',
    error:   '#e24b4a',
  };

  toast.style.borderColor = colors[tipo] || colors.info;
  toast.textContent = msg;

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3500);
}
