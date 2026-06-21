/* ============================================================
   LOGIPLEX — JavaScript v3 — Maximum
   Canvas avancé · Paquets de données · Ondes WiFi
   Particules CTA · Page Visibility · Validation formulaire
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   CANVAS : RÉSEAU DE CONNECTIVITÉ AVANCÉ
   ══════════════════════════════════════════════════════════ */

class NoeudReseau {
  constructor(l, h) {
    this.estHub = Math.random() < 0.12;
    this.x  = Math.random() * l;
    this.y  = Math.random() * h;
    const v = this.estHub ? 0.18 : 0.42;
    this.vx = (Math.random() - 0.5) * v;
    this.vy = (Math.random() - 0.5) * v;
    this.rayon      = this.estHub ? (Math.random() * 2.5 + 2.5) : (Math.random() * 1.6 + 0.8);
    this.opaciteBase= this.estHub ? 0.9 : (Math.random() * 0.5 + 0.25);
    this.teinte     = Math.random() > 0.45 ? [0,229,255] : [59,130,246];
    this.phase      = Math.random() * Math.PI * 2;
    this.vitPuls    = this.estHub ? 0.02 : (0.01 + Math.random() * 0.015);
    this.l = l; this.h = h;
    this.cptOnde  = 0;
    this.delaiOnde= Math.floor(Math.random() * 200) + 100;
  }

  maj() {
    this.x += this.vx; this.y += this.vy; this.phase += this.vitPuls;
    if (this.x < -10) this.x = this.l + 10;
    if (this.x > this.l + 10) this.x = -10;
    if (this.y < -10) this.y = this.h + 10;
    if (this.y > this.h + 10) this.y = -10;
    if (this.estHub) this.cptOnde++;
  }

  doitEmettre() {
    if (!this.estHub || this.cptOnde < this.delaiOnde) return false;
    this.cptOnde = 0;
    this.delaiOnde = Math.floor(Math.random() * 180) + 80;
    return true;
  }

  draw(ctx) {
    const op = this.opaciteBase + Math.sin(this.phase) * (this.estHub ? 0.08 : 0.15);
    const [r,g,b] = this.teinte;
    const rd = this.rayon;
    const x = this.x|0, y = this.y|0;
    if (this.estHub) {
      ctx.beginPath(); ctx.arc(x, y, rd*5, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${r},${g},${b},${(op*0.07).toFixed(3)})`; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, rd*2.5, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${r},${g},${b},${(op*0.13).toFixed(3)})`; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, rd, 0, Math.PI*2);
      ctx.shadowBlur = 8; ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.fillStyle = `rgba(${r},${g},${b},${op.toFixed(3)})`; ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      ctx.beginPath(); ctx.arc(x, y, rd*3, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${r},${g},${b},${(op*0.1).toFixed(3)})`; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, rd, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${r},${g},${b},${op.toFixed(3)})`; ctx.fill();
    }
  }
}

/* Paquet de données voyageant le long d'une connexion */
class PaquetDonnees {
  constructor(a, b) {
    this.ax=a.x; this.ay=a.y; this.bx=b.x; this.by=b.y;
    this.p  = 0;
    this.v  = 0.005 + Math.random() * 0.008;
    this.r  = 1.8 + Math.random() * 1.2;
    this.fini = false;
  }
  maj() { this.p += this.v; if (this.p >= 1) this.fini = true; }
  draw(ctx) {
    const x = this.ax + (this.bx-this.ax)*this.p;
    const y = this.ay + (this.by-this.ay)*this.p;
    ctx.beginPath(); ctx.arc(x, y, this.r, 0, Math.PI*2);
    ctx.shadowBlur = 10; ctx.shadowColor = '#00E5FF';
    ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.shadowBlur = 0;
  }
}

