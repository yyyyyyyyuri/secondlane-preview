/* Dot edge in code (11 Nov): the halftone dissolve from tools/dotfade.py, drawn live as a mask over the untouched photo.
   Two ways to mark an image:
   1. Box mode (Capital, Prime):  <img data-dotedge="left|right" [data-band=".22"] [data-lean=".113"] [data-cell="4"]>
      the edge is drawn across the image's box; dots fade towards the named side.
   2. Image mode (Home, same maths as tools/edge_slant.py): <img data-dotedge="left|right" data-xt=".97" data-xb=".86" data-band=".2">
      xt / xb: where the photo ends at the top and bottom, as fractions of the photo's own width. The mask is drawn at
      the photo's natural size and placed exactly like the photo (object-fit / object-position), so the framing never shifts. */
(function(){
  function sm(t){ t=Math.min(1,Math.max(0,t)); return t*t*(3-2*t); }
  function paint(W,H,cell,g,dpr){
    var c=document.createElement('canvas'); c.width=Math.round(W*dpr); c.height=Math.round(H*dpr);
    var x=c.getContext('2d'); x.scale(dpr,dpr); x.fillStyle='#000'; var rmax=cell*.74;
    for(var py=0;py<H;py+=1){ /* solid rows: fill every run where g reaches .97 */
      var run=-1; for(var px=0;px<=W;px+=1){ var on=px<W&&g(px,py)>=.97; if(on&&run<0) run=px; if(!on&&run>=0){ x.fillRect(run,py,px-run,1); run=-1; } } }
    for(var cy=cell/2;cy<H+cell;cy+=cell) for(var cx=cell/2;cx<W+cell;cx+=cell){
      var v=g(Math.min(cx,W-1),Math.min(cy,H-1)); if(v<=.02) continue;
      x.globalAlpha=Math.pow(.25+.75*sm(v/.9),1.2); x.beginPath(); x.arc(cx,cy,rmax*Math.sqrt(v),0,6.2832); x.fill(); }
    return c.toDataURL('image/png');
  }
  function apply(img,url,size,pos){
    var u='url('+url+')';
    img.style.webkitMaskImage=img.style.maskImage=u; img.style.webkitMaskRepeat=img.style.maskRepeat='no-repeat';
    img.style.webkitMaskSize=img.style.maskSize=size; img.style.webkitMaskPosition=img.style.maskPosition=pos;
  }
  function draw(img){
    var side=img.dataset.dotedge||'left', cell=parseFloat(img.dataset.cell||4);
    if(img.dataset.xt){ /* image mode: once per photo, at its natural size */
      if(img._de) { var cs0=getComputedStyle(img); apply(img,img._de,cs0.objectFit==='contain'?'contain':cs0.objectFit==='fill'?'100% 100%':'cover',cs0.objectPosition); return; }
      var W=img.naturalWidth, H=img.naturalHeight; if(!W||!H){ img.addEventListener('load',function(){ draw(img); },{once:true}); return; }
      var xt=parseFloat(img.dataset.xt), xb=parseFloat(img.dataset.xb), band=parseFloat(img.dataset.band||.2)*W;
      var url=paint(W,H,cell,function(px,py){ var line=(xt+(xb-xt)*py/H)*W, d=side==='right'?line-px:px-line; return sm(d/band); },1);
      img._de=url; draw(img); return;
    }
    /* box mode: redrawn whenever the box changes size */
    var BW=Math.round(img.clientWidth), BH=Math.round(img.clientHeight); if(!BW||!BH) return;
    var key=BW+'x'+BH; if(img._deb===key) return; img._deb=key;
    if(img.dataset.curve){ /* curve mode: data-curve="x,y x,y …" (fractions of the box, top to bottom) is where the fade starts;
         the photo is on the right / upper side and turns solid data-band (fraction of the box width) further in */
      var pts=img.dataset.curve.trim().split(/\s+/).map(function(p){ var a=p.split(','); return [parseFloat(a[0])*BW,parseFloat(a[1])*BH]; });
      var poly=[]; for(var i=0;i<pts.length-1;i++){ var p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
        for(var t=0;t<1;t+=.02){ var t2=t*t,t3=t2*t; poly.push([.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
                                                          .5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)]); } }
      poly.push(pts[pts.length-1]);
      /* extend both ends along their tangent so every point has a sensible nearest stretch of line */
      var A=poly[0],A2=poly[1],Z=poly[poly.length-1],Z2=poly[poly.length-2], L=4*(BW+BH);
      function ext(p,q){ var dx=p[0]-q[0],dy=p[1]-q[1],n=Math.hypot(dx,dy)||1; return [p[0]+dx/n*L,p[1]+dy/n*L]; }
      poly.unshift(ext(A,A2)); poly.push(ext(Z,Z2));
      /* signed distance on a coarse grid (positive on the photo side: right of the line's direction of travel… i.e. up/right) */
      var step=4, GW=Math.ceil(BW/step)+2, GH=Math.ceil(BH/step)+2, F=new Float32Array(GW*GH);
      for(var gy=0;gy<GH;gy++) for(var gx=0;gx<GW;gx++){ var X=gx*step, Y=gy*step, best=1e9, sgn=1;
        for(var k=0;k<poly.length-1;k++){ var a=poly[k], c2=poly[k+1], vx=c2[0]-a[0], vy=c2[1]-a[1], ll=vx*vx+vy*vy||1,
            t=Math.max(0,Math.min(1,((X-a[0])*vx+(Y-a[1])*vy)/ll)), ex=a[0]+vx*t-X, ey=a[1]+vy*t-Y, dd=ex*ex+ey*ey;
          if(dd<best){ best=dd; sgn=(vx*(Y-a[1])-vy*(X-a[0]))<0?1:-1; } }
        F[gy*GW+gx]=sgn*Math.sqrt(best); }
      function sd(px,py){ var fx=px/step, fy=py/step, ix=Math.floor(fx), iy=Math.floor(fy), tx=fx-ix, ty=fy-iy, i=iy*GW+ix;
        return (F[i]*(1-tx)+F[i+1]*tx)*(1-ty)+(F[i+GW]*(1-tx)+F[i+GW+1]*tx)*ty; }
      var bc=parseFloat(img.dataset.band||.15)*BW, dpr=Math.min(2,window.devicePixelRatio||1);
      function maskAt(off){ return paint(BW,BH,cell,function(px,py){ return sm((sd(px,py)+bc*.5-off)/bc); },dpr); }
      var grow=parseFloat(img.dataset.grow||0)*BW;
      if(!grow){ apply(img,maskAt(0),'100% 100%','0 0'); return; }
      /* data-grow: as its section scrolls away the background advances into the photo along the same curve.
         The mask is drawn at N steps (first on demand, the rest while the browser is idle) and swapped as you scroll. */
      var N=40, cache=new Array(N), sec=img.closest('section')||img.parentElement, cur=-1;
      function at(k){ if(!cache[k]) cache[k]=maskAt(grow*k/(N-1)); return cache[k]; }
      function upd(){ if(img._deb!==key) return; var r=sec.getBoundingClientRect(), p=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height))), k=Math.round(sm(p)*(N-1));
        if(k!==cur){ cur=k; apply(img,at(k),'100% 100%','0 0'); } }
      addEventListener('scroll',upd,{passive:true}); upd();
      var idle=window.requestIdleCallback||function(f){ return setTimeout(f,60); }, q=0;
      (function fill(){ if(img._deb!==key) return; while(q<N&&cache[q]) q++; if(q<N){ idle(function(){ if(img._deb===key&&!cache[q]) cache[q]=maskAt(grow*q/(N-1)); fill(); }); } })();
      return;
    }
    if(side==='top'){ /* top mode: the picture dissolves upwards into the page over data-band of its height */
      var bt=parseFloat(img.dataset.band||.5)*BH, tilt=parseFloat(img.dataset.tilt||0)*BH; /* data-tilt: how much lower the edge sits at the right than at the left, as a fraction of the height */
      apply(img,paint(BW,BH,cell,function(px,py){ return Math.min(sm((py-tilt*px/BW)/bt), img.dataset.bottom?sm((BH-1-py)/(parseFloat(img.dataset.bottom)*BH)):1); },Math.min(2,window.devicePixelRatio||1)),'100% 100%','0 0'); return; }
    var b=parseFloat(img.dataset.band||.22)*BW, lean=parseFloat(img.dataset.lean||.113)*BH/BW;
    var u2=paint(BW,BH,cell,function(px,py){ var xx=side==='left'?BW-1-px:px, solid=(.97-lean-b/BW+lean*py/BH)*BW; return sm(((solid+b)-xx)/b); },Math.min(2,window.devicePixelRatio||1));
    apply(img,u2,'100% 100%','0 0');
  }
  function all(){ document.querySelectorAll('img[data-dotedge]').forEach(draw); }
  var t; addEventListener('resize',function(){ clearTimeout(t); t=setTimeout(all,120); });
  if('ResizeObserver' in window){ var ro=new ResizeObserver(function(es){ es.forEach(function(e){ draw(e.target); }); });
    document.querySelectorAll('img[data-dotedge]').forEach(function(i){ ro.observe(i); }); }
  all();
})();
