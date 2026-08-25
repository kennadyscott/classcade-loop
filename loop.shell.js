/* ClassCade Loop — app shell: sidebar, child switcher, tier toggle, helpers */

const el = (tag, cls, html) => { const n=document.createElement(tag); if(cls)n.className=cls; if(html!=null)n.innerHTML=html; return n };
const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const ICON = {
  home:  '<svg style="width:24px;height:24px;display:block" viewBox="0 0 24 24" fill="currentColor"><path d="M11.3 2.4a1 1 0 0 1 1.4 0l8 7.4c.2.2.3.5.3.8V20a2 2 0 0 1-2 2h-4.2a1 1 0 0 1-1-1v-4.6a1.8 1.8 0 0 0-3.6 0V21a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-9.4c0-.3.1-.6.3-.8z"/></svg>',
  growth:'<svg style="width:24px;height:24px;display:block" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21a1 1 0 0 1-1-1v-5.1C6.9 14.4 4 11.6 4 8.2V6a1 1 0 0 1 1-1h1.4c3.3 0 5.8 2.2 6.3 5.3.9-2.2 3-3.8 5.5-3.8H20a1 1 0 0 1 1 1v1.3c0 3.4-2.8 6.1-6.3 6.1H13v5.1a1 1 0 0 1-1 1z"/></svg>',
  ask:   '<svg style="width:24px;height:24px;display:block" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c5 0 9 3.4 9 7.6s-4 7.6-9 7.6c-.9 0-1.7-.1-2.5-.3l-4 2.1a.7.7 0 0 1-1-.8l.8-3.1C3.2 14.7 3 12.7 3 10.6 3 6.4 7 3 12 3z"/></svg>',
  more:  '<svg style="width:24px;height:24px;display:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  school:'<svg style="width:24px;height:24px;display:block" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2 21.4 7a1 1 0 0 1 .6.9V10a1 1 0 0 1-1 1h-1v8h1a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h1v-8H3a1 1 0 0 1-1-1V7.9c0-.4.2-.7.6-.9zM8 13v6h3v-6zm5 0v6h3v-6z"/></svg>',
  kids:  '<svg style="width:24px;height:24px;display:block" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M8.5 12.5c-3.2 0-6 1.7-6 3.9V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2.6c0-2.2-2.8-3.9-6-3.9M17 11.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0 1.5c-.7 0-1.4.1-2 .3 1.3 1 2 2.2 2 3.6V20h4a1 1 0 0 0 1-1v-2.2c0-1.9-2.2-3.3-5-3.3"/></svg>',
  mail:  '<svg style="width:24px;height:24px;display:block" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6.6A2.6 2.6 0 0 1 5.6 4h12.8A2.6 2.6 0 0 1 21 6.6v.2l-9 5.2-9-5.2zm0 2.5V17a2.6 2.6 0 0 0 2.6 2.6h12.8A2.6 2.6 0 0 0 21 17V9.1l-8.5 4.9a1 1 0 0 1-1 0z"/></svg>',
  plus:  '<svg style="width:22px;height:22px;display:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
};

const NAV = [
  { id:'home',   href:'parent.html',   ic:'🏠', navico:'nav-home',    label:'Home',     tab:true },
  { id:'growth', href:'growth.html',   ic:'🌱', glyph:'growth', label:'Growth',   tab:true },
  { id:'ask',    href:'ask.html',      ic:'💬', glyph:'ask',    label:'Ask',      tab:true },
  { id:'school', href:'school.html',   ic:'🏫', glyph:'school', label:'Daily Feed' },
  { id:'kids',   href:'kids.html',     ic:'👥', navico:'nav-my-kids', label:'My Kids' },
  { id:'msgs',   href:'messages.html', ic:'✉️', navico:'nav-messages',label:'Messages', tab:true },
  { id:'chores', href:'chores.html',   ic:'🏠', navico:'nav-my-kids', glyph:'home', label:'At Home', tab:true },
  { id:'set',    href:'settings.html', ic:'⚙️', navico:'nav-menu',    label:'Settings', tab:true, tabLabel:'Settings' },
];
/* Lite keeps the nav to the three surfaces a parent uses on a weekday —
   what's happening, what the teacher said, what to do at home. Growth, Ask,
   Daily Feed and My Kids are still there, they just move behind More, so
   nothing is stranded and switching depth never loses a page. */
