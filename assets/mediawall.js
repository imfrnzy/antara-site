(() => {
  const root = document.querySelector('[data-mediawall]');
  if (!root) return;

  const carousel = root.querySelector('[data-mw-carousel]');
  const track = root.querySelector('[data-mw-track]');
  const dotsHost = root.querySelector('[data-mw-dots]');

  if (!carousel || !track || !dotsHost) return;

  const slides = Array.from(track.querySelectorAll('.mwSlide'));
  const chips  = Array.from(root.querySelectorAll('[data-mediawall-chip]'));

  const eyebrowEl  = root.querySelector('[data-mediawall-eyebrow]');
  const headlineEl = root.querySelector('[data-mediawall-headline]');
  const bodyEl     = root.querySelector('[data-mediawall-body]');

  const COPY = {
    Reflect: {
      eyebrow: 'AWAKENED INTELLIGENCE',
      headline: 'Where technology learns to feel.',
      body: 'Journalling and agentic prompts that stay human. Make meaning, not noise.'
    },
    Elevate: {
      eyebrow: 'ELEVATE',
      headline: 'Your inner coach for mindset and meaning.',
      body: 'Micro-steps that shift you from survival-thinking to growth, without denying reality.'
    },
    Heal: {
      eyebrow: 'HEAL',
      headline: 'Body-first repair, paced and trauma-aware.',
      body: 'Start where your nervous system speaks loudest, release stored stress, rebuild safety.'
    }
  };

  let active = 0;
  let timer = null;
  let pausedUntil = 0;

  // Build dots
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.className = 'mwDot';
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.addEventListener('click', () => {
      pauseAuto(2500);
      goTo(i, i > active ? 1 : -1);
    });
    dotsHost.appendChild(b);
    return b;
  });

  function keyFor(i){
    return (slides[i] && slides[i].getAttribute('data-mw-key')) || 'Reflect';
  }

  function setDots(i){
    dots.forEach((d, idx) => d.setAttribute('aria-current', idx === i ? 'true' : 'false'));
  }

  function setChipActive(key){
    chips.forEach(c => {
      const isActive = c.getAttribute('data-mediawall-chip') === key;
      c.setAttribute('data-active', isActive ? 'true' : 'false');
    });
  }

  function setCopy(key){
    const c = COPY[key] || COPY.Reflect;

    // If you prefer JS to always control copy, uncomment these 3 lines and remove the guards below.
    // if (eyebrowEl) eyebrowEl.textContent = c.eyebrow;
    // if (headlineEl) headlineEl.textContent = c.headline;
    // if (bodyEl) bodyEl.textContent = c.body;

    if (eyebrowEl && !eyebrowEl.textContent) eyebrowEl.textContent = c.eyebrow;
    if (headlineEl && !headlineEl.textContent) headlineEl.textContent = c.headline;
    if (bodyEl && !bodyEl.textContent) bodyEl.textContent = c.body;
  }

  function render(newIndex, dir){
    const prev = active;
    active = (newIndex + slides.length) % slides.length;

    slides.forEach((s, i) => {
      s.classList.remove('isActive', 'isPrev');
      if (i === active) s.classList.add('isActive');
      if (i === prev) s.classList.add('isPrev');
    });

    const key = keyFor(active);
    setDots(active);
    setChipActive(key);
    setCopy(key);
  }

  function goTo(i, dir){
    render(i, dir);
  }

  function pauseAuto(ms){
    pausedUntil = Date.now() + ms;
  }

  function startAuto(){
    stopAuto();
    timer = setInterval(() => {
      if (document.hidden) return;
      if (Date.now() < pausedUntil) return;
      goTo(active + 1, 1);
    }, 4200);
  }

  function stopAuto(){
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Chips -> jump to slide
  chips.forEach(chip => {
    chip.style.cursor = 'pointer';
    chip.addEventListener('click', () => {
      const key = chip.getAttribute('data-mediawall-chip');
      const idx = slides.findIndex(s => s.getAttribute('data-mw-key') === key);
      if (idx >= 0){
        pauseAuto(3500);
        goTo(idx, idx > active ? 1 : -1);
      }
    });
  });

  // Swipe handling (in-place frame)
  let startX = 0, startY = 0, dragging = false;

  track.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    pauseAuto(4500);
  }, { passive: true });

  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // If it’s clearly a horizontal gesture, stop it feeling laggy
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      e.preventDefault?.();
    }
  }, { passive: false });

  track.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;

    const dx = e.clientX - startX;
    if (Math.abs(dx) < 40) return;

    if (dx < 0) goTo(active + 1, 1);
    else goTo(active - 1, -1);
  });

  track.addEventListener('pointercancel', () => { dragging = false; });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  // Init
  slides.forEach((s, i) => s.classList.toggle('isActive', i === 0));
  setDots(0);
  setChipActive(keyFor(0));
  setCopy(keyFor(0));
  startAuto();
})();
