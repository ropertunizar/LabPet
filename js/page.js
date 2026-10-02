// Interactive pieces of the project page: agent-loop stepper, memory file
// browser, tabbed examples and the question/answer browser.

// Selection of evaluation questions with the robot's answers, taken from the
// experiment logs. `miss` marks the errors discussed in the paper.
const QA = [
  // Tier 1 — single-person recall
  { tier: 't1', q: 'What is María working on?',
    tools: ['search'],
    a: 'Maria Peribañez is a first-year PhD student working on affordance prediction.' },
  { tier: 't1', q: "What is David's research area, and how far along is he?",
    tools: ['get_person'],
    a: "David Morilla is a PhD student working on active perception, and he's approaching the end of his PhD journey!" },
  { tier: 't1', q: 'Who does Ana supervise?',
    tools: [],
    a: 'Ana Murillo supervises Fernando and César.' },
  { tier: 't1', q: "What is Ana's research area?",
    tools: ['get_person'],
    a: "Ana Murillo is the lab lead and a professor. While her specific research area isn't listed, she supervises work in Computer Vision and AI." },
  { tier: 't1', q: 'What did María want to know when she spoke to you?',
    tools: ['search'],
    a: 'Maria wanted an overview of the lab rules, so I explained the safety, workspace, and network protocols to her.' },
  { tier: 't1', q: 'Why did David want to hold a lunch?', miss: true,
    tools: ['read_note'],
    a: "The notes only mention that he proposed the lab lunch, but they don't say why he wanted to organize it. He was just very excited about it!",
    why: 'The reason (celebrating accepted papers) was overwritten in memory during seeding. The robot admits it does not know instead of guessing.' },

  // Tier 2 — cross-person and role lookup
  { tier: 't2', q: 'Is there a technician in the lab? Who?',
    tools: ['search'],
    a: 'Yes, Juan Dendarieta is the lab technician here, and he works with drones.' },
  { tier: 't2', q: 'Who is the lab lead?',
    tools: ['search'],
    a: 'Ana Murillo is the lab lead.' },
  { tier: 't2', q: "I'm new and want to know the lab rules. Who has asked about those before?",
    tools: ['search'],
    a: 'Maria Peribañez asked for an overview of the lab rules recently. I explained the safety, workspace, and network protocols to her.' },
  { tier: 't2', q: 'Who should I contact to ask about the drones?',
    tools: ['search'],
    a: 'You should contact Juan Dendarieta, the lab technician. He works with drones!' },
  { tier: 't2', q: 'Which PhD students do you know, and what does each work on?',
    tools: ['search'],
    a: 'I know two PhD students: David Morilla, who is working on active perception, and Maria Peribañez, who is working on affordance prediction.' },
  { tier: 't2', q: 'Who is the most senior PhD student you know?',
    tools: ['search'],
    a: "That would be David Morilla, as he's in his last year and approaching the end of his PhD journey." },
  { tier: 't2', q: 'I want to talk to someone about perception-related research. Who could I approach?',
    tools: ['search'],
    a: 'You could talk to David Morilla, who is working on active perception, or Maria Peribañez, who is working on affordance prediction. Both of those are related to perception!' },
  { tier: 't2', q: 'Who in the lab works with vision or images?',
    tools: ['search'],
    a: 'Ana Murillo supervises research in Computer Vision and AI, and Maria Peribañez works on affordance prediction, which is a vision-related area!' },
  { tier: 't2', q: 'Who reports to Ana?',
    tools: ['search'],
    a: 'Ana Murillo supervises Fernando and César.' },

  // Tier 3 — group level
  { tier: 't3', q: 'What topics does the lab work on?',
    tools: ['search'],
    a: 'The lab focuses on things like Computer Vision, AI, active perception, and affordance prediction.' },
  { tier: 't3', q: 'How many PhD students are there, and who are they?',
    tools: ['search'],
    a: "I know of at least two: David Morilla, who's wrapping up his journey, and Maria Peribañez, who's just starting her first year." },
  { tier: 't3', q: 'If I wanted to understand what the whole lab does, who should I talk to?',
    tools: ['list_lab_documents', 'search'],
    a: "You should probably talk to Professor Ana Murillo. She's the lab lead and oversees a lot of the research here!" },
  { tier: 't3', q: 'Who are the academic staff, and who are the students?',
    tools: [],
    a: 'The academic staff includes Professor Ana Murillo, who leads the lab. As for the students, I know about PhD students David Morilla and Maria Peribañez.' },
  { tier: 't3', q: 'How many people have you spoken with in the lab?', miss: true,
    tools: ['search'],
    a: 'I have profiles for five people: Manuel, David, Miguel, Maria, and Juan.',
    why: 'Ana is left out of the list. Asked why, the robot jokes: "I was just being humble!"' },

  // Tier 4 — distractors and negative probes
  { tier: 't4', q: 'What did Laura tell you about her thesis?',
    tools: ['search'],
    a: "I don't have any record of a Laura in my notes, so I don't know what she might have told me about her thesis.",
    probe: 'unknown person' },
  { tier: 't4', q: "Who is the lab's safety officer?",
    tools: ['search'],
    a: "I don't see anyone listed as a safety officer in my notes.",
    probe: 'role never established' },
  { tier: 't4', q: 'Does Fernando work on active perception?',
    tools: ['search'],
    a: "I don't have any specific details on Fernando's research, but I do know that Ana Murillo supervises him and César in Computer Vision and AI!",
    probe: 'referenced but never met' },
  { tier: 't4', q: 'What did Juan say about affordance prediction?',
    tools: ['search'],
    a: "I don't have any record of Juan saying anything about affordance prediction, but I do know that Maria Peribañez works on it!",
    probe: 'topic never discussed' },
  { tier: 't4', q: 'Which of the students is the lab lead?',
    tools: [],
    a: 'None of the students are the lab lead. That role belongs to Ana Murillo, who is a professor.',
    probe: 'false premise' },
  { tier: 't4', q: 'Is David a professor?',
    tools: [],
    a: 'No, David Morilla is a PhD student. Ana Murillo is the professor and lab lead.',
    probe: 'wrong role' },
  { tier: 't4', q: 'Fernando told you about his work, right? What was it?',
    tools: [],
    a: "I don't have any record of Fernando telling me about his work, though I do know Ana Murillo supervises him!",
    probe: 'leading question' },
  { tier: 't4', q: 'Who else was at the lunch David organized?',
    tools: ['search'],
    a: "I don't have a list of who attended the lunch, only that David was proposing it!",
    probe: 'detail never stated' },
];

