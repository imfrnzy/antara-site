(function(){
  var box=document.querySelector('[data-pbtry]'); if(!box) return;
  var qs=[].slice.call(box.querySelectorAll('.pbq')),out=box.querySelector('[data-pbres]'),ans={};
  var R=[
   ['Often a blur','Feelings tend to arrive as one lump. That is common, and the words can be practised. Start with just one more word than &ldquo;bad&rdquo;.'],
   ['Some days easy, some days not','You can name a lot of it, and it gets harder when you are tired or rushed. Worth noticing when the words go missing.'],
   ['Words come fairly easily','You can usually say what is going on inside. Notice the days it stops, those are often the useful ones.']
  ];
  qs.forEach(function(q,i){
    [].slice.call(q.querySelectorAll('button')).forEach(function(b){
      b.setAttribute('aria-pressed','false');
      b.addEventListener('click',function(){
        [].slice.call(q.querySelectorAll('button')).forEach(function(x){x.setAttribute('aria-pressed',x===b)});
        ans[i]=+b.dataset.v;
        if(Object.keys(ans).length===qs.length){
          var t=0;for(var k in ans)t+=ans[k];
          var r=t<=4?R[0]:t<=7?R[1]:R[2];
          out.innerHTML='<b>'+r[0]+'</b>'+r[1];out.hidden=false;
        }
      });
    });
  });
})();
