(function () {
  const { $, $$, esc, I, productCard, fillIcons, money, bySlug, Cart, toast, waLink, onChange } = window.A;
  const { PRODUCTS, CATS, CONTACT } = window.ATOKA;
  const PER = 12;

  /* ---------------- state <-> URL ---------------- */
  const u = new URLSearchParams(location.search);
  const S = {
    q: u.get('q') || '', cat: u.get('cat') || '', sub: u.get('sub') || '',
    brands: (u.get('brand') || '').split(',').filter(Boolean),
    min: u.get('min') || '', max: u.get('max') || '',
    sale: u.has('sale'), stock: u.has('stock'), bulk: u.has('bulk'),
    rating: +(u.get('rating') || 0), sort: u.get('sort') || 'featured', page: +(u.get('page') || 1),
  };
  function pushURL() {
    const p = new URLSearchParams();
    if (S.q) p.set('q', S.q); if (S.cat) p.set('cat', S.cat); if (S.sub) p.set('sub', S.sub);
    if (S.brands.length) p.set('brand', S.brands.join(',')); if (S.min) p.set('min', S.min); if (S.max) p.set('max', S.max);
    if (S.sale) p.set('sale', ''); if (S.stock) p.set('stock', ''); if (S.bulk) p.set('bulk', '');
    if (S.rating) p.set('rating', S.rating); if (S.sort !== 'featured') p.set('sort', S.sort); if (S.page > 1) p.set('page', S.page);
    history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p.toString().replace(/=(&|$)/g, '$1') : ''));
  }

  /* ---------------- filtering ---------------- */
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function matchQ(p) {
    if (!S.q) return true;
    const hay = norm([p.name, p.brand, p.sub, p.short, p.sku, ...Object.values(p.specs)].join(' '));
    return norm(S.q).split(/\s+/).every((w) => hay.includes(w));
  }
  function base(skip) {
    return PRODUCTS.filter((p) =>
      matchQ(p) &&
      (skip === 'cat' || !S.cat || p.cat === S.cat) &&
      (skip === 'cat' || !S.sub || p.sub === S.sub) &&
      (skip === 'brand' || !S.brands.length || S.brands.includes(p.brand)) &&
      (!S.min || p.price >= +S.min) && (!S.max || p.price <= +S.max) &&
      (!S.sale || p.onSale) && (!S.stock || p.stock > 0) && (!S.bulk || p.tiers.length) &&
      (!S.rating || p.rating >= S.rating));
  }
  const SORTS = {
    featured: (a, b) => (b.featured - a.featured) || ((b.stock > 0) - (a.stock > 0)) || b.reviews - a.reviews,
    new: (a, b) => b.added - a.added,
    'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews, name: (a, b) => a.name.localeCompare(b.name),
  };

  /* ---------------- renderers ---------------- */
  function drawCats() {
    const pool = base('cat');
    const count = (slug) => pool.filter((p) => p.cat === slug).length;
    $('[data-cats]').innerHTML = `<button class="cat-pill${!S.cat ? ' on' : ''}" data-cat="">All products <span>${pool.length}</span></button>` +
      CATS.map((c) => `<button class="cat-pill${S.cat === c.slug ? ' on' : ''}" data-cat="${c.slug}">${esc(c.name)} <span>${count(c.slug)}</span></button>`).join('');
    const c = CATS.find((x) => x.slug === S.cat);
    const subs = $('[data-subs]');
    if (c) {
      const inCat = pool.filter((p) => p.cat === c.slug);
      subs.innerHTML = `<button class="sub-pill${!S.sub ? ' on' : ''}" data-sub="">All ${esc(c.name.toLowerCase())}</button>` +
        c.subs.map((s) => `<button class="sub-pill${S.sub === s ? ' on' : ''}" data-sub="${esc(s)}">${esc(s)} <span>${inCat.filter((p) => p.sub === s).length}</span></button>`).join('');
      subs.hidden = false;
    } else { subs.innerHTML = ''; subs.hidden = true; }
  }
  function drawBrands() {
    const pool = base('brand');
    const brands = [...new Set(PRODUCTS.filter((p) => !S.cat || p.cat === S.cat).map((p) => p.brand))].sort();
    $('[data-brands]').innerHTML = brands.map((b) => {
      const n = pool.filter((p) => p.brand === b).length;
      return `<label class="check${n ? '' : ' dim'}"><input type="checkbox" data-brand="${esc(b)}" ${S.brands.includes(b) ? 'checked' : ''}> ${esc(b)} <span class="muted" style="margin-left:auto">${n}</span></label>`;
    }).join('');
  }
  function activeChips() {
    const chips = [];
    if (S.q) chips.push(['q', `“${esc(S.q)}”`]);
    if (S.cat) chips.push(['cat', esc(CATS.find((c) => c.slug === S.cat).name)]);
    if (S.sub) chips.push(['sub', esc(S.sub)]);
    S.brands.forEach((b) => chips.push(['brand:' + b, esc(b)]));
    if (S.min || S.max) chips.push(['price', `${S.min ? money(+S.min) : '$0'} – ${S.max ? money(+S.max) : 'any'}`]);
    if (S.sale) chips.push(['sale', 'On sale']); if (S.stock) chips.push(['stock', 'In stock']); if (S.bulk) chips.push(['bulk', 'Bulk discount']);
    if (S.rating) chips.push(['rating', `${S.rating}★ and up`]);
    $('[data-chips]').innerHTML = chips.length ? chips.map(([k, l]) => `<button class="a-chip" data-unchip="${esc(k)}">${l}<span>${I.close}</span></button>`).join('') + '<button class="a-chip clear" data-clear-all>Clear all</button>' : '';
    const fc = chips.filter(([k]) => !['q', 'cat', 'sub'].includes(k)).length;
    $('[data-fcount]').textContent = fc ? fc : '';
  }
  function pager(total) {
    const pages = Math.ceil(total / PER);
    if (pages <= 1) { $('[data-pager]').innerHTML = ''; return; }
    const nums = [];
    for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - S.page) <= 1) nums.push(i); else if (nums[nums.length - 1] !== '…') nums.push('…');
    $('[data-pager]').innerHTML = `<button class="pg" data-pg="${S.page - 1}" ${S.page === 1 ? 'disabled' : ''} aria-label="Previous page">${I.left}</button>` +
      nums.map((n) => n === '…' ? '<span class="pg-gap">…</span>' : `<button class="pg${n === S.page ? ' on' : ''}" data-pg="${n}" ${n === S.page ? 'aria-current="page"' : ''}>${n}</button>`).join('') +
      `<button class="pg" data-pg="${S.page + 1}" ${S.page === pages ? 'disabled' : ''} aria-label="Next page">${I.right}</button>`;
  }

  let timer;
  function render(opts = {}) {
    const list = base().sort(SORTS[S.sort] || SORTS.featured);
    const pages = Math.max(1, Math.ceil(list.length / PER)); if (S.page > pages) S.page = pages;
    drawCats(); drawBrands(); activeChips(); pushURL();
    $('[data-count]').innerHTML = `<b>${list.length}</b> product${list.length === 1 ? '' : 's'} found`;
    $('[data-sort]').value = S.sort;
    const grid = $('[data-grid]');
    const paint = () => {
      const slice = list.slice((S.page - 1) * PER, S.page * PER);
      grid.innerHTML = slice.length ? slice.map(productCard).join('') : `<div class="empty" style="grid-column:1/-1;background:#fff;border-radius:14px">${I.search}<h3 class="title" style="margin-bottom:6px">No products match</h3><p style="margin:0 0 16px">Try a different search or remove some filters.</p><button class="btn btn-navy" data-clear-all>Clear all filters</button></div>`;
      pager(list.length);
      window.A.onChangeSync && window.A.onChangeSync();
      grid.classList.remove('loading');
    };
    clearTimeout(timer);
    if (opts.instant) return paint();
    // brief skeleton so filtering feels like a live catalogue
    grid.classList.add('loading');
    grid.innerHTML = Array.from({ length: Math.min(PER, Math.max(4, list.length)) }, () => '<div class="p-skel"><i></i><b></b><b style="width:60%"></b><b style="width:40%"></b></div>').join('');
    timer = setTimeout(paint, 260);
  }

  // keep hearts / compare state in sync on freshly-rendered cards
  window.A.onChangeSync = () => {
    $$('[data-save]').forEach((b) => b.classList.toggle('on', window.A.Saves.has(b.dataset.save)));
    $$('[data-compare]').forEach((b) => b.classList.toggle('on', window.A.Compare.has(b.dataset.compare)));
  };

  /* ---------------- events ---------------- */
  const set = (patch) => { Object.assign(S, patch); if (!('page' in patch)) S.page = 1; render(); };
  const search = $('[data-search]'), searchX = $('[data-search-x]');
  searchX.innerHTML = I.close;
  search.value = S.q; searchX.hidden = !S.q;
  let deb;
  search.addEventListener('input', () => { searchX.hidden = !search.value; clearTimeout(deb); deb = setTimeout(() => set({ q: search.value.trim() }), 350); });
  searchX.addEventListener('click', () => { search.value = ''; searchX.hidden = true; set({ q: '' }); search.focus(); });

  document.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    const d = t.dataset;
    if ('cat' in d) set({ cat: d.cat, sub: '', brands: [] });
    else if ('sub' in d) set({ sub: d.sub });
    else if (d.pg) { S.page = +d.pg; render(); $('.shop-layout').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else if (d.r != null && t.closest('[data-rating]')) { $$('[data-rating] button').forEach((b) => b.classList.toggle('on', b === t)); set({ rating: +d.r }); }
    else if ('clearAll' in d) { Object.assign(S, { q: '', cat: '', sub: '', brands: [], min: '', max: '', sale: false, stock: false, bulk: false, rating: 0 }); search.value = ''; searchX.hidden = true; syncInputs(); set({}); }
    else if (d.unchip) {
      const k = d.unchip;
      if (k.startsWith('brand:')) S.brands = S.brands.filter((b) => b !== k.slice(6));
      else if (k === 'price') { S.min = S.max = ''; }
      else if (k === 'q') { S.q = ''; search.value = ''; searchX.hidden = true; }
      else if (k === 'cat') { S.cat = ''; S.sub = ''; }
      else if (k === 'rating') S.rating = 0;
      else S[k] = typeof S[k] === 'boolean' ? false : '';
      syncInputs(); set({});
    }
    else if ('filtersOpen' in d) { $('[data-filters]').classList.add('open'); document.body.style.overflow = 'hidden'; }
    else if ('filtersClose' in d) { $('[data-filters]').classList.remove('open'); document.body.style.overflow = ''; }
  });
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.brand) { S.brands = el.checked ? [...S.brands, el.dataset.brand] : S.brands.filter((b) => b !== el.dataset.brand); set({}); }
    else if (el.dataset.flag) set({ [el.dataset.flag]: el.checked });
    else if ('sort' in el.dataset) set({ sort: el.value });
  });
  let pdeb;
  ['min', 'max'].forEach((k) => $(`[data-${k}]`).addEventListener('input', (e) => { clearTimeout(pdeb); pdeb = setTimeout(() => set({ [k]: e.target.value }), 450); }));

  function syncInputs() {
    $('[data-min]').value = S.min; $('[data-max]').value = S.max;
    $$('[data-flag]').forEach((c) => (c.checked = S[c.dataset.flag]));
    $$('[data-rating] button').forEach((b) => b.classList.toggle('on', +b.dataset.r === S.rating));
  }
  $('[data-filters-close]').innerHTML = I.close;
  syncInputs();
  render({ instant: true });

  /* ---------------- material calculator ---------------- */
  const P = (slug) => bySlug(slug);
  const CALC = {
    wall: {
      fields: `
        <div class="row-2"><div class="field"><label>Wall length (m)</label><input class="input" type="number" min="0" step="0.1" name="len" value="30"></div>
        <div class="field"><label>Wall height (m)</label><input class="input" type="number" min="0" step="0.1" name="h" value="2.4"></div></div>
        <div class="row-2"><div class="field"><label>Thickness</label><select class="select" name="skin"><option value="1">Single skin (110 mm)</option><option value="2" selected>Double skin (230 mm)</option></select></div>
        <div class="field"><label>Brick</label><select class="select" name="brick"><option value="common-cement-brick">Common cement brick</option><option value="burnt-clay-common">Burnt clay common</option><option value="red-face-brick">Red satin face brick</option></select></div></div>
        <div class="field"><label>Openings — doors & windows (m²)</label><input class="input" type="number" min="0" step="0.1" name="open" value="4"></div>`,
      calc(f) {
        const area = Math.max(0, f.len * f.h - f.open), skins = +f.skin;
        const bricks = Math.ceil(area * 50 * skins * 1.05 / 10) * 10;
        const cement = Math.ceil(bricks / 1000 * 3);
        const sand = Math.ceil(bricks / 1000 * 0.6 * 10) / 10;
        const courses = Math.floor(f.h / 0.086), lines = Math.ceil(courses / 4);
        const force = Math.ceil(lines * f.len * skins / 20);
        return { note: `${area.toFixed(1)} m² of wall · ${courses} courses`, lines: [[f.brick, bricks], ['lafarge-32-5r', cement], ['river-sand-cube', Math.max(1, Math.ceil(sand))], ['brickforce-75mm', force]] };
      },
    },
    slab: {
      fields: `
        <div class="row-3"><div class="field"><label>Length (m)</label><input class="input" type="number" min="0" step="0.1" name="len" value="10"></div>
        <div class="field"><label>Width (m)</label><input class="input" type="number" min="0" step="0.1" name="w" value="8"></div>
        <div class="field"><label>Thickness (mm)</label><input class="input" type="number" min="50" step="5" name="t" value="100"></div></div>
        <div class="field"><label>Mix</label><select class="select" name="mix"><option value="7">1 : 2 : 3 — structural (25 MPa)</option><option value="5.5">1 : 3 : 4 — surface bed (20 MPa)</option></select></div>
        <label class="check"><input type="checkbox" name="mesh" checked> Include Ref 193 mesh</label>`,
      calc(f) {
        const vol = f.len * f.w * f.t / 1000 * 1.05;
        const lines = [['ppc-surebuild-42-5n', Math.ceil(vol * f.mix)], ['river-sand-cube', Math.ceil(vol * 0.5)], ['19mm-crushed-stone', Math.ceil(vol * 0.7)]];
        if (f.mesh) lines.push(['ref-193-mesh', Math.ceil(f.len * f.w / (6 * 2.4) * 1.1)]);
        return { note: `${vol.toFixed(2)} m³ of concrete (incl. 5% waste)`, lines };
      },
    },
    paint: {
      fields: `
        <div class="row-2"><div class="field"><label>Wall area to paint (m²)</label><input class="input" type="number" min="0" name="area" value="220"></div>
        <div class="field"><label>Coats</label><select class="select" name="coats"><option>1</option><option selected>2</option><option>3</option></select></div></div>
        <div class="field"><label>Surface</label><select class="select" name="where"><option value="plascon-double-velvet-20l">Interior — Plascon Double Velvet</option><option value="dulux-weatherguard-20l">Exterior — Dulux Weatherguard</option></select></div>`,
      calc(f) {
        const litres = f.area * f.coats / 9 * 1.05;
        return { note: `${Math.ceil(litres)} litres needed`, lines: [[f.where, Math.ceil(litres / 20)]] };
      },
    },
  };
  let mode = 'wall', result = null;
  const form = $('[data-calc-form]'), out = $('[data-calc-out]');
  function readForm() {
    const o = {};
    [...form.elements].forEach((el) => {
      if (!el.name) return;
      if (el.type === 'checkbox') o[el.name] = el.checked;
      else if (el.type === 'number') o[el.name] = Math.max(0, +el.value || 0);
      else o[el.name] = el.value !== '' && !isNaN(+el.value) ? +el.value : el.value;
    });
    return o;
  }
  function runCalc() {
    result = CALC[mode].calc(readForm());
    let total = 0;
    const rows = result.lines.filter(([, q]) => q > 0).map(([slug, q]) => {
      const p = P(slug); const up = window.A.unitPrice(p, q); total += up * q;
      return `<li><span class="co-q">${q.toLocaleString()}</span><div><b>${esc(p.name)}</b><small>${esc(p.unit)} · ${money(up)}${window.A.tierFor(p, q) ? ` <em>bulk −${window.A.tierFor(p, q)}%</em>` : ''}</small></div><span class="co-p">${money(up * q, 2)}</span></li>`;
    }).join('');
    out.innerHTML = `<div class="co-head"><span class="eyebrow">You'll need</span><span class="muted" style="font-size:12.5px">${result.note}</span></div>
      <ul class="co-list">${rows || '<li class="muted">Enter your dimensions</li>'}</ul>
      <div class="co-total"><span>Materials total</span><b>${money(total, 2)}</b></div>
      <button class="btn btn-amber btn-lg btn-block" data-calc-add ${rows ? '' : 'disabled'}>Add all to cart</button>`;
  }
  function drawCalc() { form.innerHTML = CALC[mode].fields; runCalc(); }
  $('[data-calc-tabs]').addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (!b) return; mode = b.dataset.c; $$('[data-calc-tabs] button').forEach((x) => x.classList.toggle('on', x === b)); drawCalc(); });
  form.addEventListener('input', runCalc); form.addEventListener('change', runCalc); form.addEventListener('submit', (e) => e.preventDefault());
  out.addEventListener('click', (e) => {
    if (!e.target.closest('[data-calc-add]')) return;
    let n = 0; result.lines.forEach(([slug, q]) => { if (q > 0 && Cart.add(P(slug).id, q, true)) n++; });
    toast(`Added ${n} item${n === 1 ? '' : 's'} to your cart`, { action: ['View cart', () => window.A.openDrawer('cart')] });
  });
  drawCalc();

  $('[data-wa-boq]').href = waLink('Hi Atoka, I would like pricing on my bill of quantities. I will attach it here.');
  $('[data-call]').href = 'tel:' + CONTACT.phoneRaw;
  fillIcons();
  onChange(() => window.A.onChangeSync());
})();
