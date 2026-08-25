/* ClassCade Loop — content model
   Everything a designer/curriculum person would want to edit lives here.
   The engine (loop.engine.js) never hardcodes copy. */

const TODAY = '2026-08-24';           // prototype "now" — frozen so the demo never decays
const WEEK_START = '2026-08-17';

/* ── THE WHOLE LEARNER ─────────────────────────────────────────────
   Adult surfaces say "Whole Learner". The student surface says "My Growth".
   Same six dimensions, two registers. */
const DIMENSIONS = [
  { id:'confidence', icon:'confidence-shield', color:'#7c5cfc', tint:'#f0ecff', ico:'🛡️', facets:['Trying hard things','Recovering from mistakes','Self-belief','Academic risk-taking'],   name:'Confidence',   emoji:'💪',
    q:'Will I try when I\'m unsure?',
    kidQ:'Do I try even when I might get it wrong?',
    why:'Taking small academic risks is an important part of building confidence as a learner.' },
  { id:'curiosity', icon:'curiosity-lightbulb', color:'#eab308', tint:'#fef6dc', ico:'💡', facets:['Asking questions','Exploring ideas','Creativity','Wanting to know why'],    name:'Curiosity',    emoji:'🔎',
    q:'Do I wonder, explore and ask?',
    kidQ:'Do I wonder about things and ask questions?',
    why:'Children who ask their own questions remember more and need less prompting to engage.' },
  { id:'connection', icon:'connection-people', color:'#ec4899', tint:'#fdeaf4', ico:'👥', facets:['Friendships','Communication','Empathy','Belonging'],   name:'Connection',   emoji:'🤝',
    q:'How do I relate to other people?',
    kidQ:'How do I get along with other people?',
    why:'How a child works with others shapes how safe they feel taking risks in front of them.' },
  { id:'independence', icon:'independence-compass', color:'#f97316', tint:'#feeee0', ico:'🧭', facets:['Homework habits','Organization','Responsibility','Problem-solving'], name:'Independence', emoji:'🧭',
    q:'Can I manage myself and ask for help?',
    kidQ:'Can I get started on my own — and ask when I\'m stuck?',
    why:'Independence isn\'t doing everything alone. It\'s knowing when to keep going and when to ask.' },
  { id:'resilience', icon:'resilience-sprout', color:'#14b8a6', tint:'#e2f7f4', ico:'🌱', facets:['Handling disappointment','Emotional regulation','Persistence','Flexibility'],   name:'Resilience',   emoji:'🌱',
    q:'What happens when things get hard?',
    kidQ:'What do I do when something is hard?',
    why:'What a child does in the first 30 seconds of difficulty predicts more than their accuracy does.' },
  { id:'learning', icon:'learning-book', color:'#2563eb', tint:'#e6edfe', ico:'📘', facets:['Reading','Math','Writing','Executive functioning','Study skills'],     name:'Learning',     emoji:'📚',
    q:'How am I developing academically?',
    kidQ:'How is my learning going?',
    why:'Academic growth is steadiest when it sits on top of confidence, not in place of it.' },
];

/* ── SHOWDOWN SIGNALS ──────────────────────────────────────────────
   Captured passively while the teacher runs Showdown. The teacher is
   never asked to fill anything out. Each signal fans into dimensions
   with a weight — a signal is evidence, not a score. */
const SIGNALS = {
  persistence:        { label:'Persistence',         emoji:'🔁', w:{ resilience:.7, confidence:.3 } },
  collaboration:      { label:'Collaboration',       emoji:'🧩', w:{ connection:.8, learning:.2 } },
  participation:      { label:'Participation',       emoji:'🙋', w:{ confidence:.6, connection:.4 } },
  independence:       { label:'Independence',        emoji:'🧭', w:{ independence:1 } },
  kindness:           { label:'Kindness',            emoji:'💛', w:{ connection:1 } },
  self_advocacy:      { label:'Self-advocacy',       emoji:'✋', w:{ independence:.6, confidence:.4 } },
  regulation:         { label:'Regulation',          emoji:'🌊', w:{ resilience:.7, independence:.3 } },
  academic_confidence:{ label:'Academic confidence', emoji:'📈', w:{ learning:.6, confidence:.4 } },
  /* The classroom doesn't only generate good news. These are the signals that
     make Loop an interpretation layer rather than a praise feed. */
  transitions:        { label:'Transitions',         emoji:'🔀', w:{ resilience:.6, independence:.2 } },
  redirections:       { label:'Redirections',        emoji:'↩️', w:{ learning:.5, independence:.5 } },
  group_conflict:     { label:'Group-work conflict', emoji:'⚡', w:{ connection:1 } },
  help_before_trying: { label:'Help before trying',  emoji:'🙇', w:{ independence:.7, confidence:.3 } },
  /* PROPOSED — see README. Nothing in the current eight feeds Curiosity,
     so Curiosity can only ever be a home-and-child dimension until Showdown
     captures something like this. */
  wondering:          { label:'Wondering',           emoji:'❓', w:{ curiosity:1 }, proposed:true },
};

/* ── HOME OBSERVATIONS ─────────────────────────────────────────────
   What a parent can log in one tap. Deliberately small and finite. */
const HOME_OBS = [
  { id:'tried_hard_thing', label:'Tried something hard',     emoji:'🧗', w:{ resilience:.6, confidence:.4 },  phrase:'tried something {subj} wasn\'t sure about' },
  { id:'did_it_alone',     label:'Did it without help',      emoji:'🧭', w:{ independence:1 },                phrase:'got started without help' },
  { id:'asked_for_help',   label:'Asked for help well',      emoji:'✋', w:{ independence:.7, confidence:.3 }, phrase:'asked for help instead of shutting down' },
  { id:'curious_question', label:'Asked a great question',   emoji:'❓', w:{ curiosity:1 },                   phrase:'asked a question nobody prompted' },
  { id:'kind_moment',      label:'Was kind to someone',      emoji:'💛', w:{ connection:1 },                  phrase:'was kind without being asked' },
  { id:'friend_stuff',     label:'Friend stuff came up',     emoji:'🤝', w:{ connection:-.5 },                phrase:'had something come up with friends' },
  { id:'read_together',    label:'Read or worked together',  emoji:'📚', w:{ learning:.7, connection:.3 },    phrase:'read or worked through something with you' },
  { id:'said_something',   label:'Something they said',      emoji:'💬', w:{},                                phrase:'said something worth remembering', quote:true },
  { id:'rough_moment',     label:'Rough moment',             emoji:'🌧️', w:{ resilience:-.7 },                phrase:'had a hard time when something didn\'t go {poss} way' },
  { id:'homework_battle',  label:'Homework was a battle',    emoji:'⚔️', w:{ learning:-.4, resilience:-.4 },  phrase:'struggled to get started on homework' },
];

/* ── CHILD CHECK-INS · PARKED 2026-08-24 ───────────────────────────
   NOT WIRED UP. Kept as a record of the design, not as a live feature.

   A child tapping answers here is personal information collected directly
   from a child under 13, which pulls Loop into COPPA proper: verifiable
   parental consent, a child-specific notice, retention limits, and a
   parental right to review and delete. It also splits by tier — a school
   can consent on parents' behalf for educational use, but a direct Loop
   Family subscriber has no school in the chain, so the same screen would
   sit on two different legal bases.

   Parking it costs Loop one thing: the child's voice. That is now relayed
   by the PARENT via the `said_something` observation, which is collected
   from an adult account holder and raises none of the above. */
