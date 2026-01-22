(function(){
  var root = document.querySelector('[data-mediawall]');
  if(!root) return;

  var eyebrowEl = root.querySelector('[data-mediawall-eyebrow]');
  var headlineEl = root.querySelector('[data-mediawall-headline]');
  var bodyEl = root.querySelector('[data-mediawall-body]');
  var imgEl = root.querySelector('[data-mediawall-img]');
  var chipEls = Array.prototype.slice.call(root.querySelectorAll('[data-mediawall-chip]'));

  var slides = [
    {
      id: 'identity',
      eyebrow: 'Awakened intelligence',
      headline: 'Where technology learns to feel.',
      body: 'Antara bridges the gap between the mind that thinks and the body that feels. Through breath, voice, motion, and micro-signals, it helps you come back into your inner realm.',
      img: 'assets/antara_universe_iphone_1242x2688.png',
      active: null
    },
    {
      id: 'reflect',
      eyebrow: 'Reflect',
      headline: 'Your intelligent mirror.',
      body: 'Before it gives answers, Antara learns your inner structure: voice and words, facial micro-expressions, and context and rhythm. It mirrors patterns back, gently, so you can name what is happening.',
      img: 'assets/antara_screen_clean_3_1242x2688.png',
      active: 'Reflect'
    },
    {
      id: 'elevate',
      eyebrow: 'Elevate',
      headline: 'Your inner coach for mindset and meaning.',
      body: 'Elevation shifts you from survival-thinking to growth-thinking, without denying reality. It helps rewrite the default story, bring clarity to what matters, and run small micro-experiments that actually move you forward.',
      img: 'assets/antara_screen_clean_1_1242x2688.png',
      active: 'Elevate'
    },
    {
      id: 'heal',
      eyebrow: 'Heal',
      headline: 'Your deep repair system.',
      body: 'Stress and emotion leave fingerprints in organs, muscles and breath. Heal starts where your nervous system speaks the loudest, then works body to mind, at your pace, with safety as the rule.',
      img: 'assets/antara_screen_clean_5_1242x2688.png',
      active: 'Heal'
    },
    {
      id: 'inner-map',
      eyebrow: 'Body-aware mapping',
      headline: 'Start where it lives in the body.',
      body: 'A simple body map helps you notice hotspots and patterns, then offers quick actions, meaning, and the next gentle step.',
      img: 'assets/antara_screen_clean_8_1242x2688.png',
      active: 'Heal'
    }
  ];

  var i = 0;
  var INTERVAL = 6200;

  function setActiveChip(key){
    chipEls.forEach(function(el){
      var k = el.getAttribute('data-mediawall-chip') || '';
      el.setAttribute('data-active', (key && k === key) ? 'true' : 'false');
    });
  }

  function render(s){
    if(eyebrowEl) eyebrowEl.textContent = s.eyebrow || '';
    if(headlineEl) headlineEl.textContent = s.headline || '';
    if(bodyEl) bodyEl.textContent = s.body || '';

    if(imgEl){
      imgEl.classList.remove('mediaWallImgFade');
      // force reflow for animation restart
      void imgEl.offsetHeight;
      imgEl.setAttribute('src', s.img);
      imgEl.classList.add('mediaWallImgFade');
    }

    setActiveChip(s.active);
  }

  render(slides[0]);

  window.setInterval(function(){
    i = (i + 1) % slides.length;
    render(slides[i]);
  }, INTERVAL);
})();
