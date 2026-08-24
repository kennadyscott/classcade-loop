# ClassCade Loop — prototype

**http://localhost:4216** · served permanently by launchd agent `com.kennadyscott.classcade-loop`
(python http.server, `~/.claude-apps/classcade-loop`). Logs: `/tmp/classcade-loop.log`.

> ClassCade Loop turns the little things teachers, parents, and kids notice
> into a bigger picture of how a child is doing.

Static HTML/CSS/JS. No backend, no build. All demo state is `localStorage` under `loop.v1.*` —
which is what lets the reciprocal loop actually close across the three surfaces in one browser.

---

## Files

| File | What it is |
|---|---|
| `index.html` | Concept + strategy page. The emotional problem, product architecture, the loop diagram, the six dimensions, the signal→dimension map, engine rules, the weekly ritual, rollout phases, both tiers, three revenue channels. Start here when showing anyone. |
| `parent.html` | 🏠 **Home** — the dashboard. Week-at-a-glance hero, Whole Learner row, today's 5-minute moment, ClassCade coins, what-happened-at-school feed, right rail. |
| **The starters section** | On `parent.html`, directly under the hero — *Instead of "How was school today?"*. The daily ritual. Content in `STARTER_FROM_SIGNAL` / `STARTER_FROM_HOME` / `STARTERS_ALWAYS`; generator is `LOOP.starters()`. |
| `growth.html` | 🌱 **Growth** — per-dimension deep dive: full insight, facets, "is this normal?" for the grade, the complete audit trail of every signal feeding it, and the reply-to-teacher control. |
| `ask.html` | 💬 **Ask** — "I'm noticing something…". Eight seeded concerns, each answered in four parts. Conference question generator built from the child's real read. Crisis resources, never paywalled. |
| `teacher.html` | 🧑‍🏫 "What should I know?" — class list + home insight + acknowledge. |
| `student.html` | 👧 "This is what I'm working on." — My Focus, three stars, check-in. |
| `kids.html` | 👥 **My Kids** — one card per child, per-child connection state, and the Boggie picker. Tier is a per-child property here, not an account one. |
| `school.html` | 🏫 **School** — the raw, unfiltered Showdown feed with coins and filters, plus teacher notes. Exists so every interpretation elsewhere is auditable. |
| `messages.html` | ✉️ **Messages** — the structured exchange log. The page where "Loop is not a messaging app" is enforced rather than asserted. |
| `settings.html` | ⚙️ **Settings** — plan, the weekly/daily rhythm, sharing, export, and two child-privacy rules shown as locked and un-toggleable. |
| `boggies/` | 11 circular Boggie medallions generated from `~/Documents/ClearK12/ClearK12 Imagery/Boggies/` — cropped, background blurred and desaturated, alpha-masked. Regenerate with the PIL snippet in this README's history. |
| `loop.data.js` | **All content.** Dimensions, signals + weights, home observations, child prompts, roster, seeded events, narrator copy. Edit here, never in the pages. |
| `loop.engine.js` | Signal aggregation, guardrails, and the narrator. |
| `loop.shell.js` | Top bar, tier toggle, toast, shared render helpers. |
| `loop.css` | ClassCade masterbrand tokens + Loop's source colors. |

The app runs in a **sidebar shell** (`mountApp()` in `loop.shell.js`) matching the dashboard mockup.
`My Kids` / `School` / `Messages` / `Settings` are deliberately greyed — not built, not faked.
The **Prototype surfaces** block in the sidebar jumps to the concept page and the teacher/student views.

Reset the demo: link at the bottom of `index.html`, or `LOOP.store.reset()` in the console.

---

## Decisions made while building

**"Whole Learner" for adults, "My Growth" for the child.** Same six dimensions, two registers.
Resolves the naming question — the parent/teacher word can be clinical-adjacent because those
readers want a framework; the child's word has to be about *them*.

**Every insight is visibly sourced.** School = ClassCade blue, home = teal, child = violet.
A parent should never have to guess whether a claim came from the classroom or from their own tap.

**The 240-character cap on the parent's reply is the feature.** It is the only thing standing
between this and email. Three taps + one line, or nothing.

**The child never sees a level, a trend, or a score.** Not hidden behind a toggle — not computed
for that surface at all. They see what they're practicing and what they did.