const CHILD_PROMPTS = [
  { id:'tried', q:'Did you try something today even though you might get it wrong?',
    a:[ {t:'Yes, I tried',     v:1,  w:{confidence:1}},
        {t:'Kind of',          v:.3, w:{confidence:.4}},
        {t:'Not today',        v:-.4,w:{confidence:-.5}} ] },
  { id:'hard', q:'When something got hard today, what did you do?',
    a:[ {t:'Kept going',       v:1,  w:{resilience:1}},
        {t:'Asked for help',   v:.8, w:{independence:.8, resilience:.4}},
        {t:'Gave up a bit',    v:-.5,w:{resilience:-.7}} ] },
  { id:'people', q:'How did today go with other people?',
    a:[ {t:'Really good',      v:1,  w:{connection:1}},
        {t:'Okay',             v:.2, w:{connection:.2}},
        {t:'Kind of hard',     v:-.6,w:{connection:-.8}} ] },
  { id:'wonder', q:'Did you wonder about anything today?',
    a:[ {t:'Yes! A lot',       v:1,  w:{curiosity:1}},
        {t:'One thing',        v:.5, w:{curiosity:.5}},
        {t:'Not really',       v:-.2,w:{curiosity:-.3}} ] },
];

/* ── ROSTER ────────────────────────────────────────────────────────
   Ms. Alvarez, 3rd grade. Maya is the fully-seeded family. */
const ROSTER = [
  { id:'maya',   first:'Maya',   last:'Okonkwo',  pron:'she', av:'g1', linked:true,  parent:'Adaeze Okonkwo' },
  { id:'theo',   first:'Theo',   last:'Barnes',   pron:'he',  av:'',   linked:true,  parent:'Ryan Barnes' },
  { id:'lila',   first:'Lila',   last:'Nguyen',   pron:'she', av:'g2', linked:true,  parent:'Kim Nguyen' },
  { id:'jonah',  first:'Jonah',  last:'Reyes',    pron:'he',  av:'g3', linked:false, parent:null },
  { id:'sasha',  first:'Sasha',  last:'Kowalski', pron:'she', av:'g4', linked:true,  parent:'Marta Kowalski' },
  { id:'omar',   first:'Omar',   last:'Haddad',   pron:'he',  av:'',   linked:false, parent:null },
  { id:'nia',    first:'Nia',    last:'Carter',   pron:'she', av:'g2', linked:true,  parent:'Devon Carter' },
  { id:'wyatt',  first:'Wyatt',  last:'Doyle',    pron:'he',  av:'g3', linked:false, parent:null },
  { id:'priya',  first:'Priya',  last:'Raman',    pron:'she', av:'g1', linked:true,  parent:'Anita Raman' },
];
const ME = 'maya';           // the parent surface's child
const TEACHER = 'Ms. Alvarez';

/* ── SEEDED EVENTS ─────────────────────────────────────────────────
   src: 'school' (Showdown, passive) | 'home' (parent tap) | 'child' (check-in)
   v:   direction/strength, -1..1
   detail: the human sentence. Written once, reused by the narrator. */
