"use strict";
window.Art = (function(){
  const m=window.LabMath, tau=2*Math.PI;
  const palette=['#cbe69a','#f2ac7f','#a9c9dd','#e3bace','#e4cd70','#9ecac1','#bfadcb','#c1baaa','#96b17d','#b9ccea','#e6ae9a','#b8cc70','#80b1ac'];
  let af=0,visible=true,observer=null,resize=null,rotation=0,phase=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,last=0;
  function ctx(c){const d=Math.min(2,devicePixelRatio||1),w=c.clientWidth,h=c.clientHeight;if(!w||!h)return null;if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d)}const g=c.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);return {g,w,h}}
  function line(g,x,y,u,v,color,width=1){g.beginPath();g.moveTo(x,y);g.lineTo(u,v);g.strokeStyle=color;g.lineWidth=width;g.stroke()}
  function label(g,t,x,y,color='#647268',size=10){g.fillStyle=color;g.font=size+'px ui-monospace, Consolas, monospace';g.fillText(t,x,y)}
  function hero(c){
    const z=ctx(c);if(!z)return;const {g,w,h}=z;
    const angle=-.55+rotation+Math.sin(phase)*.095,co=Math.cos(angle),si=Math.sin(angle),compact=w<380;
    const project=(x,y,d)=>{const X=(x-.5)*1.57,D=(d-.5)*1.63;const xx=X*co+D*si,zz=-X*si+D*co;return [w*(.518+xx*(compact?.42:.405)),h*(.535-(y-.32)*.78+zz*.15-xx*.065)]};
    for(let i=0;i<=6;i++)for(const flip of [false,true]){let a=flip?project(i/6,-.02,0):project(0,-.02,i/6),b=flip?project(i/6,-.02,1):project(1,-.02,i/6);line(g,...a,...b,'rgba(179,206,151,.115)',.7)}
    for(let j=140;j>=0;j--){const v=j/140,r=2.5+v*1.5;const trace=g.createLinearGradient(w*.13,h*.8,w*.82,h*.12);
      trace.addColorStop(0,'rgba(93,145,114,'+(.45+.25*v)+')');trace.addColorStop(.24,'rgba(177,214,137,.8)');trace.addColorStop(.48,'rgba(231,232,153,.94)');trace.addColorStop(.68,'rgba(238,180,112,.97)');trace.addColorStop(1,'rgba(203,122,79,.94)');
      g.strokeStyle=trace;g.lineWidth=j%7===0?1.35:.72;g.setLineDash(j%7===0?[]:[.65,2.45]);g.lineDashOffset=j*.4;g.beginPath();
      for(let k=0;k<=105;k++){const u=k/105,y=r*u*(1-u),p=project(u,y,v);if(k===0)g.moveTo(...p);else g.lineTo(...p)}g.stroke();
    }
    g.setLineDash([]);const a=project(0,0,0),b=project(1,0,0),d=project(.99,0,1);label(g,'0',a[0]-6,a[1]+13,'#9aa99a',10);label(g,'xₜ',b[0]+4,b[1]+5,'#cad2ba',11);label(g,'r',d[0]+3,d[1]+4,'#cad2ba',11);
  }
  function bars(c,seq,showAxis){
    const z=ctx(c);if(!z)return;const {g,w,h}=z;const left=showAxis?22:18,top=showAxis?20:16,dx=(w-2*left)/Math.max(52,...seq.map(a=>a.length)),dy=(h-top-14)/seq.length;
    for(let j=0;j<seq.length;j++){const a=seq[j];for(let i=0;i<a.length;i++){g.fillStyle=palette[(a.charCodeAt(i)-65)%palette.length];g.fillRect(left+dx*i,top+j*dy,Math.max(1,dx*.78),dy*.63)}}
  }
  let bifCache=null;
  function bif(c,r,card=false){
    const z=ctx(c);if(!z)return;const {g,w,h}=z,p=card?12:35,b=card?9:25,t=card?6:12,ww=w-p-12,hh=h-t-b;
    if(!bifCache){bifCache=[];for(let j=0;j<=600;j++)bifCache.push(m.orbit(2.8+j/600*1.2,55,270))}
    g.fillStyle=card?'#5b4f73':'#60516f';g.globalAlpha=.47;
    for(let j=0;j<bifCache.length;j++){const x=p+j/600*ww;for(const y of bifCache[j])g.fillRect(x,t+(1-y)*hh,card?1.05:1.3,card?.9:1.1)}
    g.globalAlpha=1;if(!card){for(const v of [0,.5,1]){label(g,String(v),4,t+(1-v)*hh+4);line(g,p,t+(1-v)*hh,w-10,t+(1-v)*hh,'#314b3d22',.6)}for(const v of [2.8,3.2,3.6,4])label(g,v.toFixed(1),p+(v-2.8)/1.2*ww-8,h-5)}
    const X=p+(r-2.8)/1.2*ww;g.setLineDash([4,3]);line(g,X,t,X,t+hh,card?'#a56b61':'#944a2f',1.3);g.setLineDash([]);
  }
  function trajectory(c,ys){const z=ctx(c);if(!z)return;const {g,w,h}=z;for(const y of [0,.5,1])line(g,0,(1-y)*(h-8)+4,w,(1-y)*(h-8)+4,'#d3d7c9');g.strokeStyle='#34684f';g.lineWidth=1.8;g.beginPath();ys.forEach((v,i)=>{const x=5+i/(ys.length-1)*(w-10),y=4+(1-v)*(h-8);i?g.lineTo(x,y):g.moveTo(x,y)});g.stroke()}
  function toy(c,bx,step,card=false){const z=ctx(c);if(!z)return;const {g,w,h}=z,sim=m.toy(bx),px=x=>w*.14+(x+.2)*w*.66,py=y=>h*.55-y*h*.75/1;
    if(!card){for(let x=-.25;x<=1;x+=.25)line(g,px(x),5,px(x),h-10,'#cfcec1',.65);for(let y=-.4;y<.7;y+=.2)line(g,4,py(y),w-4,py(y),'#cfcec1',.65)}
    const colors={A:'#46684c',B:'#8e511b',C:'#71588c',D:'#a3463b'};
    const points=sim.steps.slice(0,step);if(points.length){g.beginPath();points.forEach((s,i)=>{const X=px(s.context[0]),Y=py(s.context[1]);i?g.lineTo(X,Y):g.moveTo(X,Y)});g.strokeStyle='#9e7851';g.lineWidth=2;g.stroke()}
    for(const [i,v] of Object.entries(sim.vectors)){const X=px(v[0]),Y=py(v[1]),x0=px(0),y0=py(0),ang=Math.atan2(Y-y0,X-x0);line(g,x0,y0,X,Y,colors[i],2);g.beginPath();g.moveTo(X,Y);g.lineTo(X-9*Math.cos(ang-.32),Y-9*Math.sin(ang-.32));g.lineTo(X-9*Math.cos(ang+.32),Y-9*Math.sin(ang+.32));g.fillStyle=colors[i];g.fill();label(g,i,X+5,Y+(i==='A'?1:-4),colors[i],card?11:14)}
    if(points.length){const l=points[points.length-1].context;g.beginPath();g.arc(px(l[0]),py(l[1]),4,0,tau);g.fillStyle='#212d24';g.fill()}
  }
  function redraw(){
    const c=document.querySelector('#heroArt');if(c)hero(c);
    document.querySelectorAll('[data-thumb]').forEach(e=>{const n=e.dataset.thumb;if(n==='trace')bars(e,[TRACES.GPT2['0.10'],TRACES.Distil['0.10'],TRACES.GPT2['0.55'],TRACES.Distil['0.70']],false);else if(n==='map')bif(e,3.55,true);else toy(e,.8,12,true)});
    window.updateInstrument?.();
  }
  function animate(stamp){if(playing&&visible&&!document.hidden&&stamp-last>55){phase+=.009;last=stamp;const c=document.querySelector('#heroArt');if(c)hero(c)}if(playing&&visible&&!document.hidden&&document.querySelector('#heroArt'))af=requestAnimationFrame(animate)}
  function start(){cancelAnimationFrame(af);if(playing&&visible&&!document.hidden)af=requestAnimationFrame(animate)}
  function mount(){cancelAnimationFrame(af);observer?.disconnect();resize?.disconnect();redraw();resize=new ResizeObserver(redraw);document.querySelectorAll('canvas').forEach(c=>resize.observe(c));const c=document.querySelector('#heroArt');if(!c)return;
    const set=()=>{const b=document.querySelector('#motion');if(b){b.textContent=playing?'Ⅱ':'▷';b.setAttribute('aria-label',playing?'Pause orbit rotation':'Play orbit rotation');b.title=b.getAttribute('aria-label')}};set();document.querySelector('#motion').onclick=()=>{playing=!playing;set();start()};let prev=null;c.onpointerdown=e=>{prev=e.clientX;c.setPointerCapture(e.pointerId)};c.onpointermove=e=>{if(prev!==null){rotation+=(e.clientX-prev)*.006;prev=e.clientX;hero(c)}};c.onpointerup=c.onpointercancel=()=>prev=null;
    observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start()});observer.observe(c);start()}
  document.addEventListener('visibilitychange',start);
  return {mount,bars,bif,toy,trajectory,palette};
})();
