const nav=document.getElementById('nav');
const hero=document.querySelector('.hero');
const darks=[...document.querySelectorAll('.sec--deep, .footer')];
function navState(){
  const scrolled=window.scrollY>20;
  nav.classList.toggle('scrolled', scrolled);
  const line=nav.offsetHeight*0.6;
  const hr=hero.getBoundingClientRect();
  const overHero=hr.top<=line && hr.bottom>line;
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

/* Formulario demo: abre el correo con los datos. En producción, POST a tu backend o Formspree. */
const form=document.getElementById('contactForm'),note=document.getElementById('formNote');
form.addEventListener('submit',(ev)=>{ev.preventDefault();const f=new FormData(form);const nombre=(f.get('nombre')||'').toString().trim();const email=(f.get('email')||'').toString().trim();if(!nombre||!email){note.textContent='Por favor completa tu nombre y correo.';note.style.color='var(--ion)';return;}const cuerpo=encodeURIComponent(`Nombre: ${nombre}\nTeléfono: ${f.get('telefono')||'-'}\nCiudad: ${f.get('ciudad')||'-'}\nServicio: ${f.get('servicio')}\n\n${f.get('mensaje')||''}`);const asunto=encodeURIComponent(`Solicitud web — ${f.get('servicio')}`);window.location.href=`mailto:info@astrion.com.co?subject=${asunto}&body=${cuerpo}`;note.textContent='Abriendo tu correo… si no se abre, escríbenos a info@astrion.com.co';note.style.color='';});
