/* ============================================================
   Diego Marques de Carvalho — Consultoria em IA
   JavaScript: navegação, transições e interações
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1) Preloader
  ---------------------------------------------------------- */
  const preloader = $('#preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader && preloader.classList.add('done');
      document.body.classList.remove('no-scroll');
      startHeroReveal();
    }, 600);
  });
  // Fallback: se o load demorar muito
  setTimeout(() => {
    preloader && preloader.classList.add('done');
    document.body.classList.remove('no-scroll');
    startHeroReveal();
  }, 2600);
  document.body.classList.add('no-scroll');

  function startHeroReveal() {
    $$('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 120 + i * 110);
    });
  }

  /* ----------------------------------------------------------
     2) Barra de progresso de leitura
  ---------------------------------------------------------- */
  const progressBar = $('#scrollProgress');
  function updateProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progressBar.style.transform = `scaleX(${ratio})`;
  }

  /* ----------------------------------------------------------
     3) Navegação: frosted, hide-on-scroll, scrollspy
  ---------------------------------------------------------- */
  const nav = $('#nav');
  const navLinks = $$('.nav-link');
  const sections = $$('main section[id]');
  let lastY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 24);

    // Esconde ao rolar para baixo, revela ao subir
    if (y > 400 && y > lastY + 6) {
      nav.classList.add('hidden');
    } else if (y < lastY - 6 || y < 120) {
      nav.classList.remove('hidden');
    }
    lastY = y;

    updateProgress();
    spy();
  }

  function spy() {
    const pos = window.scrollY + window.innerHeight * 0.34;
    let current = sections[0];
    sections.forEach(sec => {
      if (sec.offsetTop <= pos) current = sec;
    });
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${current.id}`;
      link.classList.toggle('active', active);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { updateProgress(); spy(); });

  /* ----------------------------------------------------------
     4) Menu mobile
  ---------------------------------------------------------- */
  const burger = $('#navBurger');
  const mobileMenu = $('#mobileMenu');

  function toggleMenu(force) {
    const open = force !== undefined ? force : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('no-scroll', open);
  }
  burger.addEventListener('click', () => toggleMenu());
  $$('.mobile-link').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

  /* ----------------------------------------------------------
     5) Reveal on scroll (IntersectionObserver)
  ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal, .reveal-scale').forEach(el => {
    if (!el.closest('.hero')) revealObserver.observe(el);
  });

  /* ----------------------------------------------------------
     6) Contadores animados
  ---------------------------------------------------------- */
  const counters = $$('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const dur = 1600;
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    if (reduceMotion) { el.textContent = target + suffix; return; }
    requestAnimationFrame(frame);
  }

  /* ----------------------------------------------------------
     7) Typewriter no hero
  ---------------------------------------------------------- */
  const phrases = [
    'Inteligência Artificial aplicada a negócios.',
    'Machine Learning & Analytics.',
    'Engenharia de Prompt & LLMs.',
    'Educação, dados e tecnologia.',
    'Estratégia com base científica.'
  ];
  const typeEl = $('#typewriter');
  let pIndex = 0, cIndex = 0, deleting = false;

  function typeLoop() {
    if (!typeEl) return;
    const phrase = phrases[pIndex];

    if (!deleting) {
      cIndex++;
      if (cIndex === phrase.length) {
        deleting = true;
        setTimeout(typeLoop, 2300);
        typeEl.textContent = phrase.slice(0, cIndex);
        return;
      }
    } else {
      cIndex--;
      if (cIndex === 0) {
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
      }
    }
    typeEl.textContent = phrase.slice(0, cIndex);
    setTimeout(typeLoop, deleting ? 26 : 52);
  }
  if (!reduceMotion) setTimeout(typeLoop, 1400);
  else typeEl.textContent = phrases[0];

  /* ----------------------------------------------------------
     8) Canvas neural network no hero
  ---------------------------------------------------------- */
  const canvas = $('#heroCanvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, dots = [], mouse = { x: -9999, y: -9999 };
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let running = true;

    function resize() {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const count = Math.min(Math.floor((w * h) / 16000), 110);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - .5) * .34,
        vy: (Math.random() - .5) * .34,
        r: Math.random() * 1.6 + .6
      }));
    }

    const LINK = 132;
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        // atração suave ao mouse
        const dxm = mouse.x - d.x, dym = mouse.y - d.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 190 && dm > 0.001) {
          d.x += (dxm / dm) * .35;
          d.y += (dym / dm) * .35;
        }
      }

      // conexões
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK) {
            const alpha = (1 - dist / LINK) * .32;
            ctx.strokeStyle = `rgba(122, 120, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nós
      for (const d of dots) {
        const dm = Math.hypot(mouse.x - d.x, mouse.y - d.y);
        const near = dm < 190;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r + (near ? .8 : 0), 0, Math.PI * 2);
        ctx.fillStyle = near ? 'rgba(160, 150, 255, .95)' : 'rgba(200, 200, 235, .55)';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    const hero = $('.hero');
    hero.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    // pausa quando o hero sai da tela (performance)
    new IntersectionObserver(entries => {
      entries.forEach(en => {
        const wasRunning = running;
        running = en.isIntersecting && !reduceMotion;
        if (running && !wasRunning) requestAnimationFrame(draw);
      });
    }).observe(hero);

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
  } else if (canvas) {
    canvas.style.display = 'none';
  }

  /* ----------------------------------------------------------
     9) Parallax suave no conteúdo do hero
  ---------------------------------------------------------- */
  const heroContent = $('#heroContent');
  if (heroContent && !reduceMotion) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroContent.style.transform = `translateY(${y * .22}px)`;
        heroContent.style.opacity = String(Math.max(1 - y / (window.innerHeight * .8), 0));
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     10) Tilt 3D + spotlight nos cards
  ---------------------------------------------------------- */
  const tiltables = $$('[data-tilt]');
  if (!reduceMotion) {
    tiltables.forEach(el => {
      let raf = null;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;

        // spotlight CSS var
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);

        if (raf) return;
        raf = requestAnimationFrame(() => {
          const rx = (0.5 - py) * 7;
          const ry = (px - 0.5) * 7;
          el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
          raf = null;
        });
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ----------------------------------------------------------
     11) Botões magnéticos
  ---------------------------------------------------------- */
  if (!reduceMotion) {
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * .18}px, ${y * .22}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ----------------------------------------------------------
     12) Drag-to-scroll nas publicações
  ---------------------------------------------------------- */
  const scroller = $('#pubsScroller');
  if (scroller) {
    let isDown = false, startX = 0, startScroll = 0, moved = false;

    scroller.addEventListener('pointerdown', (e) => {
      isDown = true; moved = false;
      startX = e.clientX;
      startScroll = scroller.scrollLeft;
      scroller.classList.add('dragging');
    });
    window.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      scroller.scrollLeft = startScroll - dx;
    });
    window.addEventListener('pointerup', () => {
      isDown = false;
      scroller.classList.remove('dragging');
    });
    // evita clique acidental após arrastar
    scroller.addEventListener('click', (e) => {
      if (moved) { e.preventDefault(); moved = false; }
    }, true);
  }

  /* ----------------------------------------------------------
     13) Scroll suave com compensação da nav
  ---------------------------------------------------------- */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav.offsetHeight;
      const top = id === '#inicio'
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - navH + 1;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     Init
  ---------------------------------------------------------- */
  updateProgress();
  spy();
})();