const TIER_NAMES = { t1: 'T1', t2: 'T2', t3: 'T3', t4: 'T4' };

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

const QA_PREVIEW = 9;

function renderQA(filter, expanded) {
  const grid = document.getElementById('qa-grid');
  if (!grid) return;
  grid.innerHTML = '';
  let items = QA.filter(item => filter === 'all' || (filter === 'miss' ? item.miss : item.tier === filter));
  // In the "All" view show a mix of tiers first, then let the reader expand
  const more = document.getElementById('qa-more');
  if (filter === 'all' && !expanded) {
    const order = ['t1', 't2', 't3', 't4'];
    const byTier = order.map(t => items.filter(i => i.tier === t));
    const mixed = [];
    for (let k = 0; mixed.length < QA_PREVIEW; k++) {
      byTier.forEach(list => { if (list[k] && mixed.length < QA_PREVIEW) mixed.push(list[k]); });
    }
    if (more) { more.hidden = false; more.textContent = 'Show all ' + items.length + ' questions'; }
    items = mixed;
  } else if (more) {
    more.hidden = true;
  }
  items.forEach(item => {
      const card = el('article', 'qa-card' + (item.miss ? ' miss' : ''));
      const head = el('div', 'qa-head');
      head.appendChild(el('span', 'tier ' + item.tier, TIER_NAMES[item.tier]));
      if (item.probe) head.appendChild(el('span', 'probe', item.probe));
      const verdict = el('span', 'verdict ' + (item.miss ? 'bad' : 'good'));
      verdict.innerHTML = item.miss
        ? '<i class="bi bi-x-circle-fill"></i> error'
        : (item.tier === 't4' ? '<i class="bi bi-shield-check"></i> declined' : '<i class="bi bi-check-circle-fill"></i> correct');
      head.appendChild(verdict);
      card.appendChild(head);

      card.appendChild(el('p', 'qa-q', item.q));
      if (item.tools.length) {
        const tools = el('div', 'tools');
        item.tools.forEach(t => {
          const chip = el('span', 'chip');
          chip.innerHTML = '<i class="bi bi-gear-fill"></i> ';
          chip.appendChild(document.createTextNode(t));
          tools.appendChild(chip);
        });
        card.appendChild(tools);
      }
      card.appendChild(el('p', 'qa-a', item.a));
      if (item.why) card.appendChild(el('p', 'qa-why', item.why));
      grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  // Question/answer browser
  const filters = document.querySelectorAll('.qa-filters button');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderQA(btn.dataset.filter);
  }));
  const moreBtn = document.getElementById('qa-more');
  if (moreBtn) moreBtn.addEventListener('click', () => renderQA('all', true));
  renderQA('all');

  // Tabs
  document.querySelectorAll('[data-tabs]').forEach(tabs => {
    const buttons = tabs.querySelectorAll('.tab-buttons button');
    buttons.forEach(btn => btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      tabs.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      tabs.querySelector('#' + btn.dataset.tab).classList.add('active');
    }));
  });

  // Memory file browser
  const fileButtons = document.querySelectorAll('.filetree .file');
  fileButtons.forEach(btn => btn.addEventListener('click', () => {
    fileButtons.forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.fileview .mdfile').forEach(f => f.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.file);
    // main.js wraps every <pre> in a .code-container, so toggle the wrapper too
    target.classList.add('active');
    document.querySelectorAll('.fileview .code-container').forEach(c =>
      c.classList.toggle('active', c.contains(target)));
  }));
  document.querySelectorAll('.fileview .code-container').forEach(c =>
    c.classList.toggle('active', !!c.querySelector('.mdfile.active')));

  // Agent loop stepper
  const loop = document.getElementById('loop-demo');
  if (loop) {
    const steps = loop.querySelectorAll('.loop-step');
    const counter = document.getElementById('loop-counter');
    let current = 0;
    let showAll = false;
    const update = () => {
      steps.forEach((s, i) => s.classList.toggle('visible', showAll || i <= current));
      steps.forEach((s, i) => s.classList.toggle('current', !showAll && i === current));
      counter.textContent = (showAll ? steps.length : current + 1) + ' / ' + steps.length;
    };
    document.getElementById('loop-next').addEventListener('click', () => {
      showAll = false; current = Math.min(current + 1, steps.length - 1); update();
    });
    document.getElementById('loop-prev').addEventListener('click', () => {
      showAll = false; current = Math.max(current - 1, 0); update();
    });
    document.getElementById('loop-all').addEventListener('click', () => {
      showAll = true; current = steps.length - 1; update();
    });
    update();
  }
});

// Open a collapsed transcript when a link points to it
document.addEventListener('click', function (e) {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = document.querySelector(a.getAttribute('href'));
  if (target && target.tagName === 'DETAILS') target.open = true;
});
