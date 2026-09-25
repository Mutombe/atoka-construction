/* Atoka core — layout chrome, stores, cart / wishlist / compare, toasts, reveal. */
(function () {
  const { CATS, PRODUCTS, CONTACT } = window.ATOKA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------- icons ---------------- */
  const I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h4"/></svg>',
    house: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V3h11v18M15 8h5v13M2 21h20M8 7h3M8 11h3M8 15h3"/></svg>',
    crane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4l-3 3M6 4h15M6 4l4 4h11M18 8v5M16 13h4v3h-4zM3 21h8"/></svg>',
    hammer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12l-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9M17.6 15L22 10.6M20 12.5l-6.5-6.5a4 4 0 0 0-5.7 0L7 7l6 6 1.6-1.6a1 1 0 0 1 1.4 0l1.4 1.4"/></svg>',
    blueprint: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM3 9h6v12M9 13h12M15 3v10"/></svg>',
    wall: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18v14H3zM3 9.7h18M3 14.3h18M8 5v4.7M16 5v4.7M12 9.7v4.6M8 14.3V19M16 14.3V19"/></svg>',
    roofI: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13L12 4l10 9M5 11v9h14v-9"/><path d="M9 20v-5h6v5"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V10l6-5 6 5v11M15 13h6v8H3M9 21v-5"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8V6c0-.9.6-1 1-1h3V1h-4c-3.9 0-5 2.6-5 5v2H6v4h3v11h5V12h3.5l.5-4z"/></svg>',
    li: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
  };

  /* ---------------- product artwork (SVG, per category) ---------------- */
  const ART = {
    bag: '<path d="M60 44h80l8 16-6 88H58l-6-88z" fill="#fff" stroke="#16172b" stroke-width="3"/><path d="M52 60h96" stroke="#16172b" stroke-width="3"/><rect x="70" y="80" width="60" height="36" rx="4" fill="#f8b433"/><path d="M78 98h44M78 106h28" stroke="#05052e" stroke-width="3"/><path d="M66 44l6-10h56l6 10" fill="none" stroke="#16172b" stroke-width="3"/>',
    brick: '<g stroke="#16172b" stroke-width="3" fill="#fff"><rect x="40" y="110" width="58" height="26" rx="3"/><rect x="102" y="110" width="58" height="26" rx="3"/><rect x="70" y="80" width="58" height="26" rx="3" fill="#f8b433"/><rect x="40" y="50" width="58" height="26" rx="3"/><rect x="102" y="50" width="58" height="26" rx="3"/></g><path d="M40 80h26M132 80h28" stroke="#16172b" stroke-width="3"/>',
    rebar: '<g stroke="#16172b" stroke-width="3" fill="#fff"><rect x="30" y="56" width="140" height="12" rx="6"/><rect x="30" y="84" width="140" height="12" rx="6" fill="#f8b433"/><rect x="30" y="112" width="140" height="12" rx="6"/></g><g stroke="#16172b" stroke-width="2"><path d="M50 56l6 12M70 56l6 12M90 56l6 12M110 56l6 12M130 56l6 12M150 56l6 12M50 84l6 12M70 84l6 12M90 84l6 12M110 84l6 12M130 84l6 12M150 84l6 12M50 112l6 12M70 112l6 12M90 112l6 12M110 112l6 12M130 112l6 12M150 112l6 12"/></g>',
    roof: '<path d="M30 110l70-60 70 60" fill="none" stroke="#16172b" stroke-width="3"/><path d="M44 98l56-48 56 48v40H44z" fill="#fff" stroke="#16172b" stroke-width="3"/><path d="M58 138V86M72 138V74M86 138V62M100 138V52M114 138V62M128 138V74M142 138V86" stroke="#16172b" stroke-width="2"/><rect x="88" y="104" width="24" height="34" fill="#f8b433" stroke="#16172b" stroke-width="3"/>',
    pipe: '<path d="M30 70h80a20 20 0 0 1 20 20v60" fill="none" stroke="#16172b" stroke-width="22" stroke-linecap="round"/><path d="M30 70h80a20 20 0 0 1 20 20v60" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/><rect x="100" y="58" width="16" height="24" rx="3" fill="#f8b433" stroke="#16172b" stroke-width="3"/><rect x="118" y="100" width="24" height="16" rx="3" fill="#f8b433" stroke="#16172b" stroke-width="3"/>',
    bolt: '<circle cx="100" cy="96" r="52" fill="#fff" stroke="#16172b" stroke-width="3"/><path d="M106 56L80 102h22l-8 38 28-50h-22z" fill="#f8b433" stroke="#16172b" stroke-width="3" stroke-linejoin="round"/>',
    roller: '<rect x="44" y="46" width="100" height="34" rx="8" fill="#f8b433" stroke="#16172b" stroke-width="3"/><path d="M144 63h14v34h-58v18" fill="none" stroke="#16172b" stroke-width="3"/><rect x="92" y="115" width="16" height="36" rx="4" fill="#fff" stroke="#16172b" stroke-width="3"/>',
    drill: '<path d="M52 66h78l14 12-14 12H52z" fill="#fff" stroke="#16172b" stroke-width="3"/><path d="M144 78h26" stroke="#16172b" stroke-width="4" stroke-linecap="round"/><path d="M70 90h34l-8 46H74z" fill="#f8b433" stroke="#16172b" stroke-width="3" stroke-linejoin="round"/><rect x="68" y="136" width="36" height="14" rx="3" fill="#fff" stroke="#16172b" stroke-width="3"/>',
  };
  const TINT = {
    'cement-concrete': ['#efeeea', '#e3e1da'], 'bricks-blocks': ['#f5ebe5', '#ead8cd'], 'steel-mesh': ['#eceef1', '#dde1e7'],
    roofing: ['#ebedf2', '#dbe0ea'], plumbing: ['#e8f0f3', '#d6e4ea'], electrical: ['#f7f1e1', '#eee2bf'],
    finishes: ['#f1ebf1', '#e4d9e5'], 'tools-ppe': ['#ecf0e9', '#dce4d6'],
  };
  const catOf = (slug) => CATS.find((c) => c.slug === slug);
  function productArt(p, big) {
    const c = catOf(p.cat); const [a, b] = TINT[p.cat] || ['#eee', '#ddd'];
    const id = 'g' + p.id + (big ? 'b' : '');
    const rot = ((p.id * 37) % 9) - 4;
    return `<svg class="p-art" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(p.name)}">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
      <rect width="200" height="200" fill="url(#${id})"/>
      <circle cx="160" cy="36" r="54" fill="#fff" opacity=".35"/>
      <g transform="rotate(${rot} 100 100) translate(0 6)">${ART[c.icon]}</g>
    </svg>`;
  }

  /* ---------------- money & pricing ---------------- */
  const money = (n, dp) => {
    let d = dp != null ? dp : (n % 1 ? 2 : 0);
    if (n > 0 && n < 1 && d > 0) d = 3; // bricks & tiles are priced in fractions of a cent
    return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  const tierFor = (p, qty) => { let pct = 0; for (const [q, t] of p.tiers) if (qty >= q) pct = t; return pct; };
  const unitPrice = (p, qty) => p.price * (1 - tierFor(p, qty) / 100);
  const byId = (id) => PRODUCTS.find((p) => p.id === +id);
  const bySlug = (s) => PRODUCTS.find((p) => p.slug === s);
  const deliveryFee = (km, kg) => {
    const base = 5 + 0.65 * km;
    const trucks = kg > 1000 ? Math.ceil(kg / 5000) : 0; // heavy loads go on a flatbed
    return { base, heavy: trucks * 35, total: base + trucks * 35, trucks };
  };

  /* ---------------- persistent stores ---------------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('atoka.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('atoka.' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };
  const listeners = new Set();
  const emit = () => listeners.forEach((fn) => fn());
  const onChange = (fn) => listeners.add(fn);

  const Cart = {
    items() { return store.get('cart', []).filter((i) => byId(i.id)); },
    save(items) { store.set('cart', items); emit(); },
    count() { return this.items().reduce((n, i) => n + i.qty, 0); },
    lines() { return this.items().length; },
    add(id, qty = 1, silent) {
      const p = byId(id); if (!p || p.stock <= 0) { toast('Sorry, that item is out of stock'); return false; }
      const items = this.items(); const it = items.find((i) => i.id === p.id);
      const next = Math.min((it ? it.qty : 0) + qty, p.stock);
      if (it) it.qty = next; else items.push({ id: p.id, qty: Math.min(qty, p.stock) });
      this.save(items); bumpBadge();
      if (!silent) toast(`<b>${esc(p.name)}</b> added to cart`, { action: ['View cart', () => openDrawer('cart')] });
      return true;
    },
    setQty(id, qty) {
      const p = byId(id); const items = this.items(); const it = items.find((i) => i.id === +id); if (!it) return;
      it.qty = Math.max(1, Math.min(qty | 0 || 1, p.stock)); this.save(items);
    },
    remove(id) { const p = byId(id); this.save(this.items().filter((i) => i.id !== +id)); toast(`Removed ${esc(p.name)}`, { action: ['Undo', () => this.add(id, 1, true)] }); },
    clear() { this.save([]); },
    totals() {
      let sub = 0, list = 0, kg = 0;
      for (const i of this.items()) { const p = byId(i.id); sub += unitPrice(p, i.qty) * i.qty; list += (p.was || p.price) * i.qty; kg += p.kg * i.qty; }
      return { sub, savings: list - sub, kg };
    },
  };
  const Saves = {
    ids() { return store.get('saves', []); },
    has(id) { return this.ids().includes(+id); },
    toggle(id) {
      const ids = this.ids(); const p = byId(id); const on = !ids.includes(+id);
      store.set('saves', on ? [...ids, +id] : ids.filter((x) => x !== +id)); emit();
      toast(on ? `Saved <b>${esc(p.name)}</b>` : 'Removed from saved items', on ? { action: ['View saved', () => openDrawer('saves')] } : {});
      return on;
    },
  };
  const Compare = {
    ids() { return store.get('compare', []); },
    has(id) { return this.ids().includes(+id); },
    toggle(id) {
      let ids = this.ids(); const p = byId(id);
      if (ids.includes(+id)) ids = ids.filter((x) => x !== +id);
      else {
        if (ids.length >= 3) { toast('You can compare up to 3 products'); return false; }
        if (ids.length && byId(ids[0]).cat !== p.cat) toast('Tip: comparing works best within one category');
        ids = [...ids, +id];
      }
      store.set('compare', ids); emit(); return ids.includes(+id);
    },
    clear() { store.set('compare', []); emit(); },
  };

  /* ---------------- toasts ---------------- */
  function toast(html, opts = {}) {
    let box = $('.toasts'); if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'toast';
    t.innerHTML = `<span class="ti">${I.check}</span><span>${html}</span>`;
    if (opts.action) { const a = document.createElement('a'); a.href = '#'; a.textContent = opts.action[0]; a.onclick = (e) => { e.preventDefault(); opts.action[1](); dismiss(); }; t.lastChild.appendChild(a); }
    box.appendChild(t);
    while (box.children.length > 3) box.firstChild.remove();
    const dismiss = () => { t.classList.add('out'); setTimeout(() => t.remove(), 350); };
    setTimeout(dismiss, opts.ms || 3200);
  }

  /* ---------------- chrome: header / footer / drawers ---------------- */
  const page = document.body.dataset.page || '';
  const waLink = (msg) => `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(msg)}`;

  function header() {
    const a = (href, label, key) => `<a class="nav-link${page === key ? ' active' : ''}" href="${href}">${label}</a>`;
    return `
    <div class="wrap nav">
      <div class="nav-left">
        <a class="brand" href="index.html" aria-label="Atoka Construction home"><img src="assets/img/logo.png" alt="Atoka Construction" width="83" height="38"></a>
        <div class="nav-pills">
          <a class="nav-pill${page === 'projects' ? ' active' : ''}" href="projects.html"><i></i>Projects</a>
          <a class="nav-pill" href="index.html#services"><i></i>Services</a>
        </div>
      </div>
      <nav class="nav-center" aria-label="Primary">
        ${a('index.html#stages', 'Stages of work', 'stages')}
        ${a('shop.html', 'Shop', 'shop')}
        ${a('index.html#about', 'About us', 'about')}
        ${a('index.html#contacts', 'Contacts', 'contacts')}
      </nav>
      <div class="nav-right">
        <a class="icon-btn hide-sm" href="${waLink('Hi Atoka, I would like to discuss a project.')}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a>
        ${page === 'shop' ? `<button class="icon-btn hide-sm" data-open="saves" aria-label="Saved items">${I.heart}<span class="badge" data-badge="saves"></span></button>` : ''}
        <button class="icon-btn" data-open="cart" aria-label="Cart">${I.cart}<span class="badge" data-badge="cart"></span></button>
        <a class="btn btn-soft" href="estimate.html">Discuss the project</a>
        <button class="icon-btn burger" aria-label="Menu" data-menu>${I.menu}</button>
      </div>
    </div>`;
  }
  function mobileMenu() {
    const items = [['index.html', 'Home'], ['projects.html', 'Projects'], ['index.html#services', 'Services'], ['index.html#stages', 'Stages'], ['shop.html', 'Shop'], ['estimate.html', 'Estimate'], ['index.html#contacts', 'Contacts']];
    return `<div class="mobile-menu" id="mm" aria-hidden="true">
      <div class="mm-top"><img src="assets/img/logo.png" alt="Atoka" style="height:32px"><button class="icon-btn" data-menu aria-label="Close menu">${I.close}</button></div>
      <nav>${items.map(([h, l], i) => `<a href="${h}">${l}<small>0${i + 1}</small></a>`).join('')}</nav>
      <div class="mm-foot"><a class="btn btn-navy btn-lg" href="estimate.html">Request an estimate</a><a class="btn btn-line btn-lg" href="tel:${CONTACT.phoneRaw}">${I.phone} ${CONTACT.phone}</a></div>
    </div>`;
  }
  function footer() {
    return `
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <a class="brand" href="index.html"><img src="assets/img/logo-white.png" alt="Atoka Construction" width="100" height="46"></a>
          <p style="max-width:34ch;margin:18px 0 0">Homes, estates and commercial buildings — designed, built and handed over by one accountable team.</p>
          <div class="socials" style="margin-top:20px">
            <a href="#" aria-label="Facebook">${I.fb}</a><a href="#" aria-label="Instagram">${I.ig}</a><a href="#" aria-label="LinkedIn">${I.li}</a><a href="${waLink('Hi Atoka')}" aria-label="WhatsApp">${I.wa}</a>
          </div>
        </div>
        <div><h5>Company</h5><ul><li><a href="index.html#about">About us</a></li><li><a href="projects.html">Projects</a></li><li><a href="index.html#stages">Stages of work</a></li><li><a href="index.html#faq">FAQ</a></li></ul></div>
        <div><h5>Services</h5><ul><li><a href="estimate.html?type=new-home">New homes</a></li><li><a href="estimate.html?type=commercial">Commercial</a></li><li><a href="estimate.html?type=renovation">Renovations</a></li><li><a href="shop.html">Materials shop</a></li></ul></div>
        <div><h5>Get in touch</h5><ul><li>${CONTACT.address}</li><li><a href="tel:${CONTACT.phoneRaw}">${CONTACT.phone}</a></li><li><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li><li>${CONTACT.hours}</li></ul>
          <form class="news" data-news><input class="input" type="email" required placeholder="Email for project updates" aria-label="Email"><button class="btn btn-amber">Join</button></form>
        </div>
      </div>
      <div class="foot-word" aria-hidden="true">Atoka</div>
      <div class="foot-bar"><span>© ${new Date().getFullYear()} Atoka Construction. All rights reserved.</span><span>Demo platform by Bit Studio</span></div>
    </div>`;
  }
  function drawers() {
    return `
    <div class="scrim" data-scrim></div>
    <aside class="drawer" id="drawer-cart" aria-label="Cart" aria-hidden="true">
      <div class="drawer-head"><h3>Your cart</h3><button class="icon-btn" data-close aria-label="Close">${I.close}</button></div>
      <div class="drawer-body" data-cart-body></div>
      <div class="drawer-foot" data-cart-foot></div>
    </aside>
    <aside class="drawer" id="drawer-saves" aria-label="Saved items" aria-hidden="true">
      <div class="drawer-head"><h3>Saved</h3><button class="icon-btn" data-close aria-label="Close">${I.close}</button></div>
      <div class="drawer-body" data-saves-body></div>
    </aside>
    <div class="compare-tray" data-compare-tray></div>
    <div class="modal" id="modal-compare" aria-hidden="true"><div class="modal-scrim" data-close></div><div class="modal-box"><button class="icon-btn modal-close" data-close aria-label="Close">${I.close}</button><div data-compare-body></div></div></div>
    <div class="modal" id="modal-confirm" aria-hidden="true"><div class="modal-scrim" data-close></div><div class="modal-box narrow" style="padding:30px"><div data-confirm-body></div></div></div>
    <a class="fab-wa" href="${waLink('Hi Atoka, I have a question.')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${I.wa}</a>`;
  }

  function renderCart() {
    const body = $('[data-cart-body]'), foot = $('[data-cart-foot]'); if (!body) return;
    const items = Cart.items();
    if (!items.length) {
      body.innerHTML = `<div class="empty">${I.cart}<p style="margin:0 0 16px">Your cart is empty.</p><a class="btn btn-navy" href="shop.html">Browse materials</a></div>`;
      foot.innerHTML = ''; foot.style.display = 'none'; return;
    }
    foot.style.display = '';
    body.innerHTML = items.map((i) => {
      const p = byId(i.id); const up = unitPrice(p, i.qty); const t = tierFor(p, i.qty);
      const next = p.tiers.find(([q]) => q > i.qty);
      return `<div class="line-item">
        <a class="th" href="product.html?p=${p.slug}">${productArt(p)}</a>
        <div><h4><a href="product.html?p=${p.slug}">${esc(p.name)}</a></h4><small>${money(up)} ${esc(p.unit)}${t ? ` · <span style="color:var(--ok)">bulk −${t}%</span>` : ''}</small>
          ${next ? `<div style="font-size:11px;color:var(--amber-ink);margin-top:2px">Add ${next[0] - i.qty} more for −${next[1]}%</div>` : ''}
          <div style="display:flex;gap:10px;align-items:center;margin-top:8px">
            <div class="qty"><button data-q="-1" data-id="${p.id}" aria-label="Decrease">−</button><input type="number" value="${i.qty}" min="1" max="${p.stock}" data-qi="${p.id}" aria-label="Quantity"><button data-q="1" data-id="${p.id}" aria-label="Increase">+</button></div>
            <button class="rm" data-rm="${p.id}">Remove</button>
          </div></div>
        <div class="price">${money(up * i.qty, 2)}</div></div>`;
    }).join('') + `<button class="rm" style="justify-self:start;font-size:12px;color:var(--muted);text-decoration:underline;margin-top:6px" data-clear>Clear cart</button>`;
    const t = Cart.totals();
    foot.innerHTML = `
      <div class="sum-row"><span>Subtotal (${Cart.count().toLocaleString()} units)</span><b>${money(t.sub, 2)}</b></div>
      ${t.savings > 0.005 ? `<div class="sum-row"><span>You save</span><b style="color:var(--ok)">−${money(t.savings, 2)}</b></div>` : ''}
      <div class="sum-row"><span>Est. load weight</span><b>${Math.round(t.kg).toLocaleString()} kg</b></div>
      <div class="sum-row"><span>Delivery</span><b>Calculated at checkout</b></div>
      <div class="sum-row total"><span>Total</span><b>${money(t.sub, 2)}</b></div>
      <a class="btn btn-navy btn-lg btn-block" href="checkout.html">Checkout</a>
      <button class="btn btn-line btn-block" data-trade-quote>${I.doc} Request a trade quote instead</button>`;
  }
  function renderSaves() {
    const body = $('[data-saves-body]'); if (!body) return;
    const ids = Saves.ids();
    body.innerHTML = ids.length ? ids.map((id) => {
      const p = byId(id); if (!p) return '';
      return `<div class="line-item"><a class="th" href="product.html?p=${p.slug}">${productArt(p)}</a>
        <div><h4><a href="product.html?p=${p.slug}">${esc(p.name)}</a></h4><small>${money(p.price)} ${esc(p.unit)}</small>
        <div style="display:flex;gap:10px;margin-top:8px"><button class="btn btn-dark btn-sm" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>${p.stock ? 'Add to cart' : 'Out of stock'}</button><button class="rm" data-unsave="${p.id}">Remove</button></div></div><span></span></div>`;
    }).join('') : `<div class="empty">${I.heart}<p style="margin:0 0 16px">Nothing saved yet. Tap the heart on any product.</p><a class="btn btn-navy" href="shop.html">Browse materials</a></div>`;
  }
  function renderCompare() {
    const tray = $('[data-compare-tray]'); if (!tray) return;
    const ids = Compare.ids();
    tray.classList.toggle('on', ids.length > 0);
    tray.innerHTML = `<div class="ct-inner">
      <div class="ct-items">${[0, 1, 2].map((k) => { const p = byId(ids[k]); return p ? `<div class="ct-item">${productArt(p)}<button data-uncompare="${p.id}" aria-label="Remove">${I.close}</button></div>` : '<div class="ct-item ct-empty">+</div>'; }).join('')}</div>
      <div class="ct-copy"><b>Compare (${ids.length}/3)</b><span>${ids.length < 2 ? 'Add one more to compare' : 'Ready to compare'}</span></div>
      <div class="ct-actions"><button class="btn btn-line btn-sm" data-compare-clear>Clear</button><button class="btn btn-amber btn-sm" data-compare-open ${ids.length < 2 ? 'disabled' : ''}>Compare now</button></div></div>`;
  }
  function openCompareModal() {
    const ps = Compare.ids().map(byId).filter(Boolean);
    const keys = [...new Set(ps.flatMap((p) => Object.keys(p.specs)))];
    const rows = [
      ['Price', (p) => `${money(p.price)} <small class="muted">${esc(p.unit)}</small>`, (p) => p.price],
      ['Brand', (p) => esc(p.brand), (p) => p.brand],
      ['Category', (p) => esc(p.sub), (p) => p.sub],
      ['Rating', (p) => `★ ${p.rating} <small class="muted">(${p.reviews})</small>`, (p) => p.rating],
      ['Stock', (p) => p.stock ? (p.stock <= 5 ? `<span class="chip warn">Only ${p.stock} left</span>` : '<span class="chip ok">In stock</span>') : '<span class="chip danger">Out of stock</span>', (p) => p.stock > 0],
      ['Warranty', (p) => esc(p.warranty || '—'), (p) => p.warranty],
      ['Bulk discount', (p) => p.tiers.length ? `up to −${p.tiers[p.tiers.length - 1][1]}%` : '—', (p) => p.tiers.length],
      ...keys.map((k) => [k, (p) => esc(p.specs[k] || '—'), (p) => p.specs[k]]),
    ];
    const cheapest = Math.min(...ps.map((p) => p.price));
    $('[data-compare-body]').innerHTML = `<div style="padding:30px 30px 10px"><span class="eyebrow">Side by side</span><h2 class="display h-sm" style="margin-top:10px">Compare products</h2><p class="muted" style="margin:8px 0 0;font-size:13px">Rows that differ are highlighted.</p></div>
      <div class="cmp-scroll"><table class="cmp"><thead><tr><th></th>${ps.map((p) => `<th><div class="cmp-art">${productArt(p)}</div><a href="product.html?p=${p.slug}" class="cmp-name">${esc(p.name)}</a>${p.price === cheapest ? '<span class="chip amber" style="margin-top:6px">Best price</span>' : ''}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(([label, fmt, val]) => { const diff = new Set(ps.map((p) => String(val(p)))).size > 1; return `<tr class="${diff ? 'diff' : ''}"><td>${esc(label)}</td>${ps.map((p) => `<td>${fmt(p)}</td>`).join('')}</tr>`; }).join('')}
      <tr><td></td>${ps.map((p) => `<td><button class="btn btn-dark btn-sm" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>Add to cart</button></td>`).join('')}</tr></tbody></table></div>`;
    openModal('compare');
  }

  function confirmBox(title, text, okLabel, onOk) {
    $('[data-confirm-body]').innerHTML = `<h3 class="display h-sm">${title}</h3><p class="muted">${text}</p><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:20px"><button class="btn btn-line" data-close>Cancel</button><button class="btn btn-navy" data-ok>${okLabel}</button></div>`;
    $('[data-confirm-body] [data-ok]').onclick = () => { onOk(); closeAll(); };
    openModal('confirm');
  }

  function tradeQuote() {
    const items = Cart.items(); if (!items.length) return;
    const t = Cart.totals();
    const ref = 'ATK-TQ-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    const lines = items.map((i) => { const p = byId(i.id); return `• ${i.qty} × ${p.name} (${p.unit}) — ${money(unitPrice(p, i.qty) * i.qty, 2)}`; }).join('\n');
    const msg = `Hi Atoka, I'd like a trade quote.\nRef: ${ref}\n\n${lines}\n\nCart value: ${money(t.sub, 2)}\nEst. weight: ${Math.round(t.kg)} kg`;
    window.open(waLink(msg), '_blank', 'noopener');
    toast(`Quote <b>${ref}</b> prepared for WhatsApp`);
  }

  /* open/close */
  let lastFocus = null;
  function openDrawer(name) {
    lastFocus = document.activeElement; closeAll(true);
    name === 'cart' ? renderCart() : renderSaves();
    const d = $('#drawer-' + name); d.classList.add('on'); d.setAttribute('aria-hidden', 'false');
    $('[data-scrim]').classList.add('on'); document.body.style.overflow = 'hidden';
    setTimeout(() => d.querySelector('[data-close]').focus(), 50);
  }
  function openModal(name) {
    lastFocus = lastFocus || document.activeElement;
    const m = $('#modal-' + name); m.classList.add('on'); m.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    setTimeout(() => { const c = m.querySelector('.modal-close, [data-close].btn'); c && c.focus(); }, 50);
  }
  function closeAll(keepFocus) {
    $$('.drawer.on, .modal.on').forEach((el) => { el.classList.remove('on'); el.setAttribute('aria-hidden', 'true'); });
    const s = $('[data-scrim]'); s && s.classList.remove('on'); document.body.style.overflow = '';
    if (!keepFocus && lastFocus) { lastFocus.focus && lastFocus.focus(); lastFocus = null; }
  }

  function bumpBadge() { const b = $('[data-badge="cart"]'); if (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); } }
  function syncBadges() {
    const set = (k, n) => $$(`[data-badge="${k}"]`).forEach((b) => { b.textContent = n ? (n > 99 ? '99+' : n) : ''; b.classList.toggle('on', n > 0); });
    set('cart', Cart.lines()); set('saves', Saves.ids().length);
    $$('[data-save]').forEach((b) => { const on = Saves.has(b.dataset.save); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    $$('[data-compare]').forEach((b) => { const on = Compare.has(b.dataset.compare); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    const h = $('header.site-header'); if (h) h.innerHTML = header();
    const f = $('footer.site-footer'); if (f) f.innerHTML = footer();
    document.body.insertAdjacentHTML('beforeend', mobileMenu() + drawers());

    window.addEventListener('scroll', () => h && h.classList.toggle('scrolled', scrollY > 10), { passive: true });

    document.addEventListener('click', (e) => {
      const t = e.target.closest('button, a'); if (!t) { if (e.target.matches('[data-scrim], .modal-scrim[data-close]')) closeAll(); return; }
      const d = t.dataset;
      if (d.open) { e.preventDefault(); openDrawer(d.open); }
      else if ('close' in d) { e.preventDefault(); closeAll(); }
      else if ('menu' in d) { const m = $('#mm'); const on = !m.classList.contains('open'); m.classList.toggle('open', on); m.setAttribute('aria-hidden', !on); document.body.style.overflow = on ? 'hidden' : ''; }
      else if (d.add) { e.preventDefault(); Cart.add(d.add, +(d.qty || 1)); }
      else if (d.buy) { e.preventDefault(); if (Cart.add(d.buy, 1, true)) location.href = 'checkout.html'; }
      else if (d.save) { e.preventDefault(); Saves.toggle(d.save); }
      else if (d.unsave) { Saves.toggle(d.unsave); }
      else if (d.compare) { e.preventDefault(); Compare.toggle(d.compare); }
      else if (d.uncompare) { Compare.toggle(d.uncompare); }
      else if ('compareClear' in d) { Compare.clear(); }
      else if ('compareOpen' in d) { openCompareModal(); }
      else if (d.q) { const it = Cart.items().find((i) => i.id === +d.id); Cart.setQty(d.id, it.qty + +d.q); }
      else if (d.rm) { Cart.remove(d.rm); }
      else if ('clear' in d) { confirmBox('Clear cart?', 'This removes every item from your cart.', 'Clear cart', () => { Cart.clear(); toast('Cart cleared'); }); }
      else if ('tradeQuote' in d) { tradeQuote(); }
      if (t.closest('.mobile-menu nav')) { $('#mm').classList.remove('open'); document.body.style.overflow = ''; }
    });
    document.addEventListener('change', (e) => { if (e.target.dataset.qi) Cart.setQty(e.target.dataset.qi, +e.target.value); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeAll(); const m = $('#mm'); if (m.classList.contains('open')) { m.classList.remove('open'); document.body.style.overflow = ''; } } });
    $$('[data-news]').forEach((f) => f.addEventListener('submit', (e) => { e.preventDefault(); f.reset(); toast('Thanks — you’re on the list'); }));

    onChange(() => { syncBadges(); if ($('#drawer-cart.on')) renderCart(); if ($('#drawer-saves.on')) renderSaves(); renderCompare(); });
    syncBadges(); renderCompare();

    // scroll reveal
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach((el) => io.observe(el));
    requestAnimationFrame(() => document.body.classList.add('loaded'));
  }
  window.addEventListener('storage', (e) => { if (e.key && e.key.startsWith('atoka.')) emit(); });

  window.A = { $, $$, esc, I, productArt, money, unitPrice, tierFor, byId, bySlug, catOf, deliveryFee, Cart, Saves, Compare, toast, onChange, openDrawer, openModal, closeAll, waLink, store, observeReveal: (root) => { $$('.rv:not(.in)', root).forEach((el) => el.classList.add('in')); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
