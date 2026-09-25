/* Shared renderers: product cards, project cards + modal, icon placeholders, counters. */
(function () {
  const { $, $$, esc, I, productArt, money } = window.A;
  const { PROJECTS, CATS } = window.ATOKA;

  // <span data-ico="name"> → inline svg
  function fillIcons(root = document) {
    $$('[data-ico]', root).forEach((el) => { if (!el.dataset.icoDone && I[el.dataset.ico]) { el.insertAdjacentHTML('afterbegin', I[el.dataset.ico]); el.dataset.icoDone = 1; } });
    $$('.modal-close:empty', root).forEach((b) => (b.innerHTML = I.close));
  }

  function stars(r) {
    const full = Math.round(r);
    return `<span class="p-stars" aria-label="${r} out of 5">${'★'.repeat(full)}<i>${'★'.repeat(5 - full)}</i></span>`;
  }

  function productCard(p) {
    const low = p.stock > 0 && p.stock <= 5;
    const cat = CATS.find((c) => c.slug === p.cat);
    return `<article class="p-card${p.stock ? '' : ' oos'}">
      <div class="p-media">
        <a href="product.html?p=${p.slug}" class="p-art-link" aria-label="${esc(p.name)}">${productArt(p)}</a>
        <div class="p-badges">${p.onSale ? `<span class="chip danger">−${p.salePct}%</span>` : ''}${p.featured ? '<span class="chip amber">Best seller</span>' : ''}${low ? `<span class="chip warn">Only ${p.stock} left</span>` : ''}</div>
        <div class="p-actions">
          <button class="p-act" data-save="${p.id}" aria-label="Save ${esc(p.name)}" aria-pressed="false">${I.heart}</button>
          <button class="p-act" data-compare="${p.id}" aria-label="Compare ${esc(p.name)}" aria-pressed="false">${I.compare}</button>
        </div>
        <span class="chip p-brand">${esc(p.brand)}</span>
        ${p.stock ? '' : '<div class="p-oos"><span>Out of stock</span></div>'}
      </div>
      <div class="p-body">
        <span class="p-cat">${esc(cat.name)} · ${esc(p.sub)}</span>
        <h3 class="p-name"><a href="product.html?p=${p.slug}">${esc(p.name)}</a></h3>
        <div class="p-rate">${stars(p.rating)} <span>${p.rating} (${p.reviews})</span></div>
        <div class="p-price"><b>${money(p.price)}</b>${p.onSale ? `<s>${money(p.was)}</s>` : ''}<small>${esc(p.unit)}</small></div>
        ${p.tiers.length ? `<div class="p-bulk">Bulk: −${p.tiers[0][1]}% from ${p.tiers[0][0].toLocaleString()} units</div>` : '<div class="p-bulk" style="visibility:hidden">·</div>'}
        <div class="p-btns">
          <button class="btn btn-dark btn-sm" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>${p.stock ? 'Add to cart' : 'Sold out'}</button>
          <button class="btn btn-line btn-sm" data-buy="${p.id}" ${p.stock ? '' : 'disabled'}>Buy now</button>
        </div>
      </div>
    </article>`;
  }

  function projectCard(p) {
    return `<article class="proj${p.wide ? ' wide' : ''}" data-type="${p.type}" data-project="${p.id}" tabindex="0" role="button" aria-label="Open ${esc(p.name)}">
      <div class="ph"><img src="assets/img/${p.img}${p.wide ? '' : '-sm'}.jpg" alt="${esc(p.name)}" loading="lazy">
        <span class="chip ${p.status === 'Ongoing' ? 'amber' : ''}">${p.status}</span><span class="arrow-circle">${I.arrow}</span></div>
      <div class="meta"><div><h3>${esc(p.name)}</h3><p>${esc(p.area)} · ${p.size.toLocaleString()} m²</p></div><span class="num-tag">( ${p.year} )</span></div>
    </article>`;
  }

  function openProject(id) {
    const p = PROJECTS.find((x) => x.id === id); if (!p) return;
    const body = $('[data-project-body]'); if (!body) return;
    body.innerHTML = `<div class="pm">
      <div class="pm-gallery">
        <div class="pm-main"><img src="assets/img/${p.gallery[0]}.jpg" alt="${esc(p.name)}" data-pm-main></div>
        ${p.gallery.length > 1 ? `<div class="pm-thumbs">${p.gallery.map((g, i) => `<button class="${i ? '' : 'on'}" data-pm-thumb="${g}" aria-label="Show image ${i + 1}"><img src="assets/img/${g}-sm.jpg" alt=""></button>`).join('')}</div>` : ''}
      </div>
      <div class="pm-info">
        <span class="chip ${p.status === 'Ongoing' ? 'amber' : 'soft'}">${p.status}</span>
        <h2 class="display h-sm" style="margin:14px 0 10px">${esc(p.name)}</h2>
        <p class="muted" style="margin:0 0 20px">${esc(p.blurb)}</p>
        <dl class="pm-facts">
          <div><dt>Type</dt><dd>${p.type}</dd></div><div><dt>Location</dt><dd>${esc(p.area)}</dd></div>
          <div><dt>Built area</dt><dd>${p.size.toLocaleString()} m²</dd></div><div><dt>Programme</dt><dd>${p.months} months</dd></div>
          <div><dt>Year</dt><dd>${p.year}</dd></div><div><dt>Scope</dt><dd>Design &amp; build</dd></div>
        </dl>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:22px">
          <a class="btn btn-navy" href="estimate.html?type=${p.type === 'Commercial' ? 'commercial' : p.type === 'Renovation' ? 'renovation' : 'new-home'}&ref=${p.id}">Build something similar</a>
          <a class="btn btn-line" target="_blank" rel="noopener" href="${window.A.waLink(`Hi Atoka, I saw the ${p.name} project on your website and would like to discuss something similar.`)}">${I.wa} Ask on WhatsApp</a>
        </div>
      </div></div>`;
    window.A.openModal('project');
  }

  function bindProjects(root = document) {
    root.addEventListener('click', (e) => {
      const th = e.target.closest('[data-pm-thumb]');
      if (th) { $('[data-pm-main]').src = `assets/img/${th.dataset.pmThumb}.jpg`; $$('[data-pm-thumb]').forEach((b) => b.classList.toggle('on', b === th)); return; }
      const c = e.target.closest('[data-project]'); if (c) openProject(c.dataset.project);
    });
    root.addEventListener('keydown', (e) => { const c = e.target.closest && e.target.closest('[data-project]'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openProject(c.dataset.project); } });
  }

  function projectTabs(tabsEl, gridEl, initial = 'All') {
    const types = ['All', ...new Set(PROJECTS.map((p) => p.type))];
    let cur = types.includes(initial) ? initial : 'All';
    const limit = +gridEl.dataset.limit || 99;
    const draw = () => {
      tabsEl.innerHTML = types.map((t) => `<button class="tab${t === cur ? ' active' : ''}" role="tab" aria-selected="${t === cur}" data-t="${t}">${t}</button>`).join('');
      const list = PROJECTS.filter((p) => cur === 'All' || p.type === cur).slice(0, limit);
      gridEl.innerHTML = list.map((p, i) => {
        // keep a balanced 8/4 rhythm regardless of filter
        const q = Object.assign({}, p, { wide: cur === 'All' ? p.wide : i % 3 === 0 && list.length > 1 });
        return projectCard(q);
      }).join('') || '<p class="muted">No projects in this category yet.</p>';
      gridEl.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.2,.7,.2,1)' });
    };
    tabsEl.addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (!b) return; cur = b.dataset.t; draw(); });
    draw();
  }

  function counters() {
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (!en.isIntersecting) return; io.unobserve(en.target);
      const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
      const tick = (t) => { const k = Math.min(1, (t - t0) / 1400), v = Math.round(end * (1 - Math.pow(1 - k, 3))); el.innerHTML = v + (suf ? `<sup>${suf}</sup>` : '<sup>+</sup>'); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: .4 });
    $$('[data-count]').forEach((el) => { el.innerHTML = el.dataset.count + `<sup>${el.dataset.suffix || '+'}</sup>`; io.observe(el); });
  }

  Object.assign(window.A, { fillIcons, productCard, projectCard, openProject, bindProjects, projectTabs, counters, stars });
  fillIcons();
})();
