/* ClassCade Loop — signal engine + narrator
   Turns small noticed things into a dimension read, then into parent language.
   Rules carried over from the Root & Rise brief:
     · rolling 21-day, recency-weighted
     · never a raw score to a parent — plain language only
     · 3+ signals before we say anything; cold-start otherwise
     · no single event may move a dimension */

const LOOP = (() => {

  /* ── storage ─────────────────────────────────────────── */
  const K = {
    tier:'loop.v1.tier', resp:'loop.v1.responses', ack:'loop.v1.acks',
    home:'loop.v1.homeObs', child:'loop.v1.childCheckins', stars:'loop.v1.stars',
    teach:'loop.v1.teacherObs', focus:'loop.v1.focus',
    talked:'loop.v1.talked', seed:'loop.v1.starterSeed',
    view:'loop.v1.view', bog:'loop.v1.boggie', prefs:'loop.v1.prefs',
    levels:'loop.v1.levels', seen:'loop.v1.seen', ritual:'loop.v1.ritual',
    chores:'loop.v1.chores', choreLog:'loop.v1.choreLog', spent:'loop.v1.spent',
    fw:'loop.v1.framework', goals:'loop.v1.goals', checkin:'loop.v1.checkin',
    flags:'loop.v1.flags', flagsExtra:'loop.v1.flagsExtra',
  };
  const rd = (k,f)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):f }catch(e){ return f } };
  const wr = (k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)) }catch(e){} };

  const store = {
    tier:      ()=> rd(K.tier,'connected'),
    setTier:   t => wr(K.tier,t),
    responses: ()=> rd(K.resp,{}),
    respond:  (id,type,note)=>{ const r=store.responses(); r[id]={type,note:(note||'').slice(0,NOTE_CAP),at:TODAY}; wr(K.resp,r); return r[id] },
    unrespond:(id)=>{ const r=store.responses(); delete r[id]; wr(K.resp,r) },
    acks:      ()=> rd(K.ack,{}),
    ack:      (id)=>{ const a=store.acks(); a[id]={at:TODAY}; wr(K.ack,a) },
    homeObs:   ()=> rd(K.home,[]),
    addHome:  (student,obsId,note,when)=>{ const l=store.homeObs();
                 const c = child(student), o = HOME_OBS.find(x=>x.id===obsId);
                 const base = (o.phrase||'').replace(/\{subj\}/g,c.subj).replace(/\{poss\}/g,c.poss).replace(/\{obj\}/g,c.obj);
                 l.push({ s:student, src:'home', sig:obsId, v:1, d:when||TODAY,
                          detail: base, note:(note||'').slice(0,NOTE_CAP) || null,
                          user:true, id:'h'+l.length+'_'+obsId });
                 wr(K.home,l); return l[l.length-1]; },
    removeHome:(id)=>{ wr(K.home, store.homeObs().filter(e=>e.id!==id)) },
    updateHome:(id,note)=>{ const l=store.homeObs();
                 const e=l.find(x=>x.id===id); if(e) e.note=(note||'').slice(0,NOTE_CAP)||null; wr(K.home,l) },
    lastHome:  ()=>{ const l=store.homeObs(); return l.length?l[l.length-1]:null },
    teacherObs:()=> rd(K.teach,[]),
    addTeacher:(student,dim,note)=>{ const l=store.teacherObs(); l.push({s:student,dim,note,d:TODAY}); wr(K.teach,l) },
    checkins:  ()=> rd(K.child,[]),
    addCheckin:(student,promptId,answerIdx)=>{ const l=store.checkins().filter(c=>!(c.s===student&&c.p===promptId&&c.d===TODAY));
                 l.push({s:student,p:promptId,a:answerIdx,d:TODAY}); wr(K.child,l) },
    todayCheckins:(student)=>store.checkins().filter(c=>c.s===student&&c.d===TODAY),
    stars:     (student)=> rd(K.stars,{})[student+'|'+TODAY]||[],
    toggleStar:(student,i)=>{ const all=rd(K.stars,{}); const k=student+'|'+TODAY; const cur=all[k]||[];
                 all[k]= cur.includes(i)? cur.filter(x=>x!==i) : cur.concat(i); wr(K.stars,all); return all[k] },
    focus:     (student)=> rd(K.focus,{})[student]||null,
    setFocus:  (student,dim)=>{ const f=rd(K.focus,{}); f[student]=dim; wr(K.focus,f) },
    talked:    ()=> rd(K.talked,{}),
    toggleTalked:(key)=>{ const t=store.talked();
                 if(t[key]){ delete t[key] } else { t[key]={at:TODAY} }
                 wr(K.talked,t); return !!t[key] },
    starterSeed:()=> rd(K.seed,0),
    bumpStarterSeed:()=>{ wr(K.seed, (rd(K.seed,0)+1) % 97) },
    /* null until the visitor actually picks one — the page then chooses a
       sensible default, so a first-time viewer lands in the right frame. */
    viewPref:  ()=> rd(K.view,null),
    /* published levels — see publishLevel(). A status word is a promise, so
       it is written down rather than recomputed fresh on every paint. */
    levels:    ()=> rd(K.levels,{}),
    setLevel:  (k,rec)=>{ const m=rd(K.levels,{}); m[k]=rec; wr(K.levels,m) },
    view:      ()=> rd(K.view,'web'),
    setView:   v => wr(K.view,v),
    /* each child's Boggie follows them from Showdown into Loop */
    boggie:    (s)=> (rd(K.bog,{})[s]) || DEFAULT_BOGGIE[s] || 'fizz',
    setBoggie: (s,b)=>{ const m=rd(K.bog,{}); m[s]=b; wr(K.bog,m) },
    prefs:     ()=> Object.assign({}, DEFAULT_PREFS, rd(K.prefs,{})),
    setPref:   (k,v)=>{ const p=rd(K.prefs,{}); p[k]=v; wr(K.prefs,p) },
    /* ── weekly rhythm ────────────────────────────────────
       The product is pitched as a ritual, so the week needs a date, a
       new/seen state, and a way to be finished. */
    seen:      ()=> rd(K.seen,{}),
    markSeen:  (id)=>{ const m=store.seen(); m[id]={at:TODAY}; wr(K.seen,m) },
    isNew:     (id)=> !store.seen()[id],
    ritual:    ()=> rd(K.ritual,{})[WEEK_START] || {},
    ritualDone:(step)=>{ const all=rd(K.ritual,{}); const w=all[WEEK_START]||{};
                 w[step]=TODAY; all[WEEK_START]=w; wr(K.ritual,all) },
    ritualSteps:()=>{
      const w = store.ritual();
      const steps = [
        { id:'read',   label:'Read this week', done:!!w.read },
        { id:'talk',   label:'Ask tonight\'s question', done:!!w.talk },
        { id:'notice', label:'Log something you noticed', done:!!w.notice },
      ];
      return { steps, complete: steps.every(s=>s.done) };
    },
    chores:    (s)=> (rd(K.chores,{})[s]) || DEFAULT_CHORES[s] || [],
    setChores: (s,ids)=>{ const m=rd(K.chores,{}); m[s]=ids; wr(K.chores,m) },
    toggleChore:(s,id)=>{ const cur=store.chores(s);
                 store.setChores(s, cur.includes(id)?cur.filter(x=>x!==id):cur.concat(id)) },
    choreLog:  ()=> rd(K.choreLog,[]),
    isDone:    (s,id,dd)=> store.choreLog().some(e=>e.s===s&&e.c===id&&e.d===(dd||TODAY)),
    markChore: (s,id,dd)=>{ const l=store.choreLog(); const day2=dd||TODAY;
                 const i=l.findIndex(e=>e.s===s&&e.c===id&&e.d===day2);
                 if(i>=0) l.splice(i,1); else l.push({s:s,c:id,d:day2});
                 wr(K.choreLog,l); return i<0; },
    spent:     (s)=> (rd(K.spent,{})[s]||[]),
    spend:     (s,rid)=>{ const m=rd(K.spent,{}); m[s]=(m[s]||[]).concat({r:rid,d:TODAY}); wr(K.spent,m) },
    framework: ()=> rd(K.fw,'whole-learner'),
    setFramework:(id)=>{ wr(K.fw,id); applyFramework(id) },
    goals:     (s)=> rd(K.goals,{})[s] || null,
    setGoal:   (s,g)=>{ const m=rd(K.goals,{}); m[s]=g; wr(K.goals,m) },
    clearGoal: (s)=>{ const m=rd(K.goals,{}); delete m[s]; wr(K.goals,m) },
    checkins:  ()=> rd(K.checkin,{}),
    flagsDone: ()=> rd(K.flags,{}),
    markFlag:  (id)=>{ const m=rd(K.flags,{}); m[id]={at:TODAY}; wr(K.flags,m) },
    unmarkFlag:(id)=>{ const m=rd(K.flags,{}); delete m[id]; wr(K.flags,m) },
    sentFlags: ()=> rd(K.flagsExtra,[]),
    sendFlag:  (f)=>{ const l=rd(K.flagsExtra,[]); l.push(f); wr(K.flagsExtra,l); return f },
    reset:     ()=> Object.values(K).forEach(k=>localStorage.removeItem(k)),
  };

  /* ── time ────────────────────────────────────────────── */
  const day = s => new Date(s+'T00:00:00').getTime()/864e5;
  const ago = s => Math.round(day(TODAY)-day(s));
  const thisWeek = s => day(s) >= day(WEEK_START);
  const WINDOW = 21;
  const recency = s => Math.exp(-ago(s)/13);            // ~half-life of 9 days

  /* how much we trust a source. Showdown is passive and repeated, so it
     outranks a parent tap, which outranks a child's single-tap mood. */
  const TRUST = { school:1, home:.85 };

  /* ── events ──────────────────────────────────────────── */
  /* Two sources only: the classroom (Showdown, passive) and the home
     (the parent, by tap). There is deliberately no child data path —
     see the COPPA note above CHILD_PROMPTS in loop.data.js. */
  function events(studentId){
    const c = child(studentId);
    const fixPronouns = t => String(t||'')
      .replace(/\{subj\}/g,c.subj).replace(/\{poss\}/g,c.poss).replace(/\{obj\}/g,c.obj)
      .replace(/\bthey weren't\b/g, c.subj+(c.isPlural?" weren't":" wasn't"))
      .replace(/\bthey were\b/g, c.subj+(c.isPlural?' were':' was'))
      .replace(/\btheir way\b/g, c.poss+' way');
    const extra = store.homeObs().filter(e=>e.s===studentId)
      .map(e=>Object.assign({}, e, { detail: fixPronouns(e.detail) }));
    // A contribution kept up all week is a pattern, so it counts as ONE
    // signal — never one per tick, which would let chores outrank the
    // classroom simply by being daily.
    const choreEvents = store.chores(studentId).map(id=>{
      const c = CHORES.find(x=>x.id===id);
      if (!c || c.kind!=='contribution') return null;
      const days = choreStreak(studentId, id);
      if (days < STREAK_FOR_SIGNAL) return null;
      const w = {}; w[c.dim] = 0.7;
      return { s:studentId, src:'home', sig:'chore_'+id, v:0.8, d:TODAY, chore:true, w:w,
               detail:'kept up '+c.label.toLowerCase()+' '+days+' days this week' };
    }).filter(Boolean);
    return SEED_EVENTS.filter(e=>e.s===studentId)
      .concat(extra, choreEvents)
      .filter(e=>ago(e.d)<=WINDOW && ago(e.d)>=0);
  }

  function weightsFor(e){
    if (e.wOverride) return e.wOverride;
    if (e.w) return e.w;                 // seeded child quotes carry their own mapping
    if (e.src==='home'){ const o=HOME_OBS.find(x=>x.id===e.sig); return o?o.w:{} }
    const s = SIGNALS[e.sig]; return s?s.w:{};
  }

  /* ── aggregation ─────────────────────────────────────── */
  function read(studentId, tier){
    tier = tier || store.tier();
    const evs = events(studentId).filter(e => tier==='connected' ? true : e.src!=='school');
    const out = {};
    DIMENSIONS.forEach(dim=>{
      const parts = [];
      evs.forEach(e=>{
        const w = weightsFor(e)[dim.id];
        if (!w) return;
        parts.push({ e: Object.assign({}, e, { raw: e.v*w }), c: e.v * w * recency(e.d) * TRUST[e.src], raw: e.v*w });
      });
      const score = parts.reduce((a,p)=>a+p.c,0);
      const now   = parts.filter(p=>thisWeek(p.e.d));
      const prior = parts.filter(p=>!thisWeek(p.e.d));
      const nowAvg   = now.length   ? now.reduce((a,p)=>a+p.raw,0)/now.length     : 0;
      const priorAvg = prior.length ? prior.reduce((a,p)=>a+p.raw,0)/prior.length : 0;

      /* guardrail: a direction needs at least two events pointing the same way
         this week. One good day is not a trend. */
      const up   = now.filter(p=>p.raw>0).length;
      const down = now.filter(p=>p.raw<0).length;
      const delta = nowAvg - priorAvg;
      let dir = 'flat';
      if (prior.length===0 && now.length>=3) dir = nowAvg>.35?'up':(nowAvg<-.35?'down':'flat');
      else if (delta>.28  && up>=2)   dir='up';
      else if (delta<-.28 && down>=2) dir='down';

      const cold = parts.length < 3;
      const raw  = rawLevel(score, dir, cold);
      /* A status word must not flip because one observation nudged a score
         across a boundary — that is exactly what makes a parent stop
         believing the read. Publishing applies hysteresis and the same
         "needs a pattern" rule the direction arrow already had. */
      const pub  = publishLevel(studentId, dim.id, raw, score, parts.length);
      const level = pub.level;

      out[dim.id] = {
        dim, score, count:parts.length, dir, level, cold,
        rawLevel: raw,
        changedFrom: pub.prev || null,
        changedAt:   pub.prev ? pub.at : null,
        asOf: TODAY,
        delta, nowAvg, priorAvg,
        pct: Math.max(8, Math.min(100, Math.round(((score+2.4)/5.6)*100))),
        events: parts.sort((a,b)=>day(b.e.d)-day(a.e.d)).map(p=>p.e),
        weekEvents: now.sort((a,b)=>Math.abs(b.raw)-Math.abs(a.raw)).map(p=>p.e),
        sources: [...new Set(parts.map(p=>p.e.src))],
      };
    });
    return out;
  }

  /* Status words only — never a number, never a comparison. See LANGUAGE in loop.data.js. */
  /* ── level publication ────────────────────────────────────
     rawLevel is what the maths says right now. publishLevel is what the
     parent is shown, and it only moves when the evidence moved materially
     AND more than one new signal arrived. */
  const HYSTERESIS = 0.3;      /* score must move this much to change a word */
  const MIN_NEW    = 2;        /* and at least this many new signals */
  function rawLevel(score, dir, cold){
    return cold ? 'cold'
      : score>=2.0 ? 'thriving'
      : score>=0.8 ? 'growing'
      : (score>0 && dir==='up') ? 'emerging'
      : score>-0.8 ? 'steady'
      : 'watch';
  }
  function publishLevel(studentId, dimId, raw, score, count){
    const key = studentId+'|'+dimId;
    const all = store.levels();
    const rec = all[key];

    /* first read, or either side is cold — publish straight through */
    if (!rec || rec.level === 'cold' || raw === 'cold'){
      if (rec && rec.level === raw) return rec;
      const n = { level:raw, scoreAt:score, countAt:count, at:TODAY, prev:rec?rec.level:null };
      store.setLevel(key, n); return n;
    }
    if (raw === rec.level) return rec;

    /* The baseline is the state at LAST PUBLICATION and is never rewritten
       until the word actually changes — otherwise the "2 new signals" test
       resets on every paint and the level can never move again. */
    const moved  = Math.abs(score - rec.scoreAt) >= HYSTERESIS;
    const enough = (count - rec.countAt) >= MIN_NEW;
    if (moved && enough){
      const n = { level:raw, scoreAt:score, countAt:count, at:TODAY, prev:rec.level };
      store.setLevel(key, n); return n;
    }
    return rec;
  }

  const LEVEL_LABEL = { thriving:'Strong', growing:'Growing', emerging:'Building', steady:'On track', watch:'Needs attention', cold:'Getting to know' };
  const LEVEL_TONE  = { thriving:'good', growing:'good', emerging:'good', steady:'plain', watch:'watch', cold:'plain' };
  const ARROW = { up:'↑', flat:'→', down:'↓' };
  const ARROW_CLASS = { up:'up', flat:'flat', down:'down' };

  /* ── narrator ────────────────────────────────────────── */
  const NUM = ['zero','once','twice','three times','four times','five times','six times'];
  const child = id => {
    const c = ROSTER.find(r=>r.id===id);
    const she = c.pron==='she', he = c.pron==='he';
    return Object.assign({}, c, {
      subj: she?'she':he?'he':'they',
      obj:  she?'her':he?'him':'them',
      poss: she?'her':he?'his':'their',
      Subj: she?'She':he?'He':'They',
      isPlural: !she && !he,
    });
  };

  function joinList(a){
    if (a.length===0) return '';
    if (a.length===1) return a[0];
    if (a.length===2) return a[0]+' and '+a[1];
    return a.slice(0,-1).join(', ')+' and '+a[a.length-1];
  }

  /* Groups this week's events from one source into one readable sentence,
     with real counts. This is the step that turns "+1 Participation ×3"
     into something a parent would actually read. */
  function evidence(d, r, src){
    const sign = r.dir==='up' ? 1 : r.dir==='down' ? -1 : 0;
    const evs = r.weekEvents.filter(e=>
      e.src===src && !e.quote && (sign===0 ? true : Math.sign(e.raw)===sign));
    if (!evs.length) return null;
    const groups = {};
    evs.forEach(e=>{ (groups[e.detail] = groups[e.detail] || []).push(e) });
    const phrases = Object.keys(groups).slice(0,3).map(detail=>{
      const n = groups[detail].length;
      return n>1 ? `${detail} ${NUM[Math.min(n,6)]}` : detail;
    });
    const lead = src==='school' ? d.Subj : d.Subj;
    return `${lead} ${joinList(phrases)}.`;
  }

  /* Hero version of the evidence: one short stat, not a sentence.
     "3× volunteered an answer" reads at a glance; the full sentence lives
     on the insight card. */
  function shortStat(r, src){
    const sign = r.dir==='up' ? 1 : r.dir==='down' ? -1 : 0;
    const evs = r.weekEvents.filter(e=>e.src===src && !e.quote && (sign===0?true:Math.sign(e.raw)===sign));
    if (!evs.length) return null;
    if (src==='school'){
      /* group by SIGNAL, not by wording — "3× recognized for participation"
         is what a parent can hold in their head at a glance. */
      const g = {};
      evs.forEach(e=>{ (g[e.sig]=g[e.sig]||[]).push(e) });
      const top = Object.keys(g).sort((a,b)=>g[b].length-g[a].length)[0];
      const n = g[top].length, label = (SIGNALS[top]||{label:top}).label.toLowerCase();
      return n>1 ? `${n}× recognized for ${label}` : `Recognized for ${label}`;
    }
    /* home stays a sentence — parents wrote it, it should sound like them */
    const g = {};
    evs.forEach(e=>{ (g[e.detail]=g[e.detail]||[]).push(e) });
    const top = Object.keys(g).sort((a,b)=>g[b].length-g[a].length)[0];
    const n = g[top].length;
    const txt = top.charAt(0).toUpperCase()+top.slice(1);
    return n>1 ? `${txt}, ${n===2?'twice':n+' times'}` : txt;
  }

  /* What the child said, as relayed by their parent. */
  function childVoice(d, r){
    const q = r.weekEvents.find(e=>e.quote);
    return q ? q.detail : null;
  }

  /* One insight = one dimension, fully narrated. */
  function insight(studentId, dimId, tier){
    const d = child(studentId);
    const r = read(studentId, tier)[dimId];
    const id = `${studentId}|${dimId}|${WEEK_START}`;
    if (r.cold) return {
      id, cold:true, r, dim:r.dim, child:d,
      head: COLD_START.head(d, r.dim),
      body: COLD_START.body(d, r.dim),
    };
    const n = NARRATIVE[dimId][r.dir];
    return {
      id, cold:false, r, dim:r.dim, child:d, dir:r.dir,
      head:  n.head(d),
      school: evidence(d, r, 'school'),
      home:   evidence(d, r, 'home'),
      schoolStat: shortStat(r, 'school'),
      homeStat:   shortStat(r, 'home'),
      voice:  childVoice(d, r),
      why:    r.dim.why,
      talk:   n.talk(d),
      tryAt:  n.tryAt(d),
      response: store.responses()[id] || null,
    };
  }

  /* The one or two dimensions worth a parent's attention this week:
     biggest movement first, then anything that needs attention. */
  function headlines(studentId, tier, n){
    const r = read(studentId, tier);
    const scored = DIMENSIONS.map(dim=>{
      const x = r[dim.id];
      /* "Something we're noticing" means CHANGE. A dimension that has been
         thriving all year is not news; the week it started moving is. So
         priority is driven by delta, with standing score only as a tiebreak. */
      let priority = 0;
      if (x.cold) priority = -10;
      else if (x.level==='watch') priority = 8 + Math.abs(x.delta);
      else if (x.dir==='down') priority = 6 + Math.abs(x.delta)*2;
      /* rising from a low base is more newsworthy than a strength that was
         already a strength — "thriving, still thriving" is not the headline */
      else if (x.dir==='up') priority = 4 + x.delta*3 - Math.max(0, x.priorAvg)*1.6 + Math.min(.6, x.score*.1);
      else priority = 1 + Math.min(1, x.score/3);
      return { dim, x, priority };
    }).sort((a,b)=>b.priority-a.priority);
    return scored.slice(0, n||2).map(s=>insight(studentId, s.dim.id, tier));
  }

  /* What the teacher sees coming back from home — never a wall of text. */
  function homeSignal(studentId){
    const resp = store.responses();
    const out = [];
    Object.keys(resp).forEach(k=>{
      const [sid, dimId] = k.split('|');
      if (sid!==studentId) return;
      const d = child(sid), meta = RESPONSES.find(x=>x.id===resp[k].type);
      const dim = DIMENSIONS.find(x=>x.id===dimId);
      out.push({ key:k, dim, type:resp[k].type, tone:meta.tone, emoji:meta.emoji,
                 line: meta.teacherLine(d), note: resp[k].note, acked: !!store.acks()[k] });
    });
    const obs = store.homeObs().filter(e=>e.s===studentId && e.user);
    obs.forEach((o,i)=>{
      const meta = HOME_OBS.find(h=>h.id===o.sig), d = child(studentId);
      out.push({ key:`obs|${studentId}|${i}`, dim:null, type:'obs', tone:'good', emoji:meta.emoji,
                 line:`${d.first}'s family logged: ${meta.label.toLowerCase()}.`, note:o.detail===meta.phrase?null:o.detail,
                 acked: !!store.acks()[`obs|${studentId}|${i}`] });
    });
    return out;
  }

  function classView(tier){
    return ROSTER.map(s=>{
      const r = read(s.id, tier);
      const moved = DIMENSIONS.map(d=>r[d.id]).filter(x=>!x.cold && x.dir!=='flat')
        .sort((a,b)=>Math.abs(b.score)-Math.abs(a.score));
      return { student:child(s.id), read:r, moved, home: s.linked ? homeSignal(s.id) : [] };
    });
  }

  /* ── Showdown economy ─────────────────────────────────────
     Coins are shown because a parent already hears about them at
     dinner. They are never the headline and never feed a dimension. */
  function coins(studentId){
    const evs = events(studentId).filter(e=>e.src==='school' && thisWeek(e.d) && e.v>0);
    let total = 0; const by = {};
    evs.forEach(e=>{ const c = Math.round((COIN_VALUE[e.sig]||0) * e.v); total += c; by[e.sig]=(by[e.sig]||0)+c });
    const top = Object.keys(by).sort((a,b)=>by[b]-by[a])[0];
    return { total, top: top ? { sig:top, label:SIGNALS[top].label, pct: Math.round(by[top]/total*100) } : null };
  }

  /* What happened at school — the raw feed, newest first. */
  function activity(studentId, n){
    return events(studentId).filter(e=>e.src==='school')
      .sort((a,b)=>day(b.d)-day(a.d)).slice(0, n||6)
      .map(e=>({ d:e.d, sig:SIGNALS[e.sig], detail:e.detail, v:e.v,
                 coins: e.v>0 ? Math.round((COIN_VALUE[e.sig]||0)*e.v) : 0 }));
  }

  /* Today's 5-minute moment. Deterministic per day so it doesn't churn
     if the parent opens the app twice. */
  function moment(studentId, dimId){
    const dim = dimId || (store.focus(studentId) || (headlines(studentId, null, 1)[0]||{}).dim?.id) || 'connection';
    const list = MOMENTS[dim] || MOMENTS.connection;
    const i = Math.abs(ago(WEEK_START)) % list.length;
    return Object.assign({ dim: DIMENSIONS.find(d=>d.id===dim) }, list[i]);
  }

  /* Conference questions built from the child's actual read. */
  function conference(studentId, tier){
    const r = read(studentId, tier);
    return DIMENSIONS.filter(d=>!r[d.id].cold)
      .sort((a,b)=>Math.abs(r[b.id].delta)-Math.abs(r[a.id].delta))
      .slice(0,4)
      .map(d=>({ dim:d, q: CONFERENCE[d.id][r[d.id].dir] }));
  }

  /* ── conversation starters ────────────────────────────────
     Replaces "how was school today?". Grounded ones come first: a
     question built from something Loop actually knows happened, which
     is the question a parent could not have asked on their own. */
  function starters(studentId, n, seed){
    n = n || 3; seed = seed || 0;
    const d = child(studentId);
    const evs = events(studentId).filter(e=>thisWeek(e.d) && !e.quote);
    const grounded = [], used = new Set();

    const collect = (list, bank, srcLabel) => {
      list.forEach(e=>{
        if (used.has(e.sig) || !bank[e.sig]) return;
        used.add(e.sig);
        grounded.push(Object.assign({ grounded:true, src:srcLabel, sig:e.sig,
          because: e.detail, dim: topDimFor(e) }, bank[e.sig](d)));
      });
    };
    /* school first — it's the half the parent doesn't have */
    collect(evs.filter(e=>e.src==='school').sort((a,b)=>day(b.d)-day(a.d)), STARTER_FROM_SIGNAL, 'school');
    collect(evs.filter(e=>e.src==='home').sort((a,b)=>day(b.d)-day(a.d)),   STARTER_FROM_HOME,   'home');

    /* Rotate BOTH pools by the seed, so "different questions" actually
       differs even when there is enough grounded material to fill every slot. */
    const rot = (arr, by) => arr.length ? arr.map((_,i)=>arr[(i + by) % arr.length]) : arr;
    const dayOff = Math.abs(ago(WEEK_START));
    const g = rot(grounded, (seed + dayOff) % Math.max(1, grounded.length));
    const a = rot(STARTERS_ALWAYS.map(x=>Object.assign({ grounded:false, src:null }, x)),
                  (seed + dayOff) % STARTERS_ALWAYS.length);

    /* Grounded first, always — a question built from something that actually
       happened is the only thing here a parent couldn't have thought of alone.
       Rerolling walks the grounded pool; the generic bank is the safety net for
       a quiet week, a school holiday, or a lapsed Connected plan, and it only
       appears once there is nothing grounded left to say. */
    return g.concat(a).slice(0, n);
  }

  function topDimFor(e){
    const w = weightsFor(e);
    const id = Object.keys(w).sort((a,b)=>Math.abs(w[b])-Math.abs(w[a]))[0];
    return DIMENSIONS.find(x=>x.id===id) || null;
  }

  /* ── at home ──────────────────────────────────────────────
     A chore board is a coin ledger AND a source of patterns, kept apart:
     coins come only from `extra` completions, while a `contribution` kept
     up across a week becomes one home signal. */
  function choreBoard(studentId, dd){
    const ids = store.chores(studentId);
    const day2 = dd || TODAY;
    const rows = ids.map(id=>{
      const c = CHORES.find(x=>x.id===id); if(!c) return null;
      return Object.assign({}, c, { done: store.isDone(studentId,id,day2), streak: choreStreak(studentId,id) });
    }).filter(Boolean);
    const contributions = rows.filter(r=>r.kind==='contribution');
    const extras        = rows.filter(r=>r.kind==='extra');
    return { day:day2, contributions, extras,
      doneToday: rows.filter(r=>r.done).length, total: rows.length,
      earnedToday: extras.filter(r=>r.done).reduce((a,r)=>a+r.coins,0) };
  }
  function choreStreak(studentId, id){
    const log = store.choreLog().filter(e=>e.s===studentId && e.c===id);
    let n = 0;
    for (let i=0;i<7;i++){
      const dt = new Date((day(TODAY)-i)*864e5).toISOString().slice(0,10);
      if (log.some(e=>e.d===dt)) n++;
    }
    return n;
  }
  function homeCoins(studentId){
    let earned = checkinBonus(studentId).today;
    store.choreLog().filter(e=>e.s===studentId).forEach(e=>{
      const c = CHORES.find(x=>x.id===e.c); if (c && c.kind==='extra') earned += c.coins;
    });
    const spent = store.spent(studentId)
      .reduce((a,x)=>a+((HOME_REWARDS.find(r=>r.id===x.r)||{coins:0}).coins),0);
    return { earned, spent, balance: earned - spent };
  }
  function choreSignals(studentId){
    return store.chores(studentId).map(id=>{
      const c = CHORES.find(x=>x.id===id);
      if (!c || c.kind!=='contribution') return null;
      const n = choreStreak(studentId,id);
      if (n < STREAK_FOR_SIGNAL) return null;
      return { chore:c, days:n, dim: DIMENSIONS.find(d=>d.id===c.dim) };
    }).filter(Boolean);
  }

  /* Rewrites DIMENSIONS in place so every surface speaks the school's
     language without knowing a framework exists. */
  function applyFramework(id){
    const fw = FRAMEWORKS[id] || FRAMEWORKS['whole-learner'];
    DIMENSIONS.forEach(d=>{
      const a = fw.areas[d.id]; if(!a) return;
      d.name = a.name; d.q = a.q;
    });
    return fw;
  }
  function framework(){ return FRAMEWORKS[store.framework()] || FRAMEWORKS['whole-learner'] }

  /* ── daily check-in streak ────────────────────────────────
     Rewards showing up rather than each tick, and the bonus is capped so a
     streak can never dwarf actual effort. */
  function checkinDays(studentId){
    const log = store.choreLog().filter(e=>e.s===studentId);
    const days = new Set(log.map(e=>e.d));
    let n = 0;
    for (let i=0;i<14;i++){
      const dt = new Date((day(TODAY)-i)*864e5).toISOString().slice(0,10);
      if (days.has(dt)) n++; else break;
    }
    return n;
  }
  function checkinBonus(studentId){
    const streak = checkinDays(studentId);
    if (!streak) return { streak:0, today:0, perfect:false };
    const bonus = Math.min(CHECKIN.maxStreakBonus, (streak-1)*CHECKIN.perDay);
    const perfect = streak >= 7;
    return { streak, today: CHECKIN.base + bonus + (perfect?CHECKIN.perfectWeek:0), perfect,
             base:CHECKIN.base, bonus };
  }

  /* ── flags ────────────────────────────────────────────────
     Open action items for a child, soonest deadline first. Overdue is
     flagged but never alarmed — a late permission slip is not a crisis. */
  function flags(studentId){
    const done = store.flagsDone();
    return ACTION_ITEMS.concat(store.sentFlags())
      .filter(f=>f.s===studentId && !done[f.id])
      .map(f=>Object.assign({}, f, {
        daysLeft: f.due ? Math.round(day(f.due) - day(TODAY)) : null,
        overdue:  f.due ? day(f.due) < day(TODAY) : false,
        meta: FLAG_KINDS[f.kind] || FLAG_KINDS.form,
      }))
      .sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999'));
  }
  function flagsHandled(studentId){
    const done = store.flagsDone();
    return ACTION_ITEMS.concat(store.sentFlags()).filter(f=>f.s===studentId && done[f.id]);
  }

  function concern(id){ return CONCERNS.find(c=>c.id===id) || null }

  function expectations(dimId, grade){
    const g = GRADE_EXPECTATIONS[grade||3];
    return g ? g[dimId] : null;
  }

  function levelLabel(l){ return LEVEL_LABEL[l] }

  try { applyFramework(store.framework()) } catch(e){}

  return { store, read, insight, headlines, homeSignal, classView, child, events, levelLabel,
           coins, activity, moment, conference, concern, expectations, starters,
           choreBoard, choreStreak, homeCoins, choreSignals,
           applyFramework, framework, checkinDays, checkinBonus, flags, flagsHandled,
           LEVEL_LABEL, LEVEL_TONE, ARROW, ARROW_CLASS, ago, thisWeek, joinList };
})();