const SEED_EVENTS = [
  /* ── MAYA · this week (Aug 17–23) ── */
  { s:'maya', src:'school', sig:'participation',       v:1,  d:'2026-08-18', detail:'volunteered an answer in Showdown even though she wasn\'t sure' },
  { s:'maya', src:'school', sig:'participation',       v:1,  d:'2026-08-20', detail:'answered first for her team without being called on' },
  { s:'maya', src:'school', sig:'collaboration',       v:1,  d:'2026-08-19', detail:'contributed during group work' },
  { s:'maya', src:'school', sig:'collaboration',       v:1,  d:'2026-08-21', detail:'contributed during group work' },
  { s:'maya', src:'school', sig:'collaboration',       v:1,  d:'2026-08-22', detail:'contributed during group work' },
  { s:'maya', src:'school', sig:'persistence',         v:1,  d:'2026-08-19', detail:'retried a question she missed instead of moving on' },
  { s:'maya', src:'school', sig:'persistence',         v:1,  d:'2026-08-22', detail:'stayed with a multi-step problem to the end' },
  { s:'maya', src:'school', sig:'academic_confidence', v:.6, d:'2026-08-21', detail:'picked the harder round when she had a choice' },
  { s:'maya', src:'school', sig:'independence',        v:.5, d:'2026-08-20', detail:'started her round without waiting for a prompt' },
  { s:'maya', src:'school', sig:'regulation',          v:-.5,d:'2026-08-18', detail:'needed a reset after a transition into a timed round' },
  { s:'maya', src:'school', sig:'kindness',            v:1,  d:'2026-08-22', detail:'cheered for a teammate who got one wrong' },
  { s:'maya', src:'home',   sig:'did_it_alone',        v:1,  d:'2026-08-19', detail:'started homework without asking for help first' },
  { s:'maya', src:'home',   sig:'did_it_alone',        v:1,  d:'2026-08-21', detail:'started homework without asking for help first' },
  { s:'maya', src:'home',   sig:'tried_hard_thing',    v:1,  d:'2026-08-20', detail:'kept going on a puzzle she couldn\'t do at first' },
  /* Child quotes are RELAYED BY THE PARENT, not collected from the child.
     See the COPPA note in README — Loop has no direct child data path. */
  { s:'maya', src:'home',   sig:'said_something',      v:1,  d:'2026-08-21', w:{confidence:1}, detail:'I\'m getting braver about being wrong.', quote:true },
  { s:'maya', src:'home',   sig:'said_something',      v:.8, d:'2026-08-19', w:{independence:.8, resilience:.4}, detail:'I asked Ms. Alvarez instead of just sitting there.', quote:true },

  /* ── MAYA · prior two weeks (gives the engine a baseline to move from) ── */
  { s:'maya', src:'school', sig:'participation',       v:-1, d:'2026-08-11', detail:'waited to be called on rather than volunteering' },
  { s:'maya', src:'school', sig:'participation',       v:-1, d:'2026-08-13', detail:'waited to be called on rather than volunteering' },
  { s:'maya', src:'school', sig:'academic_confidence', v:-.5,d:'2026-08-12', detail:'chose the easier round when she had the choice' },
  { s:'maya', src:'school', sig:'independence',        v:.5, d:'2026-08-13', detail:'set up her own round' },
  { s:'maya', src:'school', sig:'collaboration',       v:.5, d:'2026-08-12', detail:'worked alongside her group quietly' },
  { s:'maya', src:'school', sig:'persistence',         v:.4, d:'2026-08-14', detail:'finished a set she found hard' },
  { s:'maya', src:'school', sig:'regulation',          v:-.6,d:'2026-08-12', detail:'had a hard time settling after a transition' },
  { s:'maya', src:'school', sig:'regulation',          v:-.5,d:'2026-08-08', detail:'had a hard time settling after a transition' },
  { s:'maya', src:'home',   sig:'homework_battle',     v:1,  d:'2026-08-11', detail:'homework took three attempts to start' },
  { s:'maya', src:'school', sig:'academic_confidence', v:.3, d:'2026-08-07', detail:'chose the standard round' },
  { s:'maya', src:'school', sig:'kindness',            v:1,  d:'2026-08-13', detail:'helped a classmate find their place' },
  { s:'maya', src:'home',   sig:'curious_question',    v:1,  d:'2026-08-15', detail:'asked why the moon changes shape' },

  /* ── the rest of the class · enough for a real teacher view ── */
  { s:'theo', src:'school', sig:'persistence',    v:1,  d:'2026-08-20', detail:'retried three questions in a row' },
  { s:'theo', src:'school', sig:'persistence',    v:1,  d:'2026-08-22', detail:'finished a set he\'d normally abandon' },
  { s:'theo', src:'school', sig:'regulation',     v:-.7,d:'2026-08-19', detail:'needed a break after a timed round' },
  { s:'theo', src:'school', sig:'regulation',     v:-.6,d:'2026-08-21', detail:'needed a break after a timed round' },
  { s:'theo', src:'school', sig:'participation',  v:.5, d:'2026-08-18', detail:'answered when called on' },
  { s:'theo', src:'home',   sig:'rough_moment',   v:1,  d:'2026-08-20', detail:'a hard evening after school' },

  { s:'lila', src:'school', sig:'collaboration',  v:1,  d:'2026-08-18', detail:'organized her group\'s turn order' },
  { s:'lila', src:'school', sig:'kindness',       v:1,  d:'2026-08-20', detail:'talked a teammate through a miss' },
  { s:'lila', src:'school', sig:'kindness',       v:1,  d:'2026-08-22', detail:'shared credit with her team' },
  { s:'lila', src:'school', sig:'participation',  v:1,  d:'2026-08-21', detail:'volunteered twice in one round' },
  { s:'lila', src:'home',   sig:'kind_moment',    v:1,  d:'2026-08-21', detail:'looked after her little brother without being asked' },

  { s:'jonah',src:'school', sig:'self_advocacy',  v:1,  d:'2026-08-19', detail:'asked for the question to be re-read' },
  { s:'jonah',src:'school', sig:'independence',   v:.8, d:'2026-08-21', detail:'set up his own round' },
  { s:'jonah',src:'school', sig:'participation',  v:-.5,d:'2026-08-18', detail:'sat out two rounds' },
  { s:'jonah',src:'school', sig:'persistence',    v:.6, d:'2026-08-22', detail:'came back to a question later' },

  { s:'sasha',src:'school', sig:'academic_confidence', v:1, d:'2026-08-18', detail:'chose the stretch round twice' },
  { s:'sasha',src:'school', sig:'academic_confidence', v:1, d:'2026-08-22', detail:'chose the stretch round twice' },
  { s:'sasha',src:'school', sig:'collaboration',  v:-.5,d:'2026-08-20', detail:'worked ahead of her group' },
  { s:'sasha',src:'school', sig:'participation',  v:1,  d:'2026-08-21', detail:'answered for her team repeatedly' },
  { s:'sasha',src:'home',   sig:'friend_stuff',   v:1,  d:'2026-08-22', detail:'something came up with a friend at lunch' },

  { s:'omar', src:'school', sig:'participation',  v:-.6,d:'2026-08-19', detail:'didn\'t volunteer this week' },
  { s:'omar', src:'school', sig:'collaboration',  v:.6, d:'2026-08-21', detail:'worked well in a pair' },

  { s:'nia',  src:'school', sig:'regulation',     v:1,  d:'2026-08-20', detail:'used the reset corner on her own' },
  { s:'nia',  src:'school', sig:'self_advocacy',  v:1,  d:'2026-08-21', detail:'told me the round was going too fast' },
  { s:'nia',  src:'school', sig:'independence',   v:.8, d:'2026-08-22', detail:'got started without a prompt' },
  { s:'nia',  src:'home',   sig:'asked_for_help', v:1,  d:'2026-08-21', detail:'asked for help instead of melting down' },

  { s:'wyatt',src:'school', sig:'persistence',    v:-.6,d:'2026-08-18', detail:'stopped after the first miss' },
  { s:'wyatt',src:'school', sig:'persistence',    v:-.7,d:'2026-08-21', detail:'stopped after the first miss' },
  { s:'wyatt',src:'school', sig:'kindness',       v:1,  d:'2026-08-20', detail:'gave his turn to someone who hadn\'t gone' },

  { s:'priya',src:'school', sig:'collaboration',  v:1,  d:'2026-08-19', detail:'kept her group on the same question' },
  { s:'priya',src:'school', sig:'academic_confidence', v:.7,d:'2026-08-21', detail:'explained her reasoning out loud' },
  { s:'priya',src:'school', sig:'participation',  v:.6, d:'2026-08-22', detail:'volunteered once' },
];

/* ── PARENT RESPONSE OPTIONS ───────────────────────────────────────
   The whole home→school channel. Three taps + one short line.
   The character cap IS the feature: it is what prevents the 900-word email. */
const RESPONSES = [
  { id:'same',      label:'We\'re seeing this at home, too', emoji:'🤝', tone:'good',
    teacherLine:d => `${d.first}'s family is seeing the same thing at home.` },
  { id:'different', label:'This feels different at home',    emoji:'🔀', tone:'watch',
    teacherLine:d => `${d.first}'s family is seeing something different at home — worth a look.` },
  { id:'talk',      label:'I\'d like to talk about this',    emoji:'💬', tone:'plain',
    teacherLine:d => `${d.first}'s family would like to talk about this.` },
];
const NOTE_CAP = 240;

/* ── NARRATOR COPY ─────────────────────────────────────────────────
   Headline + why + conversation + home strategy, per dimension × direction.
   In production this is where the model generates; the shape stays identical. */
