/* SecondLane halftone drift — a Halftone B illustration redrawn as 3D dots.
   From the start view every dot projects exactly onto the flat print; each one sits at its own depth,
   so scrolling lifts them at different speeds and the camera sway slides the layers past each other.

   Usage:  SecondLaneHalftone.mount(canvas, { src:'assets/ht-accelerator.jpg', focal:[.62,.48], scrollEl:heroSection })
   Options (all optional): firstFrom 'right'|'left' (the first load slides in from that side), intro .3 / introDur 1.5 (how far the dots start scattered and how long they take to land), detail 1 (multiplies each tier's dot budget), spacing (overrides the preset's), clearAt .9 (share of the scroll element's height scrolled when the dots are gone), preset 'fine'|'standard'|'coarse'|'bold'|'pixel', depth 2.6, depthOrder .5, zoom 1.8,
   push .3, sway .05 (share of width, ambient), swayPeriod 20 (s), light .1, fallback <img> shown when WebGL is missing.
   object {c:[x,y] object centre in the source, at:[x,y] where it lands, atSmall} places the object instead of focal.
   Returns { show(src, focal, object), pause(), play(), playing, destroy() }; show() fades to another illustration. Respects prefers-reduced-motion and stops drawing off screen. */
(function(){
  var PRE={fine:{spacing:1.8,dsize:.95,faint:.03,soft:.1,sq:0},standard:{spacing:2.4,dsize:1,faint:.04,soft:.1,sq:0},
    coarse:{spacing:4.5,dsize:1,faint:.05,soft:.12,sq:0},bold:{spacing:7,dsize:1.25,faint:.08,soft:.06,sq:0},pixel:{spacing:4,dsize:1.05,faint:.04,soft:.04,sq:1}};
  // the size the canvas actually measures sets the tier, never the device name
  var TIERS={small:{max:700,dots:60000,px:2.4e6},medium:{max:1280,dots:120000,px:4e6},large:{max:1e9,dots:210000,px:6e6}};
  var VS='attribute vec2 aS;attribute float aZ;attribute float aR;attribute vec3 aC;uniform vec2 uRes;uniform float uC;uniform vec2 uCam;uniform float uDpr;uniform float uZoom;uniform vec2 uFocus;varying float vA;varying vec3 vC;'+
    'void main(){float d=aZ-uC;if(d<=0.002){gl_Position=vec4(2.,2.,0.,1.);gl_PointSize=0.;vA=0.;return;}'+
    'float sc=aZ/d*uZoom;vec2 p=((aS*aZ-uCam)/d-uFocus)*uZoom+uFocus;gl_Position=vec4(p.x/(uRes.x*.5),-p.y/(uRes.y*.5),0.,1.);'+
    'gl_PointSize=min(2.*aR*sc*uDpr,480.);vC=aC;vA=smoothstep(.015,.35,d)*clamp(1.-(sc/uZoom-5.)/14.,0.,1.);}';
  var FS='precision mediump float;varying float vA;varying vec3 vC;uniform vec3 uL;uniform float uK;uniform float uNorm;uniform float uSoft;uniform float uSquare;uniform float uFade;'+
    'void main(){vec2 q=gl_PointCoord*2.-1.;q.y=-q.y;float r=uSquare>.5?max(q.x*q.x,q.y*q.y):dot(q,q);if(r>1.)discard;'+
    'vec3 n=uSquare>.5?vec3(0.,0.,1.):vec3(q,sqrt(1.-r));float dif=max(dot(n,uL),0.);float lit=(.3+.95*dif)/uNorm;'+
    'vec3 h=normalize(uL+vec3(0.,0.,1.));float sp=pow(max(dot(n,h),0.),30.)*.42;'+
    'vec3 col=vC*mix(1.,lit,uK)+vec3(1.,.96,.86)*sp*uK*(.4+.6*length(vC));'+
    'float e=1.-smoothstep(1.-uSoft,1.,r);float al=vA*e*uFade;gl_FragColor=vec4(col*al,al);}';
  function rnd(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
  function io(p){return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;}
  function ground(img){ // ground colour = median of the image's top and bottom edge
    var c=document.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true}),w=360,h=Math.round(360*img.height/img.width);
    c.width=w;c.height=h;x.drawImage(img,0,0,w,h);var d=x.getImageData(0,0,w,h).data,rs=[],gs=[],bs=[];
    for(var q=0;q<w;q+=2){[0,h-1].forEach(function(v){var k=(v*w+q)*4;rs.push(d[k]);gs.push(d[k+1]);bs.push(d[k+2]);});}
    function med(a){a.sort(function(p,q){return p-q});return a[a.length>>1];} return [med(rs),med(gs),med(bs)];
  }

  function mount(cv,o){
    o=o||{}; var P=Object.assign({},PRE[o.preset||'standard'],o.spacing?{spacing:o.spacing}:{}), DET=o.detail||1, focal=o.focal||[.5,.5], obj=o.object||null, zf=[.5,.5], spread=o.depth!=null?o.depth:2.6, order=o.depthOrder!=null?o.depthOrder:.5,
      ZOOM=o.zoom||1.8, PUSH=o.push!=null?o.push:.3, SWAY=o.sway!=null?o.sway:.05, PER=o.swayPeriod||20, K=o.light!=null?o.light:.1, scrollEl=o.scrollEl||cv, CLEAR=o.clearAt||.9;
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gl=cv.getContext('webgl',{antialias:true,premultipliedAlpha:true,alpha:true});
    if(!gl){ if(o.fallback) o.fallback.hidden=false; cv.hidden=true; return {pause:function(){},play:function(){},playing:false,destroy:function(){}}; }
    function sh(t,s){var x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);return x;}
    var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);gl.useProgram(pr);
    var L={},U={};['aS','aZ','aR','aC'].forEach(function(n){L[n]=gl.getAttribLocation(pr,n);});
    ['uRes','uC','uCam','uDpr','uZoom','uFocus','uL','uK','uNorm','uSoft','uSquare','uFade'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n);});
    gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    // one fixed light, upper left and in front; uNorm keeps each dot's average colour equal to the print
    var lx=-.55,ly=.55,lz=.75,m=Math.hypot(lx,ly,lz);lx/=m;ly/=m;lz/=m;var sum=0,n=0;
    for(var a=-1;a<=1;a+=.1)for(var b=-1;b<=1;b+=.1){var r=a*a+b*b;if(r>1)continue;sum+=.3+.95*Math.max(a*lx+b*ly+Math.sqrt(1-r)*lz,0);n++;}
    gl.uniform1f(U.uNorm,sum/n);gl.uniform3f(U.uL,lx,ly,lz);gl.uniform1f(U.uK,K);gl.uniform1f(U.uSoft,P.soft);gl.uniform1f(U.uSquare,P.sq);
    var buf=gl.createBuffer(), N=0, W=0, H=0, dpr=1, img=null, BG=[18,48,31], zMax=.32+spread;

    function build(){
      var area=W*H, tier=W<TIERS.small.max?'small':W<TIERS.medium.max?'medium':'large';
      var look=P.spacing*Math.min(1.5,Math.max(.75,Math.sqrt(area/(1280*800)))), cell=Math.max(look,Math.sqrt(area/(TIERS[tier].dots*DET)),2.2/dpr);
      var gw=Math.ceil(W/cell), gh=Math.ceil(H/cell), g=document.createElement('canvas'); g.width=gw; g.height=gh;
      var gx=g.getContext('2d',{willReadFrequently:true}); gx.imageSmoothingEnabled=true; gx.imageSmoothingQuality='high';
      var sc=Math.max(gw/img.width,gh/img.height); gx.fillStyle='rgb('+BG.join(',')+')'; gx.fillRect(0,0,gw,gh);
      var iw=img.width*sc, ih=img.height*sc, ox=(gw-iw)*focal[0], oy=(gh-ih)*focal[1];
      // object placement: put the object's centre (obj, a share of the source) at a share of the canvas (at); on wide canvases
      // the print may shift right past the cover crop, the gap is the print's own ground colour
      if(obj){ var at=W<TIERS.small.max?(obj.atSmall||[.5,.5]):(obj.at||[.6,.5]);
        ox=Math.min(Math.max(at[0]*gw-obj.c[0]*iw,gw-iw),.35*gw); oy=Math.min(Math.max(at[1]*gh-obj.c[1]*ih,gh-ih),0); }
      zf=[(ox/gw)+(obj?obj.c[0]:.5)*iw/gw,(oy/gh)+(obj?obj.c[1]:.5)*ih/gh]; if(!obj) zf=[focal[0],focal[1]];
      gx.drawImage(img,ox,oy,iw,ih);
      var px=gx.getImageData(0,0,gw,gh).data, cellA=cell*cell, out=[], i=0;
      for(var y=0;y<gh;y++)for(var x=0;x<gw;x++,i++){
        var k=i*4,R=px[k],G=px[k+1],B=px[k+2],dR=R-BG[0],dG=G-BG[1],dB=B-BG[2], c=Math.min(1,Math.sqrt(dR*dR+dG*dG+dB*dB)/140);
        if(c<P.faint) continue;
        // dot area grows with the difference from the ground; its colour is pushed so the cell still averages to the original
        var rr=cell*.5*Math.min(1,.42+.58*Math.sqrt(c))*P.dsize, f=Math.min(1,(P.sq?4:Math.PI)*rr*rr/cellA), l=(R*.3+G*.59+B*.11)/255;
        var t=(1-order)*rnd(i)+order*(1-l)*.85+order*.15*rnd(i+9.1), z=.32+spread*Math.pow(t,1.15);
        out.push((x+.5)*cell-W/2,(y+.5)*cell-H/2,z,rr,Math.min(1,Math.max(0,(BG[0]+dR/f)/255)),Math.min(1,Math.max(0,(BG[1]+dG/f)/255)),Math.min(1,Math.max(0,(BG[2]+dB/f)/255)));
      }
      N=out.length/7; gl.bindBuffer(gl.ARRAY_BUFFER,buf); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(out),gl.STATIC_DRAW);
      var st=28; gl.enableVertexAttribArray(L.aS);gl.vertexAttribPointer(L.aS,2,gl.FLOAT,false,st,0);
      gl.enableVertexAttribArray(L.aZ);gl.vertexAttribPointer(L.aZ,1,gl.FLOAT,false,st,8);
      gl.enableVertexAttribArray(L.aR);gl.vertexAttribPointer(L.aR,1,gl.FLOAT,false,st,12);
      gl.enableVertexAttribArray(L.aC);gl.vertexAttribPointer(L.aC,3,gl.FLOAT,false,st,16);
      cv.dataset.spec=tier+' · '+Math.round(W)+'×'+Math.round(H)+' · '+Math.round(N/1000)+'k dots · '+cell.toFixed(1)+'px · '+dpr.toFixed(2)+'x';
    }
    function size(){
      var r=cv.getBoundingClientRect(); if(r.width<2||r.height<2) return; if(Math.abs(r.width-W)<1&&Math.abs(r.height-H)<1) return;
      W=r.width; H=r.height; var tier=W<TIERS.small.max?'small':W<TIERS.medium.max?'medium':'large';
      dpr=Math.max(1,Math.min(Math.min(devicePixelRatio||1,2),Math.sqrt(TIERS[tier].px/(W*H))));
      cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); gl.viewport(0,0,cv.width,cv.height); if(img) build();
    }
    // scroll: 0 while the hero sits at the top, 1 once it has scrolled out of view
    function progress(){ var r=scrollEl.getBoundingClientRect(); return Math.min(1,Math.max(0,-r.top/Math.max(1,r.height*CLEAR))); }
    var swA=1, swT=1, pending=null, inT=-1, inFirst=false, SIDE=o.firstFrom==='right'?.4:o.firstFrom==='left'?-.4:0, INA=o.intro!=null?o.intro:.3, IND=o.introDur||1.5, cache={}, cam={d:0,c:0,z:1}, swayNow=0, clock=0, last=performance.now(), vis=true, playing=!reduce, raf=0, alive=true;
    function frame(now){
      now=now||performance.now(); var dt=Math.min(.1,(now-last)/1000); last=now;
      var p=reduce?0:progress(), ip=0, inA=1, sideX=0;
      // arrival (ease in-out, a soft start and a soft landing): each new print starts scattered along the dots' depths and flies into place over IND seconds, then settles
      if(inT>=0&&!reduce){ inT+=dt; var it=Math.min(1,inT/IND); var ie=io(it); if(inFirst&&SIDE){ sideX=-SIDE*(1-ie)*W; } else ip=INA*(1-ie); inA=io(Math.min(1,inT/(IND*.35))); if(it>=1) inT=-1; }
      p=p+ip*(1-p);
      if(playing) clock+=dt;
      // ambient sway: camera to the left, back through the centre, to the right and home, once per period
      var swayT=playing?-Math.sin(2*Math.PI*clock/PER)*SWAY*W:0; swayNow+=(swayT-swayNow)*.04;
      var cEnd=.42*PUSH, need=1.22*(zMax-cEnd)+.12, ds=Math.pow(p,1.6), zm=1+(1-Math.pow(1-p,2))*(ZOOM-1);
      var k=reduce||inT>=0?1:.09; cam.p=(cam.p||0)+(p-(cam.p||0))*k; var fp=cam.p; cam.d+=(ds*need*H/zm-cam.d)*k; cam.c+=((1-Math.pow(1-p,2))*cEnd-cam.c)*k; cam.z+=(zm-cam.z)*k;
      // switching illustration: the old print fades out quickly, then the new one arrives
      swA+=(swT-swA)*(reduce?1:.28); if(pending&&swA<.03){ apply(pending); pending=null; swT=1; swA=1; }
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.uRes,W,H); gl.uniform1f(U.uC,cam.c); gl.uniform1f(U.uZoom,cam.z); gl.uniform2f(U.uFocus,(zf[0]-.5)*W,(zf[1]-.5)*H);
      gl.uniform2f(U.uCam,swayNow+sideX,cam.d); gl.uniform1f(U.uDpr,dpr); gl.uniform1f(U.uFade,swA*inA*(1-Math.min(1,Math.max(0,(fp-.78)/.2))));
      if(N) gl.drawArrays(gl.POINTS,0,N);
    }
    function loop(nw){ raf=0; if(!alive) return; if(vis) frame(nw); if(!reduce||!N) raf=requestAnimationFrame(loop); }
    function load(src,cb){ if(cache[src]) return cb(cache[src]); var im=new Image(); im.onload=function(){ cache[src]={img:im,bg:o.ground||ground(im)}; cb(cache[src]); }; im.src=src; }
    function apply(e,first){ img=e.img; BG=e.bg; focal=e.focal; obj=e.object||null; if(W&&H) build(); inT=0; inFirst=!!first; }
    load(o.src,function(e){ apply({img:e.img,bg:e.bg,focal:focal,object:obj},true); W=H=0; size(); if(o.fallback) o.fallback.hidden=true; if(!raf) raf=requestAnimationFrame(loop); });
    var ro=('ResizeObserver' in window)?new ResizeObserver(size):null; if(ro) ro.observe(cv); else addEventListener('resize',size);
    var ob=('IntersectionObserver' in window)?new IntersectionObserver(function(es){ vis=es[0].isIntersecting; last=performance.now(); }):null; if(ob) ob.observe(cv);
    if(reduce) addEventListener('resize',function(){ requestAnimationFrame(frame); });
    raf=requestAnimationFrame(loop);
    var api={ show:function(src,f,ob){ load(src,function(e){ var nx={img:e.img,bg:e.bg,focal:f||[.5,.5],object:ob||null};
        if(reduce||!img){ apply(nx); requestAnimationFrame(frame); } else { pending=nx; swT=0; } }); },
      get playing(){return playing;}, play:function(){playing=true;}, pause:function(){playing=false;},
      destroy:function(){ alive=false; if(ro) ro.disconnect(); if(ob) ob.disconnect(); cancelAnimationFrame(raf); } };
    window.__htFrame=frame; return api;
  }
  window.SecondLaneHalftone={mount:mount};
})();
