(function(){
  var root = document.querySelector('[data-mediawall]');
  if(!root) return;

  var eyebrowEl = root.querySelector('[data-mediawall-eyebrow]');
  var headlineEl = root.querySelector('[data-mediawall-headline]');
  var bodyEl = root.querySelector('[data-mediawall-body]');
  var chipEls = Array.prototype.slice.call(root.querySelectorAll('[data-mediawall-chip]'));

  var rail = root.querySelector('[data-carousel-rail]');
  var items = rail ? Array.prototype.slice.call(root.querySelectorAll('[data-carousel-item]')) : [];
  var dotsWrap = root.querySelector('[data-carousel-dots]');

  // Slides map 1:1 to carousel items (same order as index.html)
  var slides = [
    {
      id: 'identity',
      eyebrow: 'Awakened intelligence',
      headline: 'Where technology learns to feel.',
      body: 'Antara bridges the gap between the mind that thinks and the body that feels. Through breath, voice, motion, and micro-signals, it helps you come back into your inner realm.',
      active: null
    },
    {
      id: 'reflect',
      eyebrow: 'Reflect',
      headline: 'Your intelligent mirror.',
      body: 'Before it gives answers, Antara learns your inner structure: voice and words, facial micro-expressions, and context and rhythm. It mirrors patterns back, gently, so you can name what is happening.',
      active: 'Reflect'
    },
    {
      id: 'elevate',
      eyebrow: 'Elevate',
      headline: 'Your inner coach for mindset and meaning.',
      body: 'Elevation shifts you from survival-thinking to growth-thinking, without denying reality. It helps rewrite the default story, bring clarity to what matters, and run small micro-experiments that actually move you forward.',
      active: 'Elevate'
    },
    {
      id: 'heal',
      eyebrow: 'Heal',
      headline: 'Your deep repair system.',
      body: 'Stress and emotion leave fingerprints in organs, muscles and breath. Heal starts where your nervous system speaks the loudest, then works body to mind, at your pace, with safety as the rule.',
      active: 'Heal'
    },
    {
      id: 'inner-map',
      eyebrow: 'Body-aware mapping',
      headline: 'Start where it lives in the body.',
      body: 'A simple body map helps you notice hotspots and patterns, then offers quick actions, meaning, and the next gentle step.',
      active: 'Heal'
    }
  ];

  // Safety: if carousel items count differs, cap to smallest
  var N = Math.min(slides.length, items.length || slides.length);
  slides = slides.slice(0, N);
  if(items.length) items = items.slice(0, N);

  var i = 0;
  var INTERVAL = 6200;
  var lastSwitch = 0;
  var paused = false;
  var lastUser = 0;


  var fixedSlot = window.matchMedia && (
    window.matchMedia('(max-width: 720px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  );

  function applyFixedSlotVisibility(activeIdx){
    if(!items.length) return;
    for(var j=0; j<items.length; j++){
      var it = items[j];
      it.style.display = (j === activeIdx) ? 'block' : 'none';
    }
    if(rail){
      rail.style.overflow = 'hidden';
      rail.style.scrollSnapType = 'none';
      rail.scrollLeft = 0;
    }
  }

  function setActiveChip(key){
    chipEls.forEach(function(el){
      var k = el.getAttribute('data-mediawall-chip') || '';
      el.setAttribute('data-active', (key && k === key) ? 'true' : 'false');
    });
  }

  var dotEls = [];
  function setActiveDot(idx){
    if(!dotEls.length) return;
    dotEls.forEach(function(el, j){
      el.setAttribute('data-active', (j === idx) ? 'true' : 'false');
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

    setActiveChip(s.active);
  }

  function centreTo(idx, behavior){
    if(fixedSlot) return;
    if(!rail || !items[idx]) return;
    var item = items[idx];
    var left = item.offsetLeft - (rail.clientWidth - item.clientWidth) / 2;
    try{
      rail.scrollTo({ left: left, behavior: behavior || 'smooth' });
    }catch(e){
      rail.scrollLeft = left;
    }
  }

  function goTo(idx, opts){
    i = (idx + slides.length) % slides.length;
    render(slides[i]);
    setActiveDot(i);

    if(fixedSlot){
      applyFixedSlotVisibility(i);
    }else{
      if(!(opts && opts.noScroll)){
        centreTo(i, (opts && opts.behavior) || 'smooth');
      }
    }

    lastSwitch = performance.now();
  }

  function nearestIndex(){
    if(!rail || !items.length) return i;
    var railCentre = rail.scrollLeft + rail.clientWidth / 2;
    var best = 0;
    var bestDist = Infinity;
    for(var j=0; j<items.length; j++){
      var it = items[j];
      var itCentre = it.offsetLeft + it.clientWidth / 2;
      var d = Math.abs(itCentre - railCentre);
      if(d < bestDist){ bestDist = d; best = j; }
    }
    return best;
  }

  // Dots
  if(dotsWrap && slides.length){
    dotsWrap.innerHTML = '';
    slides.forEach(function(_, idx){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'screenDot';
      b.setAttribute('aria-label', 'Slide ' + (idx + 1));
      b.setAttribute('data-active', 'false');
      b.addEventListener('click', function(){
        lastUser = performance.now();
        goTo(idx);
      });
      dotsWrap.appendChild(b);
    });
    dotEls = Array.prototype.slice.call(dotsWrap.querySelectorAll('.screenDot'));
  }

    // Fixed-slot swipe (mobile): change slide in-place
    if(fixedSlot){
      var sx = 0, sy = 0, down = false;
      rail.addEventListener('pointerdown', function(e){
        down = true;
        sx = e.clientX; sy = e.clientY;
        lastUser = performance.now();
      }, {passive:true});

      rail.addEventListener('pointerup', function(e){
        if(!down) return;
        down = false;
        var dx = e.clientX - sx;
        var dy = e.clientY - sy;

        // ignore vertical scroll gestures
        if(Math.abs(dy) > Math.abs(dx)) return;
        if(Math.abs(dx) < 40) return;

        lastUser = performance.now();
        if(dx < 0) goTo(i + 1, { noScroll: true });
        else goTo(i - 1, { noScroll: true });
      }, {passive:true});

      rail.addEventListener('pointercancel', function(){ down = false; }, {passive:true});
    }


  // Chips -> jump to relevant slide
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

  // Auto-cycle (rAF, mobile-friendly)
  function loop(now){
    if(!lastSwitch) lastSwitch = now;
    var recentlyTouched = lastUser && (now - lastUser) < 9000;
    if(!paused && !recentlyTouched && (now - lastSwitch) > INTERVAL){
      goTo(i + 1);
    }
    window.requestAnimationFrame(loop);
  }

  // Init after first layout
   window.requestAnimationFrame(function(){
    goTo(0, { behavior: 'auto' });
    if(fixedSlot) applyFixedSlotVisibility(0);
    window.requestAnimationFrame(loop);
  });
})();