const NARRATIVE = {
  confidence:{
    up:{   head:d=>`${d.first} showed more confidence participating this week.`,
           talk:d=>`"Was there anything you tried at school this week even though you weren't sure you'd get it right?"`,
           tryAt:d=>`Give ${d.first} opportunities to explain how ${d.subj} figured something out rather than focusing only on whether the answer was correct.` },
    flat:{ head:d=>`${d.first}'s confidence looks steady right now.`,
           talk:d=>`"What's something you're good at that used to be hard?"`,
           tryAt:d=>`Name the risk out loud when you see it — "you weren't sure and you tried anyway" — so ${d.first} learns what to be proud of.` },
    down:{ head:d=>`${d.first} has been holding back a little this week.`,
           talk:d=>`"Is there anything at school right now that feels risky to try?"`,
           tryAt:d=>`Lower the stakes on one thing this week — let ${d.first} answer something where being wrong genuinely doesn't matter.` } },
  curiosity:{
    up:{   head:d=>`${d.first} has been asking more of her own questions.`,
           talk:d=>`"What's something you wondered about today?"`,
           tryAt:d=>`When ${d.first} asks a question you could answer instantly, try "what do you think?" first.` },
    flat:{ head:d=>`We don't have much on ${d.first}'s curiosity yet.`,
           talk:d=>`"If you could learn about anything at school, what would it be?"`,
           tryAt:d=>`Leave one question unanswered at dinner and come back to it tomorrow.` },
    down:{ head:d=>`${d.first} has been asking fewer questions lately.`,
           talk:d=>`"Has anything at school felt boring this week?"`,
           tryAt:d=>`Follow one thing ${d.first} already likes further than usual — curiosity restarts on familiar ground.` } },
  connection:{
    up:{   head:d=>`${d.first} has been connecting well with the people around her.`,
           talk:d=>`"Who did you help this week?"`,
           tryAt:d=>`Ask about someone else's day, not just ${d.first}'s — it keeps the noticing going.` },
    flat:{ head:d=>`${d.first}'s connections with others look steady.`,
           talk:d=>`"Who do you like working with at school?"`,
           tryAt:d=>`Ask who ${d.first} sat with, not just what she did.` },
    down:{ head:d=>`Something may be going on socially for ${d.first}.`,
           talk:d=>`"Was there a part of today you'd want to do over?"`,
           tryAt:d=>`Don't solve it. Ask one question and let ${d.first} talk longer than feels comfortable.` } },
  independence:{
    up:{   head:d=>`${d.first} is managing more on her own.`,
           talk:d=>`"What did you figure out today without asking anyone?"`,
           tryAt:d=>`Wait ten seconds longer than usual before stepping in.` },
    flat:{ head:d=>`${d.first}'s independence looks about the same as last week.`,
           talk:d=>`"When you get stuck, what do you do first?"`,
           tryAt:d=>`Ask ${d.first} what she already tried before you help.` },
    down:{ head:d=>`${d.first} has needed more support to get started.`,
           talk:d=>`"What's the hardest part about starting?"`,
           tryAt:d=>`Start it together and leave after two minutes — starting is usually the whole problem.` } },
  resilience:{
    up:{   head:d=>`${d.first} is staying with hard things longer.`,
           talk:d=>`"What's something you didn't get right the first time this week?"`,
           tryAt:d=>`Tell ${d.first} about something you got wrong this week and what you did next.` },
    flat:{ head:d=>`${d.first} handles hard moments about the same as last week.`,
           talk:d=>`"What do you do when something is too hard?"`,
           tryAt:d=>`Notice the second attempt out loud, not the finished answer.` },
    down:{ head:d=>`Hard moments have been landing harder for ${d.first} this week.`,
           talk:d=>`"What part of the day is hardest right now?"`,
           tryAt:d=>`Look at when it happens rather than why — transitions and endings are usually the trigger, not the task.` } },
  learning:{
    up:{   head:d=>`${d.first}'s academic work is moving in a good direction.`,
           talk:d=>`"What's something you understand now that you didn't a month ago?"`,
           tryAt:d=>`Ask ${d.first} to teach you one thing ${d.subj} learned. Explaining is what makes it stick.` },
    flat:{ head:d=>`${d.first}'s learning looks steady.`,
           talk:d=>`"What's the easiest part of school right now? The hardest?"`,
           tryAt:d=>`Read something together that neither of you chose for school.` },
    down:{ head:d=>`${d.first}'s academic work has been harder going this week.`,
           talk:d=>`"Which subject makes you want to give up fastest?"`,
           tryAt:d=>`Pick one small thing and get it fully right rather than getting through everything.` } },
};

/* ── COLD START ────────────────────────────────────────────────── */
const COLD_START = {
  head:(d,dim)=>`Still getting to know ${d.first} here.`,
  body:(d,dim)=>`We don't have enough on ${dim.name.toLowerCase()} yet to say anything useful. Loop waits for a pattern rather than guessing from one moment.`,
};

const TIER_COPY = {
  family:{
    name:'Family',
    price:'$7.99/mo',
    blurb:'Your observations, your child\'s check-ins, and age-appropriate guidance. No school required.',
  },
  connected:{
    name:'Connected',
    price:'Included when the school uses ClassCade',
    blurb:'Showdown signals from the classroom flow in alongside what you notice at home.',
  },
};

/* ── STUDENT SURFACE COPY ──────────────────────────────────────────
   Kid register. The child never sees a level, a score, or a trend —
   only what they're practicing and what they did. */
const KID_COPY = {
  confidence:  { practice:'Sharing my thinking even when I\'m not 100% sure.',
                 stars:['I tried','I spoke up','I kept going'] },
  curiosity:   { practice:'Asking one question about something I wonder about.',
                 stars:['I wondered','I asked','I found out'] },
  connection:  { practice:'Making sure everyone in my group gets a turn.',
                 stars:['I listened','I helped','I included someone'] },
  independence:{ practice:'Starting on my own before I ask for help.',
                 stars:['I started','I checked my work','I asked when stuck'] },
  resilience:  { practice:'Trying one more time before I stop.',
                 stars:['I stayed calm','I tried again','I finished it'] },
  learning:    { practice:'Explaining how I got my answer, not just the answer.',
                 stars:['I practiced','I explained it','I got better'] },
};

/* ── LANGUAGE RULES ────────────────────────────────────────────────
   Non-negotiable. Every string that reaches a parent goes through this. */
const LANGUAGE = {
  use:   ['Emerging','Growing','Strong','Thriving','On track','Needs attention','We\'re noticing','Common at this stage'],
  never: ['Below benchmark','Deficient','At risk','Behind','Low','Failing','Percentile','Score','Compared to peers'],
  rule:  'Status words only, never numbers. Describe the child, never rank them.',
};

/* ── TODAY'S 5-MINUTE MOMENT ───────────────────────────────────────
   The daily habit loop. One small idea — never a task list.
   Sunday is the weekly ritual; this is the other six days. */
const MOMENTS = {
  confidence: [
    { title:'Name the risk, not the result', prompt:'Ask: "What\'s something you tried today that you weren\'t sure about?"',
      why:'Praising the attempt rather than the answer is what makes a child willing to attempt again.',
      follow:'"What made you decide to try it anyway?"' },
    { title:'Tell on yourself', prompt:'Tell your child about something you got wrong today.',
      why:'Children calibrate how bad being wrong is by watching how the adults around them handle it.',
      follow:'"What did I do after I messed it up?"' },
  ],
  curiosity: [
    { title:'Don\'t answer it', prompt:'Next time your child asks you something you could answer instantly, say "what do you think?" first.',
      why:'A question answered too fast ends the thinking. A question handed back extends it.',
      follow:'"How could we find out for sure?"' },
    { title:'Leave one open', prompt:'End dinner with a question nobody knows the answer to. Come back to it tomorrow.',
      why:'Curiosity needs somewhere to go. An unfinished question is an invitation.',
      follow:'"Did you think about it at all today?"' },
  ],
  connection: [
    { title:'The funniest thing', prompt:'Ask: "What was the funniest thing that happened today?"',
      why:'"How was school?" gets "fine." A specific question gets a story — and stories are where the real information is.',
      follow:'"Who else thought it was funny?"' },
    { title:'Ask about someone else', prompt:'Ask about a classmate\'s day, not just your child\'s.',
      why:'Noticing other people is a skill, and it gets practised by being asked about.',
      follow:'"Who did you sit with?"' },
  ],
  independence: [
    { title:'Ten more seconds', prompt:'When your child gets stuck today, wait ten seconds longer than usual before stepping in.',
      why:'Most help arrives before it\'s needed. The pause is where the problem-solving happens.',
      follow:'"What did you already try?"' },
    { title:'Start together, leave early', prompt:'Start homework together, then leave after two minutes.',
      why:'For most children starting is the whole problem, not the work itself.',
      follow:'"Which part was the hardest to begin?"' },
  ],
  resilience: [
    { title:'Notice the restart', prompt:'Praise the second attempt today, not the finished answer.',
      why:'What a child does in the first 30 seconds of difficulty predicts more than their accuracy does.',
      follow:'"What made you want to try again?"' },
    { title:'When, not why', prompt:'Notice what time of day the hard moments happen this week.',
      why:'Hard moments usually cluster around transitions and endings rather than around specific tasks.',
      follow:'"Is there a part of the day you wish you could skip?"' },
  ],
  learning: [
    { title:'Make them the teacher', prompt:'Ask your child to teach you one thing they learned today.',
      why:'Explaining is the step that turns something remembered into something understood.',
      follow:'"What part is hard to explain?"' },
    { title:'Read something useless', prompt:'Read something together that nobody assigned.',
      why:'Reading for school and reading for pleasure build different things. Only one of them is optional.',
      follow:'"Would you read another one of these?"' },
  ],
};