const LITE_NAV = ['home','msgs','chores','set'];
function navItems(){
  if (LOOP.deep()) return NAV;
  return NAV.filter(n=>LITE_NAV.includes(n.id)).map(n=>({...n, tab:true}));
}
function navMore(){
  const hidden = LOOP.deep() ? NAV.filter(n=>!n.tab) : NAV.filter(n=>!LITE_NAV.includes(n.id));
  const set = NAV.find(n=>n.id==='set');
  return hidden.filter(n=>n.id!=='set').concat(set?[set]:[]);
}

const PROTO = [
  { href:'index.html',   ic:'🔗', label:'Concept' },
  { href:'teacher.html', ic:'🧑‍🏫', label:'Teacher view' },
];

/* The ClassCade Loop lockup, drawn rather than imaged so it stays crisp
   at any size and recolors for light surfaces. The two o's of "Loop" are
   overlapping rings — blue from school, gold from home, navy where they
   meet. That overlap is the entire product thesis. */
function brandMark(cls){
  return `
  <a class="brand ${cls||''}" href="parent.html" aria-label="ClassCade Loop">
    <span class="brand-top">
      <svg class="spark" viewBox="0 0 24 24" aria-hidden="true">
        <g stroke-linecap="round" fill="none">
          <path d="M8 8.5 L18.5 4.2"  stroke="#ffc425" stroke-width="4.2"/>
          <path d="M4.8 13 L14.8 10.4" stroke="#1172ff" stroke-width="4.2"/>
          <path d="M5.6 19 L12.6 17.2" stroke="#5cb0ff" stroke-width="4.2"/>
        </g>
      </svg>
      <span class="cc">ClassCade</span><span class="tm">™</span>
    </span>
    <span class="brand-loop">
      <span class="ltr">L</span>
      <svg class="inf" viewBox="0 0 100 58" aria-hidden="true">
        <defs>
          <linearGradient id="lpBlue" x1="0" x2="1">
            <stop offset="0" stop-color="#1172ff"/><stop offset="1" stop-color="#3d8bff"/>
          </linearGradient>
          <linearGradient id="lpGold" x1="0" x2="1">
            <stop offset="0" stop-color="#ffc425"/><stop offset="1" stop-color="#ffd547"/>
          </linearGradient>
          <mask id="lpCross">
            <rect width="100" height="58" fill="black"/>
            <circle cx="63" cy="29" r="20" fill="none" stroke="white" stroke-width="13.5"/>
          </mask>
        </defs>
        <circle cx="37" cy="29" r="20" fill="none" stroke="url(#lpBlue)" stroke-width="13.5"/>
        <circle cx="63" cy="29" r="20" fill="none" stroke="url(#lpGold)" stroke-width="13.5"/>
        <circle cx="37" cy="29" r="20" fill="none" stroke="#182a56" stroke-width="13.5" mask="url(#lpCross)"/>
      </svg>
      <span class="ltr">p</span>
    </span>
  </a>`;
}

/* A Boggie, used sparingly. Each child picks one in Showdown and it
   follows them into Loop — the one piece of the classroom's personality
   that belongs at home. */
const BOGGIES = {
  fizz:'Fizz', starpop:'Starpop', coco:'Coco', uni:'Uni', whizzle:'Whizzle',
  queenie:'Queenie', sharky:'Sharky', ragnar:'Ragnar', oneeye:'One Eye Jr.',
  spitseed:'Spitseed', zapjaw:'ZapJaw',
};
/* the real icon set, sized by context */
function ico(name, px, cls){
  return `<img class="ic-img ${cls||''}" src="icons/${name}.png" alt="" width="${px}" height="${px}"
           style="width:${px}px;height:${px}px" decoding="async">`;
}
function dimIcon(dim, px){ return dim.icon ? ico(dim.icon, px) : dim.ico }

