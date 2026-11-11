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

})();