/* ── "I'M NOTICING SOMETHING…" ─────────────────────────────────────
   The always-there safety net. Never paywalled, never requires history.
   Four parts every time: what it might mean · what to watch for ·
   one small next step · when to ask for more help. */
const CONCERNS = [
  { id:'meltdowns', label:'Meltdowns after school', emoji:'🌧️', dims:['resilience','connection'],
    mean:'Holding it together all day takes enormous effort. Many children spend their whole regulation budget at school and have nothing left at the door. The meltdown is usually a sign that school felt safe enough to hold it in — not that home is going badly.',
    watch:['Whether it happens on particular days or after particular subjects','Whether it starts before or after a snack','Whether the trigger is the request, or the transition into it'],
    step:'Protect the first 20 minutes after pickup. No questions, no homework, no plans — food and quiet. Ask about the day later.',
    seek:'If it is escalating week over week, if it involves hurting themselves or others, or if it has started happening at school too.' },
  { id:'homework_refusal', label:'Homework refusal', emoji:'⚔️', dims:['independence','learning','resilience'],
    mean:'Refusal is almost always about the start, not the work. It usually means the task feels unbounded, or that being wrong in front of you feels worse than not trying.',
    watch:['Whether refusal is subject-specific or across the board','Whether they can do the same work when you\'re not watching','Whether it started at a particular point in the year'],
    step:'Cut the task in half and name where it ends. "Do these four, then you\'re done" beats "do your homework."',
    seek:'If avoidance is spreading into school itself, or if a task that should take 20 minutes reliably takes an hour or more.' },
  { id:'wont_read', label:'Doesn\'t want to read', emoji:'📕', dims:['learning','confidence'],
    mean:'Children who avoid reading usually find it effortful rather than boring. When decoding still takes conscious work, there is nothing left over to enjoy the story with.',
    watch:['Whether they avoid reading aloud specifically','Whether they will listen to the same book happily','Whether they lose their place or reread lines'],
    step:'Read to them above their level and let them read below it. Both count, and only one of them is work.',
    seek:'If they are avoiding reading in a way that is new this year, or if a teacher has also raised it — that combination is worth a conversation.' },
  { id:'friendships', label:'Friendship trouble', emoji:'🤝', dims:['connection'],
    mean:'Friendship groups at this age reorganize constantly, and most of it resolves without adult involvement. What matters is whether your child has somewhere to land, not whether the group is stable.',
    watch:['Whether there is at least one reliable person','Whether they are being excluded or choosing to withdraw','Whether it changes their willingness to go to school'],
    step:'Ask one question and then be quiet longer than feels comfortable. Don\'t solve it in the first conversation.',
    seek:'If it involves being targeted repeatedly by the same person, or if your child has stopped wanting to go to school.' },
  { id:'mistakes', label:'Falls apart over mistakes', emoji:'💔', dims:['resilience','confidence'],
    mean:'A strong reaction to being wrong usually means the child has attached being right to being good. It is very common in children who found early school easy.',
    watch:['Whether it happens more with things they used to be good at','Whether they quit before finishing to avoid a verdict','Whether they hide work rather than show it'],
    step:'Stop praising accuracy for a week. Praise strategy, restarts, and asking — out loud, specifically.',
    seek:'If they are describing themselves in fixed terms ("I\'m the dumb one"), or if the reaction is escalating rather than easing.' },
  { id:'wont_start', label:'Won\'t start without help', emoji:'🙇', dims:['independence','confidence'],
    mean:'Asking before trying is often a confidence pattern rather than an ability one. If the first move has historically been corrected, waiting for an adult is the rational strategy.',
    watch:['Whether they can do it once started','Whether the same pattern shows up at school','What specifically they ask for — permission, or instruction'],
    step:'Agree on one thing to try before asking. "Try one thing first" is a small enough rule to actually hold.',
    seek:'If it is getting broader rather than narrower, or if it appears alongside a drop in things they used to enjoy.' },
  { id:'boring', label:'Says school is boring', emoji:'😐', dims:['curiosity','learning'],
    mean:'"Boring" is the only word most children have for a wide range of feelings — under-challenged, over-challenged, lonely, or lost. It is a starting point, not a diagnosis.',
    watch:['Whether "boring" appears for everything or for particular subjects','Whether it followed a change — a unit, a seat, a friendship','Whether they can say what the lesson was about'],
    step:'Ask what the boring part actually was: the waiting, the work, or the not-knowing. The three have different fixes.',
    seek:'If it comes with not wanting to go, or if a teacher is also seeing disengagement.' },
  { id:'stomachaches', label:'Stomachaches before school', emoji:'🤢', dims:['resilience','connection'],
    mean:'Physical symptoms before school are real symptoms — anxiety produces genuine stomach pain. They usually point at a specific part of the day rather than at school as a whole.',
    watch:['Which days it happens','Whether it eases once they are there','Whether there is a specific class, person, or time it maps onto'],
    step:'Find the specific 20 minutes. "What part of the day would you skip if you could?" gets further than "what\'s wrong?"',
    seek:'If it is causing missed days, or if it persists for more than two or three weeks — a pediatrician can rule out the physical causes and that is genuinely useful.' },
];

/* Always visible on the Ask surface, never behind the paywall. */
const CRISIS = [
  { label:'988 Suicide & Crisis Lifeline', detail:'Call or text 988 · 24/7' },
  { label:'Childhelp National Child Abuse Hotline', detail:'1-800-422-4453 · 24/7' },
  { label:'Crisis Text Line', detail:'Text HOME to 741741' },
];

/* ── AGE / GRADE EXPECTATIONS ──────────────────────────────────────
   "Is this normal?" answered without ranking anyone. Grade 3 shown;
   production carries K–8. */
const GRADE_EXPECTATIONS = {
  3:{
    confidence:  'Most 8-year-olds are newly aware of being watched by peers. A dip in volunteering is common in third grade and usually not about ability.',
    curiosity:   'Questions get narrower and more specific around this age — fewer "why is the sky blue", more "how does that work". That is development, not decline.',
    connection:  'Friendship groups reorganize repeatedly in third grade. Stability matters less than having at least one reliable person.',
    independence:'Third graders can usually manage a multi-step task, but rarely a multi-day one. Forgetting a Friday deadline on Monday is typical.',
    resilience:  'Emotional regulation is still developing and is highly dependent on food, sleep, and transitions rather than on character.',
    learning:    'Third grade is where reading shifts from learning-to-read to reading-to-learn. A child who was fine in second grade can visibly struggle here.',
  },
};

