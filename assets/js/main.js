const nav=document.getElementById('nav');
const hero=document.querySelector('.hero');
const darks=[...document.querySelectorAll('.sec--deep, .footer')];
function navState(){
  const scrolled=window.scrollY>20;
  nav.classList.toggle('scrolled', scrolled);
  const line=nav.offsetHeight*0.6;
  let overHero=false;
  if(hero){
    const hr=hero.getBoundingClientRect();
    overHero=hr.top<=line && hr.bottom>line;
  }
  nav.classList.toggle('on-hero', overHero && !scrolled);
  let over=false;
  for(const s of darks){
    const r=s.getBoundingClientRect();
    if(r.top<=line && r.bottom>line){over=true;break;}
  }
  nav.classList.toggle('over-dark', over || (overHero && scrolled));
}
navState();
window.addEventListener('scroll',navState,{passive:true});
window.addEventListener('resize',navState);

/* carrusel de sectores: duplica los ítems para que el desplazamiento sea continuo */
const sTrack=document.getElementById('sectorsTrack');
if(sTrack){[...sTrack.children].forEach(el=>{const c=el.cloneNode(true);c.setAttribute('aria-hidden','true');sTrack.appendChild(c);});}

/* matriz de marcas: banda continua con "túneles" de envoltura exacta — todas las marcas avanzan
   a velocidad constante y con separación fija; al cruzar de fila, cada píxel que sale por el borde
   izquierdo aparece en ese mismo instante entrando por el borde derecho de la fila siguiente
   (la marca se dibuja en ambos extremos a la vez mediante un duplicado, y el overflow la recorta) */
const bGrid=document.getElementById('brandsGrid');
if(bGrid && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const bEls=[...bGrid.children];
  const bN=bEls.length;
  const bClones=bEls.map(el=>{const c=el.cloneNode(true);c.setAttribute('aria-hidden','true');c.style.cssText='position:absolute;margin:0;display:none;pointer-events:none;';bGrid.appendChild(c);return c;});
  let bSlots=[],bPath=[],bIdx=[];
  function bMeasure(){
    bEls.forEach(el=>el.style.transform='');
    const g=bGrid.getBoundingClientRect();
    bSlots=bEls.map(el=>{const r=el.getBoundingClientRect();return{x:r.left-g.left,y:r.top-g.top,w:r.width,h:r.height};});
    bClones.forEach((c,i)=>{c.style.display='none';c.style.left=bSlots[i].x+'px';c.style.top=bSlots[i].y+'px';c.style.width=bSlots[i].w+'px';c.style.height=bSlots[i].h+'px';});
    /* orden de viaje: filas de arriba a abajo, dentro de cada fila de derecha a izquierda (serpentina de lectura) */
    const rows=new Map();
    bSlots.forEach((r,i)=>{const key=Math.round(r.y);if(!rows.has(key))rows.set(key,[]);rows.get(key).push(i);});
    bPath=[];
    [...rows.keys()].sort((a,b)=>a-b).forEach(key=>{
      bPath.push(...rows.get(key).sort((a,b)=>bSlots[b].x-bSlots[a].x));
    });
    bIdx=[];bPath.forEach((slot,k)=>bIdx[slot]=k);
  }
  bMeasure();
  window.addEventListener('resize',bMeasure);
  let bP=0,bLast=null,bPause=false;
  bGrid.addEventListener('mouseenter',()=>bPause=true);
  bGrid.addEventListener('mouseleave',()=>bPause=false);
  const bSpeed=1/5000; /* una casilla cada 5 s, ritmo constante */
  function bFrame(t){
    if(bLast!==null && !bPause && !document.hidden) bP=(bP+(t-bLast)*bSpeed)%bN;
    bLast=t;
    for(let i=0;i<bN;i++){
      const q=(bIdx[i]+bP)%bN;
      const k=Math.floor(q), f=q-k;
      const A=bSlots[bPath[k]], B=bSlots[bPath[(k+1)%bN]];
      const c=bClones[i];
      let x,y;
      if(Math.abs(A.y-B.y)<1){ /* misma fila: deslizamiento normal */
        x=A.x+(B.x-A.x)*f; y=A.y;
        if(c.style.display!=='none')c.style.display='none';
      }else{ /* túnel: sale por el borde izquierdo mientras su duplicado entra, píxel a píxel, por el derecho */
        x=A.x-f*A.w; y=A.y;
        if(c.style.display==='none')c.style.display='';
        c.style.transform='translate('+(B.x+(1-f)*B.w-bSlots[i].x)+'px,'+(B.y-bSlots[i].y)+'px)';
      }
      bEls[i].style.transform='translate('+(x-bSlots[i].x)+'px,'+(y-bSlots[i].y)+'px)';
    }
    requestAnimationFrame(bFrame);
  }
  requestAnimationFrame(bFrame);
}