**Family mode genuinely degrades.** Flip the toggle to Family and school signals stop feeding the
engine: four of Maya's six dimensions fall back to "Getting to know", the return channel disappears
(there's no teacher to answer), and the connect upsell appears. That degradation is the argument
for the day-one architecture — it proves Loop stands alone and gets better connected, rather than
claiming it.

**Insights rank by movement, not by standing score.** A dimension that has been thriving all year
isn't news; the week it started moving is. Priority = delta × 3, minus a penalty for having already
been high, plus a small tiebreak on score. Anything at "needs attention" jumps the queue.

**Evidence must support the direction it's cited for.** Early version listed "needed a reset after
a transition" as proof that resilience was *improving*, because it sorted by magnitude and ignored
sign. Fixed — but worth remembering, because an LLM narrator will make exactly this mistake and it
is the kind of error that destroys a parent's trust in one reading.

**ClassCade brand wins over the original earth-tone direction.** The Root & Rise notes called for
warm greens, plant metaphors, and "not bright primary school colors." Loop is a ClassCade product, and
the dashboard mockup confirmed the ClassCade look, so the shell is navy/blue/gold. What carried over
is the *tone*, not the palette: calm, non-judgmental, no performance language. **Each dimension does
get its own color** (Confidence violet, Curiosity amber, Connection pink, Independence orange,
Resilience teal, Learning blue) — that came from the mockup and it does real work, since a parent
learns to recognize an area by color before they read the word.

**Status words only, never numbers.** `LANGUAGE` in `loop.data.js` holds the allowed vocabulary
(Emerging · Building · Growing · Strong · On track · Needs attention) and the banned list
(Below benchmark · Deficient · At risk · Behind · Percentile · Compared to peers). Every parent-facing
string goes through it. `Building` exists specifically for the real-but-early case that would
otherwise get rounded down to "On track" and read as nothing happening.

**Coins are shown but never counted.** Showdown's currency appears on the dashboard because a parent
already hears about it at dinner. It never feeds a dimension. If coins ever become the headline, Loop
has collapsed back into the "+1 Persistence" feed it exists to replace.

**"I'm noticing something…" is never behind the paywall,** and neither are the crisis resources. Every
answer has the same four parts — what it might mean · what to watch for · one small next step · when
to ask for more help — and every one ends by saying Loop is not clinical.

**"How was school today?" is the question Loop exists to replace.** It asks a child to summarize
seven hours and deliver a verdict, so they say "fine". The starters section answers it three ways:
a question **grounded** in something Loop knows happened ("Because at school: cheered for a teammate
who got one wrong" → *"I heard you looked out for somebody this week. What happened?"*), a
*why this works* line so the parent learns the pattern rather than just borrowing the question, and a
follow-up for when it lands. Grounded questions come first because they are the ones a parent could
not have asked on their own — that is the moment the subscription justifies itself.

One rule baked into the generator: **at least one question is always a generic one.** A parent should
never be left with three questions that only work because Loop had data — the ritual has to survive a
quiet week, a school holiday, and a lapsed Connected plan.

**The brand lockup is drawn, not imaged.** `brandMark()` in `loop.shell.js` renders the ClassCade spark
and the Loop wordmark as inline SVG, so it stays crisp at any size and recolors for light surfaces. The
two o's are overlapping rings — blue from school, gold from home, navy where they meet. **That overlap
is the entire product thesis**, which is why the mark is worth drawing properly rather than dropping in
a PNG.

**Boggies appear in exactly five places, and never as decoration.** The child's own Boggie on the
student surface ("Starpop is working on this with you"), the sidebar prompt to ask about it by name, the
coin card (a Boggie is what coins buy), a friendly face on cold-start and empty states, and the picker
on My Kids. The rule: a Boggie shows up where a *child* is the subject. It never appears next to an
insight, a concern, or anything a parent might be worried about — cheerful art next to "meltdowns after
school" would read as glib.

**Web ⇄ App toggle.** Top-right on every page, persisted in `loop.v1.view`. The phone frame is pure
CSS over identical markup and identical data, so anything that breaks in app view is genuinely broken —
it is a responsive test, not a mockup. In app view the sidebar becomes a five-tab bar and the two
surfaces that don't fit (My Kids, Messages) move into a **More** sheet rather than becoming unreachable.

**Children have pronoun fields.** `ROSTER[].pron` drives every narrated sentence. A product that
writes prose about someone's child cannot infer this.

---

## Engine rules (all in `loop.engine.js`)

- Rolling **21-day window**, recency-weighted, ≈9-day half-life
- Source trust: `school 1.0` · `home 0.85` · `child 0.7` — Showdown is passive and repeated, so it
  outranks a parent tap, which outranks a single-tap mood
- **3+ signals** before a dimension says anything; otherwise cold-start ("Getting to know Maya")
- A direction needs **2+ events pointing the same way this week**. One good day is not a trend
- Levels: Thriving / Growing / On track / Needs attention. Parents never see the number
- `SIGNALS[x].w` fans one signal into several dimensions with weights — a signal is evidence, not a score

In production, `NARRATIVE` is where the model generates instead of templating. The *shape* stays
identical: headline → sourced evidence → why it matters → one question → one thing to try.

---

## Open questions

1. **Curiosity has no school source.** None of the eight Showdown signals feeds it. As specced, a
   connected family sees five dimensions lit by school and one that isn't — which reads like a bug.
   Either Showdown captures something like **Wondering** (a student asking their own question,
   choosing to go deeper — it's stubbed in `SIGNALS` as `proposed:true`), or Curiosity is labeled
   home-sourced on purpose.
2. **Where does Loop actually live?** Its own app, a tab inside ClassCade, or a parent-only PWA?
   Affects auth: parents are not ClassCade users today.
3. **Who owns the child's check-in data?** The student surface says the teacher doesn't see it.
   That promise is easy to make in a prototype and hard to keep in a school product.
4. **The safety layer from the Root & Rise brief is not in here.** Acute-signal detection,
   mandatory reporting, COPPA if a child interacts directly. Still the blocker it was in July —
   see `~/Documents/Claude/root-and-rise/BUILD_BRIEF.md`.
5. **Teacher-added observations are stored but not yet narrated home.** `LOOP.store.addTeacher()`
   writes them; nothing on the parent surface reads them back yet.
6. **Boggie art is cropped, not cut out.** The source renders have busy sci-fi backgrounds; the
   medallions blur and desaturate everything outside the center rather than removing it. Production
   wants proper transparent-background exports from whoever made them.
7. **The child switcher is real UI over one seeded child.** `FAMILY` has Maya (connected) and Ezra
   (not connected) to make the point that tier is a *per-child* state, not an account one — but only
   Maya has data.
8. **Grade expectations only exist for grade 3.** `GRADE_EXPECTATIONS` is the shape; production needs
   K–8 written by someone who knows the developmental literature.
9. **The Ask library is eight hand-written concerns.** In production this is where a model generates,
   but the four-part shape and the "when to seek support" discipline must survive that change.