/* ── CONFERENCE QUESTION GENERATOR ─────────────────────────────────
   Built from the child's actual read, so a parent walks in with
   something better than "how's she doing?" */
const CONFERENCE = {
  confidence:{ up:'She\'s been volunteering more at home too — is that showing up in class?', down:'Is she volunteering in class, or waiting to be called on?', flat:'When does she seem most willing to take a risk in front of the class?' },
  curiosity:{ up:'What kinds of questions is she asking in class?', down:'Is there anything she seems switched off by right now?', flat:'What topic gets the most out of her?' },
  connection:{ up:'Who does she work best with?', down:'Have you noticed anything with her friendship group?', flat:'Who does she choose when she gets to choose?' },
  independence:{ up:'Is she starting work on her own, or still waiting for a prompt?', down:'What does she do in the first minute of an independent task?', flat:'How much prompting does she need to get started?' },
  resilience:{ up:'How does she handle it now when she gets something wrong?', down:'What time of day is hardest for her?', flat:'What does she do when a task gets hard?' },
  learning:{ up:'What\'s she doing better than she was a month ago?', down:'Where is the gap widest right now — and what would help at home?', flat:'What should we be practicing at home that would actually matter?' },
};

/* ── FAMILY ────────────────────────────────────────────────────────
   The parent's own account. Two children on purpose: one classroom
   connected, one not — the tier is a per-child state, not an account one. */
const PARENT = { name:'Kennady', greeting:'Good afternoon' };
const FAMILY = [
  { id:'maya', label:'Maya Okonkwo', grade:'3rd Grade', teacher:'Ms. Alvarez', connected:true },
  { id:'ezra', label:'Ezra Okonkwo', grade:'1st Grade', teacher:null,          connected:false },
];

/* ── SHOWDOWN ECONOMY ──────────────────────────────────────────────
   Coins are Showdown's currency. Loop shows them because a parent already
   hears about them at dinner — but they are never the headline, and they
   are never what a dimension is computed from. */
const COIN_VALUE = { participation:20, collaboration:15, persistence:20, kindness:15,
  independence:15, self_advocacy:15, academic_confidence:25, regulation:10,
  transitions:0, redirections:0, group_conflict:0, help_before_trying:0, wondering:15 };

/* ── FROM THE CLASSROOM ────────────────────────────────────────────
   Occasional teacher notes. Rare on purpose — if this fills up, Loop has
   become a messaging app. */
const TEACHER_MESSAGES = [
  { s:'maya', from:'Ms. Alvarez', d:'2026-08-21',
    body:'Maya is such a kind and thoughtful classmate. She brings great ideas to group discussions.' },
];

const EVENTS_UPCOMING = [
  { s:'maya', kind:'Parent-teacher conference', when:'Sep 4 · 3:30 – 4:00 PM', cta:'Add to calendar' },
];

/* ── INSTEAD OF "HOW WAS SCHOOL TODAY?" ────────────────────────────
   "How was school?" fails for three reasons: it's too big to answer, it
   asks for a verdict rather than a memory, and it can be closed with one
   word. Every starter below is specific, answerable, and impossible to
   close with "fine".

   The best ones are GROUNDED — built from something Loop actually knows
   happened, so the parent asks a question they could not have known to ask.
   That is the moment the product earns its subscription. */

const STARTER_FROM_SIGNAL = {
  participation:      d=>({ q:`I heard you spoke up in Showdown this week. Were you nervous before you did it?`,
                            why:'Names the risk rather than the answer, so the brave part is what gets remembered.',
                            follow:`What made you decide to do it anyway?` }),
  persistence:        d=>({ q:`Somebody told me you went back to a question you got wrong. What made you try it again?`,
                            why:'Asks about the restart — the behavior you actually want repeated.',
                            follow:`Did it feel different the second time?` }),
  collaboration:      d=>({ q:`Who was in your group this week, and what did you end up doing?`,
                            why:'Two questions in one, and neither can be answered with "fine".',
                            follow:`Who had the best idea?` }),
  kindness:           d=>({ q:`I heard you looked out for somebody this week. What happened?`,
                            why:`Lets ${d.first} tell the story rather than accept a compliment.`,
                            follow:`How did they seem after?` }),
  independence:       d=>({ q:`What's something you got started on this week without anybody telling you to?`,
                            why:'Independence is invisible unless somebody names it out loud.',
                            follow:`Was that hard or easy?` }),
  self_advocacy:      d=>({ q:`Was there a moment this week you had to speak up for yourself?`,
                            why:'Asking for help is a skill, not a failure — this frames it that way.',
                            follow:`Who did you ask?` }),
  academic_confidence:d=>({ q:`You picked the harder one this week. What made you go for it?`,
                            why:'Turns a choice into an identity: "I\'m someone who picks the hard one."',
                            follow:`Would you pick it again?` }),
  regulation:         d=>({ q:`What part of the school day is hardest to switch into?`,
                            why:'Gets at the transition rather than the behavior, which is usually the real trigger.',
                            follow:`What would make that part easier?` }),
  transitions:        d=>({ q:`Which part of the day do you wish you could skip?`,
                            why:'A child will name a specific twenty minutes long before they can name a feeling.',
                            follow:`What happens right before that?` }),
  redirections:       d=>({ q:`When you have to work on your own, what makes it hard to stay with it?`,
                            why:'Asks about the conditions, not the character.',
                            follow:`Where do you sit when you work best?` }),
  group_conflict:     d=>({ q:`Was there anything today you'd want a do-over on?`,
                            why:'Non-accusing, and it works whether or not anything happened.',
                            follow:`What would you do differently?` }),
  help_before_trying: d=>({ q:`What's one thing you could try before you ask for help next time?`,
                            why:'Makes the strategy concrete and small enough to actually use tomorrow.',
                            follow:`Want to pick one together?` }),
  wondering:          d=>({ q:`What's something you wondered about today?`,
                            why:'Signals that questions are the interesting part, not the answers.',
                            follow:`How could we find out?` }),
};

const STARTER_FROM_HOME = {
  tried_hard_thing:   d=>({ q:`You stuck with that thing you couldn't do at first. How did you know not to quit?`,
                            why:`Puts the strategy in ${d.first}'s own words, which is what makes it repeatable.`,
                            follow:`What was the moment it started working?` }),
  did_it_alone:       d=>({ q:`You started your homework by yourself. What made it easier this time?`,
                            why:'Finds the condition that worked so you can reproduce it.',
                            follow:`Do you want to do it that way tomorrow?` }),
  curious_question:   d=>({ q:`You asked me something good this week. Did you keep thinking about it?`,
                            why:'Shows that a question you asked was worth remembering.',
                            follow:`What do you think the answer is?` }),
  friend_stuff:       d=>({ q:`How are things with your friends this week — same as usual, or different?`,
                            why:'Offers a scale instead of a yes/no, which is much easier to answer honestly.',
                            follow:`Who are you sitting with at lunch?` }),
  rough_moment:       d=>({ q:`Yesterday was hard. What would have helped in that moment?`,
                            why:'Comes back to it calmly and treats them as the expert on themselves.',
                            follow:`Want to try that next time?` }),
  homework_battle:    d=>({ q:`What's the worst part of starting homework — the starting, or the work?`,
                            why:'A forced choice between two real options gets a straighter answer than "why won\'t you start?"',
                            follow:`What if we only did the first one together?` }),
};