function bog(slug, size, cls){
  return `<img class="bog bog-${size||'sm'} ${cls||''}" src="boggies/${slug}.png"
           alt="${BOGGIES[slug]||'Boggie'}" width="120" height="120" decoding="async">`;
}

/* Wraps whatever the page already put in <body> into the app shell. */
function mountApp(active){
  /* ?view=phone / ?view=desktop forces the view regardless of any saved
     preference — so a shared link always opens the way you intended, even
     for someone who toggled earlier. */
  const forced = new URLSearchParams(location.search).get('view');
  if (forced === 'phone' || forced === 'app')      LOOP.store.setView('app');
  else if (forced === 'desktop' || forced === 'web') LOOP.store.setView('web');
  CURRENT_VIEW = LOOP.store.viewPref() || defaultViewFor(active);
  const tier = LOOP.store.tier();
  const body = document.body;
  const existing = [...body.children];
  const app = el('div','app');
  const side = el('aside','side');
  side.innerHTML = `
    ${brandMark()}
    <nav class="mainnav">
      ${navItems().map(n=>`<a href="${n.href}" class="${n.id===active?'on':''}${n.tab?'':' notab'}"
          aria-label="${esc(n.label)}" ${n.id===active?'aria-current="page"':''}>
          <span class="ic">${n.ic}</span>
          <span class="gl">${n.navico
            ? `<img class="gl-off" src="icons/${n.navico}.png" alt=""><img class="gl-on" src="icons/${n.navico}-on.png" alt="">`
            : (n.glyph?ICON[n.glyph]:'')}</span>
          <span class="nlabel" data-web="${esc(n.label)}" data-app="${esc(n.tabLabel||n.label)}">${esc(n.label)}</span>
        </a>`).join('')}
      <button class="tab-fab" id="addFab" aria-label="Add from home">
        <span class="fab">${ICON.plus}</span>
        <span class="flabel">Add from home</span>
      </button>
    </nav>
    ${LOOP.deep() ? '' : `
    <div class="side-label">Also in Loop</div>
    <nav class="morenav">
      ${navMore().filter(n=>n.id!=='set').map(n=>`<a href="${n.href}" class="${n.id===active?'on':''}"><span class="ic">${n.ic}</span>${esc(n.label)}</a>`).join('')}
    </nav>`}
    <div class="side-label">Prototype surfaces</div>
    <nav>
      ${PROTO.map(n=>`<a href="${n.href}" class="${n.href.startsWith(active)?'on':''}"><span class="ic">${n.ic}</span>${n.label}</a>`).join('')}
    </nav>
    <div class="side-label">Plan</div>
    <div class="tier" id="tierToggle">
      <button data-t="family"    class="${tier==='family'?'on':''}">Family</button>
      <button data-t="connected" class="${tier==='connected'?'on':''}">Connected</button>
    </div>
    <div class="side-promo">
      ${bog(LOOP.store.boggie(ME), 'md', 'ring')}
      <div class="txt">
        <h5>Bring ClassCade home</h5>
        <p>Ask ${esc(LOOP.child(ME).first)} about ${esc(BOGGIES[LOOP.store.boggie(ME)])} this week.</p>
      </div>
    </div>`;
  const main = el('main','main');
  existing.forEach(n=>main.appendChild(n));
  const status = el('div','statusbar', `<span>9:41</span><div class="notch"></div><span>▮▮▮</span>`);
  const bd = el('div','sheet-bd');
  const sheet = el('div','sheet', moreSheet(active));
  app.appendChild(status); app.appendChild(side); app.appendChild(main);
  app.appendChild(bd); app.appendChild(sheet);
  const addSheet = el('div','sheet addsheet', `
    <div class="grab"></div>
    <div class="sec">Add from home</div>
    <p class="small muted" style="padding:0 12px 10px">One tap. It counts as a signal the same way the classroom's do.</p>
    <div class="m-chips" style="padding:0 12px">
      ${HOME_OBS.map(o=>`<button data-obs2="${o.id}">${o.emoji} ${esc(o.label)}</button>`).join('')}
    </div>
    <a class="btn block ghost" style="margin:14px 12px 0" href="ask.html">Or tell us what's worrying you →</a>
    <button class="btn block" style="margin:9px 12px 0" data-close2>Close</button>`);
  app.appendChild(addSheet);
  const closeSheet = ()=>{ bd.classList.remove('open'); sheet.classList.remove('open'); addSheet.classList.remove('open') };
  bd.onclick = closeSheet;
  sheet.querySelector('[data-close]').onclick = closeSheet;
  sheet.querySelectorAll('#sheetTier button').forEach(b=>{
    b.onclick = ()=>{ LOOP.store.setTier(b.dataset.t); location.reload() };
  });
  sheet.querySelectorAll('#sheetView button').forEach(b=>{
    b.onclick = ()=>{ LOOP.store.setView(b.dataset.v); location.reload() };
  });
  addSheet.querySelector('[data-close2]').onclick = closeSheet;
  addSheet.querySelectorAll('[data-obs2]').forEach(b=>b.onclick=()=>{
    LOOP.store.addHome(ME, b.dataset.obs2);
    closeSheet();
    toast('Logged: ' + HOME_OBS.find(x=>x.id===b.dataset.obs2).label);
    setTimeout(()=>location.reload(), 500);
  });
  side.querySelector('#addFab').onclick = ()=>{ bd.classList.add('open'); addSheet.classList.add('open') };
  /* in app view the Settings tab is a "More" sheet, so nothing is stranded */
  side.querySelector('.mainnav a[href="settings.html"]').addEventListener('click', e=>{
    if (!document.body.classList.contains('sm')) return;
    e.preventDefault();
    bd.classList.add('open'); sheet.classList.add('open');
  });
  body.appendChild(app);
  mountViewToggle();
  mountMobileBar(active);
  mountDepthGate();
  syncMode();
  window.addEventListener('resize', ()=>{ applyView(CURRENT_VIEW); });
  side.querySelectorAll('#tierToggle button').forEach(b=>{
    b.onclick = ()=>{ LOOP.store.setTier(b.dataset.t); location.reload() };
  });
}

