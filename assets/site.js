(function(){
  // -----------------------------
  // Touch / mobile detection (robust against iOS "Request Desktop Site")
  // We use this to force mobile nav when the viewport lies.
  // -----------------------------
  try{
    var isTouch = ('ontouchstart' in window) || (navigator && (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0));
    if(isTouch){
      document.documentElement.classList.add('isTouch');
    }
  } catch(e){}

  // -----------------------------
  // Active nav
  // -----------------------------
  var here = (location.pathname || "/").replace(/\/+$/, "");
  if(here === "") here = "/";
  var links = document.querySelectorAll("[data-nav]");
  links.forEach(function(a){
    var href = (a.getAttribute("href") || "").replace(/\/+$/, "");
    if(href === "") href = "/";
    if(href === here){ a.setAttribute("data-active","true"); }
  });

  // -----------------------------
  // Mobile nav (auto-injected)
  // -----------------------------
  try{
    var nav = document.querySelector('.nav');
    if(nav && !nav.querySelector('.navToggle')){
      var navlinks = nav.querySelector('.navlinks');
      var cta = nav.querySelector('.cta');
      var brand = nav.querySelector('.brand');

      var toggle = document.createElement('button');
      toggle.className = 'navToggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label','Menu');
      toggle.innerHTML = "<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 7h14M5 12h14M5 17h14' stroke='currentColor' stroke-width='2' stroke-linecap='round'/></svg>";

      // Insert before CTA if possible
      if(cta){ nav.insertBefore(toggle, cta); }
      else { nav.appendChild(toggle); }

      var overlay = document.createElement('div');
      overlay.className = 'navOverlay';
      overlay.setAttribute('data-open','false');

      var drawer = document.createElement('div');
      drawer.className = 'navDrawer';
      drawer.setAttribute('data-open','false');

      var closeBtn = document.createElement('button');
      closeBtn.className = 'btn ghost';
      closeBtn.type = 'button';
      closeBtn.textContent = 'Close';

      var head = document.createElement('div');
      head.className = 'drawerHead';
      var brandClone = brand ? brand.cloneNode(true) : document.createElement('div');
      head.appendChild(brandClone);
      head.appendChild(closeBtn);

      var linksWrap = document.createElement('div');
      linksWrap.className = 'drawerLinks';
      if(navlinks){
        Array.prototype.slice.call(navlinks.querySelectorAll('a')).forEach(function(a){
          linksWrap.appendChild(a.cloneNode(true));
        });
      }

      var ctas = document.createElement('div');
      ctas.className = 'drawerCtas';
      if(cta){
        Array.prototype.slice.call(cta.querySelectorAll('a')).forEach(function(a){
          ctas.appendChild(a.cloneNode(true));
        });
      }

      drawer.appendChild(head);
      drawer.appendChild(linksWrap);
      drawer.appendChild(ctas);
      document.body.appendChild(overlay);
      document.body.appendChild(drawer);

      function setOpen(isOpen){
        overlay.setAttribute('data-open', isOpen ? 'true' : 'false');
        drawer.setAttribute('data-open', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if(isOpen){ closeBtn.focus(); }
      }

      toggle.addEventListener('click', function(){ setOpen(true); });
      closeBtn.addEventListener('click', function(){ setOpen(false); });
      overlay.addEventListener('click', function(){ setOpen(false); });
      drawer.addEventListener('click', function(e){
        var t = e.target;
        if(t && t.tagName === 'A'){ setOpen(false); }
      });
      window.addEventListener('keydown', function(e){
        if(e.key === 'Escape'){ setOpen(false); }
      });
    }
  } catch(e){}

  // -----------------------------
  // Spotlight follows pointer (very subtle)
  // -----------------------------
  var root = document.documentElement;
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(!prefersReduced){
    var last = 0;
    window.addEventListener('mousemove', function(e){
      // throttle a bit
      var now = performance.now();
      if(now - last < 24) return;
      last = now;
      root.style.setProperty('--mx', e.clientX + 'px');
      root.style.setProperty('--my', e.clientY + 'px');
    }, {passive:true});
  }

  // -----------------------------
  // Reveal on scroll
  // -----------------------------
  try{
    var candidates = document.querySelectorAll('.card, .mediaWallSection, .hero, .section');
    candidates.forEach(function(el){
      if(el.classList.contains('reveal')) return;
      el.classList.add('reveal');
    });

    // Subtle 3D tilt for cards (desktop only)
    var canHover = window.matchMedia && window.matchMedia('(hover:hover)').matches;
    if(canHover){
      var tiltCards = document.querySelectorAll('.card');
      tiltCards.forEach(function(c){
        c.setAttribute('data-tilt','true');
        var raf = 0;
        c.addEventListener('mousemove', function(e){
          if(prefersReduced) return;
          if(raf) return;
          raf = requestAnimationFrame(function(){
            raf = 0;
            var r = c.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width;
            var py = (e.clientY - r.top) / r.height;
            var rx = (py - 0.5) * -6;
            var ry = (px - 0.5) * 8;
            c.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-2px)';
          });
        }, {passive:true});
        c.addEventListener('mouseleave', function(){
          c.style.transform = '';
        }, {passive:true});
      });
    }

    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){
            en.target.classList.add('in-view');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12 });
      candidates.forEach(function(el){ io.observe(el); });
    } else {
      candidates.forEach(function(el){ el.classList.add('in-view'); });
    }
  } catch(e){}

  // -----------------------------
  // Sticky nav state
  // -----------------------------
  var topbar = document.querySelector('.topbar');
  if(topbar){
    var onScroll = function(){
      if(window.scrollY > 6){ topbar.classList.add('scrolled'); }
      else { topbar.classList.remove('scrolled'); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  // -----------------------------
  // Particles (canvas, lightweight)
  // -----------------------------
  if(prefersReduced) return;

  var canvas = document.getElementById('antaraParticles');
  if(!canvas){
    canvas = document.createElement('canvas');
    canvas.id = 'antaraParticles';
    document.body.prepend(canvas);
  }
  var ctx = canvas.getContext('2d', { alpha: true });
  if(!ctx) return;

  var DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  var W = 0, H = 0;

  function resize(){
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  function rand(min,max){ return min + Math.random()*(max-min); }

  var isMobile = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
  var COUNT = isMobile ? 48 : 86;
  var SPEED = isMobile ? 0.22 : 0.28;
  var LINK_DIST = isMobile ? 120 : 150;

  var cols = [
    'rgba(255,198,92,0.55)',
    'rgba(106,225,224,0.45)',
    'rgba(188,120,255,0.40)',
    'rgba(255,255,255,0.28)'
  ];

  var ps = [];
  function seed(){
    ps.length = 0;
    for(var i=0;i<COUNT;i++){
      ps.push({
        x: rand(0, W),
        y: rand(0, H),
        vx: rand(-SPEED, SPEED),
        vy: rand(-SPEED, SPEED),
        r: rand(0.6, 2.2),
        c: cols[(Math.random()*cols.length)|0]
      });
    }
  }

  function step(){
    ctx.clearRect(0,0,W,H);

    // gentle vignette
    var g = ctx.createRadialGradient(W*0.5, H*0.15, 40, W*0.5, H*0.35, Math.max(W,H));
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.30)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    // links
    for(var i=0;i<ps.length;i++){
      var p = ps[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x < -20) p.x = W + 20;
      if(p.x > W + 20) p.x = -20;
      if(p.y < -20) p.y = H + 20;
      if(p.y > H + 20) p.y = -20;

      for(var j=i+1;j<ps.length;j++){
        var q = ps[j];
        var dx = p.x - q.x;
        var dy = p.y - q.y;
        var d2 = dx*dx + dy*dy;
        if(d2 < LINK_DIST*LINK_DIST){
          var a = 1 - (Math.sqrt(d2)/LINK_DIST);
          ctx.strokeStyle = 'rgba(255,255,255,' + (0.08*a).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    // dots
    for(var k=0;k<ps.length;k++){
      var d = ps[k];
      ctx.fillStyle = d.c;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  resize();
  seed();
  step();

  window.addEventListener('resize', function(){
    DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    resize();
    seed();
  }, {passive:true});
})();
