(function () {
  const { $, $$, esc, I, productArt, productCard, money, unitPrice, tierFor, bySlug, byId, catOf, Cart, Saves, Compare, toast, waLink, deliveryFee, store, stars, onChange } = window.A;
  const { PRODUCTS, AREAS } = window.ATOKA;
  const root = $('[data-pdp]');
  const p = bySlug(new URLSearchParams(location.search).get('p'));

  if (!p) {
    root.innerHTML = `<section class="sec"><div class="wrap empty"><h1 class="display h-md">Not found</h1><p>That product doesn't exist or has been removed.</p><a class="btn btn-navy" href="shop.html">Back to the shop</a></div></section>`;
    return;
  }
  document.title = `${p.name} — Atoka Materials Shop`;
  const cat = catOf(p.cat);
  const SITE = { 'cement-concrete': 'frame-site', 'bricks-blocks': 'townhouses', 'steel-mesh': 'cranes', roofing: 'roof-truss', plumbing: 'interior-walkthrough', electrical: 'engineer-frame', finishes: 'modern-house', 'tools-ppe': 'site-team' };

  // recently viewed
  const rv = store.get('recent', []).filter((id) => id !== p.id); store.set('recent', [p.id, ...rv].slice(0, 8));

  // deterministic demo reviews
  const NAMES = ['Tatenda', 'Farai', 'Nyasha', 'Blessing', 'Tapiwa', 'Chipo', 'Simba', 'Rumbi'];
  const TEXTS = ['Exactly as described, delivered on time to site.', 'Good quality and the bulk price made a real difference on our job.', 'Collected from the yard — quick loading, helpful staff.', 'Consistent quality batch to batch. Will reorder.', 'Delivery driver called ahead and offloaded carefully.', 'Fair price compared to other suppliers in Harare.'];
  const reviews = Array.from({ length: 4 }, (_, i) => ({ n: NAMES[(p.id + i * 3) % NAMES.length], t: TEXTS[(p.id + i) % TEXTS.length], r: i === 3 && p.rating < 4.7 ? 4 : 5, d: `${(p.id * 3 + i * 7) % 27 + 1} ${['Jun', 'Jul', 'Aug', 'Sep'][i]} 2026` }));
  const dist = [5, 4, 3, 2, 1].map((s) => { const w = s === 5 ? (p.rating - 4) * 90 : s === 4 ? (5 - p.rating) * 70 : s === 3 ? 4 : 1; return [s, Math.max(0, Math.round(w))]; });
  const dsum = dist.reduce((a, [, w]) => a + w, 0) || 1;

  let qty = 1;
  const stockBadge = () => p.stock <= 0 ? '<span class="chip danger">Out of stock</span>' : p.stock <= 5 ? `<span class="chip warn">Low stock — only ${p.stock} left</span>` : `<span class="chip ok">In stock · ${p.stock.toLocaleString()} available</span>`;

  root.innerHTML = `
  <section class="page-hero" style="padding-bottom:0">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="shop.html">Shop</a><span>/</span><a href="shop.html?cat=${p.cat}">${esc(cat.name)}</a><span>/</span><span>${esc(p.name)}</span></nav></div>
  </section>
  <section class="sec-tight" style="padding-top:20px">
    <div class="wrap pdp">
      <div class="pdp-gallery">
        <div class="pdp-main" data-main>${productArt(p, true)}</div>
        <div class="pdp-thumbs">
          <button class="on" data-view="art" aria-label="Product image">${productArt(p)}</button>
          <button data-view="site" aria-label="On site"><img src="assets/img/${SITE[p.cat]}-sm.jpg" alt=""></button>
          <button data-view="spec" aria-label="Specification card"><span class="spec-thumb">${I.doc}<small>Spec</small></span></button>
        </div>
      </div>

      <div class="pdp-info">
        <div style="display:flex;gap:8px;flex-wrap:wrap">${p.onSale ? `<span class="chip danger">−${p.salePct}% sale</span>` : ''}<span class="chip soft">${esc(p.brand)}</span>${p.warranty ? `<span class="chip soft">${I.shield.replace('<svg', '<svg width="12" height="12"')} ${esc(p.warranty)} warranty</span>` : ''}</div>
        <h1 class="pdp-title">${esc(p.name)}</h1>
        <div class="p-rate" style="font-size:13px">${stars(p.rating)} <span>${p.rating} · <a href="#tabs" data-goto="reviews" style="text-decoration:underline">${p.reviews} reviews</a> · SKU ${p.sku}</span></div>
        <p class="muted" style="margin:16px 0 0">${esc(p.short)}</p>

        <div class="pdp-price">
          <b data-unit-price>${money(p.price, 2)}</b>${p.onSale ? `<s>${money(p.was, 2)}</s><span class="save">Save ${money(p.was - p.price, 2)}</span>` : ''}<small>${esc(p.unit)}</small>
        </div>

        ${p.tiers.length ? `<div class="tiers" data-tiers>
          <div class="tiers-head"><span>Bulk pricing</span><span class="muted">per ${esc(p.unit.replace(/^per /, ''))}</span></div>
          ${[[1, 0], ...p.tiers].map(([q, t], i, arr) => `<div class="tier" data-tq="${q}"><span>${q.toLocaleString()}${arr[i + 1] ? '–' + (arr[i + 1][0] - 1).toLocaleString() : '+'}</span><span>${t ? `<em>−${t}%</em>` : ''}</span><b>${money(p.price * (1 - t / 100), 2)}</b></div>`).join('')}
        </div>` : ''}

        <div class="pdp-stock">${stockBadge()}</div>

        <div class="pdp-buy">
          <div class="qty qty-lg"><button data-step="-1" aria-label="Decrease">−</button><input type="number" value="1" min="1" max="${p.stock}" data-qty aria-label="Quantity"><button data-step="1" aria-label="Increase">+</button></div>
          <button class="btn btn-navy btn-lg" data-add-main ${p.stock ? '' : 'disabled'}>${I.cart.replace('<svg', '<svg width="16" height="16"')} Add to cart</button>
          <button class="btn btn-amber btn-lg" data-buy-main ${p.stock ? '' : 'disabled'}>Buy now</button>
        </div>
        <div class="pdp-line" data-line></div>

        <div class="pdp-actions">
          <button class="pa" data-save="${p.id}">${I.heart}<span>Save</span></button>
          <button class="pa" data-compare="${p.id}">${I.compare}<span>Compare</span></button>
          <a class="pa" target="_blank" rel="noopener" href="${waLink(`Hi Atoka, I'm interested in ${p.name} (${p.sku}). ${location.href}`)}">${I.wa}<span>Enquire</span></a>
          <button class="pa" data-share>${I.share}<span>Share</span></button>
          <button class="pa" data-sheet>${I.print}<span>Spec sheet</span></button>
        </div>

        <div class="deliv">
          <div class="deliv-head">${I.truck}<b>Delivery estimate</b></div>
          <select class="select" data-area aria-label="Delivery area"><option value="">Choose your area…</option>${AREAS.map((a) => `<option value="${a.km}">${a.name}</option>`).join('')}</select>
          <p class="muted" data-deliv-out style="margin:10px 0 0;font-size:13px">Free collection from our Msasa yard, or delivery from $5.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="sec-tight" id="tabs" style="padding-top:10px">
    <div class="wrap">
      <div class="tabs" role="tablist" data-ptabs>
        <button class="tab active" data-tab="desc">Description</button><button class="tab" data-tab="specs">Specifications</button><button class="tab" data-tab="reviews">Reviews (${p.reviews})</button><button class="tab" data-tab="ship">Delivery &amp; returns</button>
      </div>
      <div class="tab-panels panel">
        <div data-panel="desc"><p>${esc(p.short)}</p><p class="muted">Every batch that leaves the Atoka yard is inspected by the same team that uses it on our own sites. Need help choosing? Our yard staff can advise on quantities and alternatives — just ask on WhatsApp.</p>
          ${p.tiers.length ? `<p class="muted">Volume discounts apply automatically in your cart from ${p.tiers[0][0].toLocaleString()} units.</p>` : ''}</div>
        <div data-panel="specs" hidden><table class="spec-table"><tbody>${Object.entries({ Brand: p.brand, SKU: p.sku, Unit: p.unit, ...p.specs, 'Shipping weight': p.kg + ' kg', ...(p.warranty ? { Warranty: p.warranty } : {}) }).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div>
        <div data-panel="reviews" hidden>
          <div class="rev-grid">
            <div class="rev-sum"><b>${p.rating}</b>${stars(p.rating)}<span class="muted">${p.reviews} verified reviews</span>
              ${dist.map(([s, w]) => `<div class="rev-bar"><span>${s}★</span><i><em style="width:${(w / dsum) * 100}%"></em></i></div>`).join('')}
            </div>
            <div class="rev-list">${reviews.map((r) => `<div class="rev"><div style="display:flex;justify-content:space-between;gap:10px"><b>${r.n}</b><span class="muted" style="font-size:12px">${r.d}</span></div>${stars(r.r)}<p>${r.t}</p><span class="chip ok" style="height:22px">Verified buyer</span></div>`).join('')}</div>
          </div>
        </div>
        <div data-panel="ship" hidden>
          <ul class="ticks"><li>Delivery anywhere in Zimbabwe: $5 + $0.65 per km from Msasa, Harare.</li><li>Loads over 1 tonne travel on a flatbed (+$35 per 5 tonnes).</li><li>Harare deliveries within 24–48 hours; other towns 2–5 working days.</li><li>Free collection from the yard, Mon–Sat.</li><li>Unopened, undamaged items can be returned within 7 days.</li></ul>
        </div>
      </div>
    </div>
  </section>

  <section class="sec-tight">
    <div class="wrap">
      <div class="sec-head"><h2 class="display h-md">Related</h2><a class="learn" href="shop.html?cat=${p.cat}"><span>More ${esc(cat.name.toLowerCase())}</span><span class="sq">${I.right}</span></a></div>
      <div class="p-grid p-grid-4">${PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4).map(productCard).join('')}</div>
      <div data-recent></div>
    </div>
  </section>`;

  /* recently viewed */
  const recent = store.get('recent', []).filter((id) => id !== p.id).map(byId).filter(Boolean).slice(0, 4);
  if (recent.length) $('[data-recent]').innerHTML = `<div class="sec-head" style="margin-top:60px"><h2 class="display h-sm">Recently viewed</h2></div><div class="p-grid p-grid-4">${recent.map(productCard).join('')}</div>`;

  /* quantity + live pricing */
  const qIn = $('[data-qty]');
  let refresh = function () {
    const up = unitPrice(p, qty), t = tierFor(p, qty);
    $('[data-unit-price]').textContent = money(up, 2);
    $$('[data-tq]').forEach((row, i, rows) => { const q = +row.dataset.tq, nq = rows[i + 1] ? +rows[i + 1].dataset.tq : Infinity; row.classList.toggle('on', qty >= q && qty < nq); });
    const next = p.tiers.find(([q]) => q > qty);
    $('[data-line]').innerHTML = p.stock ? `Line total <b>${money(up * qty, 2)}</b>${t ? ` <span style="color:var(--ok)">(saving ${money((p.price - up) * qty, 2)})</span>` : ''}${next ? ` · <span style="color:var(--amber-ink)">buy ${(next[0] - qty).toLocaleString()} more to save ${next[1]}%</span>` : ''}` : 'Currently unavailable — <a style="text-decoration:underline" target="_blank" rel="noopener" href="' + waLink(`Hi Atoka, please let me know when ${p.name} is back in stock.`) + '">notify me on WhatsApp</a>';
    updateDelivery();
  };
  const setQty = (v) => { qty = Math.max(1, Math.min(v | 0 || 1, Math.max(1, p.stock))); qIn.value = qty; refresh(); };
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button, a'); if (!b) return;
    const d = b.dataset;
    if (d.step) setQty(qty + +d.step);
    else if ('addMain' in d) Cart.add(p.id, qty);
    else if ('buyMain' in d) { if (Cart.add(p.id, qty, true)) location.href = 'checkout.html'; }
    else if (d.view) {
      $$('[data-view]').forEach((x) => x.classList.toggle('on', x === b));
      const m = $('[data-main]');
      m.innerHTML = d.view === 'art' ? productArt(p, true) : d.view === 'site' ? `<img src="assets/img/${SITE[p.cat]}.jpg" alt="${esc(p.name)} in use on an Atoka site">` :
        `<div class="spec-card"><span class="eyebrow">Specification</span><h3>${esc(p.name)}</h3><dl>${Object.entries(p.specs).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>`;
    }
    else if (d.tab || d.goto) {
      const k = d.tab || d.goto;
      $$('[data-tab]').forEach((x) => { x.classList.toggle('active', x.dataset.tab === k); x.setAttribute('aria-selected', x.dataset.tab === k); });
      $$('[data-panel]').forEach((x) => (x.hidden = x.dataset.panel !== k));
    }
    else if ('share' in d) {
      if (navigator.share) navigator.share({ title: p.name, url: location.href }).catch(() => {});
      else navigator.clipboard.writeText(location.href).then(() => toast('Link copied to clipboard'), () => toast('Copy this link: ' + location.href));
    }
    else if ('sheet' in d) printSheet();
  });
  qIn.addEventListener('change', () => setQty(+qIn.value));

  function updateDelivery() {
    const sel = $('[data-area]'); if (!sel.value) return;
    const km = +sel.value, kg = p.kg * qty, f = deliveryFee(km, kg);
    const eta = km <= 30 ? '24–48 hours' : km <= 150 ? '2–3 working days' : '3–5 working days';
    $('[data-deliv-out]').innerHTML = `<b style="color:var(--ink)">${money(f.total, 2)}</b> to ${esc(sel.selectedOptions[0].text)} (${km} km) · arrives in ${eta}${f.trucks ? `<br><span style="color:var(--amber-ink)">Includes flatbed surcharge for ${Math.round(kg).toLocaleString()} kg load</span>` : ''}`;
  }
  $('[data-area]').addEventListener('change', updateDelivery);

  function printSheet() {
    const w = window.open('', '_blank'); if (!w) { toast('Allow pop-ups to open the spec sheet'); return; }
    w.document.write(`<!doctype html><html><head><title>${esc(p.name)} — Spec sheet</title><style>
      body{font-family:Inter,Arial,sans-serif;color:#16172b;margin:40px;max-width:760px}header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #05052e;padding-bottom:16px}
      img{height:44px}h1{font-size:28px;margin:28px 0 6px}.muted{color:#8b9099}.art{width:220px;float:right;margin:0 0 20px 20px;border-radius:12px;overflow:hidden}
      table{width:100%;border-collapse:collapse;margin-top:20px}th,td{text-align:left;padding:10px 0;border-bottom:1px solid #eee;font-size:14px}th{color:#8b9099;font-weight:500;width:40%}
      .price{font-size:26px;font-weight:700;margin:14px 0}footer{margin-top:40px;font-size:12px;color:#8b9099;border-top:1px solid #eee;padding-top:14px}</style></head><body>
      <header><img src="${new URL('assets/img/logo.png', location.href)}" alt="Atoka"><span class="muted">Product specification · ${new Date().toLocaleDateString('en-GB')}</span></header>
      <div class="art">${productArt(p, true)}</div><h1>${esc(p.name)}</h1><div class="muted">${esc(p.brand)} · SKU ${p.sku}</div><div class="price">${money(p.price, 2)} <span class="muted" style="font-size:14px;font-weight:400">${esc(p.unit)}</span></div><p>${esc(p.short)}</p>
      <table>${Object.entries({ ...p.specs, 'Shipping weight': p.kg + ' kg', ...(p.warranty ? { Warranty: p.warranty } : {}) }).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}
      ${p.tiers.length ? `<tr><th>Bulk pricing</th><td>${p.tiers.map(([q, t]) => `${q.toLocaleString()}+ units: −${t}%`).join('<br>')}</td></tr>` : ''}</table>
      <footer>Atoka Construction · ${window.ATOKA.CONTACT.address} · ${window.ATOKA.CONTACT.phone} · ${window.ATOKA.CONTACT.email}<br>Prices are indicative and subject to stock availability.</footer>
      <script>setTimeout(()=>print(),400)<\/script></body></html>`);
    w.document.close();
  }

  const sync = () => {
    $$('[data-save]').forEach((b) => { const on = Saves.has(b.dataset.save); b.classList.toggle('on', on); const s = b.querySelector('span'); if (s && b.classList.contains('pa')) s.textContent = on ? 'Saved' : 'Save'; });
    $$('[data-compare]').forEach((b) => b.classList.toggle('on', Compare.has(b.dataset.compare)));
  };
  onChange(sync); sync();

  /* phones: sticky buy bar once the main buy buttons scroll away */
  document.body.classList.add('has-buybar');
  const bar = document.createElement('div');
  bar.className = 'buybar'; bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = `<div class="bb-info"><b data-bb-price></b><small>${esc(p.unit)}${p.stock ? '' : ' · out of stock'}</small></div>
    <button class="btn btn-navy" data-bb-add ${p.stock ? '' : 'disabled'} tabindex="-1">Add ${qty > 1 ? qty + ' ' : ''}to cart</button>`;
  document.body.appendChild(bar);
  bar.querySelector('[data-bb-add]').addEventListener('click', () => Cart.add(p.id, qty));
  new IntersectionObserver(([en]) => {
    const on = !en.isIntersecting && en.boundingClientRect.top < 0;
    bar.classList.toggle('on', on); bar.setAttribute('aria-hidden', !on);
    bar.querySelector('button').tabIndex = on ? 0 : -1;
  }).observe($('.pdp-buy'));
  const syncBar = () => { $('[data-bb-price]').textContent = money(unitPrice(p, qty) * qty, 2); bar.querySelector('[data-bb-add]').textContent = qty > 1 ? `Add ${qty.toLocaleString()} to cart` : 'Add to cart'; };
  const _refresh = refresh; refresh = function () { _refresh(); syncBar(); };
  refresh();
})();