/* Is this a phone? True in the App frame and on a small viewport, so every
   phone rule can be written once against body.sm instead of duplicated
   between a media query and body.appview. */
function syncMode(){
  const small = window.innerWidth <= 900 || document.body.classList.contains('appview');
  document.body.classList.toggle('sm', small);
  fitPhone();
}
/* Scale the phone frame down to fit a short window rather than squashing it. */
function fitPhone(){
  const avail = window.innerHeight - 84;
  const scale = Math.max(0.45, Math.min(1, avail / 844));
  document.documentElement.style.setProperty('--pscale', scale.toFixed(4));
}
/* iOS-style large title: it lives in the content and a compact bar takes over
   once you scroll past it. */
function mountMobileBar(active){
  const bar = el('header','mobilebar');
  const kid = FAMILY.find(f=>f.id===ME) || FAMILY[0];
  const page = (NAV.find(n=>n.id===active) || {label:'Loop'});
  bar.innerHTML = `
    <div class="mb-in">
      <span class="mb-title">${esc(page.label==='Home' ? 'Hi, '+PARENT.name : page.label)}</span>
      <span class="spacer"></span>
      <span class="mb-kid">${esc(kid.label.split(' ')[0])}</span>
      <div class="av g1" style="width:26px;height:26px;border-radius:8px;font-size:11px">${esc(kid.label[0])}</div>
    </div>`;
  document.body.appendChild(bar);
  const onScroll = () => {
    const y = (document.querySelector('.main')||document).scrollTop || window.scrollY || 0;
    document.body.classList.toggle('scrolled', y > 56);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  const main = document.querySelector('.main');
  if (main) main.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

/* First-time default. A parent product should be seen on a phone first, so
   the family surfaces open in the phone frame — but the concept page is a
   strategy document and the teacher view is a classroom surface, and both
   belong on a desktop. Once the visitor picks a side, their choice wins
   everywhere. */
function defaultViewFor(active){
  if (window.innerWidth < 900) return 'web';   // already a phone; no frame needed
  if (active === 'teacher.html') return 'web';   /* a classroom surface */
  return 'app';
}
let CURRENT_VIEW = 'web';

/* Web ⇄ App preview. Same markup, same data — the phone frame is CSS only,
   so anything that breaks in app view is genuinely broken. */
function mountViewToggle(){
  const mode = CURRENT_VIEW;
  applyView(mode);
  const t = el('div','viewtoggle');
  const dp = LOOP.store.depth() || 'lite';
  t.innerHTML = `
    <span class="vt-label">Preview as</span>
    <div class="vt-group">
      <button data-v="web" class="${mode==='web'?'on':''}">🖥 Desktop</button>
      <button data-v="app" class="${mode==='app'?'on':''}">📱 Phone</button>
    </div>
    <span class="vt-sep"></span>
    <span class="vt-label">Depth</span>
    <div class="vt-group">
      <button data-d="lite" class="${dp==='lite'?'on':''}">Lite</button>
      <button data-d="deep" class="${dp==='deep'?'on':''}">In Depth</button>
    </div>`;
  document.body.appendChild(t);
  t.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{
    LOOP.store.setView(b.dataset.v);
    CURRENT_VIEW = b.dataset.v;
    applyView(b.dataset.v);
    t.querySelectorAll('[data-v]').forEach(x=>x.classList.toggle('on', x===b));
  });
  /* depth changes what renders, so reload rather than trying to re-run
     every page's own render() from here */
  t.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{
    LOOP.store.setDepth(b.dataset.d); location.reload();
  });
}
function applyView(mode){
  /* Never draw a phone frame on an actual phone. If someone picked "Phone"
     on a desktop and then opens the same link on their handset, the stored
     preference would otherwise render a 392px frame inside a 375px screen —
     cut off, with the toggle sitting on top of the header. */
  const framed = mode === 'app' && window.innerWidth >= 900;
  document.body.classList.toggle('appview', framed);
  syncMode();
  /* the tab bar wants shorter labels than the sidebar does */
  $$('.mainnav .nlabel').forEach(n=>{ n.textContent = mode==='app' ? n.dataset.app : n.dataset.web });
  window.scrollTo(0,0);
}