/* selector de idioma: conserva la sección actual al cambiar de idioma */
document.querySelectorAll('.js-lang-switch').forEach(a=>{ if(location.hash) a.href+=location.hash; });

/* menú móvil */
const burger=document.getElementById('burger'), mnav=document.getElementById('mnav');
burger.addEventListener('click',()=>{
  const open=mnav.classList.toggle('open');
  burger.setAttribute('aria-expanded',open);
  document.body.style.overflow=open?'hidden':'';
});
mnav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  mnav.classList.remove('open');burger.setAttribute('aria-expanded','false');document.body.style.overflow='';
}));

/* reveals */
const io=new IntersectionObserver((es)=>{es.forEach((e)=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(Math.min(i,3)*60)+'ms';io.observe(el);});
/* al saltar a un ancla (clic en el menú o llegada con #hash), revela de inmediato los .rv de la sección destino
   — sin esto, el contenido del destino (p. ej. el carrusel de sectores) queda invisible hasta mover el scroll */
function revealHash(){
  if(!location.hash) return;
  let t=null;try{t=document.querySelector(location.hash);}catch(e){return;}
  if(!t) return;
  if(t.classList.contains('rv')){t.classList.add('in');io.unobserve(t);}
  t.querySelectorAll('.rv').forEach(el=>{el.classList.add('in');io.unobserve(el);});
}
revealHash();
window.addEventListener('hashchange',revealHash);

/* Formulario demo: abre el correo con los datos. En producción, POST a tu backend o Formspree. */
const isEN=document.documentElement.lang==='en';
const formT=isEN?{
  missing:'Please fill in your name and email.',
  labels:['Name','Phone','City','Service'],
  subject:'Website inquiry',
  sent:'Opening your email client… if it doesn’t open, write to us at info@astrion.com.co'
}:{
  missing:'Por favor completa tu nombre y correo.',
  labels:['Nombre','Teléfono','Ciudad','Servicio'],
  subject:'Solicitud web',
  sent:'Abriendo tu correo… si no se abre, escríbenos a info@astrion.com.co'
};
const form=document.getElementById('contactForm'),note=document.getElementById('formNote');
if(form){
  form.addEventListener('submit',(ev)=>{ev.preventDefault();const f=new FormData(form);const nombre=(f.get('nombre')||'').toString().trim();const email=(f.get('email')||'').toString().trim();if(!nombre||!email){note.textContent=formT.missing;note.style.color='var(--ion)';return;}const [lName,lPhone,lCity,lService]=formT.labels;const cuerpo=encodeURIComponent(`${lName}: ${nombre}\n${lPhone}: ${f.get('telefono')||'-'}\n${lCity}: ${f.get('ciudad')||'-'}\n${lService}: ${f.get('servicio')}\n\n${f.get('mensaje')||''}`);const asunto=encodeURIComponent(`${formT.subject} — ${f.get('servicio')}`);window.location.href=`mailto:info@astrion.com.co?subject=${asunto}&body=${cuerpo}`;note.textContent=formT.sent;note.style.color='';});
}