/* Onde WiFi émise par un hub */
class OndeHub {
  constructor(x, y) {
    this.x=x; this.y=y;
    this.r = 4; this.rMax = 52 + Math.random()*34;
    this.op= 0.55; this.fini=false;
  }
  maj() {
    this.r  += 0.72;
    this.op  = 0.55 * (1 - this.r / this.rMax);
    if (this.r >= this.rMax) this.fini = true;
  }
  draw(ctx) {
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(0,229,255,${Math.max(0, this.op)})`;
    ctx.lineWidth = 1; ctx.stroke();
  }
}

function lancerCanvas() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d', { alpha: true });

  const NB     = window.innerWidth < 600 ? 24 : 58;
  const DM     = window.innerWidth < 600 ? 96 : 150;
  const DM2    = DM * DM;
  const MAX_PKT = 8;
  const FPS    = 33; /* ~30fps cap */

  let noeuds=[], paquets=[], ondes=[], animId=null, actif=true, lastTime=0;

  function init() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    noeuds  = Array.from({length:NB}, () => new NoeudReseau(canvas.width, canvas.height));
    paquets = []; ondes = [];
  }

  function frame(now) {
    animId = requestAnimationFrame(frame);
    if (!actif || now - lastTime < FPS) return;
    lastTime = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cnx = [];
    for (let i = 0; i < noeuds.length; i++) {
      const a = noeuds[i];
      for (let j = i+1; j < noeuds.length; j++) {
        const b = noeuds[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx*dx + dy*dy;
        if (d2 < DM2) {
          const d = Math.sqrt(d2);
          const op = ((1 - d/DM) * 0.26).toFixed(3);
          const [r1,g1,b1] = a.teinte, [r2,g2,b2] = b.teinte;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${(r1+r2)>>1},${(g1+g2)>>1},${(b1+b2)>>1},${op})`;
          ctx.lineWidth = (a.estHub || b.estHub) ? 0.85 : 0.55;
          ctx.moveTo(a.x|0, a.y|0); ctx.lineTo(b.x|0, b.y|0); ctx.stroke();
          cnx.push([i, j]);
        }
      }
    }

    if (paquets.length < MAX_PKT && cnx.length && Math.random() < 0.028) {
      const [i,j] = cnx[Math.floor(Math.random()*cnx.length)];
      paquets.push(new PaquetDonnees(noeuds[i], noeuds[j]));
    }
    paquets = paquets.filter(p => !p.fini);
    paquets.forEach(p => { p.maj(); p.draw(ctx); });

    ondes = ondes.filter(o => !o.fini);
    ondes.forEach(o => { o.maj(); o.draw(ctx); });

    for (const n of noeuds) {
      n.maj();
      if (n.doitEmettre()) ondes.push(new OndeHub(n.x, n.y));
      n.draw(ctx);
    }
  }

  document.addEventListener('visibilitychange', () => {
    actif = !document.hidden;
    if (document.hidden) {
      cancelAnimationFrame(animId); animId = null;
    } else {
      lastTime = 0; animId = requestAnimationFrame(frame);
    }
  });

  init(); animId = requestAnimationFrame(frame);

  let resT;
  window.addEventListener('resize', () => {
    clearTimeout(resT);
    resT = setTimeout(() => {
      cancelAnimationFrame(animId); animId = null;
      init(); animId = requestAnimationFrame(frame);
    }, 250);
  });
}

/* ══════════════════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const pourquoi = document.getElementById('pourquoi');
  let ticking = false;

  function smoothstep(t) { return t * t * (3 - 2 * t); }

  function update() {
    const scrollY = window.scrollY;

    // Continuous fade-in: 0 → max alpha over first 280px of scroll
    const fadeIn = smoothstep(Math.min(Math.max(scrollY / 280, 0), 1));
    let alpha = fadeIn * 0.66;

    // Smooth fade-out when navbar is over the pourquoi (light) section
    if (pourquoi && alpha > 0.02) {
      const navH = nav.offsetHeight;
      const { top, bottom } = pourquoi.getBoundingClientRect();
      if (bottom > 0 && top < navH) {
        const zone = 72;
        const dist = top - navH; // negative when inside section
        const mult = Math.min(Math.max((dist + zone) / zone, 0), 1);
        alpha *= mult;
      }
    }

    // Apply background directly — no class toggle, no CSS transition
    nav.style.background = alpha > 0.005
      ? `rgba(6,11,30,${alpha.toFixed(3)})`
      : '';
    nav.classList.toggle('scrolled', scrollY > 40);

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
}

/* ══════════════════════════════════════════════════════════
   HAMBURGER
   ══════════════════════════════════════════════════════════ */