function moreSheet(active){
  const tier = LOOP.store.tier();
  return `
    <div class="grab"></div>
    <div class="sec">Also in Loop</div>
    ${navMore().map(n=>
      `<a href="${n.href}" class="${n.id===active?'on':''}"><span class="ic">${n.ic}</span>${esc(n.label)}</a>`).join('')}
    <div class="sec">Plan</div>
    <div class="srow" style="padding-bottom:4px">
      <div class="tier" id="sheetTier" style="margin:0">
        <button data-t="family"    class="${LOOP.store.tier()==='family'?'on':''}">Family</button>
        <button data-t="connected" class="${LOOP.store.tier()==='connected'?'on':''}">Connected</button>
      </div>
    </div>
    <div class="srow"><span class="ic">${tier==='connected'?'🔗':'🏠'}</span>
      Loop ${esc(TIER_COPY[tier].name)}<span class="spacer"></span>
      <span class="chip ${tier==='connected'?'school':'plain'}">${tier==='connected'?'Included':esc(TIER_COPY.family.price)}</span></div>
    <div class="sec">Preview as</div>
    <div class="srow" style="padding-bottom:4px">
      <div class="tier" id="sheetView" style="margin:0;background:#eef3fb;box-shadow:inset 0 0 0 1px var(--line)">
        <button data-v="web" class="${CURRENT_VIEW==='web'?'on':''}" style="color:var(--muted)">🖥 Desktop</button>
        <button data-v="app" class="${CURRENT_VIEW==='app'?'on':''}" style="color:var(--muted)">📱 Phone</button>
      </div>
    </div>
    <div class="sec">Prototype surfaces</div>
    ${PROTO.map(n=>`<a href="${n.href}"><span class="ic">${n.ic}</span>${esc(n.label)}</a>`).join('')}
    <button class="btn block" style="margin-top:12px" data-close>Close</button>`;
}