/* ── THE BANK · 60 ways to ask about a day ─────────────────────────
   None of them is "How was school?". That question asks a child to
   summarize seven hours and deliver a verdict, so it gets "fine".
   Every one of these is specific, retrieves a memory rather than a
   judgment, and cannot be closed with one word.
   `tag` groups them; the engine rotates within and across groups. */
const STARTERS_ALWAYS = [
  /* ── anchors · the day itself ─────────────────────────── */
  { tag:'anchor', q:`What was the funniest thing that happened today?`,
    why:`Asks for a story instead of a verdict — and stories are where the actual information is.`,
    follow:`Who else thought it was funny?` },
  { tag:'anchor', q:`What was the hardest part of today?`,
    why:`Gives permission for the day to have been hard, which is usually what "fine" is covering.`,
    follow:`Did it get easier, or did it just end?` },
  { tag:'anchor', q:`Rate today out of ten — and tell me what the missing points were.`,
    why:`The number is a warm-up. The missing points are the real question, and children answer it precisely.`,
    follow:`What would have made it a ten?` },
  { tag:'anchor', q:`What do you know now that you didn't know this morning?`,
    why:`Reframes learning as something that happened to them, not something they were tested on.`,
    follow:`Who told you, or did you work it out?` },
  { tag:'anchor', q:`If you only got to tell me one thing about today, what would it be?`,
    why:`Forces a choice, which surfaces what actually mattered instead of what happened first.`,
    follow:`Why that one?` },
  { tag:'anchor', q:`What was the loudest part of your day?`,
    why:`A sensory question is easy to answer and almost always leads somewhere.`,
    follow:`Were you part of the loud, or near it?` },
  { tag:'anchor', q:`Did today go fast or slow?`,
    why:`Pace is how children experience a day. The answer tells you more than a list of subjects would.`,
    follow:`Which part dragged?` },
  { tag:'anchor', q:`What's the first thing you'd change about today?`,
    why:`Invites a small complaint, which is often the door to the real thing.`,
    follow:`Could you change it tomorrow?` },
  { tag:'anchor', q:`Where were you standing when the best part of today happened?`,
    why:`Anchoring to a place reliably retrieves a memory that "what happened" doesn't.`,
    follow:`Who was with you?` },
  { tag:'anchor', q:`What's something that happened today that you didn't expect?`,
    why:`Surprise is memorable, so this is one of the easiest questions to answer honestly.`,
    follow:`Was it a good surprise?` },

  /* ── people ───────────────────────────────────────────── */
  { tag:'people', q:`Who did you sit with at lunch?`,
    why:`The most reliable social question there is — one factual answer, no judgment in it.`,
    follow:`Is that who you usually sit with?` },
  { tag:'people', q:`Who did you help today?`,
    why:`Assumes competence and generosity, and gives a child a role to describe rather than a grade.`,
    follow:`Did they figure it out?` },
  { tag:'people', q:`Who helped you today?`,
    why:`Normalizes needing help by asking about it as an ordinary event.`,
    follow:`Did you ask, or did they notice?` },
  { tag:'people', q:`Who made you laugh?`,
    why:`Finds the person your child actually enjoys, which is rarely the one they name as a "best friend".`,
    follow:`What did they do?` },
  { tag:'people', q:`Did anyone seem like they were having a hard day?`,
    why:`Practises noticing other people, and often reveals something about your own child's day sideways.`,
    follow:`Did anybody check on them?` },
  { tag:'people', q:`Was there anyone new to talk to today?`,
    why:`Low-stakes way into the social map without asking about friendships directly.`,
    follow:`Would you talk to them again?` },
  { tag:'people', q:`Who would you want on your team for absolutely anything?`,
    why:`Gets at trust rather than popularity, and children answer it fast.`,
    follow:`What makes them good to have?` },
  { tag:'people', q:`Did anybody surprise you today?`,
    why:`Opens room for a good surprise or a bad one without steering toward either.`,
    follow:`Had they done that before?` },
  { tag:'people', q:`Who did you say something nice to?`,
    why:`Asks about kindness as an action they took, not a quality they have.`,
    follow:`How did they react?` },
  { tag:'people', q:`If your class got a team name today, what should it be?`,
    why:`A playful question that quietly reports the mood of the whole room.`,
    follow:`What would last week's have been?` },

  /* ── effort and mistakes ──────────────────────────────── */
  { tag:'effort', q:`What's something you tried even though you might get it wrong?`,
    why:`Names the risk rather than the result, so the brave part is what gets remembered.`,
    follow:`What made you decide to try it anyway?` },
  { tag:'effort', q:`What did you get wrong today, and what happened next?`,
    why:`The second half is the whole question — it treats a mistake as a thing with an afterwards.`,
    follow:`Would you do the same next time?` },
  { tag:'effort', q:`Did you have to try anything twice?`,
    why:`Asks about the restart, which is the behaviour you actually want repeated.`,
    follow:`Was the second try different?` },
  { tag:'effort', q:`What do you do first when you get stuck?`,
    why:`Surfaces the strategy in their own words, which is what makes it repeatable.`,
    follow:`Does it usually work?` },
  { tag:'effort', q:`What's something that was hard at the start and easier by the end?`,
    why:`Builds the idea that difficulty is a stage, not a verdict.`,
    follow:`When did it start feeling easier?` },
  { tag:'effort', q:`What are you better at than you were last week?`,
    why:`Short timescales make progress visible to a child in a way "this year" never does.`,
    follow:`How can you tell?` },
  { tag:'effort', q:`Was there a moment you nearly gave up but didn't?`,
    why:`Invites them to describe persistence as a decision they made.`,
    follow:`What kept you going?` },
  { tag:'effort', q:`What did you need help with today?`,
    why:`Frames asking for help as normal and expected rather than as a failure.`,
    follow:`Was it easy to ask?` },
  { tag:'effort', q:`Did you ask a question out loud today?`,
    why:`Speaking up in front of peers is a bigger risk than adults remember.`,
    follow:`Was anyone else wondering the same thing?` },
  { tag:'effort', q:`What was the bravest thing you did today?`,
    why:`Lets a child define bravery for themselves, which is usually smaller and truer than you'd guess.`,
    follow:`Was anyone watching?` },

  /* ── curiosity and learning ───────────────────────────── */
  { tag:'curious', q:`Tell me one thing that made you go "huh".`,
    why:`Asks for curiosity rather than achievement, and children answer it far more often than adults expect.`,
    follow:`Do you want to know more about it?` },
  { tag:'curious', q:`What did you wonder about today?`,
    why:`Signals that questions are the interesting part, not the answers.`,
    follow:`How could we find out?` },
  { tag:'curious', q:`Teach me one thing you learned today.`,
    why:`Explaining is the step that turns something remembered into something understood.`,
    follow:`What part is hard to explain?` },
  { tag:'curious', q:`What's something you learned that seems weird to you?`,
    why:`"Weird" gives a child permission to find school strange, which is often where real thinking starts.`,
    follow:`Weird good or weird confusing?` },
  { tag:'curious', q:`If you could ask your teacher one thing, what would it be?`,
    why:`Reveals the question they didn't feel able to ask in the room.`,
    follow:`Could you ask tomorrow?` },
  { tag:'curious', q:`What's something you want to know more about?`,
    why:`Points at the interest worth feeding, which is rarely the subject they're graded best in.`,
    follow:`Where could we look?` },
  { tag:'curious', q:`What was the most interesting thing anybody said today?`,
    why:`Widens the field beyond the lesson to include everything they overheard.`,
    follow:`Who said it?` },
  { tag:'curious', q:`Was there a question nobody could answer today?`,
    why:`An unanswered question is an invitation, and children remember them vividly.`,
    follow:`What do you think the answer is?` },
  { tag:'curious', q:`What's something you figured out without being told?`,
    why:`Independent thinking is invisible unless somebody names it out loud.`,
    follow:`How did you work it out?` },
  { tag:'curious', q:`What would you put in a museum about today?`,
    why:`Concrete and playful, and it forces a choice about what mattered.`,
    follow:`What would the label say?` },

  /* ── feelings and hard moments ────────────────────────── */
  { tag:'feeling', q:`What part of the day would you skip if you could?`,
    why:`A child will name a specific twenty minutes long before they can name a feeling.`,
    follow:`What happens right before that part?` },
  { tag:'feeling', q:`When did you feel most like yourself today?`,
    why:`Finds the conditions where your child is comfortable, which is worth knowing and worth protecting.`,
    follow:`Who else was there?` },
  { tag:'feeling', q:`Was there anything today you'd want a do-over on?`,
    why:`Non-accusing, and it works whether or not anything actually happened.`,
    follow:`What would you do differently?` },
  { tag:'feeling', q:`What made you feel proud today?`,
    why:`Asks for their own standard rather than yours.`,
    follow:`Did anyone notice?` },
  { tag:'feeling', q:`Was anything unfair today?`,
    why:`Fairness is the frame children think in, so this gets straighter answers than "was anything wrong".`,
    follow:`What would have been fair?` },
  { tag:'feeling', q:`When did you feel calm today?`,
    why:`Locating calm is more useful than locating stress, because calm can be repeated on purpose.`,
    follow:`What made it calm?` },
  { tag:'feeling', q:`What annoyed you today?`,
    why:`Small and specific, and it very often opens onto something larger.`,
    follow:`Does that happen a lot?` },
  { tag:'feeling', q:`Did anything worry you today?`,
    why:`Asked plainly and without alarm, so a child can answer plainly.`,
    follow:`Is it still worrying you now?` },
  { tag:'feeling', q:`When did you feel included today?`,
    why:`Asks about belonging from the positive side, which is easier to answer honestly.`,
    follow:`Who made that happen?` },
  { tag:'feeling', q:`Was there a moment you felt left out?`,
    why:`Direct, but only ask it once you've asked the one above — order matters.`,
    follow:`What would have helped?` },

  /* ── sideways and imaginative ─────────────────────────── */
  { tag:'sideways', q:`If you were the teacher tomorrow, what would you change?`,
    why:`Sideways route into how school actually feels, with none of the pressure of being asked directly.`,
    follow:`What would you keep exactly the same?` },
  { tag:'sideways', q:`If today were a weather report, what would it say?`,
    why:`Gives a child a way to describe a mood without needing the vocabulary for it.`,
    follow:`What's the forecast for tomorrow?` },
  { tag:'sideways', q:`What colour was today?`,
    why:`Sounds like a game, works like a mood check, and gets answered instantly.`,
    follow:`What colour was yesterday?` },
  { tag:'sideways', q:`If today were a movie, what would it be called?`,
    why:`A title forces a summary, and children summarize far more honestly in play than on request.`,
    follow:`Who's the main character?` },
  { tag:'sideways', q:`What should somebody invent to make school better?`,
    why:`The invention always points at the actual problem.`,
    follow:`Who would use it most?` },
  { tag:'sideways', q:`If you could swap jobs with anyone at school for a day, who?`,
    why:`Reveals who they admire, envy, or don't understand — all useful.`,
    follow:`What would you do first?` },
  { tag:'sideways', q:`What's one school rule you'd keep exactly as it is?`,
    why:`Asking what's working is unusual enough that children think properly about it.`,
    follow:`What would happen without it?` },
  { tag:'sideways', q:`If your day had a soundtrack, what would be playing right now?`,
    why:`A wind-down question that lands emotional information without asking for it.`,
    follow:`What was playing this morning?` },

  /* ── looking forward ──────────────────────────────────── */
  { tag:'forward', q:`What are you looking forward to tomorrow?`,
    why:`Ends the conversation pointing forwards, which is a good place to leave a child at bedtime.`,
    follow:`Is there anything you're not looking forward to?` },
  { tag:'forward', q:`What do you want to do differently tomorrow?`,
    why:`Turns reflection into a plan, and keeps it small enough to actually happen.`,
    follow:`What would help you remember?` },
];

