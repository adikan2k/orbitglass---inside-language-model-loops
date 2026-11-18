"use strict";
const content=document.getElementById('content');
const Lab=(()=>{
  const experiments=[
    {id:'trace',tag:'Observed outputs',title:'Repetition atlas',desc:'Compare two models answering the same question across seven temperatures.',ref:'Sentence clusters',module:2},
    {id:'map',tag:'Mathematical reference',title:'Logistic map',desc:'Sweep the growth rate and watch one orbit split into cycles and irregular motion.',ref:'Nonlinear dynamics',module:3},
    {id:'toy',tag:'Controlled intervention',title:'Toy transformer',desc:'Move one embedding and trace its effect on a four-token decoder, step by step.',ref:'Mechanistic probe',module:5}
  ];
  const modules=LESSONS.filter(l=>typeof l.id==='number');
  const kinds=['Decoding','Symbolic dynamics','Nonlinear dynamics','Information theory','Mechanistic models','Representations','Network science','Interpretability','Feedback control','System design'];
  function esc(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function head(k,t,sub=''){return '<div class="pagetop"><div class="kicker">'+k+'</div><h1>'+t+'</h1>'+(sub?'<p>'+sub+'</p>':'')+'</div>'}
  function btn(url,txt,cls='dark'){return '<a href="'+url+'" class="btn '+cls+'">'+txt+'</a>'}
  function announce(s){document.getElementById('announce').textContent=s}
  function cards(){return '<div class="card-grid">'+experiments.map((e,i)=>'<a class="exp-card" href="#lab/'+e.id+'"><div class="thumb '+e.id+'"><canvas data-thumb="'+e.id+'" aria-hidden="true"></canvas><span class="tag">EXP. 0'+(i+1)+'</span></div><div class="cardbody"><div class="meta">'+e.tag+'</div><h3>'+e.title+'</h3><p>'+e.desc+'</p><span class="cardlink">Open experiment <span class="arrow">→</span></span></div></a>').join('')+'</div>'}
  function downloads(){
    return '<div class="resources"><a class="btn paper small" href="files/Research_Report.pdf" target="_blank" rel="noopener">Research findings (PDF) ↗</a></div>';
  }
  function home(){return '<section class="hero"><div class="wrap"><div class="hero-grid"><div class="hero-text"><div class="eyebrow"><span class="cross" aria-hidden="true">✳</span> Network Data Science / Research lab</div><h1>The shape of<br><em>model behavior.</em></h1><p class="hero-lead">Explore how language models repeat, switch and settle. Step inside the experiments behind the research.</p><div class="actions">'+btn('#demo/1','<span class="play-icon">▶</span> Launch guided demo','lime')+btn('#guide','Explore concepts <span>↗</span>','line')+'</div></div><div class="orbit-figure"><div class="figcap"><span><span class="tagnum">FIG. 01</span> Logistic return surface</span><span>r ∈ [2.5, 4.0]</span></div><canvas id="heroArt" aria-label="A three-dimensional family of logistic return curves for growth rates from 2.5 to 4.0. Drag to rotate."></canvas><div class="figcap bottom">Drag to rotate <button id="motion" class="circle-btn" aria-label="Pause orbit rotation">Ⅱ</button></div></div></div><div class="hero-foot"><span><i class="dot"></i><b>GW NETWORK DATA SCIENCE</b></span><span>3 experiments &nbsp; / &nbsp; 14 archived responses &nbsp; / &nbsp; 10 methods</span></div></div></section><div class="wrap"><section class="section"><div class="section-head"><div><div class="kicker">Research instruments</div><h2>Experiment index</h2></div><span class="count">01 — 03</span></div>'+cards()+'</section><section class="section utility-grid"><div><div class="kicker">Research methods</div><h2 style="margin:8px 0 10px">Concepts behind the experiments</h2>'+modules.slice(0,3).map((m,i)=>'<a class="listlink" href="#lesson/'+m.id+'"><span class="ordinal">0'+(i+1)+'</span><strong>'+m.title+'</strong><span class="arrow">↗</span></a>').join('')+'<a class="cardlink" href="#guide">Browse all 10 methods →</a></div><div class="product-note"><div class="kicker">Product implications</div><h3>When should a product interrupt a loop?</h3><p>Some repeated text is useful. Compare missed loops and unnecessary interruptions before changing the decoding policy.</p><div class="actions">'+btn('#implications','Explore the decision →','dark small')+'<a class="linkbtn" href="#architecture">Architecture</a></div></div></section></div>'}
  function guide(){
    const cards=modules.map((m,i)=>'<a class="module-card" href="#lesson/'+m.id+'"><span class="num">'+String(m.id).padStart(2,'0')+'</span><span><small>'+kinds[i]+'</small><h3>'+m.title+'</h3></span><span>↗</span></a>').join('');
    return '<div class="wrap bottomspace enter">'+head('Technical reference','Concepts and methods','Explore how each experiment turns a model output into a measurement. Use the glossary for plain-language definitions and examples.')+'<div class="tabs"><a href="#glossary">Keyword glossary</a><a href="#architecture">Research architecture</a><a href="#lesson/stack">Technology stack</a><a href="#implications">Product implications</a></div><div class="guidegrid">'+cards+'</div>'+downloads()+'</div>';
  }
  function lesson(id){
    const m=LESSONS.find(l=>String(l.id)===id);if(!m)return missing();
    const num=typeof m.id==='number', e=experiments.find(t=>t.module===m.id);
    const navigation=modules.map(l=>'<a class="'+(l.id===m.id?'active':'')+'" href="#lesson/'+l.id+'">'+String(l.id).padStart(2,'0')+' · '+l.title+'</a>').join('');
    return '<div class="wrap bottomspace enter">'+head(num?'Method '+String(m.id).padStart(2,'0')+' / 10':'Research reference',m.title)+'<div class="readlayout"><aside class="aside"><div class="meta">Concepts and methods</div><a href="#guide">← All methods</a>'+navigation+'<a href="#glossary">Keyword glossary</a></aside><article class="reading panel">'+m.body+'<div class="actions">'+(e?btn('#lab/'+e.id,'Open '+e.title+' ↗','dark small'):'')+(num&&m.id<10?btn('#lesson/'+(m.id+1),'Next method →','paper small'):btn('#guide','All methods','paper small'))+'</div></article></div></div>';
  }
  function glossary(){
    return '<div class="wrap bottomspace enter">'+head('Technical reference','Keyword glossary','Look up a term from the demo and see how it is used in the research.')+'<div class="term-search"><label for="term">Find a keyword</label><input id="term" type="search" placeholder="Try entropy, embedding or switch rate"></div><div class="count" id="termCount" aria-live="polite"></div><div class="terms" id="terms"></div></div>';
  }
  function filterTerms(){
    const term=document.getElementById('term').value.trim().toLowerCase();
    const rows=TERMS.filter(row=>row.slice(0,3).join(' ').toLowerCase().includes(term));
    document.getElementById('termCount').textContent=rows.length+' of '+TERMS.length+' terms';
    document.getElementById('terms').innerHTML=rows.length?rows.map(([title,definition,example,id])=>'<article class="term-entry"><h2>'+esc(title)+'</h2><p>'+esc(definition)+'</p><p class="hint">'+esc(example)+'</p><a class="cardlink" href="#lesson/'+id+'">Related method →</a></article>').join(''):'<p class="empty">No terms match this search. Try a shorter keyword.</p>';
  }
  function architecture(){
    const m=LESSONS.find(l=>l.id==='architecture');
    return '<div class="wrap bottomspace enter">'+head('System design','Research architecture','The lab follows three paths from raw observations to evidence. Each path supports a different kind of product decision.')+'<article class="panel reading wide-read">'+m.body+'<h2>What runs in the demo?</h2><div class="flow"><div><b>Archive</b><span>The repetition atlas loads 14 saved continuations and their local sentence-cluster labels. A selected bar maps directly to its sentence.</span></div><div><b>Compute</b><span>The logistic map and four-token decoder recalculate in JavaScript when a parameter changes. The demo runs locally without model inference calls.</span></div><div><b>Inspect</b><span>The charts display the measured transitions, periods, context vectors and token scores. The experimental notebooks used Python, PyTorch and Hugging Face Transformers.</span></div></div><div class="actions">'+btn('#lesson/stack','Technology stack →','dark small')+btn('#lesson/10','Evaluation design →','paper small')+'</div></article></div>';
  }
  function implications(){
    return '<div class="wrap bottomspace enter">'+head('Product decisions','When should a generation be interrupted?','A support assistant may repeat mandated wording correctly. The same assistant can alternate two phrases until its token budget runs out. An intervention should distinguish those cases.')+'<div class="panel reading wide-read"><h2>What the experiments establish</h2><div class="table-scroll"><table><thead><tr><th>Observation</th><th>Decision it informs</th><th>Evidence still needed</th></tr></thead><tbody><tr><td>GPT-2 changed cluster at 32 of 32 boundaries in one low-temperature run. DistilGPT-2 changed at 1 of 51.</td><td>Review short cycles as well as identical runs when detecting repetition.</td><td>False alarms and missed loops on representative customer tasks.</td></tr><tr><td>The deterministic toy decoder produced six versus 21 consecutive B tokens after a one-coordinate edit.</td><td>Trace a suspected mechanism under a controlled intervention.</td><td>Replicated effects on the intended deployed model, across prompts and seeds.</td></tr><tr><td>The feedback experiments changed sampling filters as well as temperature policy.</td><td>Use a matched baseline before crediting a controller for a quality change.</td><td>Independent task outcomes, response length, latency and token use.</td></tr></tbody></table></div><h2>A small pilot</h2><p>Choose one workflow where repetition matters. Ask reviewers to label harmful loops and examples of useful repetition without seeing the detector score. Hold out entire prompt families.</p><p>Run the detector in shadow mode. Compare its proposed interventions with the labels. Estimate the cost of interrupting a valid answer alongside the tokens a successful intervention might save. Use those measurements to decide whether to pilot automatic stopping.</p><div class="actions">'+btn('#lab/trace','Inspect a recorded run →','dark small')+btn('#architecture','Explore architecture','paper small')+'</div></div>'+downloads()+'</div>';
  }
  function missing(){return '<div class="wrap section">'+head('Navigation','Page not found')+btn('#home','Back to overview')+'</div>'}
  function render(){
    const [path='home',id='']=location.hash.replace(/^#/,'').split('/');const view=path||'home';
    window.updateInstrument=null;Experiments.cleanup();
    const menu=document.getElementById('nav');menu.classList.remove('open');document.getElementById('menu').setAttribute('aria-expanded','false');
    const active={home:'home',experiments:'experiments',lab:'experiments',demo:'experiments',guide:'guide',lesson:'guide',glossary:'guide',architecture:'architecture',implications:'guide'}[view];
    for(const a of menu.querySelectorAll('a')){const yes=a.hash==='#'+active;a.classList.toggle('on',yes);if(yes)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}
    let html;switch(view){case 'home':html=home();break;case 'experiments':html='<div class="wrap bottomspace enter">'+head('Research instruments','Experiment index','Inspect archived model outputs and run the two mathematical experiments directly in your browser.')+cards()+'</div>';break;case 'lab':case 'demo':html=Experiments.page(view,id);break;case 'guide':html=guide();break;case 'lesson':html=id==='architecture'?architecture():lesson(id);break;case 'glossary':html=glossary();break;case 'architecture':html=architecture();break;case 'implications':html=implications();break;default:html=missing()}
    content.innerHTML=html;document.title=(view==='home'?'LLM Behavior Lab':content.querySelector('h1')?.textContent||'Field guide')+' · Orbitglass';
    if(view==='lab'||view==='demo')Experiments.bind(view,id);
    if(view==='glossary'){document.getElementById('term').oninput=filterTerms;filterTerms()}
    Art.mount();
  }
  document.getElementById('menu').onclick=e=>{const open=document.getElementById('nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',open)};
  document.querySelector('.skip').onclick=e=>{e.preventDefault();content.focus()};
  window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);content.focus({preventScroll:true})});
  return {render,esc,head,btn,announce,experiments,modules,kinds,downloads,missing};
})();
Lab.render();