/* Header tab strip — sits in the dark zone under the greeting and carries
   every surface, so the bottom bar can stay short. */
function headerTabs(active){
  return `
  <nav class="h-tabs">
    ${NAV.map(n=>`<a href="${n.href}" class="${n.id===active?'on':''}">
      <span class="ht-ic">${n.glyph?ICON[n.glyph]:n.ic}</span>
      <span class="ht-lb">${esc(n.tabLabel||n.label)}</span>
      ${n.id==='msgs'?'<i class="ht-dot"></i>':''}
    </a>`).join('')}
  </nav>`;
}

/* First run: pick a depth before seeing the app. Written so neither option
   reads as the lesser one — Lite is a choice, not a downgrade. */
function depthChooser(){
  return `
  <div class="dp-wrap">
    <div class="dp-card">
      <img src="art/loop-monster-sm.png" alt="" class="dp-mon">
      <div class="dp-eyebrow">Before you start</div>
      <h2>How much do you want to see?</h2>
      <p class="dp-sub">You can change this any time in Settings. Neither one hides anything the school
        needs you to do, or anything to do with your child's safety.</p>
      <div class="dp-opts">
        ${Object.keys(DEPTHS).map(k=>{const D=DEPTHS[k];return `
        <button class="dp-opt" data-depth="${k}">
          <span class="dp-name">${esc(D.name)}<span class="dp-tag">${esc(D.tag)}</span></span>
          <span class="dp-blurb">${esc(D.blurb)}</span>
          <span class="dp-list">${D.shows.map(x=>`<span class="dp-yes">✓ ${esc(x)}</span>`).join('')}
          ${D.hides.map(x=>`<span class="dp-no">— ${esc(x)}</span>`).join('')}</span>
        </button>`}).join('')}
      </div>
    </div>
  </div>`;
}
function mountDepthGate(){
  if (LOOP.store.depth()) return false;
  const w = el('div','dp-gate', depthChooser());
  document.body.appendChild(w);
  w.querySelectorAll('[data-depth]').forEach(b=>b.onclick=()=>{
    LOOP.store.setDepth(b.dataset.depth); location.reload();
  });
  return true;
}

/* greeting + child switcher */
function topline(sub, title){
  const kid = FAMILY.find(f=>f.id===ME) || FAMILY[0];
  return `
  <div class="topline">
    <div>
      ${title
        ? `<div class="page-eyebrow">${esc(PARENT.greeting)}, ${esc(PARENT.name)}</div>
           <h1 style="font-size:31px">${esc(title)}</h1>`
        : `<h1 style="font-size:31px"><span class="hide-sm">${esc(PARENT.greeting)}, ${esc(PARENT.name)}! 👋</span><span class="show-sm">Hi, ${esc(PARENT.name)}! 👋</span></h1>`}
      <p class="muted" style="margin-top:6px;font-size:15px">${sub}</p>
    </div>
    <div class="kidmenu" id="kidmenu">
      <div class="kidpick">
        <div class="av g1">${esc(kid.label[0])}</div>
        <div>
          <div style="font-weight:900;letter-spacing:-.02em">${esc(kid.label)}</div>
          <div class="meta">${esc(kid.grade)}${kid.teacher?' · '+esc(kid.teacher):' · school not connected'}</div>
        </div>
        <span style="color:var(--muted-2);font-weight:900">⌄</span>
      </div>
      <div class="drop">
        ${FAMILY.map(f=>`<button data-kid="${f.id}">
          <div class="av ${f.id===ME?'g1':'g2'}">${esc(f.label[0])}</div>
          <div><div style="font-weight:900;letter-spacing:-.02em">${esc(f.label)}</div>
          <div class="meta">${esc(f.grade)} · ${f.connected?'connected':'not connected'}</div></div>
        </button>`).join('')}
      </div>
    </div>
  </div>`;
}
function wireTopline(){
  const m = $('#kidmenu'); if(!m) return;
  const trigger = m.querySelector('.kidpick');
  if (!trigger){                       /* phone composition: pill IS the trigger */
    m.onclick = ()=>toast('Only Maya is seeded in this prototype.');
    return;
  }
  trigger.onclick = ()=>m.classList.toggle('open');
  m.querySelectorAll('[data-kid]').forEach(b=>b.onclick=()=>{
    m.classList.remove('open');
    if (b.dataset.kid!==ME) toast('Only Maya is seeded in this prototype.');
  });
}

