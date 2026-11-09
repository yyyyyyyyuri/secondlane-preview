(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* side nav: highlight the section on screen */
  var links=[].slice.call(document.querySelectorAll('#toc .sub a'));
  var map={}; links.forEach(function(a){ map[a.getAttribute('href').slice(1)]=a; });
  if(links.length && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ links.forEach(function(l){l.classList.remove('on');}); var a=map[e.target.id]; if(a){ a.classList.add('on'); } } }); },{rootMargin:'-40% 0px -55% 0px'});
    Object.keys(map).forEach(function(id){ var s=document.getElementById(id); if(s) io.observe(s); });
  }

  /* lit edges follow the pointer */
  document.querySelectorAll('.lit').forEach(function(el){
    el.addEventListener('pointermove',function(e){ var r=el.getBoundingClientRect(); el.style.setProperty('--mx',(e.clientX-r.left)+'px'); el.style.setProperty('--my',(e.clientY-r.top)+'px'); });
    el.addEventListener('pointerleave',function(){ el.style.removeProperty('--mx'); el.style.removeProperty('--my'); });
  });

  /* tab groups: each tablist works on its own; panels when aria-controls is set */
  document.querySelectorAll('[role=tablist]').forEach(function(list){
    var tabs=[].slice.call(list.querySelectorAll('[role=tab]'));
    function pick(t){
      tabs.forEach(function(o){ var on=o===t; o.setAttribute('aria-selected',on); o.tabIndex=on?0:-1; var p=o.getAttribute('aria-controls'); if(p){ var el=document.getElementById(p); if(el) el.hidden=!on; } });
    }
    tabs.forEach(function(t,i){
      t.tabIndex=t.getAttribute('aria-selected')==='true'?0:-1;
      t.addEventListener('click',function(){ pick(t); });
      t.addEventListener('keydown',function(e){
        var n=null;
        if(e.key==='ArrowRight') n=(i+1)%tabs.length;
        if(e.key==='ArrowLeft') n=(i+tabs.length-1)%tabs.length;
        if(e.key==='Home') n=0;
        if(e.key==='End') n=tabs.length-1;
        if(n!==null){ e.preventDefault(); pick(tabs[n]); tabs[n].focus(); }
      });
    });
  });

  /* file viewers */
  document.querySelectorAll('code[data-src]').forEach(function(c){
    fetch(c.dataset.src).then(function(r){ if(!r.ok) throw 0; return r.text(); }).then(function(t){ c.textContent=t; }).catch(function(){ c.textContent='Open the file with the buttons above.'; });
  });

  /* copy buttons */
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var txt=b.parentNode.querySelector('code').textContent;
      (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){ b.textContent='Copied'; setTimeout(function(){b.textContent='Copy';},1600); },function(){ b.textContent='Select and copy'; });
    });
  });

  /* dot field, same parameters as the site */
  function Dots(cv,host){
    if(!cv||!host) return;
    var ctx=cv.getContext('2d'),W=0,H=0,C=9,m={x:-1e4,y:-1e4,tx:-1e4,ty:-1e4,a:0,ta:0},vis=true;
    function size(){ var r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2); W=r.width;H=r.height; cv.width=W*d; cv.height=H*d; ctx.setTransform(d,0,0,d,0,0); draw(); }
    function draw(){
      ctx.fillStyle='#12301F'; ctx.fillRect(0,0,W,H);
      m.x+=(m.tx-m.x)*.12; m.y+=(m.ty-m.y)*.12; m.a+=(m.ta-m.a)*(m.ta>m.a?.08:.03);
      for(var y=C/2;y<H;y+=C)for(var x=C/2;x<W;x+=C){
        var f=0; if(m.a>.01){ var q=Math.hypot(x-m.x,y-m.y)/200; f=Math.exp(-q*q)*m.a; }
        ctx.fillStyle='rgba(227,253,90,'+(.216+.484*f)+')'; ctx.beginPath(); ctx.arc(x,y,.85,0,6.283); ctx.fill();
      }
    }
    size(); addEventListener('resize',size);
    if(reduce) return;
    host.addEventListener('pointermove',function(e){ var r=cv.getBoundingClientRect(); m.tx=e.clientX-r.left; m.ty=e.clientY-r.top; if(m.x<-9e3){m.x=m.tx;m.y=m.ty;} m.ta=1; });
    host.addEventListener('pointerleave',function(){ m.ta=0; });
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){vis=es[0].isIntersecting;}).observe(cv);
    (function loop(){ if(vis&&!document.hidden) draw(); requestAnimationFrame(loop); })();
  }
  Dots(document.getElementById('dotCanvas'),document.getElementById('dotDemo'));
  Dots(document.getElementById('coverDots'),document.querySelector('.cover'));
})();