function initHamburger() {
  const btn=document.getElementById('hamburger'), menu=document.getElementById('mobileMenu');
  if (!btn||!menu) return;
  btn.addEventListener('click', () => {
    const o=btn.classList.toggle('open');
    menu.classList.toggle('open',o);
    btn.setAttribute('aria-expanded',o);
    menu.setAttribute('aria-hidden',!o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(l=>l.addEventListener('click',()=>{
    btn.classList.remove('open'); menu.classList.remove('open');
    btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }));
}

/* ══════════════════════════════════════════════════════════
   BILINGUE FR / EN
   ══════════════════════════════════════════════════════════ */
const OPTS={
  fr:['Sélectionner...','10 à 24 logements','25 à 49 logements','50 à 99 logements','100 logements et plus'],
  en:['Select...','10 to 24 units','25 to 49 units','50 to 99 units','100 units or more'],
};

function appliquerLangue(lang) {
  document.documentElement.lang = lang;
  const btn=document.getElementById('langToggle');
  if (btn) {
    btn.textContent = lang==='fr'?'EN':'FR';
    btn.setAttribute('aria-label', lang==='fr' ? 'EN — Changer la langue' : 'FR — Switch language');
  }
  document.querySelectorAll('[data-fr]').forEach(el => {
    const t=el.dataset[lang]; if (!t) return;
    if (t.includes('<')||t.includes('&')) el.innerHTML=t; else el.textContent=t;
  });
  document.querySelectorAll('[data-fr-ph]').forEach(el => {
    el.placeholder = lang==='fr' ? el.dataset.frPh : el.dataset.enPh;
  });
  const sel=document.getElementById('units');
  if (sel) sel.querySelectorAll('option').forEach((o,i)=>{ if(OPTS[lang][i]) o.textContent=OPTS[lang][i]; });
  localStorage.setItem('logiplex-lang', lang);

  /* Délai de réponse */
  initDelaiReponse();

  /* Recalculer le calculateur dans la bonne langue */
  if (window._calcUpdate) window._calcUpdate();
}

function initLangue() {
  const btn=document.getElementById('langToggle');
  appliquerLangue(localStorage.getItem('logiplex-lang')||'fr');
  if (btn) btn.addEventListener('click', () => appliquerLangue(document.documentElement.lang==='fr'?'en':'fr'));
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const obs = new IntersectionObserver(
    es => es.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} }),
    {threshold:0.1, rootMargin:'0px 0px -40px 0px'}
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* Animate steps connecting line when steps section enters viewport */
  const stepsLine = document.querySelector('.steps-line');
  if (stepsLine) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { stepsLine.classList.add('animated'); }
    }, {threshold: 0.3}).observe(stepsLine.parentElement);
  }
}

/* ══════════════════════════════════════════════════════════
   COMPTEURS ANIMÉS
   ══════════════════════════════════════════════════════════ */
function animerCompteur(el) {
  const cible=parseInt(el.dataset.target,10);
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=cible.toLocaleString('fr-CA');return;}
  const d0=performance.now(), dur=1900;
  (function step(now) {
    const t=Math.min((now-d0)/dur,1), e=1-Math.pow(1-t,3);
    el.textContent=Math.round(e*cible).toLocaleString('fr-CA');
    if(t<1) requestAnimationFrame(step);
  })(d0);
}