const STARTER_WHY_THIS_WORKS = [
  'Specific beats general — "who did you sit with" gets answered, "how was school" gets "fine".',
  'Ask for a memory, not a verdict. Children can retrieve moments long before they can summarize days.',
  'Make it impossible to close with one word.',
  'Ask about the attempt, not the outcome. What you ask about is what they think matters.',
  'One question, then be quiet longer than feels comfortable.',
];

/* Each child picks a Boggie in Showdown; it follows them into Loop.
   It is the only piece of the classroom's personality that belongs at home. */
const DEFAULT_BOGGIE = { maya:'starpop', ezra:'coco' };

/* ── SETTINGS ──────────────────────────────────────────────────────
   Defaults are the product's ethics written down. The child-privacy
   ones are deliberately NOT parent-configurable defaults-off. */
const DEFAULT_PREFS = {
  weeklyDay:'Sunday',
  weeklyTime:'8:00 AM',
  dailyMoment:true,
  dailyTime:'4:30 PM',
  teacherAlerts:true,
  quietUntilPattern:true,     // never notify on a single event
  childSeesLevels:false,      // hard product rule, shown read-only
  teacherSeesCheckins:false,  // hard product rule, shown read-only
  shareWithSchool:true,
  language:'English',
};

/* ── CLASSROOM UPDATES ─────────────────────────────────────────────
   Whole-class posts from the teacher, threaded into the School log
   alongside the per-child Showdown signals. Photos are a designed
   affordance — nothing uploads yet, so `photo` renders a placeholder. */
const CLASS_UPDATES = [
  { d:'2026-08-22', from:'Ms. Alvarez', kind:'update', photo:true,
    body:'Showdown finals today — every team made it to the last round. Ask your kids who they picked for their team name.' },
  { d:'2026-08-20', from:'Ms. Alvarez', kind:'update',
    body:'We start our unit on multiplication strategies Monday. No supplies needed — just a good night\'s sleep.' },
  { d:'2026-08-18', from:'ClassCade', kind:'system',
    body:'New Boggies unlocked for the class this week.' },
];
