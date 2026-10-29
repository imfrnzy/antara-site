(function(){
  'use strict';
  var wrap=document.querySelector('.lg-toc-wrap'),hs=document.querySelectorAll('.lg-prose .lg-blk h2');
  if(!wrap||!hs.length)return;
  var nav=document.createElement('nav');nav.className='lg-toc';nav.setAttribute('aria-label','Contents');
  var p=document.createElement('p');p.textContent='Contents';nav.appendChild(p);
  var ul=document.createElement('ul');nav.appendChild(ul);
  var links=[];
  Array.prototype.forEach.call(hs,function(h,i){
    if(!h.id)h.id='s'+(i+1);
    var li=document.createElement('li'),a=document.createElement('a');
    a.href='#'+h.id;a.textContent=h.textContent;li.appendChild(a);ul.appendChild(li);links.push(a);
  });
  wrap.appendChild(nav);
  if(!('IntersectionObserver' in window))return;
  var cur=null;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        var i=Array.prototype.indexOf.call(hs,e.target);
        if(cur!==null)links[cur].classList.remove('on');
        links[i].classList.add('on');cur=i;
      }
    });
  },{rootMargin:'-20% 0px -70% 0px'});
  Array.prototype.forEach.call(hs,function(h){io.observe(h)});
})();
