(function () {
  const { $, esc, I, productCard, fillIcons, projectTabs, bindProjects, counters, toast, waLink } = window.A;
  const { PRODUCTS, CONTACT } = window.ATOKA;

  const STAGES = [
    ['Project Consultation', 'client-handshake', 'We start with a detailed conversation about your vision, stand and budget. Our team checks feasibility, zoning and soil conditions so your ideas line up with council requirements and your expectations.'],
    ['Design Development', 'engineer-frame', 'Our architects and engineers produce a design that balances looks with function — full drawings, 3D views and a bill of quantities, so you can make decisions before a single brick is laid.'],
    ['Construction Phase', 'cranes', 'With approved plans, construction begins under a dedicated project manager. We build with quality materials from our own yard and stick to the programme, the budget and every safety regulation.'],
    ['Project Handover', 'keys-handover', 'When the build is complete we walk through every room with you, close out any snag items and hand over the keys — together with warranties, as-built drawings and a maintenance guide.'],
  ];
  $('[data-stages]').innerHTML = STAGES.map(([t, img, d], i) => `
    <article class="stage rv" style="--d:${i * 0.06}s">
      <span class="num-tag">( 0${i + 1} )</span>
      <div class="pill-img v${i + 1}" style="background-image:url(assets/img/${img}-sm.jpg)" role="img" aria-label="${esc(t)}"></div>
      <h3>${t.replace(' ', '<br>')}</h3>
      <div class="s-desc"><p>${d}</p><a class="learn" href="estimate.html"><span>Learn More</span><span class="sq">${I.right}</span></a></div>
    </article>`).join('');

  const SERVICES = [
    ['house', 'New homes', 'Design & build from stand to keys', 'luxury-home-sm', 'new-home', '4–14 months'],
    ['building', 'Commercial', 'Offices, retail, apartments, warehouses', 'apartments-sm', 'commercial', '6–24 months'],
    ['crane', 'Estates & civils', 'Roads, reticulation, bulk earthworks', 'excavator-sm', 'commercial', 'Phased'],
    ['ext', 'Extensions', 'Add rooms, storeys, garages & cottages', 'frame-site-sm', 'extension', '2–6 months'],
    ['hammer', 'Renovations', 'Re-roofing, kitchens, bathrooms, re-plastering', 'white-house-solar-sm', 'renovation', '3–16 weeks'],
    ['wall', 'Boundary walls', 'Precast, brick and palisade with gates', 'townhouses-sm', 'boundary-wall', '1–4 weeks'],
  ];
  $('[data-services]').innerHTML = SERVICES.map(([ico, t, s, img, type, dur], i) => `
    <a class="notch-card rv" style="--d:${(i % 3) * 0.06}s" href="estimate.html?type=${type}">
      <div class="nc-media"><img src="assets/img/${img}.jpg" alt="" loading="lazy"></div>
      <div class="nc-cover"></div>
      <span class="arrow-circle nc-arrow">${I.arrow}</span>
      <div class="nc-body">
        <div class="tag-row"><span class="tag-ico">${I[ico]}</span>0${i + 1}</div>
        <h3 class="nc-title">${t}</h3>
        <p class="nc-sub" style="font-size:13.5px">${s}</p>
        <div class="nc-foot"><span class="nc-date">(${dur})</span><span class="btn btn-dark btn-sm">Estimate</span></div>
      </div>
    </a>`).join('');

  $('[data-featured]').innerHTML = PRODUCTS.filter((p) => p.featured).slice(0, 4).map(productCard).join('');

  $('[data-contact-list]').innerHTML = `
    <li><span>${I.phone}</span><a href="tel:${CONTACT.phoneRaw}">${CONTACT.phone}</a></li>
    <li><span>${I.wa}</span><a href="${waLink('Hi Atoka, I would like to discuss a project.')}" target="_blank" rel="noopener">Chat on WhatsApp</a></li>
    <li><span>${I.mail}</span><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
    <li><span>${I.pin}</span>${CONTACT.address}</li>`;

  projectTabs($('[data-proj-tabs]'), $('[data-proj-grid]'));
  bindProjects();
  counters();
  fillIcons();

  const f = $('[data-quick]');
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    ['name', 'phone'].forEach((n) => { const el = f.elements[n]; const bad = !el.value.trim() || (n === 'phone' && el.value.replace(/\D/g, '').length < 9); el.classList.toggle('err', bad); if (bad) ok = false; });
    if (!ok) { toast('Please add your name and a valid phone number'); return; }
    const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'Sending…';
    setTimeout(() => {
      f.innerHTML = `<div class="sent"><span class="sent-ico">${I.check}</span><h3 class="display h-sm">Thank you, ${esc(f.elements.name.value.split(' ')[0])}</h3><p class="muted">A project manager will call you within one working day.</p><a class="btn btn-line" href="estimate.html">Get an instant estimate meanwhile</a></div>`;
    }, 700);
  });
})();
