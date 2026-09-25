/* Atoka demo data — products, projects, delivery areas.
   Prices are demo figures in USD. */
(function () {
  const CATS = [
    { slug: 'cement-concrete', name: 'Cement & Concrete', icon: 'bag', subs: ['Cement', 'Aggregates', 'Admixtures'] },
    { slug: 'bricks-blocks', name: 'Bricks & Blocks', icon: 'brick', subs: ['Common bricks', 'Face bricks', 'Blocks & pavers'] },
    { slug: 'steel-mesh', name: 'Steel & Mesh', icon: 'rebar', subs: ['Rebar', 'Mesh', 'Structural'] },
    { slug: 'roofing', name: 'Roofing', icon: 'roof', subs: ['Sheeting', 'Tiles', 'Timber & trusses', 'Gutters'] },
    { slug: 'plumbing', name: 'Plumbing', icon: 'pipe', subs: ['Pipes', 'Tanks', 'Sanitaryware'] },
    { slug: 'electrical', name: 'Electrical', icon: 'bolt', subs: ['Cable', 'Distribution', 'Lighting'] },
    { slug: 'finishes', name: 'Paint & Finishes', icon: 'roller', subs: ['Paint', 'Waterproofing', 'Tiles & adhesive'] },
    { slug: 'tools-ppe', name: 'Tools & PPE', icon: 'drill', subs: ['Power tools', 'Hand tools', 'Safety'] },
  ];

  // [slug, name, cat, sub, brand, unit, price, was, stock, rating, reviews, warranty, kg, short, specs, tiers, featured]
  const T_BULK = [[10, 3], [50, 6], [200, 9]];
  const T_BRICK = [[1000, 4], [5000, 8], [20000, 12]];
  const T_STD = [[10, 3], [25, 5]];
  const raw = [
    ['ppc-surebuild-42-5n', 'SureBuild 42.5N Cement', 'cement-concrete', 'Cement', 'PPC', '50kg bag', 12.5, 13.9, 1240, 4.8, 212, null, 50, 'High-strength general purpose cement for structural concrete, slabs and columns.', { Class: 'CEM II 42.5N', 'Bag weight': '50 kg', 'Setting time': '≥ 60 min', Use: 'Slabs, columns, foundations', Standard: 'SAZS 150' }, T_BULK, 1],
    ['lafarge-32-5r', 'Lafarge 32.5R Masonry Cement', 'cement-concrete', 'Cement', 'Lafarge', '50kg bag', 11.2, null, 860, 4.6, 148, null, 50, 'Rapid-hardening cement ideal for brickwork mortar and plaster.', { Class: 'CEM II 32.5R', 'Bag weight': '50 kg', Use: 'Mortar, plaster, screeds', Standard: 'SAZS 150' }, T_BULK, 0],
    ['sino-zim-32-5n', 'Sino-Zim 32.5N Cement', 'cement-concrete', 'Cement', 'Sino-Zim', '50kg bag', 10.4, 11.0, 0, 4.3, 96, null, 50, 'Economical cement for non-structural masonry and plastering.', { Class: 'CEM II 32.5N', 'Bag weight': '50 kg', Use: 'Masonry, plaster' }, T_BULK, 0],
    ['river-sand-cube', 'Washed River Sand', 'cement-concrete', 'Aggregates', 'Atoka Select', 'per m³', 28, null, 300, 4.7, 61, null, 1600, 'Clean, washed river sand for concrete and plaster work. Delivered by tipper.', { Grade: 'Washed, screened', Volume: '1 m³', Use: 'Concrete, plaster' }, T_STD, 0],
    ['19mm-crushed-stone', '19mm Crushed Stone', 'cement-concrete', 'Aggregates', 'Atoka Select', 'per m³', 34, 38, 240, 4.8, 57, null, 1500, 'Quarry-crushed 19mm aggregate for reinforced concrete.', { Size: '19 mm', Volume: '1 m³', Use: 'Reinforced concrete' }, T_STD, 0],
    ['sika-waterproof-admix', 'Sika Waterproofing Admixture 5L', 'cement-concrete', 'Admixtures', 'Sika', '5L can', 24, null, 38, 4.5, 22, '12 months', 5.4, 'Integral waterproofer for mortars, renders and concrete.', { Volume: '5 L', Dosage: '1 L per 50 kg cement', Use: 'Foundations, renders, tanks' }, null, 0],

    ['common-cement-brick', 'Common Cement Brick', 'bricks-blocks', 'Common bricks', 'Atoka Select', 'per brick', 0.14, null, 180000, 4.6, 133, null, 3, 'Standard 222×106×73 cement brick for load-bearing walls.', { Size: '222 × 106 × 73 mm', Strength: '7 MPa', 'Per m² (single skin)': '≈ 50 bricks' }, T_BRICK, 1],
    ['burnt-clay-common', 'Burnt Clay Common Brick', 'bricks-blocks', 'Common bricks', 'Willdale', 'per brick', 0.17, 0.19, 95000, 4.7, 188, null, 3.2, 'Kiln-fired clay brick with excellent durability and thermal mass.', { Size: '222 × 106 × 73 mm', Strength: '10 MPa', Finish: 'Rough' }, T_BRICK, 0],
    ['red-face-brick', 'Red Satin Face Brick', 'bricks-blocks', 'Face bricks', 'Willdale', 'per brick', 0.42, null, 26000, 4.9, 74, null, 3.3, 'Smooth-faced red clay brick for exposed feature walls.', { Size: '222 × 106 × 73 mm', Finish: 'Satin smooth', Colour: 'Red' }, T_BRICK, 0],
    ['6in-hollow-block', '6" Hollow Concrete Block', 'bricks-blocks', 'Blocks & pavers', 'Atoka Select', 'per block', 0.95, null, 12000, 4.5, 41, null, 14, 'Quick-build 390×190×140 hollow block for boundary and farm walls.', { Size: '390 × 190 × 140 mm', 'Per m²': '12.5 blocks' }, [[100, 4], [1000, 8]], 0],
    ['interlock-paver', 'Interlocking Paver 60mm', 'bricks-blocks', 'Blocks & pavers', 'Atoka Select', 'per m²', 11.5, 13, 850, 4.6, 39, null, 130, 'Charcoal interlocking pavers for driveways and walkways.', { Thickness: '60 mm', Colour: 'Charcoal', 'Units per m²': '39' }, T_STD, 0],

    ['y12-rebar-6m', 'Y12 High-Tensile Rebar (6m)', 'steel-mesh', 'Rebar', 'ZimSteel', 'per length', 8.9, null, 2400, 4.7, 90, null, 5.3, 'Deformed high-yield 12mm bar for columns, beams and slabs.', { Diameter: '12 mm', Length: '6 m', Grade: '450 MPa' }, T_BULK, 1],
    ['y10-rebar-6m', 'Y10 High-Tensile Rebar (6m)', 'steel-mesh', 'Rebar', 'ZimSteel', 'per length', 6.3, 6.8, 3100, 4.6, 71, null, 3.7, 'Deformed 10mm bar for lintels, slabs and ring beams.', { Diameter: '10 mm', Length: '6 m', Grade: '450 MPa' }, T_BULK, 0],
    ['ref-193-mesh', 'Ref 193 Welded Mesh Sheet', 'steel-mesh', 'Mesh', 'ZimSteel', 'per sheet', 46, null, 4, 4.8, 33, null, 36, 'Welded fabric mesh for surface beds and floor slabs.', { Sheet: '6 × 2.4 m', Wire: '5.6 mm @ 200 mm', Reference: '193' }, T_STD, 0],
    ['brickforce-75mm', 'Brickforce 75mm (20m roll)', 'steel-mesh', 'Mesh', 'Atoka Select', 'per roll', 3.8, null, 900, 4.4, 58, null, 2.1, 'Galvanised brickforce reinforcement for every 4th course.', { Width: '75 mm', Length: '20 m', Finish: 'Galvanised' }, T_BULK, 0],
    ['ipe-100-beam', 'IPE 100 Steel Beam (6m)', 'steel-mesh', 'Structural', 'ZimSteel', 'per length', 64, 70, 60, 4.7, 12, null, 49, 'Hot-rolled I-section for lintels over wide openings and carports.', { Section: 'IPE 100', Length: '6 m', 'Mass per m': '8.1 kg' }, null, 0],

    ['ibr-0-5-charcoal', 'IBR Sheet 0.5mm Charcoal (per m)', 'roofing', 'Sheeting', 'Tassburg', 'per metre', 7.8, null, 5200, 4.8, 104, '15 years', 4.9, 'Pre-painted IBR profile roof sheeting, cut to your length.', { Thickness: '0.5 mm', 'Cover width': '686 mm', Finish: 'Pre-painted charcoal', Warranty: '15 years' }, T_BULK, 1],
    ['corrugated-0-4-galv', 'Corrugated Sheet 0.4mm Galvanised (3m)', 'roofing', 'Sheeting', 'Tassburg', 'per sheet', 14.5, 16, 700, 4.3, 49, '10 years', 11, 'Classic galvanised corrugated sheet for outbuildings and farms.', { Thickness: '0.4 mm', Length: '3 m', Finish: 'Galvanised' }, T_BULK, 0],
    ['concrete-roof-tile', 'Double-Roman Concrete Roof Tile', 'roofing', 'Tiles', 'Coverland', 'per tile', 0.85, null, 14000, 4.6, 63, '25 years', 4.3, 'Durable concrete roof tile in slate grey. ≈ 10.5 tiles per m².', { Colour: 'Slate grey', 'Tiles per m²': '10.5', Weight: '4.3 kg' }, [[500, 5], [2000, 9]], 0],
    ['sa-pine-38x114', 'Treated SA Pine 38×114 (6m)', 'roofing', 'Timber & trusses', 'Atoka Select', 'per length', 12.4, null, 480, 4.5, 37, null, 14, 'CCA-treated structural timber for rafters and trusses.', { Section: '38 × 114 mm', Length: '6 m', Treatment: 'CCA H2', Grade: 'S5' }, T_BULK, 0],
    ['pvc-gutter-4m', 'PVC Seamless Gutter (4m)', 'roofing', 'Gutters', 'Marley', 'per length', 9.9, 11.5, 320, 4.4, 28, '10 years', 2.6, 'UV-stable 125mm PVC gutter in charcoal.', { Size: '125 mm', Length: '4 m', Colour: 'Charcoal' }, T_STD, 0],

    ['hdpe-32mm-100m', 'HDPE Pipe 32mm Class 6 (100m)', 'plumbing', 'Pipes', 'Plastics Zimbabwe', 'per roll', 78, null, 45, 4.6, 26, '50 years', 28, 'Flexible HDPE water pipe for borehole and mains supply lines.', { Diameter: '32 mm', Class: '6 (60 m head)', Length: '100 m' }, null, 0],
    ['pvc-110-sewer-6m', 'PVC Sewer Pipe 110mm (6m)', 'plumbing', 'Pipes', 'Plastics Zimbabwe', 'per length', 16.5, null, 260, 4.5, 31, null, 9, 'Class 34 underground drainage pipe.', { Diameter: '110 mm', Length: '6 m', Class: '34 (SABS 791)' }, T_STD, 0],
    ['jojo-5000l-tank', 'JoJo Vertical Water Tank 5000L', 'plumbing', 'Tanks', 'JoJo', 'each', 485, 530, 9, 4.9, 117, '10 years', 110, 'UV-stabilised food-grade water tank. Ideal for borehole storage.', { Capacity: '5 000 L', Height: '2.23 m', Diameter: '1.82 m', Material: 'LLDPE food grade' }, null, 1],
    ['close-coupled-wc', 'Close-Coupled Toilet Suite', 'plumbing', 'Sanitaryware', 'Vitreous', 'each', 96, null, 22, 4.5, 43, '5 years', 32, 'White vitreous china suite with dual-flush cistern and soft-close seat.', { Flush: 'Dual 3/6 L', Outlet: 'P-trap', Seat: 'Soft-close' }, null, 0],

    ['surfix-2-5mm-100m', 'Surfix Cable 2.5mm² (100m)', 'electrical', 'Cable', 'CAFCA', 'per roll', 92, 99, 64, 4.8, 84, null, 11, 'Twin & earth flat cable for plug circuits.', { Size: '2.5 mm²', Cores: 'Twin + earth', Length: '100 m' }, null, 0],
    ['db-board-12-way', '12-Way Distribution Board', 'electrical', 'Distribution', 'Schneider', 'each', 58, null, 17, 4.7, 19, '2 years', 3, 'Surface-mount DB with 63A main switch and earth-leakage ready.', { Ways: '12', 'Main switch': '63 A', Mounting: 'Surface' }, null, 0],
    ['led-downlight-9w', 'LED Downlight 9W (pack of 10)', 'electrical', 'Lighting', 'Eurolux', 'pack', 39, 48, 140, 4.6, 52, '2 years', 1.6, 'Warm-white recessed LED downlights for ceilings.', { Power: '9 W', Colour: '3000 K warm white', Cutout: '90 mm' }, T_STD, 0],

    ['plascon-double-velvet-20l', 'Plascon Double Velvet 20L', 'finishes', 'Paint', 'Plascon', '20L tin', 118, 129, 36, 4.9, 141, null, 26, 'Premium washable matt acrylic for interior walls.', { Volume: '20 L', Finish: 'Matt', Coverage: '8–10 m²/L' }, T_STD, 1],
    ['dulux-weatherguard-20l', 'Dulux Weatherguard 20L', 'finishes', 'Paint', 'Dulux', '20L tin', 104, null, 3, 4.7, 88, null, 26, 'Exterior acrylic with UV and algae resistance.', { Volume: '20 L', Finish: 'Low sheen', Coverage: '7–9 m²/L' }, T_STD, 0],
    ['abe-roof-seal-5l', 'A.B.E. Roof Sealer 5L', 'finishes', 'Waterproofing', 'A.B.E.', '5L tin', 32, null, 55, 4.4, 24, null, 6, 'Bituminous waterproofing for parapets, flat roofs and flashings.', { Volume: '5 L', Type: 'Bitumen emulsion' }, null, 0],
    ['porcelain-600-tile', 'Porcelain Floor Tile 600×600 (per m²)', 'finishes', 'Tiles & adhesive', 'Atoka Select', 'per m²', 16.9, 19.5, 620, 4.6, 45, null, 23, 'Rectified matt porcelain in warm grey.', { Size: '600 × 600 mm', Finish: 'Matt rectified', 'PEI rating': '4' }, T_STD, 0],
    ['tile-adhesive-20kg', 'Tile Adhesive 20kg', 'finishes', 'Tiles & adhesive', 'TAL', '20kg bag', 9.8, null, 400, 4.5, 38, null, 20, 'Cement-based adhesive for floor and wall tiles.', { Weight: '20 kg', Coverage: '≈ 4 m²' }, T_BULK, 0],

    ['makita-angle-grinder', 'Makita 115mm Angle Grinder', 'tools-ppe', 'Power tools', 'Makita', 'each', 79, 89, 14, 4.8, 66, '1 year', 2.2, '720W compact grinder for cutting and grinding steel and tile.', { Power: '720 W', Disc: '115 mm', Speed: '11 000 rpm' }, null, 0],
    ['dewalt-sds-hammer', 'DeWalt SDS-Plus Rotary Hammer', 'tools-ppe', 'Power tools', 'DeWalt', 'each', 189, null, 6, 4.9, 29, '3 years', 3.4, '800W 3-mode hammer drill for concrete and masonry.', { Power: '800 W', Impact: '2.6 J', Chuck: 'SDS-Plus' }, null, 0],
    ['builders-wheelbarrow', 'Heavy-Duty Wheelbarrow 90L', 'tools-ppe', 'Hand tools', 'Lasher', 'each', 64, 72, 30, 4.6, 58, '1 year', 16, 'Pneumatic-tyre builder’s barrow with steel tray.', { Capacity: '90 L', Tyre: 'Pneumatic', Tray: '0.9 mm steel' }, null, 0],
    ['ppe-starter-kit', 'Site PPE Starter Kit', 'tools-ppe', 'Safety', 'Atoka Select', 'kit', 29, null, 80, 4.7, 36, null, 1.5, 'Hard hat, hi-vis vest, gloves, goggles and ear plugs.', { Includes: 'Hard hat, vest, gloves, goggles, plugs', Standard: 'EN 397 / EN 471' }, T_STD, 0],
  ];

  const now = Date.now();
  const PRODUCTS = raw.map((r, i) => {
    const [slug, name, cat, sub, brand, unit, price, was, stock, rating, reviews, warranty, kg, short, specs, tiers, featured] = r;
    return {
      id: i + 1, slug, name, cat, sub, brand, unit, price, was, stock, rating, reviews, warranty, kg, short, specs,
      tiers: tiers || [], featured: !!featured, added: now - i * 86400000 * 3,
      onSale: !!was && was > price, salePct: was ? Math.round((1 - price / was) * 100) : 0,
      sku: 'ATK-' + String(1000 + i * 7),
    };
  });

  const PROJECTS = [
    { id: 'borrowdale-villa', name: 'Borrowdale Brooke Villa', type: 'Residential', area: 'Borrowdale, Harare', year: 2025, size: 620, months: 14, status: 'Completed', img: 'luxury-home', gallery: ['luxury-home', 'interior-walkthrough', 'keys-handover'], wide: true, blurb: 'A five-bedroom family villa with double-volume living spaces, a landscaped motor court and an off-grid ready electrical design.' },
    { id: 'highlands-residence', name: 'Highlands Stone Residence', type: 'Residential', area: 'Highlands, Harare', year: 2024, size: 480, months: 11, status: 'Completed', img: 'stone-villa', gallery: ['stone-villa', 'engineer-frame'], blurb: 'Natural stone cladding, standing-seam roofing and oversized glazing on a sloping stand.' },
    { id: 'avondale-apartments', name: 'Avondale Heights Apartments', type: 'Commercial', area: 'Avondale, Harare', year: 2025, size: 3400, months: 22, status: 'Ongoing', img: 'apartments', gallery: ['apartments', 'cranes', 'site-team'], blurb: 'Four-storey, 32-unit residential block with basement parking and rooftop terraces.' },
    { id: 'greendale-cluster', name: 'Greendale Cluster Homes', type: 'Estates', area: 'Greendale, Harare', year: 2024, size: 2900, months: 18, status: 'Completed', img: 'townhouses', gallery: ['townhouses', 'estate-aerial'], wide: true, blurb: 'Twelve double-storey cluster homes with shared services, paved roads and a guard house.' },
    { id: 'mt-pleasant-family', name: 'Mount Pleasant Family Home', type: 'Residential', area: 'Mount Pleasant, Harare', year: 2023, size: 340, months: 9, status: 'Completed', img: 'family-home', gallery: ['family-home', 'roof-truss'], blurb: 'Four-bedroom home with a double garage, timber-framed gables and a covered patio.' },
    { id: 'ruwa-estate', name: 'Ruwa Gardens Estate', type: 'Estates', area: 'Ruwa', year: 2026, size: 12800, months: 30, status: 'Ongoing', img: 'estate-aerial', gallery: ['estate-aerial', 'excavator', 'site-team'], wide: true, blurb: 'Serviced 64-stand estate: bulk earthworks, roads, reticulation and show-house construction.' },
    { id: 'gunhill-modern', name: 'Gunhill Modern Gable', type: 'Residential', area: 'Gunhill, Harare', year: 2025, size: 290, months: 8, status: 'Completed', img: 'modern-house', gallery: ['modern-house', 'engineer-frame'], blurb: 'A contemporary gabled home with a timber-slat entrance and balcony.' },
    { id: 'marlborough-reno', name: 'Marlborough Renovation', type: 'Renovation', area: 'Marlborough, Harare', year: 2024, size: 210, months: 4, status: 'Completed', img: 'white-house-solar', gallery: ['white-house-solar'], blurb: 'Full re-roof, new plaster and paint, kitchen and bathroom refurbishment on a 1990s home.' },
    { id: 'msasa-warehouse', name: 'Msasa Logistics Shed', type: 'Commercial', area: 'Msasa, Harare', year: 2026, size: 1800, months: 7, status: 'Ongoing', img: 'frame-site', gallery: ['frame-site', 'roof-truss', 'excavator'], blurb: 'Portal-frame warehouse with 8m eaves, loading bays and a two-level office block.' },
  ];

  // km from Atoka HQ (Msasa, Harare) — drives delivery fee
  const AREAS = [
    ['Avondale', 7], ['Belgravia', 6], ['Borrowdale', 11], ['Borrowdale Brooke', 14], ['Chisipite', 9], ['Colne Valley', 12],
    ['Eastlea', 4], ['Emerald Hill', 9], ['Glen Lorne', 13], ['Greendale', 5], ['Gunhill', 9], ['Harare CBD', 8],
    ['Hatfield', 7], ['Highlands', 7], ['Hillside', 5], ['Kuwadzana', 20], ['Mabelreign', 12], ['Mandara', 8],
    ['Marlborough', 13], ['Milton Park', 9], ['Mount Pleasant', 11], ['Msasa', 1], ['Pomona', 12], ['Ruwa', 17],
    ['Southerton', 10], ['Tafara', 12], ['Waterfalls', 13], ['Westgate', 16], ['Chitungwiza', 27], ['Norton', 44],
    ['Goromonzi', 35], ['Marondera', 70], ['Bindura', 88], ['Chegutu', 106], ['Kadoma', 142], ['Mutare', 256],
    ['Gweru', 275], ['Masvingo', 292], ['Bulawayo', 435],
  ].map(([name, km]) => ({ name, km }));

  const CONTACT = {
    phone: '+263 77 123 4567',
    phoneRaw: '263771234567',
    email: 'hello@atoka.co.zw',
    address: '14 Mutare Road, Msasa, Harare',
    hours: 'Mon–Fri 7:30–17:00 · Sat 8:00–13:00',
  };

  window.ATOKA = { CATS, PRODUCTS, PROJECTS, AREAS, CONTACT };
})();
