(function () {
  const { $, $$, esc, I, money, toast, waLink, store } = window.A;
  const { AREAS, CONTACT, PROJECTS } = window.ATOKA;
  const root = $('[data-est]');

  const TYPES = {
    'new-home': { label: 'New home', icon: 'house', note: 'Design & build on your stand', area: [60, 900, 220], kind: 'area' },
    extension: { label: 'Extension', icon: 'ext', note: 'Extra rooms, storey or cottage', area: [15, 250, 45], kind: 'area' },
    renovation: { label: 'Renovation', icon: 'hammer', note: 'Kitchens, bathrooms, re-plaster', area: [20, 600, 120], kind: 'area' },
    commercial: { label: 'Commercial', icon: 'building', note: 'Offices, retail, flats, sheds', area: [150, 6000, 800], kind: 'area' },
    roofing: { label: 'Roofing', icon: 'roofI', note: 'New roof or full re-roof', area: [40, 800, 180], kind: 'area' },
    'boundary-wall': { label: 'Boundary wall', icon: 'wall', note: 'Precast, brick or palisade', kind: 'wall' },
  };
  const FINISH = {
    standard: { label: 'Standard', note: 'Durable, practical, great value', rate: 380, roof: 55 },
    premium: { label: 'Premium', note: 'Upgraded fittings, tiles & joinery', rate: 560, roof: 78 },
    luxury: { label: 'Luxury', note: 'Architectural finishes throughout', rate: 820, roof: 115 },
  };
  const TYPE_K = { 'new-home': 1, extension: 1.08, renovation: 0.42, commercial: 0.92 };
  const EXTRAS = [['paving', 'Driveway paving', 4500], ['landscape', 'Landscaping', 3000], ['borehole', 'Borehole & tank', 3800], ['wall', 'Boundary wall & gate', 9000], ['pool', 'Swimming pool', 14000]];
  const WALLS = { precast: ['Precast concrete', 38], brick: ['Plastered brick', 95], palisade: ['Brick piers + palisade', 150] };
  const GATES = { none: ['No gate', 0], swing: ['Swing gate', 900], sliding: ['Motorised sliding gate', 2400] };
  const PHASES = {
    area: [['Site & substructure', 16], ['Walls & structure', 26], ['Roof', 14], ['Doors & windows', 9], ['Plumbing & electrical', 13], ['Finishes', 16], ['Prelims & management', 6]],
    renovation: [['Strip-out & repairs', 14], ['Plaster & screeds', 18], ['Plumbing & electrical', 20], ['Kitchen & bathrooms', 26], ['Finishes & paint', 16], ['Management', 6]],
    roofing: [['Strip & dispose', 10], ['Timber & trusses', 34], ['Covering', 38], ['Gutters & flashings', 12], ['Management', 6]],
    wall: [['Foundations', 24], ['Walling', 52], ['Gate & automation', 16], ['Management', 8]],
  };

  const q = new URLSearchParams(location.search);
  const initType = TYPES[q.get('type')] ? q.get('type') : '';
  const ref = PROJECTS.find((p) => p.id === q.get('ref'));
  const S = Object.assign({
    step: 1, type: initType, area: initType && TYPES[initType].area ? TYPES[initType].area[2] : 220, storeys: 1, beds: 3, finish: 'premium', extras: [],
    wallLen: 120, wallH: 2.1, wallType: 'brick', gate: 'sliding',
    site: '', km: 0, stand: 'yes', plans: 'no', when: '1-3', budget: '',
    name: '', phone: '', email: '', contact: 'whatsapp', notes: ref ? `Inspired by your ${ref.name} project.` : '', files: [],
  }, initType ? { type: initType, step: 2 } : {});

  /* ---------------- pricing model ---------------- */
  function calc() {
    const t = TYPES[S.type]; if (!t) return null;
    let total = 0, months = 0, phases;
    if (t.kind === 'wall') {
      total = S.wallLen * WALLS[S.wallType][1] * (S.wallH / 2.1) + GATES[S.gate][1];
      months = Math.max(0.5, S.wallLen / 150); phases = PHASES.wall;
    } else if (S.type === 'roofing') {
      total = S.area * FINISH[S.finish].roof; months = Math.max(0.5, S.area / 300); phases = PHASES.roofing;
    } else {
      const storeyK = 1 + (S.storeys - 1) * 0.06;
      total = S.area * FINISH[S.finish].rate * TYPE_K[S.type] * storeyK;
      months = S.type === 'commercial' ? 4 + S.area / 280 : S.type === 'renovation' ? 1 + S.area / 140 : S.type === 'extension' ? 2 + S.area / 45 : 3 + S.area / 55;
      phases = S.type === 'renovation' ? PHASES.renovation : PHASES.area;
      if (S.type === 'new-home') total += S.extras.reduce((a, k) => a + EXTRAS.find((e) => e[0] === k)[2], 0);
    }
    const loc = S.km > 200 ? 1.1 : S.km > 60 ? 1.05 : 1;
    total *= loc;
    const design = S.plans === 'help' ? total * 0.045 : 0;
    total += design;
    return { mid: total, low: total * 0.9, high: total * 1.15, months: Math.round(months * 2) / 2, phases, design, loc };
  }
  const round = (n) => Math.round(n / 100) * 100;
  const dur = (m) => m < 1 ? `${Math.round(m * 4.3)} weeks` : `${m} month${m === 1 ? '' : 's'}`;

  /* ---------------- views ---------------- */
  const LABELS = ['Project', 'Size & spec', 'Site & timing', 'Your details', 'Estimate'];
  const stepper = () => `<ol class="stepper">${LABELS.map((l, i) => `<li class="${S.step === i + 1 ? 'on' : ''}${S.step > i + 1 ? ' done' : ''}"><button ${S.step > i + 1 && S.step < 5 ? `data-go="${i + 1}"` : 'disabled'}><i>${S.step > i + 1 ? I.check : i + 1}</i>${l}</button></li>`).join('')}</ol>`;

  function v1() {
    return `<h2 class="title co-h">What are you planning to build?</h2>
      <div class="opt-grid est-types">${Object.entries(TYPES).map(([k, t]) => `<button class="opt${S.type === k ? ' on' : ''}" data-type="${k}">${I[t.icon]}<b>${t.label}</b><small>${t.note}</small></button>`).join('')}</div>`;
  }
  function v2() {
    const t = TYPES[S.type];
    if (t.kind === 'wall') return `<h2 class="title co-h">Tell us about the wall</h2>
      <div class="field"><label>Wall length: <b data-out="wallLen">${S.wallLen} m</b></label><input type="range" min="10" max="600" step="5" value="${S.wallLen}" data-f="wallLen"></div>
      <div class="field" style="margin-top:16px"><label>Height</label><div class="seg">${[1.8, 2.1, 2.4].map((h) => `<button data-set="wallH" data-v="${h}" class="${S.wallH === h ? 'on' : ''}">${h} m</button>`).join('')}</div></div>
      <div class="field" style="margin-top:16px"><label>Wall type</label><div class="opt-grid">${Object.entries(WALLS).map(([k, [l, r]]) => `<button class="opt${S.wallType === k ? ' on' : ''}" data-set="wallType" data-v="${k}"><b>${l}</b><small>from ${money(r)}/m</small></button>`).join('')}</div></div>
      <div class="field" style="margin-top:16px"><label>Gate</label><div class="opt-grid">${Object.entries(GATES).map(([k, [l, r]]) => `<button class="opt${S.gate === k ? ' on' : ''}" data-set="gate" data-v="${k}"><b>${l}</b><small>${r ? money(r) : '—'}</small></button>`).join('')}</div></div>`;
    const [mn, mx] = t.area;
    const isHome = S.type === 'new-home' || S.type === 'extension';
    return `<h2 class="title co-h">Size and specification</h2>
      <div class="field"><label>${S.type === 'roofing' ? 'Roof area' : 'Floor area'}: <b data-out="area">${S.area.toLocaleString()} m²</b></label>
        <input type="range" min="${mn}" max="${mx}" step="${mx > 1000 ? 50 : 5}" value="${Math.min(mx, Math.max(mn, S.area))}" data-f="area">
        <div class="range-lbl"><span>${mn} m²</span><span>${mx.toLocaleString()} m²</span></div>
        ${S.type === 'new-home' ? '<small class="muted">Tip: a 3-bed family home is typically 160–240 m².</small>' : ''}</div>
      ${S.type !== 'roofing' && S.type !== 'renovation' ? `<div class="row-2" style="margin-top:16px">
        <div class="field"><label>Storeys</label><div class="seg">${[1, 2, 3].map((n) => `<button data-set="storeys" data-v="${n}" class="${S.storeys === n ? 'on' : ''}">${n}</button>`).join('')}</div></div>
        ${isHome ? `<div class="field"><label>Bedrooms</label><div class="seg">${[1, 2, 3, 4, 5, 6].map((n) => `<button data-set="beds" data-v="${n}" class="${S.beds === n ? 'on' : ''}">${n}${n === 6 ? '+' : ''}</button>`).join('')}</div></div>` : ''}
      </div>` : ''}
      <div class="field" style="margin-top:18px"><label>Finish level</label><div class="opt-grid" style="grid-template-columns:repeat(3,1fr)">${Object.entries(FINISH).map(([k, f]) => `<button class="opt${S.finish === k ? ' on' : ''}" data-set="finish" data-v="${k}"><b>${f.label}</b><small>${f.note}</small><small style="color:var(--ink)">~${money(S.type === 'roofing' ? f.roof : f.rate * (TYPE_K[S.type] || 1))}/m²</small></button>`).join('')}</div></div>
      ${S.type === 'new-home' ? `<div class="field" style="margin-top:18px"><label>Extras</label><div class="extras">${EXTRAS.map(([k, l, c]) => `<label class="check extra"><input type="checkbox" data-extra="${k}" ${S.extras.includes(k) ? 'checked' : ''}><span>${l}</span><small>+${money(c)}</small></label>`).join('')}</div></div>` : ''}`;
  }
  function v3() {
    return `<h2 class="title co-h">Where and when?</h2>
      <div class="row-2"><div class="field"><label for="e-site">Site location</label><select class="select" id="e-site" data-f="site"><option value="">Choose area…</option>${AREAS.map((a) => `<option ${S.site === a.name ? 'selected' : ''}>${a.name}</option>`).join('')}</select></div>
      <div class="field"><label for="e-budget">Budget in mind (optional)</label><select class="select" id="e-budget" data-f="budget">${['', 'Under $25k', '$25k – $75k', '$75k – $150k', '$150k – $300k', '$300k +'].map((b) => `<option value="${b}" ${S.budget === b ? 'selected' : ''}>${b || 'Prefer not to say'}</option>`).join('')}</select></div></div>
      <div class="field" style="margin-top:18px"><label>Do you already own the stand / property?</label><div class="seg">${[['yes', 'Yes'], ['buying', 'Buying one'], ['no', 'Not yet']].map(([k, l]) => `<button data-set="stand" data-v="${k}" class="${S.stand === k ? 'on' : ''}">${l}</button>`).join('')}</div></div>
      <div class="field" style="margin-top:18px"><label>Approved plans?</label><div class="opt-grid">${[['yes', 'Yes, approved', 'Ready to price'], ['no', 'Drawn, not approved', 'We’ll handle submission'], ['help', 'Need plans', 'Design & approvals +4.5%']].map(([k, l, n]) => `<button class="opt${S.plans === k ? ' on' : ''}" data-set="plans" data-v="${k}"><b>${l}</b><small>${n}</small></button>`).join('')}</div></div>
      <div class="field" style="margin-top:18px"><label>When would you like to start?</label><div class="seg">${[['asap', 'ASAP'], ['1-3', '1–3 months'], ['3-6', '3–6 months'], ['6+', '6+ months']].map(([k, l]) => `<button data-set="when" data-v="${k}" class="${S.when === k ? 'on' : ''}">${l}</button>`).join('')}</div></div>`;
  }
  function v4() {
    return `<h2 class="title co-h">Where should we send your estimate?</h2>
      <div class="row-2"><div class="field"><label for="e-name">Full name</label><input class="input" id="e-name" data-f="name" value="${esc(S.name)}" autocomplete="name"></div>
      <div class="field"><label for="e-phone">Phone / WhatsApp</label><input class="input" id="e-phone" data-f="phone" value="${esc(S.phone)}" inputmode="tel" placeholder="+263 7…" autocomplete="tel"></div></div>
      <div class="field" style="margin-top:12px"><label for="e-email">Email</label><input class="input" id="e-email" type="email" data-f="email" value="${esc(S.email)}" autocomplete="email"></div>
      <div class="field" style="margin-top:16px"><label>Best way to reach you</label><div class="seg">${[['whatsapp', 'WhatsApp'], ['call', 'Phone call'], ['email', 'Email']].map(([k, l]) => `<button data-set="contact" data-v="${k}" class="${S.contact === k ? 'on' : ''}">${l}</button>`).join('')}</div></div>
      <div class="field" style="margin-top:16px"><label for="e-notes">Anything else? (optional)</label><textarea class="textarea" id="e-notes" data-f="notes" placeholder="Stand size, style you like, special requirements…">${esc(S.notes)}</textarea></div>
      <label class="drop" style="margin-top:12px"><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.dwg" data-files hidden>${I.doc}<span><b>Attach plans or photos</b><small>PDF, JPG, PNG or DWG — optional</small></span></label>
      <div class="files" data-file-list>${S.files.map((f) => `<span class="chip soft">${esc(f)}</span>`).join('')}</div>`;
  }
  function v5() {
    const c = calc(), t = TYPES[S.type];
    const refNo = S.refNo || (S.refNo = 'ATK-EST-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase());
    const ms = S.type === 'boundary-wall' || S.type === 'roofing' ? [['Deposit & mobilisation', 40], ['Midway', 40], ['Completion', 20]] : [['Deposit & site set-up', 20], ['Foundations complete', 20], ['Wall plate', 25], ['Roof on', 20], ['Handover', 15]];
    const scope = t.kind === 'wall' ? `${S.wallLen} m ${WALLS[S.wallType][0].toLowerCase()} wall, ${S.wallH} m high${S.gate !== 'none' ? ', ' + GATES[S.gate][0].toLowerCase() : ''}` : `${S.area.toLocaleString()} m² ${S.type === 'roofing' ? 'roof' : ''} · ${FINISH[S.finish].label.toLowerCase()} finish${S.type !== 'roofing' && S.type !== 'renovation' ? ` · ${S.storeys} storey${S.storeys > 1 ? 's' : ''}` : ''}${S.type === 'new-home' ? ` · ${S.beds} bed` : ''}`;
    return `<div class="est-result">
      <div class="er-head">
        <div><span class="eyebrow">Indicative estimate · ${refNo}</span><h2 class="display h-md" style="margin:12px 0 8px">${money(round(c.low), 0)} – ${money(round(c.high), 0)}</h2>
        <p class="muted" style="margin:0">${t.label} · ${scope}${S.site ? ` · ${esc(S.site)}` : ''}</p></div>
        <div class="er-kpis"><div><b>${dur(c.months)}</b><span>Programme</span></div><div><b>${money(round(c.mid), 0)}</b><span>Mid-point</span></div></div>
      </div>
      <div class="er-grid">
        <div class="rv-box"><span class="eyebrow">Where the money goes</span>
          <div class="bars">${c.phases.map(([l, p], i) => `<div class="bar"><span>${l}</span><i><em style="--w:${p * 2.6}%;--d:${i * 0.08}s"></em></i><b>${money(round(c.mid * p / 100), 0)}</b></div>`).join('')}</div>
          ${c.design ? `<p class="muted" style="font-size:12px;margin:10px 0 0">Includes ${money(round(c.design), 0)} for design & council approvals.</p>` : ''}
          ${c.loc > 1 ? `<p class="muted" style="font-size:12px;margin:6px 0 0">Includes a ${Math.round((c.loc - 1) * 100)}% out-of-town logistics allowance.</p>` : ''}
        </div>
        <div class="rv-box"><span class="eyebrow">Staged payments</span>
          <ol class="milestones">${ms.map(([l, p]) => `<li><span>${l}</span><em>${p}%</em><b>${money(round(c.mid * p / 100), 0)}</b></li>`).join('')}</ol>
          <p class="muted" style="font-size:12px;margin:10px 0 0">You only pay for work that is complete and inspected.</p></div>
      </div>
      <div class="er-next">
        <div><span class="eyebrow">What happens next</span><ol class="next"><li><b>Today</b> — we've received your request (ref ${refNo}).</li><li><b>Within 1 working day</b> — your project manager ${S.contact === 'email' ? 'emails' : S.contact === 'call' ? 'calls' : 'WhatsApps'} you.</li><li><b>Site visit</b> — we measure up and review plans, free of charge.</li><li><b>Fixed quotation</b> — itemised, within 5 working days.</li></ol></div>
        <div class="er-actions">
          <div class="field"><label for="e-visit">Book a free site visit</label><div style="display:flex;gap:6px"><input class="input" id="e-visit" type="date" min="${new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)}" data-visit><button class="btn btn-navy" style="height:46px" data-book>Book</button></div></div>
          <a class="btn btn-amber btn-lg btn-block" target="_blank" rel="noopener" data-wa-send>${I.wa.replace('<svg', '<svg width="16" height="16"')} Send to Atoka on WhatsApp</a>
          <div style="display:flex;gap:6px"><button class="btn btn-line btn-block" data-print>${I.print.replace('<svg', '<svg width="15" height="15"')} Save as PDF</button><button class="btn btn-line btn-block" data-restart>New estimate</button></div>
        </div>
      </div>
      <p class="muted" style="font-size:11.5px;margin:18px 0 0">This is an indicative budget based on typical Harare build rates and your answers. It is not a quotation — your fixed price follows the site visit.</p>
    </div>`;
  }

  function side() {
    const c = calc();
    if (!c) return `<aside class="est-side"><div class="panel es-card"><span class="eyebrow">Live budget</span><p class="muted" style="margin:14px 0 0">Choose a project type to see an instant budget range.</p></div>${helpCard()}</aside>`;
    return `<aside class="est-side"><div class="panel es-card"><span class="eyebrow">Live budget</span>
      <div class="es-range"><b data-live-low>${money(round(c.low), 0)}</b><span>–</span><b data-live-high>${money(round(c.high), 0)}</b></div>
      <div class="es-meter"><i style="width:${Math.min(100, (c.mid / 600000) * 100)}%"></i></div>
      <div class="sum-row" style="margin-top:14px"><span>Project</span><b>${TYPES[S.type].label}</b></div>
      <div class="sum-row"><span>Programme</span><b>${dur(c.months)}</b></div>
      ${TYPES[S.type].kind === 'area' ? `<div class="sum-row"><span>Rate</span><b>${money(c.mid / S.area, 0)}/m²</b></div>` : ''}
      </div>${helpCard()}</aside>`;
  }
  const helpCard = () => `<div class="panel es-help"><img src="assets/img/client-handshake-sm.jpg" alt=""><div><b>Rather talk it through?</b><p class="muted">Our project managers are on WhatsApp during working hours.</p><a class="learn" target="_blank" rel="noopener" href="${waLink('Hi Atoka, I’d like help planning my project.')}"><span>Chat now</span><span class="sq">${I.right}</span></a></div></div>`;

  function render(anim) {
    const views = [v1, v2, v3, v4, v5];
    if (S.step === 5) { root.innerHTML = stepper() + `<div class="panel co-step">${v5()}</div>`; bindResult(); }
    else root.innerHTML = `${stepper()}<div class="co-layout est-layout"><div class="panel co-step"><div data-view>${views[S.step - 1]()}</div>
      <div class="co-nav">${S.step > 1 ? '<button class="btn btn-line" data-back>Back</button>' : '<span></span>'}<button class="btn btn-navy btn-lg" data-next ${S.type ? '' : 'disabled'}>${S.step === 4 ? 'Get my estimate' : 'Continue'}</button></div></div>${side()}</div>`;
    if (anim) { const v = $('.co-step'); v && v.animate([{ opacity: 0, transform: 'translateX(14px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' }); }
    store.set('estimate', Object.assign({}, S, { files: [] }));
  }
  const refreshSide = () => { const s = $('.est-side'); if (s) s.outerHTML = side(); };

  function validate() {
    if (S.step === 3 && !S.site) { toast('Please choose where the site is'); $('#e-site').classList.add('err'); $('#e-site').focus(); return false; }
    if (S.step === 4) {
      const bad = [];
      if (S.name.trim().length < 2) bad.push('name');
      if (S.phone.replace(/\D/g, '').length < 9) bad.push('phone');
      if (S.email && !/^\S+@\S+\.\S+$/.test(S.email)) bad.push('email');
      $$('[data-f]').forEach((el) => el.classList.toggle('err', bad.includes(el.dataset.f)));
      if (bad.length) { toast('Please check the highlighted fields'); $(`[data-f="${bad[0]}"]`).focus(); return false; }
    }
    return true;
  }

  function bindResult() {
    const c = calc(), t = TYPES[S.type];
    const msg = `Hi Atoka, I've just completed an online estimate.\nRef: ${S.refNo}\nProject: ${t.label}${t.kind === 'wall' ? ` — ${S.wallLen} m wall` : ` — ${S.area} m², ${FINISH[S.finish].label}`}\nLocation: ${S.site}\nIndicative budget: ${money(round(c.low), 0)} – ${money(round(c.high), 0)}\nStart: ${S.when}\nName: ${S.name}\nPhone: ${S.phone}${S.notes ? '\nNotes: ' + S.notes : ''}`;
    $('[data-wa-send]').href = waLink(msg);
    requestAnimationFrame(() => $$('.bars em').forEach((e) => e.classList.add('go')));
  }

  function printEstimate() {
    const c = calc(), t = TYPES[S.type];
    const w = window.open('', '_blank'); if (!w) { toast('Allow pop-ups to save the PDF'); return; }
    w.document.write(`<!doctype html><html><head><title>Estimate ${S.refNo}</title><style>body{font-family:Inter,Arial,sans-serif;color:#16172b;margin:40px;max-width:760px}header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #05052e;padding-bottom:16px}img{height:44px}.muted{color:#8b9099}h1{font-size:30px;margin:26px 0 4px}table{width:100%;border-collapse:collapse;margin:18px 0}td,th{padding:9px 0;border-bottom:1px solid #eee;text-align:left;font-size:13px}td:last-child{text-align:right}h3{margin:28px 0 0;font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#8b9099}footer{font-size:11.5px;color:#8b9099;margin-top:30px;border-top:1px solid #eee;padding-top:12px}</style></head><body>
      <header><img src="${new URL('assets/img/logo.png', location.href)}" alt="Atoka"><div style="text-align:right" class="muted">Indicative estimate<br>${S.refNo} · ${new Date().toLocaleDateString('en-GB')}</div></header>
      <h1>${money(round(c.low), 0)} – ${money(round(c.high), 0)}</h1><div class="muted">${t.label} · ${esc(S.site)} · programme ≈ ${dur(c.months)}</div>
      <p>Prepared for <b>${esc(S.name)}</b> · ${esc(S.phone)}${S.email ? ' · ' + esc(S.email) : ''}</p>
      <h3>Cost breakdown (mid-point ${money(round(c.mid), 0)})</h3><table>${c.phases.map(([l, p]) => `<tr><td>${l}</td><td>${p}%</td><td>${money(round(c.mid * p / 100), 0)}</td></tr>`).join('')}</table>
      <footer>This indicative budget is based on typical build rates and the information provided. It is not a quotation. A fixed, itemised quotation follows a free site visit.<br>Atoka Construction · ${CONTACT.address} · ${CONTACT.phone} · ${CONTACT.email}</footer><script>setTimeout(()=>print(),400)<\/script></body></html>`);
    w.document.close();
  }

  /* ---------------- events ---------------- */
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.type) { S.type = d.type; if (TYPES[d.type].area) S.area = TYPES[d.type].area[2]; render(); }
    else if (d.set) { const v = isNaN(+d.v) ? d.v : +d.v; S[d.set] = v; $$(`[data-set="${d.set}"]`).forEach((x) => x.classList.toggle('on', x === b)); refreshSide(); store.set('estimate', S); }
    else if ('next' in d) { if (!validate()) return; S.step++; render(true); scrollTo({ top: root.offsetTop - 90, behavior: 'smooth' }); if (S.step === 5) toast('Estimate ready — we’ve logged your request'); }
    else if ('back' in d) { S.step--; render(true); }
    else if (d.go) { S.step = +d.go; render(true); }
    else if ('print' in d) printEstimate();
    else if ('restart' in d) { Object.assign(S, { step: 1, type: '', refNo: null }); render(true); }
    else if ('book' in d) { const v = $('[data-visit]').value; if (!v) { toast('Pick a date for the site visit'); return; } const day = new Date(v).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); b.textContent = 'Booked'; b.disabled = true; toast(`Site visit requested for <b>${day}</b>. We’ll confirm the time.`); }
  });
  root.addEventListener('input', (e) => {
    const el = e.target, f = el.dataset.f; if (!f) return;
    S[f] = el.type === 'range' ? +el.value : el.value; el.classList.remove('err');
    if (f === 'site') { const a = AREAS.find((x) => x.name === el.value); S.km = a ? a.km : 0; }
    const out = $(`[data-out="${f}"]`); if (out) out.textContent = f === 'wallLen' ? `${S[f]} m` : `${S[f].toLocaleString()} m²`;
    refreshSide(); store.set('estimate', S);
  });
  root.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.extra) { S.extras = el.checked ? [...S.extras, el.dataset.extra] : S.extras.filter((x) => x !== el.dataset.extra); refreshSide(); }
    if ('files' in el.dataset) { S.files = [...el.files].map((f) => f.name); $('[data-file-list]').innerHTML = S.files.map((f) => `<span class="chip soft">${esc(f)}</span>`).join(''); toast(`${S.files.length} file${S.files.length === 1 ? '' : 's'} attached`); }
  });

  render();
})();