function initCompteurs() {
  const obs=new IntersectionObserver(
    es=>es.forEach(e=>{if(e.isIntersecting){animerCompteur(e.target);obs.unobserve(e.target);}}),
    {threshold:0.5}
  );
  document.querySelectorAll('.count-num').forEach(n=>obs.observe(n));
}

/* ══════════════════════════════════════════════════════════
   CARROUSEL
   ══════════════════════════════════════════════════════════ */
function initCarrousel() {
  const cartes=document.querySelectorAll('.testi-card');
  const dots=document.querySelectorAll('.dot');
  const prev=document.getElementById('prevBtn'), next=document.getElementById('nextBtn');
  if (!cartes.length) return;
  let idx=0, timer;
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Live region discret : annonce le numéro du slide sans relire le contenu */
  const status=document.createElement('div');
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  status.setAttribute('aria-atomic','true');
  status.className='sr-only';
  document.querySelector('.carousel-wrapper')?.appendChild(status);

  function show(n) {
    cartes[idx].classList.remove('active'); dots[idx].classList.remove('active'); dots[idx].setAttribute('aria-selected','false');
    idx=(n+cartes.length)%cartes.length;
    cartes[idx].classList.add('active'); dots[idx].classList.add('active'); dots[idx].setAttribute('aria-selected','true');
    const lang=document.documentElement.lang||'fr';
    status.textContent=lang==='en'?`Testimonial ${idx+1} of ${cartes.length}`:`Témoignage ${idx+1} sur ${cartes.length}`;
  }
  cartes[0].classList.add('active');
  if(prev) prev.addEventListener('click',()=>{show(idx-1);reset();});
  if(next) next.addEventListener('click',()=>{show(idx+1);reset();});
  dots.forEach(d=>d.addEventListener('click',()=>{show(+d.dataset.idx);reset();}));
  function start(){ if(!reducedMotion) timer=setInterval(()=>show(idx+1),6200); }
  function reset(){ clearInterval(timer); start(); }
  start();
  const w=document.querySelector('.carousel-wrapper');
  if(w){
    w.addEventListener('mouseenter',()=>clearInterval(timer));
    w.addEventListener('mouseleave',start);
    w.addEventListener('keydown',e=>{
      if(e.key==='ArrowLeft'){ show(idx-1); reset(); }
      if(e.key==='ArrowRight'){ show(idx+1); reset(); }
    });
  }
}

/* ══════════════════════════════════════════════════════════
   FAQ
   ══════════════════════════════════════════════════════════ */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item=btn.closest('.faq-item'), ouvert=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(a=>{
        if(a!==item){a.classList.remove('open');a.querySelector('.faq-q').setAttribute('aria-expanded','false');}
      });
      item.classList.toggle('open',!ouvert);
      btn.setAttribute('aria-expanded',!ouvert);
    });
  });
}

/* ══════════════════════════════════════════════════════════
   FORMULAIRE — validation temps réel + erreurs accessibles
   ══════════════════════════════════════════════════════════ */
