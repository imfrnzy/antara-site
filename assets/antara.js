(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- starfield ---------- */
  var cv=$('#sky');
  if(cv&&cv.getContext){
    var cx=cv.getContext('2d'),W,H,stars=[],mx=0,my=0,tx=0,ty=0,dpr=Math.min(window.devicePixelRatio||1,2);
    var N=function(){return Math.round(Math.min(220,Math.max(90,innerWidth*innerHeight/9000)))};
    var size=function(){W=cv.width=innerWidth*dpr;H=cv.height=innerHeight*dpr;cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';
      stars=[];for(var i=0;i<N();i++){stars.push({x:Math.random()*W,y:Math.random()*H,z:Math.random()*.9+.1,r:(Math.random()*1.3+.3)*dpr,p:Math.random()*6.28,s:Math.random()*.02+.004,g:Math.random()<.12})}};
    var draw=function(t){
      cx.clearRect(0,0,W,H);
      tx+=(mx-tx)*.04;ty+=(my-ty)*.04;
      var sc=window.scrollY||0;
      for(var i=0;i<stars.length;i++){var s=stars[i];
        var a=.35+.65*Math.abs(Math.sin(s.p+t*s.s*.06));
        var x=(s.x+tx*s.z*30*dpr)%W,y=((s.y-sc*s.z*.25*dpr+ty*s.z*20*dpr)%H+H)%H;
        cx.beginPath();cx.fillStyle=s.g?'rgba(242,200,121,'+a+')':'rgba(220,214,255,'+(a*s.z)+')';
        cx.arc(x,y,s.r*(s.g?1.3:1),0,6.283);cx.fill();
        if(s.g&&s.r>1.1*dpr){cx.fillStyle='rgba(242,200,121,'+a*.12+')';cx.beginPath();cx.arc(x,y,s.r*5,0,6.283);cx.fill()}
      }
      if(!reduce)requestAnimationFrame(draw);
    };
    size();addEventListener('resize',function(){size();if(reduce)draw(0)});
    addEventListener('pointermove',function(e){mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2},{passive:true});
    requestAnimationFrame(draw);
  }

  /* ---------- nav ---------- */
  var nav=$('header.nav');
  var onScroll=function(){nav&&nav.classList.toggle('scrolled',scrollY>24);var m=$('.mcta');var h=$('.hero');if(m&&h){m.classList.toggle('on',scrollY>h.offsetHeight*.7)}};
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  var bg=$('.burger'),ln=$('.links');
  if(bg&&ln){bg.addEventListener('click',function(){var o=ln.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
    $$('a',ln).forEach(function(a){a.addEventListener('click',function(){ln.classList.remove('open');bg.setAttribute('aria-expanded','false')})})}

  /* ---------- reveal ---------- */
  var rv=$$('.rv');
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    rv.forEach(function(el){io.observe(el)});
  }else rv.forEach(function(el){el.classList.add('in')});

  /* ---------- store smart-order ---------- */
  var ua=navigator.userAgent||'';
  var isAndroid=/Android/i.test(ua),isIOS=/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  $$('[data-stores]').forEach(function(box){
    var a=$('[data-store=android]',box),i=$('[data-store=ios]',box);
    if(isAndroid&&a){box.insertBefore(a,box.firstChild);a.classList.add('gold');i&&i.classList.remove('gold')}
  });

  /* ---------- hero state chips ---------- */
  var chips=$$('.statechips .chip');
  if(chips.length&&!reduce){var ci=0;setInterval(function(){chips.forEach(function(c,k){c.classList.toggle('on',k===ci)});ci=(ci+1)%chips.length},2300);chips[0].classList.add('on')}
  else if(chips[0])chips[0].classList.add('on');

  /* ---------- play videos only when visible ---------- */
  var vids=$$('video[data-lazyplay]');
  if('IntersectionObserver' in window){
    var vo=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){var p=v.play();p&&p.catch&&p.catch(function(){})}else v.pause()})},{threshold:.25});
    vids.forEach(function(v){if(!reduce)vo.observe(v)});
  }

  /* ---------- doors ---------- */
  var tabs=$$('[data-door]');
  if(tabs.length){
    var setDoor=function(k){
      tabs.forEach(function(t){t.setAttribute('aria-selected',t.dataset.door===k)});
      $$('.doorPanel').forEach(function(p){p.classList.toggle('on',p.dataset.panel===k)});
      $$('.doorShots .phone').forEach(function(p){p.classList.toggle('on',p.dataset.shot===k)});
    };
    tabs.forEach(function(t){t.addEventListener('click',function(){setDoor(t.dataset.door)});
      t.addEventListener('keydown',function(e){var i=tabs.indexOf(t);if(e.key==='ArrowRight'){tabs[(i+1)%tabs.length].focus();tabs[(i+1)%tabs.length].click()}if(e.key==='ArrowLeft'){tabs[(i+tabs.length-1)%tabs.length].focus();tabs[(i+tabs.length-1)%tabs.length].click()}})});
    setDoor('talk');
  }

  /* ---------- inner sky demo ---------- */
  var skyBox=$('[data-skydemo]');
  if(skyBox){
    // min = number of talks needed before it shows at all; firm = talks needed before it is firm
    var S=[
      {g:'body',t:'Chest',size:3,min:1,firm:2,note:'You have mentioned your chest in more than one talk. Worth noticing, not a verdict.'},
      {g:'body',t:'Shoulders',size:2,min:1,firm:2,note:'Came up when you spoke about the week ahead.'},
      {g:'body',t:'Jaw',size:1,min:1,firm:3,note:'Mentioned once, so it stays faint and dotted until it comes up again.'},
      {g:'life',t:'Work',size:3,min:1,firm:2,note:'Work keeps turning up in the same talks as your chest.'},
      {g:'life',t:'Family',size:2,min:1,firm:2,note:'You have talked about family in a few of our talks.'},
      {g:'life',t:'Sleep',size:1,min:1,firm:3,note:'Only mentioned once so far.'},
      {g:'life',t:'Grief',size:2,min:2,firm:2,note:'Heavy topics wait. This only appears after two separate talks, never off a single mention.'},
      {g:'patterns',t:'Replaying conversations',size:2,min:1,firm:2,note:'I am noticing this. It is a pattern I have picked up, not a fact about you.'},
      {g:'patterns',t:'Hard to ask for help',size:1,min:1,firm:3,note:'A faint one. One signal so far.'}
    ];
    var talks=2,cols={};
    $$('[data-col]',skyBox).forEach(function(c){cols[c.dataset.col]=c});
    var note=$('[data-skynote]',skyBox);
    var defNote='Tap a star to see what she noticed.';
    var render=function(){
      Object.keys(cols).forEach(function(k){cols[k].innerHTML=''});
      S.forEach(function(s){
        var b=document.createElement('button');b.type='button';b.className='star'+(talks<s.firm?' faint':'')+(talks<s.min?' hidden':'');
        b.dataset.s=s.size;b.textContent=s.t;b.setAttribute('aria-label',s.t+(talks<s.firm?' (faint, one mention)':''));
        if(talks<s.min)b.tabIndex=-1;
        b.addEventListener('click',function(){$$('.star',skyBox).forEach(function(x){x.classList.remove('active')});b.classList.add('active');note.innerHTML=s.note+'<small>'+(talks<s.firm?'Faint and dotted: seen in '+talks+' talk'+(talks>1?'s':'')+'.':'Firm: seen in '+talks+' talks.')+'</small>'});
        cols[s.g].appendChild(b);
      });
      note.innerHTML=defNote+'<small>This is an example sky. Yours is drawn only from what you actually tell her.</small>';
    };
    $$('[data-talks]',skyBox).forEach(function(b){b.addEventListener('click',function(){talks=+b.dataset.talks;$$('[data-talks]',skyBox).forEach(function(x){x.setAttribute('aria-pressed',x===b)});render()})});
    render();
  }

  /* ---------- signals toggles ---------- */
  $$('.sw').forEach(function(s){s.addEventListener('click',function(){s.setAttribute('aria-checked',s.getAttribute('aria-checked')!=='true')})});

  /* ---------- breathing ---------- */
  var orb=$('[data-orb]');
  if(orb){
    var P=[
      {n:'Moonlit Exhale',p:[4,7,8],l:['Breathe in','Hold','Breathe out'],a:'#6EA8FF',b:'#B69CFF',d:'For the end of the day. A long exhale tells the body it can slow down.',when:'Before bed'},
      {n:'Stillwater Rhythm',p:[4,4,8],l:['Breathe in','Hold','Breathe out'],a:'#9EE6D1',b:'#7CC6FF',d:'Slow breathing with a longer out-breath, for a busy day when your head is loud.',when:'During the day'},
      {n:'Balance Flow',p:[4,4,4],l:['In through the left','Hold','Out through the right'],a:'#B7F0A6',b:'#8EE5C2',d:'Alternate nostril breathing. A steady one for when your focus dips.',when:'Afternoon'},
      {n:'Equinox Square',p:[4,4,4,4],l:['Breathe in','Hold','Breathe out','Hold'],a:'#A8B1FF',b:'#C6A7FF',d:'Box breathing. Four equal sides, simple to hold in your head under pressure.',when:'Under pressure'},
      {n:'Ember Breath',p:[1,1,1],l:['In','Hold','Out'],a:'#FF946B',b:'#FF6FB1',d:'Quick, steady breaths to wake the body up. Not for bedtime.',when:'Morning'},
      {n:'Pulse Ignition',p:[2,0,2],l:['In','Hold','Out'],a:'#FFD36E',b:'#FF9E6E',d:'Fast breaths for alertness. Skip it if you feel dizzy or anxious.',when:'Energy dip'}
    ];
    var wrap=$('[data-pchips]'),lab=$('[data-orblabel]'),sub=$('[data-orbsub]'),ti=$('[data-ptitle]'),pa=$('[data-ppat]'),pd=$('[data-pdesc]'),pw=$('[data-pwhen]');
    var cur=0,timer=null,step=0,left=0;
    var stop=function(){clearTimeout(timer)};
    var run=function(){
      stop();var q=P[cur];step=0;
      var go=function(){
        var dur=q.p[step];
        if(dur===0){step=(step+1)%q.p.length;return go()}
        var inhale=step===0,exhale=(q.p.length===3&&step===2)||(q.p.length===4&&step===2);
        orb.style.setProperty('--dur',dur+'s');
        if(inhale)orb.style.setProperty('--sc','1.18');else if(exhale)orb.style.setProperty('--sc','.7');
        lab.textContent=q.l[step];left=dur;sub.textContent=left;
        var tick=function(){left--;if(left>0){sub.textContent=left;timer=setTimeout(tick,1000)}else{step=(step+1)%q.p.length;go()}};
        timer=setTimeout(tick,1000);
      };
      if(reduce){lab.textContent='Pick one, then follow the words';sub.textContent='';return}
      orb.style.setProperty('--sc','.7');setTimeout(go,60);
    };
    var set=function(i){
      cur=i;var q=P[i];
      $$('button',wrap).forEach(function(b,k){b.setAttribute('aria-pressed',k===i)});
      orb.style.setProperty('--a',q.a);orb.style.setProperty('--b',q.b);
      ti.textContent=q.n;pa.textContent=q.p.join(' · ')+'  seconds';pd.textContent=q.d;pw.textContent=q.when;run();
    };
    P.forEach(function(q,i){var b=document.createElement('button');b.type='button';b.textContent=q.n;b.addEventListener('click',function(){set(i)});wrap.appendChild(b)});
    // only breathe while on screen
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)set(cur);else stop()})},{threshold:.3}).observe(orb);
    }else set(0);
    set(0);
  }

  /* ---------- film modal ---------- */
  var modal=$('.modal'),mv=modal&&$('video',modal),last=null;
  var openFilm=function(){if(!modal)return;last=document.activeElement;modal.classList.add('on');document.body.style.overflow='hidden';mv.currentTime=0;var p=mv.play();p&&p.catch&&p.catch(function(){});$('.x',modal).focus()};
  var closeFilm=function(){if(!modal)return;modal.classList.remove('on');document.body.style.overflow='';mv.pause();last&&last.focus&&last.focus()};
  $$('[data-film]').forEach(function(b){b.addEventListener('click',openFilm)});
  if(modal){$('.x',modal).addEventListener('click',closeFilm);modal.addEventListener('click',function(e){if(e.target===modal)closeFilm()});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('on'))closeFilm()})}

  /* ---------- year ---------- */
  $$('[data-year]').forEach(function(y){y.textContent=new Date().getFullYear()});
})();
