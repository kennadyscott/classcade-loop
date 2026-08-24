/* ClassCade Loop — app shell: sidebar, child switcher, tier toggle, helpers */

const el = (tag, cls, html) => { const n=document.createElement(tag); if(cls)n.className=cls; if(html!=null)n.innerHTML=html; return n };
const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const NAV = [
  { id:'home',   href:'parent.html',   ic:'🏠', label:'Home',     tab:true },
  { id:'growth', href:'growth.html',   ic:'🌱', label:'Growth',   tab:true },
  { id:'ask',    href:'ask.html',      ic:'💬', label:'Ask',      tab:true },
  { id:'school', href:'school.html',   ic:'🏫', label:'School',   tab:true },
  { id:'kids',   href:'kids.html',     ic:'👥', label:'My Kids' },
  { id:'msgs',   href:'messages.html', ic:'✉️', label:'Messages' },
  { id:'set',    href:'settings.html', ic:'⚙️', label:'Settings', tab:true, tabLabel:'More', tabIc:'⚙️' },
];
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
function bog(slug, size, cls){
  return `<img class="bog bog-${size||'sm'} ${cls||''}" src="boggies/${slug}.png"
           alt="${BOGGIES[slug]||'Boggie'}" width="120" height="120" loading="lazy">`;
}

/* Wraps whatever the page already put in <body> into the app shell. */
function mountApp(active){
  const tier = LOOP.store.tier();
  const body = document.body;
  const existing = [...body.children];
  const app = el('div','app');
  const side = el('aside','side');
  side.innerHTML = `
    ${brandMark()}
    <nav class="mainnav">
      ${NAV.map(n=>`<a href="${n.href}" class="${n.id===active?'on':''}${n.tab?'':' notab'}">
          <span class="ic">${n.ic}</span>
          <span class="nlabel" data-web="${esc(n.label)}" data-app="${esc(n.tabLabel||n.label)}">${esc(n.label)}</span>
        </a>`).join('')}
    </nav>
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
  const closeSheet = ()=>{ bd.classList.remove('open'); sheet.classList.remove('open') };
  bd.onclick = closeSheet;
  sheet.querySelector('[data-close]').onclick = closeSheet;
  /* in app view the Settings tab is a "More" sheet, so nothing is stranded */
  side.querySelector('.mainnav a[href="settings.html"]').addEventListener('click', e=>{
    if (!document.body.classList.contains('appview')) return;
    e.preventDefault();
    bd.classList.add('open'); sheet.classList.add('open');
  });
  body.appendChild(app);
  mountViewToggle();
  side.querySelectorAll('#tierToggle button').forEach(b=>{
    b.onclick = ()=>{ LOOP.store.setTier(b.dataset.t); location.reload() };
  });
}

/* Web ⇄ App preview. Same markup, same data — the phone frame is CSS only,
   so anything that breaks in app view is genuinely broken. */
function mountViewToggle(){
  const mode = LOOP.store.view();
  applyView(mode);
  const t = el('div','viewtoggle');
  t.innerHTML = `
    <button data-v="web" class="${mode==='web'?'on':''}">🖥 Web</button>
    <button data-v="app" class="${mode==='app'?'on':''}">📱 App</button>`;
  document.body.appendChild(t);
  t.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    LOOP.store.setView(b.dataset.v);
    applyView(b.dataset.v);
    t.querySelectorAll('button').forEach(x=>x.classList.toggle('on', x===b));
  });
}
function applyView(mode){
  document.body.classList.toggle('appview', mode==='app');
  /* the tab bar wants shorter labels than the sidebar does */
  $$('.mainnav .nlabel').forEach(n=>{ n.textContent = mode==='app' ? n.dataset.app : n.dataset.web });
  window.scrollTo(0,0);
}

function moreSheet(active){
  const tier = LOOP.store.tier();
  return `
    <div class="grab"></div>
    <div class="sec">More</div>
    ${NAV.filter(n=>!n.tab || n.id==='set').map(n=>
      `<a href="${n.href}" class="${n.id===active?'on':''}"><span class="ic">${n.ic}</span>${esc(n.label)}</a>`).join('')}
    <div class="sec">Plan</div>
    <div class="srow"><span class="ic">${tier==='connected'?'🔗':'🏠'}</span>
      Loop ${esc(TIER_COPY[tier].name)}<span class="spacer"></span>
      <span class="chip ${tier==='connected'?'school':'plain'}">${tier==='connected'?'Included':esc(TIER_COPY.family.price)}</span></div>
    <div class="sec">Prototype surfaces</div>
    ${PROTO.map(n=>`<a href="${n.href}"><span class="ic">${n.ic}</span>${esc(n.label)}</a>`).join('')}
    <button class="btn block" style="margin-top:12px" data-close>Close</button>`;
}

/* greeting + child switcher */
function topline(sub){
  const kid = FAMILY.find(f=>f.id===ME) || FAMILY[0];
  return `
  <div class="topline">
    <div>
      <h1 style="font-size:31px"><span class="hide-sm">${esc(PARENT.greeting)}, ${esc(PARENT.name)}! 👋</span><span class="show-sm">Hi, ${esc(PARENT.name)}! 👋</span></h1>
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
  m.querySelector('.kidpick').onclick = ()=>m.classList.toggle('open');
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
    <div class="tile" style="background:${x.dim.tint}">${x.dim.ico}</div>
    <div class="nm">${esc(x.dim.name)}</div>
    <div class="st" style="color:${x.cold?'var(--muted-2)':x.dim.color}">
      ${lvl}${x.cold?'':' '+LOOP.ARROW[x.dir]}</div>
    <div class="bar"><i style="width:${x.cold?10:x.pct}%;background:${x.cold?'#c9d6ec':x.dim.color}"></i></div>
  </div>`;
}

/* list-style dimension row — used on the teacher surface */
function dimRow(x, opts){
  opts = opts||{};
  const lvl = LOOP.LEVEL_LABEL[x.level], tone = LOOP.LEVEL_TONE[x.level];
  return `
    <div class="src" style="align-items:center;padding:11px 0">
      <div class="dim-ico" style="background:${x.dim.tint};box-shadow:none">${x.dim.ico}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px">
          <h4 style="margin:0">${x.dim.name}</h4>
          <span class="trend ${LOOP.ARROW_CLASS[x.dir]}">${x.cold?'':LOOP.ARROW[x.dir]}</span>
          <span class="spacer"></span>
          <span class="chip ${tone}">${lvl}</span>
        </div>
        <div class="meter" style="margin-top:7px"><i style="width:${x.cold?12:x.pct}%;background:${x.cold?'#c9d6ec':x.dim.color}"></i></div>
        ${opts.sub!==false?`<div class="tiny muted" style="margin-top:6px">${x.cold
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

let toastTimer;
function toast(msg){
  let t = $('.toast');
  if (!t){ t = el('div','toast'); document.body.appendChild(t) }
  t.textContent = msg;
  requestAnimationFrame(()=>t.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}
