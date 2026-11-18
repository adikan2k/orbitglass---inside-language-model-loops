"use strict";
(function () {
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
  function toy(bx) {
    const names=['A','B','C','D'], vectors={A:[.4,-.3],B:[bx,0],C:[-.2,-.2],D:[.9,.5]};
    const sequence=Array.from('ACCA'), steps=[];
    while(sequence.length<30){
      const read=vectors[sequence[sequence.length-1]], xs=sequence.map(t=>vectors[t]);
      const scores=xs.map(v=>dot(read,v)), shift=Math.max(...scores), w=scores.map(s=>Math.exp(s-shift)), total=w.reduce((a,b)=>a+b,0);
      const context=xs.reduce((a,v,i)=>[a[0]+v[0]*w[i]/total,a[1]+v[1]*w[i]/total],[0,0]);
      const logits=names.map(t=>dot(context,vectors[t])), next=names[logits.indexOf(Math.max(...logits))];
      sequence.push(next);steps.push({next,context,logits});
    }
    const generated=sequence.slice(4).join(''), longest=Math.max(0,...(generated.match(/B+/g)||[]).map(s=>s.length));
    return {sequence:sequence.join(''),generated,steps,longest,vectors};
  }
  function orbit(r,n=80,burn=500,x=.217){
    for(let i=0;i<burn;i++) x=r*x*(1-x);
    const ys=[];for(let i=0;i<n;i++){ys.push(x);x=r*x*(1-x)}return ys;
  }
  function period(a,limit=16,tolerance=0){
    for(let p=1;p<=Math.min(limit,Math.floor(a.length/2));p++){
      let ok=true;for(let i=p;i<a.length;i++)if(tolerance?Math.abs(a[i]-a[i-p])>tolerance:a[i]!==a[i-p]){ok=false;break}if(ok)return p;
    }return null;
  }
  function metrics(s){
    let switches=0,longest=0,run=0,rows={};for(let i=0;i<s.length;i++){run=i&&s[i]===s[i-1]?run+1:1;longest=Math.max(longest,run);if(i){switches+=Number(s[i]!==s[i-1]);const row=rows[s[i-1]]||={};row[s[i]]=(row[s[i]]||0)+1}}
    let h=0;for(const row of Object.values(rows)){const n=Object.values(row).reduce((a,b)=>a+b,0);for(const c of Object.values(row))h-=c/(s.length-1)*Math.log2(c/n)}
    return {n:s.length,switches,longest,distinct:new Set(s).size,entropy:h,period:period(s)};
  }
  window.LabMath={toy,orbit,metrics,period};
})();