/* one Whole Learner card */
function wlCard(x){
  const lvl = LOOP.LEVEL_LABEL[x.level];
  return `
  <div class="wl-card" data-dim="${x.dim.id}">
    <div class="tile" style="background:${x.dim.tint}">${dimIcon(x.dim,18)}</div>
    <div class="nm">${esc(x.dim.name)}</div>
    <div class="st" style="color:${x.cold?'var(--muted-2)':x.dim.color}">
      ${lvl}${x.cold?'':' '+LOOP.ARROW[x.dir]}</div>
    ${!LOOP.deep() ? '' : `<div class="bar"><i style="width:${x.cold?10:x.pct}%;background:${x.cold?'#c9d6ec':x.dim.color}"></i></div>`}
  </div>`;
}

/* list-style dimension row — used on the teacher surface */
function dimRow(x, opts){
  opts = opts||{};
  const lvl = LOOP.LEVEL_LABEL[x.level], tone = LOOP.LEVEL_TONE[x.level];
  return `
    <div class="src" style="align-items:center;padding:11px 0">
      <div class="dim-ico" style="background:${x.dim.tint};box-shadow:none">${dimIcon(x.dim,19)}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px">
          <h4 style="margin:0">${x.dim.name}</h4>
          <span class="trend ${LOOP.ARROW_CLASS[x.dir]}">${x.cold?'':LOOP.ARROW[x.dir]}</span>
          <span class="spacer"></span>
          <span class="chip ${tone}">${lvl}</span>
        </div>
        ${!LOOP.deep() ? '' : `<div class="meter" style="margin-top:7px"><i style="width:${x.cold?12:x.pct}%;background:${x.cold?'#c9d6ec':x.dim.color}"></i></div>`}
        ${(opts.sub!==false && LOOP.deep())?`<div class="tiny muted" style="margin-top:6px">${x.cold
            ? 'Not enough signals yet'
            : `${x.count} signal${x.count===1?'':'s'} · ${x.sources.map(s=>({school:'school',home:'home',child:'check-ins'}[s]||s)).join(' + ')}`}</div>`:''}
      </div>
    </div>`;
}

function sourcedLine(kind, label, text){
  return `<div class="src"><div class="src-key ${kind}">${label}</div><div class="src-body">${text}</div></div>`;
}

/* folds open on a wide screen, closed on a phone */
function wideScreen(){
  return window.matchMedia('(min-width:901px)').matches
      && !document.body.classList.contains('appview');
}
/* wrap a block in a fold that only actually folds on small screens */
function foldable(title, body, extraStyle){
  return `<details class="fold" ${wideScreen()?'open':''} style="${extraStyle||''}">
    <summary>${esc(title)}</summary><div class="foldbody">${body}</div></details>`;
}

/* a toast with an action — logging must be undoable */
function toastUndo(msg, undo){
  let t=$('.toast'); if(!t){ t=el('div','toast'); document.body.appendChild(t) }
  t.innerHTML = `<span>${esc(msg)}</span><button class="t-undo">Undo</button>`;
  t.classList.add('show','with-action');
  clearTimeout(toastTimer);
  t.querySelector('.t-undo').onclick = ()=>{ t.classList.remove('show','with-action'); undo&&undo() };
  toastTimer = setTimeout(()=>t.classList.remove('show','with-action'), 7000);
}

let toastTimer;
function toast(msg){
  let t = $('.toast');
  if (!t){ t = el('div','toast'); document.body.appendChild(t) }
  t.textContent = msg;
  requestAnimationFrame(()=>t.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}