function initFormulaire() {
  const form=document.getElementById('contactForm');
  const succes=document.getElementById('formSuccess');
  if (!form) return;

  const MSG = {
    fr: { nom:'Veuillez entrer votre nom.', email:'Adresse courriel invalide.', units:'Veuillez sélectionner une option.' },
    en: { nom:'Please enter your name.', email:'Invalid email address.', units:'Please select an option.' },
  };

  function errMsg(input) {
    const lang=document.documentElement.lang;
    if (input.id==='name')  return MSG[lang].nom;
    if (input.id==='email') return MSG[lang].email;
    if (input.id==='units') return MSG[lang].units;
    return input.validationMessage;
  }

  function valider(input) {
    const ok=input.checkValidity();
    input.classList.toggle('invalide',!ok);
    input.classList.toggle('valide',ok);
    let prev=input.parentElement.querySelector('.field-error');
    if (prev) prev.remove();
    if (!ok) {
      const span=document.createElement('span');
      span.className='field-error'; span.setAttribute('role','alert');
      span.textContent=errMsg(input);
      input.insertAdjacentElement('afterend',span);
    }
  }

  form.querySelectorAll('input[required],select[required]').forEach(inp=>{
    inp.addEventListener('blur', ()=>valider(inp));
    inp.addEventListener('input',()=>{ if(inp.classList.contains('invalide')) valider(inp); });
  });

  form.addEventListener('submit', e=>{
    e.preventDefault();
    let ok=true;
    form.querySelectorAll('input[required],select[required]').forEach(inp=>{valider(inp); if(!inp.checkValidity()) ok=false;});
    if(!ok) return;

    const btn=form.querySelector('button[type="submit"]');
    const btnSpan=btn.querySelector('span[data-fr]');
    const origFr=btnSpan?.getAttribute('data-fr')||'Envoyer';
    const origEn=btnSpan?.getAttribute('data-en')||'Send';
    const lang=document.documentElement.lang||'fr';
    btn.disabled=true;
    btn.classList.add('loading');
    const spinner=document.createElement('span');
    spinner.className='btn-spinner';
    btn.insertBefore(spinner, btn.firstChild);
    if(btnSpan){
      btnSpan.setAttribute('data-fr','Envoi en cours…');
      btnSpan.setAttribute('data-en','Sending…');
      btnSpan.textContent=lang==='en'?'Sending…':'Envoi en cours…';
    }

    fetch('/',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams(new FormData(form)).toString()
    })
    .then(res=>{
      if(!res.ok) throw new Error('HTTP '+res.status);
      form.style.display='none'; succes.hidden=false;
    })
    .catch(()=>{
      btn.disabled=false;
      btn.classList.remove('loading');
      spinner.remove();
      if(btnSpan){
        btnSpan.setAttribute('data-fr',origFr);
        btnSpan.setAttribute('data-en',origEn);
        btnSpan.textContent=lang==='en'?origEn:origFr;
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════
   SMOOTH SCROLL
   ══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(l=>{
    l.addEventListener('click', e=>{
      const t=document.querySelector(l.getAttribute('href')); if(!t) return;
      e.preventDefault();
      const off=document.getElementById('navbar')?.offsetHeight||72;
      window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-off, behavior:'smooth'});
    });
  });
}

/* ══════════════════════════════════════════════════════════
   PARALLAXE SOURIS
   ══════════════════════════════════════════════════════════ */
function initMouseParallax() {
  const canvas=document.getElementById('networkCanvas');
  if (!canvas||window.innerWidth<800) return;
  let tx=0,ty=0,cx=0,cy=0;
  const MAX_SHIFT=6;
  document.addEventListener('mousemove', e=>{
    if(window.scrollY>window.innerHeight*0.6) return;
    tx=Math.max(-MAX_SHIFT,Math.min(MAX_SHIFT,(e.clientX/window.innerWidth-0.5)*20));
    ty=Math.max(-MAX_SHIFT,Math.min(MAX_SHIFT,(e.clientY/window.innerHeight-0.5)*20));
  }, { passive: true });
  (function loop(){
    cx+=(tx-cx)*0.055; cy+=(ty-cy)*0.055;
    canvas.style.transform=`translate(${cx.toFixed(2)}px,${cy.toFixed(2)}px)`;
    requestAnimationFrame(loop);
  })();
}

/* ══════════════════════════════════════════════════════════
   PARTICULES AU CLIC SUR LES BOUTONS CTA
   ══════════════════════════════════════════════════════════ */
function initParticulesClick() {
  document.querySelectorAll('.btn-primary').forEach(btn=>{
    btn.addEventListener('click', e=>{
      for(let i=0;i<14;i++){
        const p=document.createElement('span');
        p.className='explosion-particule';
        const angle=(i/14)*Math.PI*2+Math.random()*0.4;
        const dist=35+Math.random()*60;
        const sz=3+Math.random()*4;
        p.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;--dx:${(Math.cos(angle)*dist).toFixed(1)}px;--dy:${(Math.sin(angle)*dist).toFixed(1)}px;background:${Math.random()>0.45?'#00E5FF':'#3B82F6'};`;
        document.body.appendChild(p);
        p.addEventListener('animationend',()=>p.remove(),{once:true});
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════
   INDICATEUR LIEN ACTIF DANS LA NAV
   ══════════════════════════════════════════════════════════ */
function initNavHighlight() {
  const secs=document.querySelectorAll('section[id]');
  const liens=document.querySelectorAll('.nav-links a[href^="#"]');
  if(!secs.length||!liens.length) return;
  const obs=new IntersectionObserver(
    es=>es.forEach(e=>{
      if(!e.isIntersecting) return;
      liens.forEach(l=>l.removeAttribute('aria-current'));
      const a=document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if(a) a.setAttribute('aria-current','page');
    }),
    {threshold:0.4}
  );
  secs.forEach(s=>obs.observe(s));
}

/* ══════════════════════════════════════════════════════════
   DÉLAI DE RÉPONSE DYNAMIQUE (formulaire)
   ══════════════════════════════════════════════════════════ */
function initDelaiReponse() {
  const el=document.getElementById('delaiReponse');
  if(!el) return;
  const h=new Date().getHours(), j=new Date().getDay();
  const lang=document.documentElement.lang;
  const horsLigne = j===0||j===6||h<8||h>=18;
  el.textContent = horsLigne
    ? (lang==='fr'?'⏱ Réponse le prochain jour ouvrable (lun-ven 8h-18h)':'⏱ Reply next business day (Mon-Fri 8am-6pm)')
    : (lang==='fr'?'⏱ Réponse habituelle en moins de 2 heures':'⏱ Usual reply in under 2 hours');
}

/* ══════════════════════════════════════════════════════════
   TICKER BÂTIMENTS — CARTE DASHBOARD HERO
   ══════════════════════════════════════════════════════════ */
function initDashboardTicker() {
  const nameEl = document.querySelector('.hdc-name');
  const unitsEl = document.querySelector('.hdc-units');
  const monthlyEl = document.querySelector('.hdc-val.hdc-cyan');
  const tenantsEl = document.querySelector('.hdc-metric:last-child .hdc-val');
  const barFill = document.querySelector('.hdc-bar-fill');
  const barLabel = document.querySelector('.hdc-bar-label');
  if (!nameEl) return;

  const buildings = [
    { name:'Tour des Érables', unitsFr:'120 logements · Montréal', unitsEn:'120 units · Montréal', monthly:'+10 200 $', tenants:'118 / 120', pct:'98.3%', fill:'98.3' },
    { name:'Résidence Le Plateau', unitsFr:'48 logements · Montréal', unitsEn:'48 units · Montréal', monthly:'+4 080 $', tenants:'47 / 48', pct:'97.9%', fill:'97.9' },
    { name:'Les Condos Laval', unitsFr:'200 logements · Laval', unitsEn:'200 units · Laval', monthly:'+17 000 $', tenants:'196 / 200', pct:'98.0%', fill:'98.0' },
    { name:'Le Saint-Laurent', unitsFr:'76 logements · Québec', unitsEn:'76 units · Québec', monthly:'+6 460 $', tenants:'74 / 76', pct:'97.4%', fill:'97.4' },
  ];
  let idx = 0;

  function rotate() {
    idx = (idx + 1) % buildings.length;
    const b = buildings[idx];
    const lang = document.documentElement.lang || 'fr';
    const card = nameEl.closest('.hero-dashboard-card');
    if (card) { card.style.opacity = '0'; card.style.transition = 'opacity 0.4s'; }
    setTimeout(() => {
      nameEl.textContent = b.name;
      if (unitsEl) unitsEl.textContent = lang === 'en' ? b.unitsEn : b.unitsFr;
      if (monthlyEl) monthlyEl.textContent = b.monthly;
      if (tenantsEl) tenantsEl.textContent = b.tenants;
      if (barFill) barFill.style.width = b.fill + '%';
      if (barLabel) barLabel.textContent = (lang === 'en' ? 'Adoption rate: ' : 'Taux d\'adoption: ') + b.pct;
      if (card) { card.style.opacity = '1'; }
    }, 400);
  }

  setInterval(rotate, 5500);
}

/* ══════════════════════════════════════════════════════════
   TILT 3D SUR LES CARTES SOLUTIONS
   ══════════════════════════════════════════════════════════ */
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.sol-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'border-color 0.2s, box-shadow 0.2s, transform 0.08s linear';
    });
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(700px) rotateX(${(-y * 9).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'border-color 0.3s, box-shadow 0.3s, transform 0.55s ease';
      card.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════════════════════
   PARALLAXE SCROLL — ORBES DU HERO
   ══════════════════════════════════════════════════════════ */
function initScrollParallax() {
  const orbs = [
    document.querySelector('.hero-orb-1'),
    document.querySelector('.hero-orb-2'),
    document.querySelector('.hero-orb-3'),
  ].filter(Boolean);
  if (!orbs.length) return;
  const rates = [0.14, -0.1, 0.07];
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        orbs.forEach((o, i) => { o.style.transform = `translateY(${y * rates[i]}px)`; });
      }
      ticking = false;
    });
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   CALCULATEUR DE REVENUS
   ══════════════════════════════════════════════════════════ */
function initCalculateur() {
  const slider = document.getElementById('calcSlider');
  const unitsEl = document.getElementById('calcUnitsNum');
  const monthlyEl = document.getElementById('calcMonthly');
  const annualEl = document.getElementById('calcAnnual');
  if (!slider) return;

  const RATE = 85;

  function fmt(n, lang) {
    return lang === 'fr'
      ? n.toLocaleString('fr-CA') + ' $/mois'
      : '$' + n.toLocaleString('en-CA') + '/mo';
  }
  function fmtAnnual(n, lang) {
    return lang === 'fr'
      ? n.toLocaleString('fr-CA') + ' $/an'
      : '$' + n.toLocaleString('en-CA') + '/yr';
  }

  function update() {
    const units = parseInt(slider.value, 10);
    const lang = document.documentElement.lang || 'fr';
    const monthly = units * RATE;
    const annual = monthly * 12;
    unitsEl.textContent = units;
    monthlyEl.textContent = fmt(monthly, lang);
    annualEl.textContent = fmtAnnual(annual, lang);
    slider.setAttribute('aria-valuenow', units);
    const pct = ((units - 10) / (100 - 10)) * 100;
    slider.style.setProperty('--pct', pct + '%');
  }

  slider.addEventListener('input', update);
  update();
  window._calcUpdate = update;
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   CURSEUR PERSONNALISÉ LUMINEUX
   ══════════════════════════════════════════════════════════ */
function initCustomCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.body.classList.add('has-custom-cursor');
  let mx = -200, my = -200, rx = -200, ry = -200;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(calc(${mx}px - 50%),calc(${my}px - 50%))`;
  }, { passive: true });
  (function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(calc(${rx.toFixed(1)}px - 50%),calc(${ry.toFixed(1)}px - 50%))`;
    requestAnimationFrame(loop);
  })();
  const setHover = on => {
    dot.classList.toggle('cursor-hover', on);
    ring.classList.toggle('cursor-hover', on);
  };
  document.querySelectorAll('a, button, .sol-card, .step-card, .marche-card, input, select, textarea')
    .forEach(el => { el.addEventListener('mouseenter', () => setHover(true)); el.addEventListener('mouseleave', () => setHover(false)); });
  document.addEventListener('mousedown', () => ring.classList.add('cursor-click'));
  document.addEventListener('mouseup', () => ring.classList.remove('cursor-click'));
}

/* ══════════════════════════════════════════════════════════
   BARRE DE PROGRESSION SCROLL
   ══════════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   SPOTLIGHT SOURIS — SECTIONS SOMBRES
   ══════════════════════════════════════════════════════════ */
function initMouseSpotlight() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.section-dark, .section-testimonials, .section-contact, .cta-banner, .section-calculateur').forEach(section => {
    const s = document.createElement('div');
    s.className = 'mouse-spotlight';
    section.appendChild(s);
    section.addEventListener('mousemove', e => {
      const r = section.getBoundingClientRect();
      s.style.transform = `translate(calc(${e.clientX - r.left}px - 50%),calc(${e.clientY - r.top}px - 50%))`;
      s.style.opacity = '1';
    }, { passive: true });
    section.addEventListener('mouseleave', () => { s.style.opacity = '0'; });
  });
}

/* ══════════════════════════════════════════════════════════
   BOUTONS MAGNÉTIQUES
   ══════════════════════════════════════════════════════════ */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.btn-primary, .nav-cta, .card-cta').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease, box-shadow var(--t-fast), filter var(--t-fast)';
    });
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), box-shadow var(--t-fast), filter var(--t-fast)';
      btn.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════════════════════
   COMPTEUR ANIMÉ — STATISTIQUES HERO
   ══════════════════════════════════════════════════════════ */
function initHeroStatsCounter() {
  const stats = document.querySelectorAll('.hero-stat-num');
  if (!stats.length) return;
  function fmt(n) {
    return n >= 1000 ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : n.toString();
  }
  const obs = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.textContent.replace(/[ \s]/g, '');
      const num = parseInt(raw);
      const suffix = raw.replace(/[0-9]/g, '');
      if (isNaN(num)) return;
      const dur = 1800, d0 = performance.now();
      (function step(now) {
        const t = Math.min((now - d0) / dur, 1);
        el.textContent = fmt(Math.round((1 - Math.pow(1 - t, 3)) * num)) + suffix;
        if (t < 1) requestAnimationFrame(step);
      })(d0);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => obs.observe(s));
}

/* ══════════════════════════════════════════════════════════
   TYPEWRITER — TEXTE GRADIENT DU HERO
   ══════════════════════════════════════════════════════════ */
function initTypewriter() {
  const spans = document.querySelectorAll('.hero-title .gradient-text');
  if (!spans.length) return;
  const texts = Array.from(spans).map(s => s.textContent);
  spans.forEach(s => { s.textContent = ''; });
  let delay = 1100;
  spans.forEach((span, i) => {
    const text = texts[i];
    setTimeout(() => {
      span.classList.add('typewriter-cursor');
      let j = 0;
      const iv = setInterval(() => {
        span.textContent = text.slice(0, ++j);
        if (j >= text.length) {
          clearInterval(iv);
          span.classList.remove('typewriter-cursor');
        }
      }, 52);
    }, delay);
    delay += text.length * 52 + 480;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  /* Critique : exécuté immédiatement */
  initNavbar();
  initHamburger();
  initLangue();
  initFormulaire();
  initSmoothScroll();
  initFAQ();
  initCalculateur();

  /* Priorité moyenne : contenu visible au scroll */
  setTimeout(() => {
    initScrollReveal();
    initCompteurs();
    initCarrousel();
    initNavHighlight();
    initDashboardTicker();
    initHeroStatsCounter();
    initTypewriter();
  }, 60);

  /* Différé : effets visuels non-critiques */
  const ric = window.requestIdleCallback || (cb => setTimeout(() => cb(), 200));
  ric(() => {
    lancerCanvas();
    initMouseParallax();
    initScrollParallax();
    initParticulesClick();
    initCardTilt();
    initCustomCursor();
    initScrollProgress();
    initMouseSpotlight();
    initMagneticButtons();
  }, { timeout: 2500 });
});
