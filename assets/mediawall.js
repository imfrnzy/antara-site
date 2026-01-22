(function(){
  var root = document.querySelector('[data-mediawall]');
  if(!root) return;

  var eyebrowEl = root.querySelector('[data-mediawall-eyebrow]');
  var headlineEl = root.querySelector('[data-mediawall-headline]');
  var bodyEl = root.querySelector('[data-mediawall-body]');
  var imgEls = Array.prototype.slice.call(root.querySelectorAll('[data-mediawall-img]'));
  var chipEls = Array.prototype.slice.call(root.querySelectorAll('[data-mediawall-chip]'));

  var slides = [
    {
      id: 'identity',
      eyebrow: 'Awakened intelligence',
      headline: 'Where technology learns to feel.',
      body: 'Antara bridges the gap between the mind that thinks and the body that feels. Through breath, voice, motion, and micro-signals, it helps you come back into your inner realm.',
      images: [
        'assets/antara_universe_iphone_1242x2688.png',
        'assets/antara_screen_clean_3_1242x2688.png',
        'assets/antara_screen_clean_8_1242x2688.png'
      ],
      active: null
    },
    {
      id: 'reflect',
      eyebrow: 'Reflect',
      headline: 'Your intelligent mirror.',
      body: 'Before it gives answers, Antara learns your inner structure: voice and words, facial micro-expressions, and context and rhythm. It mirrors patterns back, gently, so you can name what is happening.',
      images: [
        'assets/antara_screen_clean_3_1242x2688.png',
        'assets/antara_universe_iphone_1242x2688.png',
        'assets/antara_screen_clean_5_1242x2688.png'
      ],
      active: 'Reflect'
    },
    {
      id: 'elevate',
      eyebrow: 'Elevate',
      headline: 'Your inner coach for mindset and meaning.',
      body: 'Elevation shifts you from survival-thinking to growth-thinking, without denying reality. It helps rewrite the default story, bring clarity to what matters, and run small micro-experiments that actually move you forward.',
      images: [
        'assets/antara_screen_clean_1_1242x2688.png',
        'assets/antara_screen_clean_3_1242x2688.png',
        'assets/antara_universe_iphone_1242x2688.png'
      ],
      active: 'Elevate'
    },
    {
      id: 'heal',
      eyebrow: 'Heal',
      headline: 'Your deep repair system.',
      body: 'Stress and emotion leave fingerprints in organs, muscles and breath. Heal starts where your nervous system speaks the loudest, then works body to mind, at your pace, with safety as the rule.',
      images: [
        'assets/antara_screen_clean_5_1242x2688.png',
        'assets/antara_screen_clean_8_1242x2688.png',
        'assets/antara_universe_iphone_1242x2688.png'
      ],
      active: 'Heal'
    },
    {
      id: 'inner-map',
      eyebrow: 'Body-aware mapping',
      headline: 'Start where it lives in the body.',
      body: 'A simple body map helps you notice hotspots and patterns, then offers quick actions, meaning, and the next gentle step.',
      images: [
        'assets/antara_screen_clean_8_1242x2688.png',
        'assets/antara_screen_clean_5_1242x2688.png',
        'assets/antara_screen_clean_1_1242x2688.png'
      ],
      active: 'Heal'
    }
  ];

  var i = 0;
  var INTERVAL = 6200;
  var lastSwitch = 0;
  var paused = false;
  var lastUser = 0;

  function setActiveChip(key){
    chipEls.forEach(function(el){
      var k = el.getAttribute('data-mediawall-chip') || '';
      el.setAttribute('data-active', (key && k === key) ? 'true' : 'false');
    });
  }

  function render(s){
    // restart text animation
    root.classList.remove('mwTick');
    void root.offsetHeight;
    root.classList.add('mwTick');

    if(eyebrowEl) eyebrowEl.textContent = s.eyebrow || '';
    if(headlineEl) headlineEl.textContent = s.headline || '';
    if(bodyEl) bodyEl.textContent = s.body || '';

    if(imgEls && imgEls.length){
      var imgs = (s.images && s.images.length) ? s.images : [];
      imgEls.forEach(function(el, idx){
        var next = imgs[idx] || imgs[0];
        if(!next) return;
        el.classList.remove('mediaWallImgFade');
        void el.offsetHeight;
        el.setAttribute('src', next);
        el.classList.add('mediaWallImgFade');
      });
    }

    setActiveChip(s.active);
  }

  function goTo(idx){
    i = (idx + slides.length) % slides.length;
    render(slides[i]);
    lastSwitch = performance.now();
  }

  // Touch swipe (mobile): left/right to change slides
  (function(){
    var startX = 0, startY = 0, startT = 0;
    var tracking = false;
    root.addEventListener('touchstart', function(e){
      if(!e.touches || e.touches.length !== 1) return;
      var t = e.touches[0];
      startX = t.clientX; startY = t.clientY; startT = performance.now();
      tracking = true;
    }, {passive:true});
    root.addEventListener('touchmove', function(e){
      if(!tracking || !e.touches || e.touches.length !== 1) return;
      var t = e.touches[0];
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      // Cancel if it's mostly vertical scrolling
      if(Math.abs(dy) > Math.abs(dx) * 1.25){ tracking = false; }
    }, {passive:true});
    root.addEventListener('touchend', function(e){
      if(!tracking) return;
      tracking = false;
      var now = performance.now();
      var dt = now - startT;
      var endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
      var dx = endX - startX;
      if(dt < 600 && Math.abs(dx) > 48){
        lastUser = performance.now();
        goTo(i + (dx < 0 ? 1 : -1));
      }
    }, {passive:true});
  })();

  // Chips are clickable: jump to the relevant slide
  chipEls.forEach(function(el){
    el.setAttribute('role','button');
    el.setAttribute('tabindex','0');
    var key = el.getAttribute('data-mediawall-chip') || '';
    function handler(){
      lastUser = performance.now();
      var idx = slides.findIndex(function(s){ return s.active === key; });
      if(idx < 0) idx = 0;
      goTo(idx);
    }
    el.addEventListener('click', handler);
    el.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); handler(); }
    });
  });

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', function(){
    paused = document.hidden;
    if(!paused) lastSwitch = performance.now();
  });

  // Auto-cycle using rAF (more reliable than setInterval on mobile)
  function loop(now){
    if(!lastSwitch) lastSwitch = now;
    // After a manual interaction, pause auto-cycling briefly so it doesn't feel "fighty"
    var recentlyTouched = lastUser && (now - lastUser) < 12000;
    if(!paused && !recentlyTouched && (now - lastSwitch) > INTERVAL){
      goTo(i + 1);
    }
    window.requestAnimationFrame(loop);
  }

  goTo(0);
  window.requestAnimationFrame(loop);
})();
