(function () {
  const { $, $$, esc, I, productArt, money, unitPrice, byId, Cart, toast, waLink, deliveryFee, store, openModal, closeAll, onChange } = window.A;
  const { AREAS, CONTACT } = window.ATOKA;
  const root = $('[data-checkout]');

  const METHODS = [
    { id: 'ecocash', name: 'EcoCash', note: 'USD wallet · prompt on your phone', mobile: true, mark: '<span class="pm-mark" style="background:#0f4c9c;color:#fff">Eco<b style="color:#e8262c">Cash</b></span>' },
    { id: 'onemoney', name: 'OneMoney', note: 'Prompt on your phone', mobile: true, mark: '<span class="pm-mark" style="background:#f36f21;color:#fff">One<b>Money</b></span>' },
    { id: 'innbucks', name: 'InnBucks', note: 'Pay with InnBucks code', mark: '<span class="pm-mark" style="background:#101010;color:#f8b433">Inn<b>Bucks</b></span>' },
    { id: 'card', name: 'Visa / Mastercard', note: 'Secure card payment', mark: '<span class="pm-mark" style="background:#1a1f71;color:#fff;font-style:italic">VISA <b style="color:#f7b600;font-style:normal">●</b><b style="color:#eb001b;margin-left:-6px;font-style:normal">●</b></span>' },
    { id: 'zimswitch', name: 'ZimSwitch', note: 'Local debit cards', mark: '<span class="pm-mark" style="background:#00843d;color:#fff">Zim<b>Switch</b></span>' },
    { id: 'bank', name: 'Bank transfer', note: 'Order held 48h until funds clear', mark: `<span class="pm-mark" style="background:#eef0f3;color:#16172b">${I.building.replace('<svg', '<svg width="16" height="16"')} Bank</span>` },
  ];

  const S = Object.assign({ step: 1, method: 'delivery', area: '', km: 0, address: '', city: 'Harare', name: '', phone: '', email: '', date: '', notes: '', pay: 'ecocash', payPhone: '', terms: false }, store.get('checkout', {}), { step: 1, terms: false });
  const save = () => store.set('checkout', Object.assign({}, S, { step: 1 }));
  let sumOpen = false;

  function totals() {
    const t = Cart.totals();
    const d = S.method === 'pickup' ? { total: 0, base: 0, heavy: 0, trucks: 0 } : S.area ? deliveryFee(S.km, t.kg) : null;
    return { ...t, d, total: t.sub + (d ? d.total : 0) };
  }

  function summary() {
    const t = totals(); const items = Cart.items();
    return `<aside class="co-summary${sumOpen ? ' open' : ''}">
      <div class="panel co-sum-panel">
        <button class="co-sum-toggle" data-sum-toggle aria-expanded="${sumOpen}"><span>${I.cart} ${sumOpen ? 'Hide' : 'Show'} order summary <i class="chev"></i></span><b>${money(t.total, 2)}</b></button>
        <div class="co-sum-body">
        <div class="co-sum-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 class="title" style="font-size:18px">Order summary</h3><button class="learn" data-open="cart"><span>Edit</span></button></div>
        <div class="co-items">${items.map((i) => { const p = byId(i.id); return `<div class="co-item"><span class="th">${productArt(p)}<em>${i.qty > 999 ? Math.round(i.qty / 1000) + 'k' : i.qty}</em></span><div><b>${esc(p.name)}</b><small>${money(unitPrice(p, i.qty))} ${esc(p.unit)}</small></div><span>${money(unitPrice(p, i.qty) * i.qty, 2)}</span></div>`; }).join('')}</div>
        <div style="display:grid;gap:8px;margin-top:14px">
          <div class="sum-row"><span>Subtotal</span><b>${money(t.sub, 2)}</b></div>
          ${t.savings > 0.005 ? `<div class="sum-row"><span>Savings</span><b style="color:var(--ok)">−${money(t.savings, 2)}</b></div>` : ''}
          <div class="sum-row"><span>${S.method === 'pickup' ? 'Collection' : 'Delivery'}${t.d && S.method !== 'pickup' ? ` · ${S.km} km` : ''}</span><b>${S.method === 'pickup' ? 'Free' : t.d ? money(t.d.base, 2) : '—'}</b></div>
          ${t.d && t.d.heavy ? `<div class="sum-row"><span>Flatbed (${Math.round(t.kg).toLocaleString()} kg)</span><b>${money(t.d.heavy, 2)}</b></div>` : ''}
          <div class="sum-row total"><span>Total</span><b>${money(t.total, 2)}</b></div>
        </div>
        </div>
      </div>
      <div class="co-trust"><span>${I.shield}</span><p>Payments are processed securely. Your order is held for you as soon as payment is confirmed.</p></div>
    </aside>`;
  }

  const stepper = () => `<ol class="stepper">${['Delivery', 'Payment', 'Review'].map((l, i) => `<li class="${S.step === i + 1 ? 'on' : ''}${S.step > i + 1 ? ' done' : ''}"><button ${S.step > i + 1 ? `data-go="${i + 1}"` : 'disabled'}><i>${S.step > i + 1 ? I.check : i + 1}</i>${l}</button></li>`).join('')}</ol>`;

  function step1() {
    return `<div class="panel co-step">
      <h2 class="title co-h">How would you like to receive your order?</h2>
      <div class="opt-grid" style="grid-template-columns:1fr 1fr">
        <button class="opt${S.method === 'delivery' ? ' on' : ''}" data-method="delivery">${I.truck}<b>Delivery</b><small>$5 + $0.65/km from Msasa</small></button>
        <button class="opt${S.method === 'pickup' ? ' on' : ''}" data-method="pickup">${I.store}<b>Collect from yard</b><small>Free · ${esc(CONTACT.address)}</small></button>
      </div>
      ${S.method === 'delivery' ? `
      <div class="field" style="margin-top:20px"><label for="c-area">Delivery area</label>
        <div class="combo" data-combo>
          <input class="input" id="c-area" autocomplete="off" placeholder="Search suburb or town…" value="${esc(S.area)}" data-f="area" role="combobox" aria-expanded="false" aria-controls="combo-list">
          <ul class="combo-list" id="combo-list" role="listbox" hidden></ul>
        </div>
        <small class="muted" data-area-note>${S.area ? `${S.km} km from our yard` : ''}</small>
      </div>
      <div class="field" style="margin-top:12px"><label for="c-addr">Street address</label><input class="input" id="c-addr" data-f="address" value="${esc(S.address)}" placeholder="House number, street, stand no." autocomplete="street-address"></div>` : ''}
      <div class="row-2" style="margin-top:12px">
        <div class="field"><label for="c-name">Full name</label><input class="input" id="c-name" data-f="name" value="${esc(S.name)}" autocomplete="name"></div>
        <div class="field"><label for="c-phone">Phone</label><input class="input" id="c-phone" data-f="phone" value="${esc(S.phone)}" inputmode="tel" placeholder="+263 7…" autocomplete="tel"></div>
      </div>
      <div class="row-2" style="margin-top:12px">
        <div class="field"><label for="c-email">Email (for your receipt)</label><input class="input" id="c-email" data-f="email" type="email" value="${esc(S.email)}" autocomplete="email"></div>
        <div class="field"><label for="c-date">Preferred ${S.method === 'pickup' ? 'collection' : 'delivery'} date</label><input class="input" id="c-date" data-f="date" type="date" min="${new Date(Date.now() + 86400000).toISOString().slice(0, 10)}" value="${esc(S.date)}"></div>
      </div>
      <div class="field" style="margin-top:12px"><label for="c-notes">Notes for the driver / yard (optional)</label><textarea class="textarea" id="c-notes" data-f="notes" placeholder="Gate code, site contact, offloading instructions…" style="min-height:80px">${esc(S.notes)}</textarea></div>
      <div class="co-nav"><a class="btn btn-line" href="shop.html">${I.left.replace('<svg', '<svg width="14" height="14"')} Continue shopping</a><button class="btn btn-navy btn-lg" data-next>Continue to payment</button></div>
    </div>`;
  }
  function step2() {
    const m = METHODS.find((x) => x.id === S.pay);
    return `<div class="panel co-step">
      <h2 class="title co-h">Choose a payment method</h2>
      <div class="pay-grid">${METHODS.map((x) => `<button class="opt pay-opt${S.pay === x.id ? ' on' : ''}" data-pay="${x.id}">${x.mark}<b>${x.name}</b><small>${x.note}</small></button>`).join('')}</div>
      ${m.mobile ? `<div class="field" style="margin-top:18px;max-width:360px"><label for="c-payphone">${m.name} number</label><input class="input" id="c-payphone" data-f="payPhone" inputmode="tel" placeholder="07X XXX XXXX" value="${esc(S.payPhone || S.phone)}"><small class="muted">We'll send a payment prompt to this number.</small></div>` : ''}
      ${S.pay === 'bank' ? `<div class="bank-box"><b>Bank details</b><dl><div><dt>Account name</dt><dd>Atoka Construction (Pvt) Ltd</dd></div><div><dt>Bank</dt><dd>Your bank · Msasa branch</dd></div><div><dt>Account no.</dt><dd>0000 0000 0000</dd></div><div><dt>Reference</dt><dd>Your order number</dd></div></dl></div>` : ''}
      <div class="co-nav"><button class="btn btn-line" data-go="1">Back</button><button class="btn btn-navy btn-lg" data-next>Review order</button></div>
    </div>`;
  }
  function step3() {
    const m = METHODS.find((x) => x.id === S.pay); const t = totals();
    return `<div class="panel co-step">
      <h2 class="title co-h">Review and place your order</h2>
      <div class="review-grid">
        <div class="rv-box"><div class="rv-h"><span class="eyebrow">${S.method === 'pickup' ? 'Collection' : 'Delivery'}</span><button class="learn" data-go="1"><span>Edit</span></button></div>
          <p><b>${esc(S.name)}</b><br>${esc(S.phone)}${S.email ? '<br>' + esc(S.email) : ''}</p>
          <p class="muted">${S.method === 'pickup' ? esc(CONTACT.address) : `${esc(S.address)}<br>${esc(S.area)} · ${S.km} km`}${S.date ? `<br>Preferred: ${new Date(S.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}` : ''}</p></div>
        <div class="rv-box"><div class="rv-h"><span class="eyebrow">Payment</span><button class="learn" data-go="2"><span>Edit</span></button></div>
          <p>${m.mark}</p><p class="muted">${m.name}${m.mobile ? ' · ' + esc(S.payPhone || S.phone) : ''}</p></div>
      </div>
      ${S.notes ? `<div class="rv-box" style="margin-top:10px"><span class="eyebrow">Notes</span><p class="muted">${esc(S.notes)}</p></div>` : ''}
      <label class="check" style="margin-top:18px"><input type="checkbox" data-terms ${S.terms ? 'checked' : ''}> I confirm the delivery details are correct and agree to Atoka's terms of sale and 7-day returns policy.</label>
      <div class="co-nav"><button class="btn btn-line" data-go="2">Back</button><button class="btn btn-amber btn-lg" data-place>Place order · ${money(t.total, 2)}</button></div>
    </div>`;
  }

  function render() {
    if (!Cart.items().length) {
      root.innerHTML = `<div class="panel empty" style="padding:70px 20px">${I.cart}<h2 class="display h-sm">Your cart is empty</h2><p>Add some materials before checking out.</p><a class="btn btn-navy" href="shop.html">Go to the shop</a></div>`;
      return;
    }
    root.innerHTML = `${stepper()}<div class="co-layout"><div data-step>${[step1, step2, step3][S.step - 1]()}</div>${summary()}</div>`;
  }
  const refreshSummary = () => { const s = $('.co-summary'); if (s) s.outerHTML = summary(); };

  function validate() {
    const bad = [];
    if (S.step === 1) {
      if (S.method === 'delivery') { if (!S.area) bad.push('area'); if (S.address.trim().length < 4) bad.push('address'); }
      if (S.name.trim().length < 2) bad.push('name');
      if (S.phone.replace(/\D/g, '').length < 9) bad.push('phone');
      if (S.email && !/^\S+@\S+\.\S+$/.test(S.email)) bad.push('email');
    } else if (S.step === 2) {
      const m = METHODS.find((x) => x.id === S.pay);
      if (m.mobile && (S.payPhone || S.phone).replace(/\D/g, '').length < 9) bad.push('payPhone');
    }
    $$('[data-f]').forEach((el) => el.classList.toggle('err', bad.includes(el.dataset.f)));
    if (bad.length) { toast('Please check the highlighted fields'); const first = $(`[data-f="${bad[0]}"]`); first && first.focus(); }
    return !bad.length;
  }

  /* area combobox */
  function comboOpen(q) {
    const list = $('#combo-list'); if (!list) return;
    const n = q.trim().toLowerCase();
    const hits = AREAS.filter((a) => a.name.toLowerCase().includes(n)).slice(0, 8);
    list.innerHTML = hits.length ? hits.map((a, i) => `<li role="option" data-area="${esc(a.name)}" data-km="${a.km}" class="${i === 0 ? 'hi' : ''}"><span>${esc(a.name)}</span><small>${a.km} km · ${money(deliveryFee(a.km, 0).base, 2)}</small></li>`).join('') : '<li class="none">No match — choose the nearest town</li>';
    list.hidden = false; $('#c-area').setAttribute('aria-expanded', 'true');
  }
  function pickArea(name, km) {
    S.area = name; S.km = +km; save();
    const inp = $('#c-area'); inp.value = name; inp.classList.remove('err');
    $('#combo-list').hidden = true; inp.setAttribute('aria-expanded', 'false');
    $('[data-area-note]').textContent = `${km} km from our yard`;
    refreshSummary();
  }

  root.addEventListener('input', (e) => {
    const f = e.target.dataset.f; if (!f) return;
    if (f === 'area') { S.area = ''; S.km = 0; comboOpen(e.target.value); refreshSummary(); return; }
    S[f] = e.target.value; e.target.classList.remove('err'); save();
  });
  root.addEventListener('focusin', (e) => { if (e.target.id === 'c-area') comboOpen(e.target.value === S.area ? '' : e.target.value); });
  root.addEventListener('keydown', (e) => {
    if (e.target.id !== 'c-area') return;
    const items = $$('#combo-list li[data-area]'); if (!items.length) return;
    let i = items.findIndex((li) => li.classList.contains('hi'));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); i = (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length; items.forEach((li, k) => li.classList.toggle('hi', k === i)); }
    else if (e.key === 'Enter') { e.preventDefault(); const li = items[Math.max(0, i)]; pickArea(li.dataset.area, li.dataset.km); }
    else if (e.key === 'Escape') { $('#combo-list').hidden = true; }
  });
  document.addEventListener('mousedown', (e) => {
    const li = e.target.closest('#combo-list li[data-area]'); if (li) { e.preventDefault(); pickArea(li.dataset.area, li.dataset.km); return; }
    if (!e.target.closest('[data-combo]')) { const l = $('#combo-list'); if (l) l.hidden = true; }
  });

  root.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if ('sumToggle' in d) { sumOpen = !sumOpen; refreshSummary(); return; }
    if (d.method) { S.method = d.method; save(); render(); }
    else if (d.pay) { S.pay = d.pay; save(); render(); }
    else if (d.go) { S.step = +d.go; render(); scrollTo({ top: 0, behavior: 'smooth' }); }
    else if ('next' in d) { if (validate()) { S.step++; render(); scrollTo({ top: 0, behavior: 'smooth' }); } }
    else if ('place' in d) {
      if (!$('[data-terms]').checked) { toast('Please confirm the terms to continue'); $('[data-terms]').focus(); return; }
      pay();
    }
  });
  root.addEventListener('change', (e) => { if ('terms' in e.target.dataset) S.terms = e.target.checked; });

  /* simulated payment gateway */
  function pay() {
    const m = METHODS.find((x) => x.id === S.pay), t = totals();
    const no = 'ATK-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 9000 + 1000));
    const box = $('[data-pay-body]');
    const isBank = S.pay === 'bank';
    box.innerHTML = `<div class="pay-spin"></div><h3 class="display h-sm" style="margin:18px 0 8px">${isBank ? 'Reserving your order' : m.mobile ? 'Check your phone' : 'Connecting securely'}</h3>
      <p class="muted" data-pay-msg>${m.mobile ? `We've sent a ${m.name} prompt to <b>${esc(S.payPhone || S.phone)}</b>. Enter your PIN to approve <b>${money(t.total, 2)}</b>.` : isBank ? 'Holding your stock for 48 hours…' : `Redirecting to the secure ${m.name} payment page…`}</p>
      <div class="pay-bar"><i></i></div>`;
    openModal('pay');
    const msgs = m.mobile ? ['Waiting for approval…', 'Payment approved', 'Confirming order…'] : ['Processing payment…', 'Payment confirmed', 'Confirming order…'];
    msgs.forEach((txt, i) => setTimeout(() => { const el = $('[data-pay-msg]'); if (el) el.textContent = txt; }, 1300 + i * 900));
    setTimeout(() => {
      const order = { no, date: new Date().toISOString(), items: Cart.items(), totals: t, S: { ...S }, pay: m.name, status: isBank ? 'Awaiting transfer' : 'Paid' };
      const orders = store.get('orders', []); store.set('orders', [order, ...orders].slice(0, 20));
      Cart.clear(); closeAll(true); confirmation(order);
    }, 1300 + msgs.length * 900 + 300);
  }

  function confirmation(o) {
    const t = o.totals, isPickup = o.S.method === 'pickup';
    const eta = isPickup ? 'Ready for collection in 2 hours' : o.S.km <= 30 ? 'Delivery within 24–48 hours' : 'Delivery in 2–5 working days';
    root.innerHTML = `<div class="confirm panel">
      <div class="confirm-head"><span class="sent-ico">${I.check}</span><div><span class="eyebrow">Order ${o.status === 'Paid' ? 'confirmed' : 'received'}</span><h2 class="display h-md" style="margin:10px 0 6px">Thank you${o.S.name ? ', ' + esc(o.S.name.split(' ')[0]) : ''}<span class="dot">.</span></h2>
        <p class="muted" style="margin:0">Order <b style="color:var(--ink)">${o.no}</b> · ${eta}${o.S.email ? ` · receipt sent to ${esc(o.S.email)}` : ''}</p></div></div>
      <ol class="track">${['Order placed', o.status === 'Paid' ? 'Payment received' : 'Awaiting transfer', isPickup ? 'Being picked' : 'Loading at yard', isPickup ? 'Ready to collect' : 'Out for delivery'].map((s, i) => `<li class="${i < (o.status === 'Paid' ? 2 : 1) ? 'done' : i === (o.status === 'Paid' ? 2 : 1) ? 'now' : ''}"><i></i><span>${s}</span></li>`).join('')}</ol>
      <div class="confirm-grid">
        <div><span class="eyebrow">Items</span><div class="co-items" style="margin-top:12px">${o.items.map((i) => { const p = byId(i.id); return `<div class="co-item"><span class="th">${productArt(p)}<em>${i.qty > 999 ? Math.round(i.qty / 1000) + 'k' : i.qty}</em></span><div><b>${esc(p.name)}</b><small>${esc(p.unit)}</small></div><span>${money(unitPrice(p, i.qty) * i.qty, 2)}</span></div>`; }).join('')}</div></div>
        <div class="rv-box"><div class="sum-row"><span>Subtotal</span><b>${money(t.sub, 2)}</b></div><div class="sum-row" style="margin-top:8px"><span>${isPickup ? 'Collection' : 'Delivery'}</span><b>${t.d && t.d.total ? money(t.d.total, 2) : 'Free'}</b></div><div class="sum-row"><span>Payment</span><b>${esc(o.pay)}</b></div><div class="sum-row total" style="margin-top:10px"><span>Total</span><b>${money(t.total, 2)}</b></div></div>
      </div>
      <div class="co-nav" style="justify-content:flex-start;flex-wrap:wrap">
        <button class="btn btn-navy" data-receipt>${I.print.replace('<svg', '<svg width="15" height="15"')} Print receipt</button>
        <a class="btn btn-line" target="_blank" rel="noopener" href="${waLink(`Hi Atoka, checking on my order ${o.no}.`)}">${I.wa.replace('<svg', '<svg width="15" height="15"')} Track on WhatsApp</a>
        <a class="btn btn-line" href="shop.html">Continue shopping</a>
      </div></div>`;
    $('.stepper') && $('.stepper').remove();
    root.querySelector('[data-receipt]').onclick = () => receipt(o);
    scrollTo({ top: 0, behavior: 'smooth' });
  }

  function receipt(o) {
    const w = window.open('', '_blank'); if (!w) { toast('Allow pop-ups to print the receipt'); return; }
    const t = o.totals;
    w.document.write(`<!doctype html><html><head><title>Receipt ${o.no}</title><style>body{font-family:Inter,Arial,sans-serif;color:#16172b;margin:40px;max-width:720px}header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #05052e;padding-bottom:16px}img{height:44px}h1{font-size:22px;margin:0}table{width:100%;border-collapse:collapse;margin:24px 0}th,td{padding:10px 0;border-bottom:1px solid #eee;text-align:left;font-size:13px}td:last-child,th:last-child{text-align:right}.muted{color:#8b9099}.tot td{font-weight:700;font-size:16px;border:0}footer{font-size:12px;color:#8b9099;margin-top:30px}</style></head><body>
      <header><img src="${new URL('assets/img/logo.png', location.href)}" alt="Atoka"><div style="text-align:right"><h1>Receipt</h1><div class="muted">${o.no} · ${new Date(o.date).toLocaleString('en-GB')}</div></div></header>
      <p><b>${esc(o.S.name)}</b><br>${esc(o.S.phone)}<br>${o.S.method === 'pickup' ? 'Collection from yard' : esc(o.S.address + ', ' + o.S.area)}</p>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Amount</th></tr></thead><tbody>${o.items.map((i) => { const p = byId(i.id); const up = unitPrice(p, i.qty); return `<tr><td>${esc(p.name)}<br><span class="muted">${p.sku}</span></td><td>${i.qty.toLocaleString()}</td><td>${money(up, 2)}</td><td>${money(up * i.qty, 2)}</td></tr>`; }).join('')}
      <tr><td colspan="3">Subtotal</td><td>${money(t.sub, 2)}</td></tr><tr><td colspan="3">${o.S.method === 'pickup' ? 'Collection' : 'Delivery (' + o.S.km + ' km)'}</td><td>${money(t.d ? t.d.total : 0, 2)}</td></tr><tr class="tot"><td colspan="3">Total (USD)</td><td>${money(t.total, 2)}</td></tr></tbody></table>
      <p>Paid with ${esc(o.pay)} · Status: ${o.status}</p><footer>Atoka Construction · ${CONTACT.address} · ${CONTACT.phone} · ${CONTACT.email}</footer><script>setTimeout(()=>print(),400)<\/script></body></html>`);
    w.document.close();
  }

  onChange(() => { if ($('.co-summary')) { if (!Cart.items().length) render(); else refreshSummary(); } });
  render();
})();
