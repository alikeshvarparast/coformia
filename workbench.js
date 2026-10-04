
(function () {
  /* ================= THEMES ================= */
  const THEMES = {
    nord: {
      light: { bar:'#E5E9F0', side:'#ECEFF4', bg:'#F8F9FB', panel:'#FFFFFF', line:'#D8DEE9', fg:'#2E3440', muted:'#5B6577', hover:'#E5E9F0', sel:'#D8DEE9', ok:'#4E7A35', warn:'#9A6A00', bad:'#B0404A',
        accent: { formulane:{ a:'#3E7C7A', s:'#3E7C7A', on:'#FFFFFF' }, qualane:{ a:'#4C6E96', s:'#4C6E96', on:'#FFFFFF' } } },
      dark:  { bar:'#242933', side:'#2B303B', bg:'#2E3440', panel:'#353C4A', line:'#434C5E', fg:'#ECEFF4', muted:'#A4AEC0', hover:'#3B4252', sel:'#434C5E', ok:'#A3BE8C', warn:'#EBCB8B', bad:'#D27B83',
        accent: { formulane:{ a:'#8FBCBB', s:'#8FBCBB', on:'#242933' }, qualane:{ a:'#88C0D0', s:'#81A1C1', on:'#242933' } } }
    },
    catppuccin: {
      light: { bar:'#DCE0E8', side:'#E6E9EF', bg:'#EFF1F5', panel:'#F8F9FB', line:'#CCD0DA', fg:'#4C4F69', muted:'#6C6F85', hover:'#E1E4EB', sel:'#CCD0DA', ok:'#2F7D1F', warn:'#A35F00', bad:'#C0102F',
        accent: { formulane:{ a:'#147F86', s:'#147F86', on:'#FFFFFF' }, qualane:{ a:'#1E66F5', s:'#1E66F5', on:'#FFFFFF' } } },
      dark:  { bar:'#11111B', side:'#181825', bg:'#1E1E2E', panel:'#26263A', line:'#313244', fg:'#CDD6F4', muted:'#A6ADC8', hover:'#2A2B3D', sel:'#45475A', ok:'#A6E3A1', warn:'#F9E2AF', bad:'#F38BA8',
        accent: { formulane:{ a:'#94E2D5', s:'#94E2D5', on:'#11111B' }, qualane:{ a:'#89B4FA', s:'#89B4FA', on:'#11111B' } } }
    }
  };
  const LABEL = { nord:'Nord', catppuccin:'Catppuccin', light:'Light', dark:'Dark', formulane:'Formulane', qualane:'Qualane' };

  const ICONS = {
    files:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>',
    flask:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M7.5 15h9"/>',
    lines:'<path d="M3 7h18M3 12h18M3 17h18"/><circle cx="7" cy="7" r="1.2"/><circle cx="13" cy="12" r="1.2"/><circle cx="17" cy="17" r="1.2"/>',
    chart:'<path d="M4 20V4M4 20h16"/><path d="m7 15 4-4 3 3 5-6"/>',
    leaf:'<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19l8-8"/>',
    swap:'<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
    stamp:'<path d="M9.5 3h5l-.8 6H17a2 2 0 0 1 2 2v3H5v-3a2 2 0 0 1 2-2h3.3z"/><path d="M5 18h14M7 21h10"/>',
    tasks:'<path d="m4 6 1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17"/><path d="M11 6h9M11 12h9M11 18h9"/>',
    batch:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 10h6M9 14h6M9 18h3"/>',
    coa:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 8h7M7 11h4"/><circle cx="16.5" cy="15" r="2.5"/><path d="m15 17-1 4 2.5-1.2L19 21l-1-4"/>',
    holds:'<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z"/><path d="M10 9v6M14 9v6"/>',
    spark:'<path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'
  };
  const svg = k => '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[k] + '</svg>';
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[ch]));
  const fmt = (n, d) => n.toLocaleString('en-CA', { minimumFractionDigits: d, maximumFractionDigits: d });

  /* ================= SAMPLE DATA ================= */
  const RM = {
    'Bread flour, Type 65':   { code:'RM-1001', sup:'Prairie Mills', cost:0.92, all:'Wheat', doc:'ok' },
    'Whole wheat flour':      { code:'RM-1004', sup:'Prairie Mills', cost:0.98, all:'Wheat', doc:'ok' },
    'Dark rye flour':         { code:'RM-1010', sup:'Northfield Grain', cost:1.35, all:'Rye (gluten)', doc:'warn' },
    'Water':                  { code:'RM-0001', sup:'Municipal, filtered', cost:0.002, all:'', doc:'ok' },
    'Levain (house culture)': { code:'RM-0010', sup:'In-house', cost:0.40, all:'Wheat', doc:'ok' },
    'Sea salt, fine':         { code:'RM-2001', sup:'Northshore Salt', cost:0.60, all:'', doc:'ok' },
    'Malted barley flour':    { code:'RM-1020', sup:'Lakeside Malt', cost:2.10, all:'Barley', doc:'ok' },
    'Seed mix':               { code:'RM-1030', sup:'Prairie Mills', cost:3.40, all:'Sesame', doc:'ok' },
    'Butter 82%':             { code:'RM-3002', sup:'Valley Dairy', cost:9.80, all:'Milk', doc:'ok' },
    'Whole egg, liquid':      { code:'RM-3005', sup:'Maple Egg Co.', cost:4.10, all:'Egg', doc:'bad' },
    'Tomato paste 28 °Bx':    { code:'RM-4002', sup:'Sunvale Tomato', cost:2.25, all:'', doc:'ok' }
  };
  const ING = (n, p) => [n, p];
  const FORMULAS = [
    { id:'f-0142', code:'FRM-0142', name:'Sourdough Country Loaf', cat:'Bakery', ver:'3.2', st:['info','In review'], owner:'S. Rahimi', upd:'Today 11:05', batch:500,
      ings:[ING('Bread flour, Type 65',54.2),ING('Water',37.5),ING('Levain (house culture)',6.2),ING('Sea salt, fine',1.1),ING('Malted barley flour',1.0)],
      specs:[['Moisture','36.0–39.0 %'],['pH','4.20–4.60'],['Loaf weight','800 ± 15 g'],['Sodium','≤ 430 mg / 100 g']] },
    { id:'f-0138', code:'FRM-0138', name:'Multigrain Sandwich', cat:'Bakery', ver:'2.0', st:['ok','Approved'], owner:'S. Rahimi', upd:'Sep 22',  batch:600,
      ings:[ING('Bread flour, Type 65',45),ING('Whole wheat flour',15),ING('Water',32),ING('Seed mix',5),ING('Sugar',1.5),ING('Sea salt, fine',1),ING('Yeast',0.5)],
      specs:[['Moisture','37.0–40.0 %'],['Slice weight','28 ± 2 g'],['Sodium','≤ 450 mg / 100 g']] },
    { id:'f-0131', code:'FRM-0131', name:'Rye Bâtard', cat:'Bakery', ver:'1.4', st:['warn','Doc expiring'], owner:'D. Moreau', upd:'Sep 10', batch:400,
      ings:[ING('Dark rye flour',30),ING('Bread flour, Type 65',25),ING('Water',38),ING('Levain (house culture)',5),ING('Sea salt, fine',1.2),ING('Caraway',0.8)],
      specs:[['Moisture','38.0–42.0 %'],['pH','4.00–4.40']] },
    { id:'f-0150', code:'FRM-0150', name:'Brioche Bun 80 g', cat:'Bakery', ver:'0.3', st:['idle','Draft'], owner:'D. Moreau', upd:'Sep 29', batch:300,
      ings:[ING('Bread flour, Type 65',48),ING('Whole egg, liquid',16),ING('Butter 82%',14),ING('Milk',12),ING('Sugar',7),ING('Yeast',1.5),ING('Sea salt, fine',1.5)],
      specs:[['Bun weight','80 ± 3 g'],['Moisture','30.0–34.0 %']] },
    { id:'f-0207', code:'FRM-0207', name:'Tomato Basil Sauce', cat:'Sauces & dressings', ver:'5.1', st:['ok','Approved'], owner:'A. Novak', upd:'Sep 28', batch:1000,
      ings:[ING('Tomato paste 28 °Bx',28),ING('Water',55),ING('Olive oil',6),ING('Onion, diced',5),ING('Sugar',3),ING('Sea salt, fine',1.5),ING('Basil',1),ING('Garlic',0.5)],
      specs:[['pH','≤ 4.40'],['Brix','12.0–14.0 °Bx'],['Bostwick','4–6 cm / 30 s']] },
    { id:'f-0215', code:'FRM-0215', name:'Caesar Dressing', cat:'Sauces & dressings', ver:'2.3', st:['info','In review'], owner:'A. Novak', upd:'Sep 30', batch:400,
      ings:[ING('Canola oil',52),ING('Water',20),ING('Egg yolk',8),ING('Parmesan',7),ING('White vinegar',6),ING('Anchovy paste',3),ING('Mustard',2),ING('Garlic',1),ING('Sea salt, fine',1)],
      specs:[['pH','≤ 4.10'],['Viscosity','18–24 Pa·s']] },
    { id:'f-0301', code:'FRM-0301', name:'Cold Brew Base', cat:'Beverages', ver:'1.1', st:['ok','Approved'], owner:'J. Patel', upd:'Aug 30', batch:2000,
      ings:[ING('Water',92),ING('Coffee extract',8)],
      specs:[['Brix','11.0–12.2 °Bx'],['pH','4.80–5.20']] }
  ];
  const ALLERGEN_OF = n => (RM[n] && RM[n].all) || ({ 'Milk':'Milk', 'Egg yolk':'Egg', 'Parmesan':'Milk', 'Anchovy paste':'Fish', 'Mustard':'Mustard' }[n] || '');
  const SUP_OF = n => (RM[n] && RM[n].sup) || '—';

  const LINES = [
    { id:'l1', n:1, prod:'Sparkling Lemon 355 mL', st:'ok',   val:'Fill 356.2 g · CO₂ 3.4 vol', lot:'26-0272-L1', speed:'420 cans/min', op:'R. Singh' },
    { id:'l2', n:2, prod:'Cold Brew 300 mL',       st:'warn', val:'Brix 12.1 · limit 11.0–12.2', lot:'26-0273-L2', speed:'180 btl/min', op:'K. Osei' },
    { id:'l3', n:3, prod:'Oat Drink 1 L',          st:'bad',  val:'pH 4.71 · limit ≤ 4.60', lot:'26-0274-L3', speed:'95 cartons/min', op:'L. Haddad' },
    { id:'l4', n:4, prod:'Peach Iced Tea 500 mL',  st:'ok',   val:'Seal 4.8 N · Brix 9.6', lot:'26-0271-L4', speed:'240 btl/min', op:'M. Ruiz' }
  ];
  const STW = { ok:'Pass', warn:'Watch', bad:'Fail', idle:'Due', info:'Open' };
  const chip = (s, t) => `<span class="chip ${s}">${t || STW[s]}</span>`;

  const TRENDS = {
    ph3:  { label:'pH · Line 3', unit:'', lo:4.20, hi:4.60, min:4.10, max:4.80, d:2, v:[4.41,4.39,4.44,4.42,4.46,4.43,4.47,4.50,4.48,4.53,4.59,4.71] },
    brix2:{ label:'Brix · Line 2', unit:' °Bx', lo:11.0, hi:12.2, min:10.8, max:12.6, d:1, v:[11.6,11.7,11.5,11.8,11.7,11.9,11.8,12.0,11.9,12.0,12.1,12.1] },
    fill1:{ label:'Fill weight · Line 1', unit:' g', lo:354.0, hi:358.0, min:353.5, max:358.5, d:1, v:[355.8,356.1,355.6,356.4,355.9,356.2,356.0,355.7,356.3,356.1,355.9,356.2] }
  };
  const TIMES = ['08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00'];
  function evalStatus(v, lo, hi) {
    if (isNaN(v)) return null;
    if (v < lo || v > hi) return 'bad';
    const m = (hi - lo) * 0.1;
    return (v - lo < m || hi - v < m) ? 'warn' : 'ok';
  }

  /* ================= VIEW HELPERS ================= */
  const guide = (text, list) => `<div class="guide"><span class="gl">What goes here</span><div><p>${text}</p>${list ? '<ul>' + list.map(x => `<li>${x}</li>`).join('') + '</ul>' : ''}</div></div>`;
  const head = (crumbs, title, meta, actions) => `
    <div class="crumbs">${crumbs}</div>
    <div class="rec-head"><div><h2>${title}</h2><div class="rec-meta">${meta || ''}</div></div><div class="actions">${actions || ''}</div></div>`;
  const panel = (title, sub, body) => `<div class="panel"><div class="panel-h">${title}<span>${sub || ''}</span></div>${body}</div>`;
  const table = (cols, rows, opts) => `<div class="tbl-wrap"><table${opts && opts.cls ? ` class="${opts.cls}"` : ''}><thead><tr>${cols.map(c => `<th${c.startsWith('#') ? ' class="num"' : ''}>${c.replace(/^#/, '')}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody>${opts && opts.foot ? `<tfoot>${opts.foot}</tfoot>` : ''}</table></div>`;
  const tr = (cells, open) => `<tr${open ? ` class="clickable" data-open="${open}"` : ''}>${cells.join('')}</tr>`;
  const td = (v, cls) => `<td${cls ? ` class="${cls}"` : ''}>${v}</td>`;
  const fields = pairs => `<dl class="fields">${pairs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  const subtabs = (id, names) => `<div class="subtabs" role="tablist" data-subgroup="${id}">${names.map((n, i) => `<button type="button" aria-selected="${i === 0}" data-sub="${i}">${n}</button>`).join('')}</div>`;
  const subpanels = (id, panels) => panels.map((p, i) => `<div data-subpanel="${id}" data-idx="${i}"${i ? ' hidden' : ''} style="display:grid;gap:16px">${p}</div>`).join('');

  function lineChart(t) {
    const W = 640, H = 230, L = 52, R = 16, T = 14, B = 30;
    const x = i => L + i * (W - L - R) / (t.v.length - 1);
    const y = v => T + (t.max - v) / (t.max - t.min) * (H - T - B);
    const ticks = [0, 1, 2, 3, 4].map(i => t.min + i * (t.max - t.min) / 4);
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t.label} trend, last 12 samples">`;
    s += `<rect x="${L}" y="${y(t.hi)}" width="${W - L - R}" height="${y(t.lo) - y(t.hi)}" fill="var(--c-ok)" opacity=".12"/>`;
    ticks.forEach(v => { s += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--c-line)" stroke-width="1"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" font-family="IBM Plex Mono, monospace" fill="var(--c-muted)">${fmt(v, t.d)}</text>`; });
    [['hi', 'Upper limit'], ['lo', 'Lower limit']].forEach(([k, n]) => { s += `<line x1="${L}" x2="${W - R}" y1="${y(t[k])}" y2="${y(t[k])}" stroke="var(--c-bad)" stroke-dasharray="4 4" stroke-width="1.2"/><text x="${W - R - 4}" y="${y(t[k]) - 5}" text-anchor="end" font-size="10.5" fill="var(--c-bad)" font-family="IBM Plex Sans, sans-serif">${n} ${fmt(t[k], t.d)}</text>`; });
    TIMES.forEach((tm, i) => { if (i % 2 === 0 || i === TIMES.length - 1) s += `<text x="${x(i)}" y="${H - 10}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono, monospace" fill="var(--c-muted)">${tm}</text>`; });
    s += `<polyline points="${t.v.map((v, i) => `${x(i)},${y(v)}`).join(' ')}" fill="none" stroke="var(--c-accent)" stroke-width="2"/>`;
    t.v.forEach((v, i) => { const st = evalStatus(v, t.lo, t.hi); s += `<circle cx="${x(i)}" cy="${y(v)}" r="${i === t.v.length - 1 ? 5.5 : 3.5}" fill="var(--c-${st})" stroke="var(--c-panel)" stroke-width="1.5"><title>${TIMES[i]} · ${fmt(v, t.d)}${t.unit}</title></circle>`; });
    return s + '</svg>';
  }

  /* ================= VIEWS ================= */
  const V = {};
  const def = (id, product, section, title, render) => { V[id] = { id, product, section, title, render }; };

  // ---------- FORMULANE · Formulas ----------
  def('f-list', 'formulane', 'formulas', 'All formulas', () =>
    guide('The home of this section is a <b>list</b> of every recipe. Each row opens the formula as a <b>detail page</b> in a new tab.', ['Columns: code, name, category, current version, status, owner, last change', 'Filters in the sidebar: category, status, owner']) +
    head('Formulas', 'All formulas', `<span>${FORMULAS.length} formulas</span><span>3 categories</span>`, '<button type="button" class="btn">Import from Excel</button><button type="button" class="btn primary">New formula</button>') +
    panel('Formulas', 'Click a row to open it', table(['Code', 'Name', 'Category', 'Version', 'Status', 'Owner', 'Updated'],
      FORMULAS.map(f => tr([td(f.code, 'mono'), td(`<b>${f.name}</b>`), td(f.cat, 'muted'), td('v' + f.ver, 'mono'), td(chip(...f.st)), td(f.owner), td(f.upd, 'muted')], f.id)))));

  FORMULAS.forEach(f => def(f.id, 'formulane', 'formulas', f.name, () => {
    const rows = f.ings.map(([n, p]) => tr([td(n), td(SUP_OF(n), 'muted'), td(fmt(p, 2), 'num'), `<td class="num" data-kg="${p * f.batch / 100}">${fmt(p * f.batch / 100, 1)}</td>`, td(ALLERGEN_OF(n) ? `<span class="allergen">${ALLERGEN_OF(n)}</span>` : '')], RM[n] ? 'rm-' + RM[n].code : null));
    const total = f.ings.reduce((a, [, p]) => a + p, 0);
    const ingPanel = panel('Ingredients', '<span class="units" role="group" aria-label="Batch units">Units <button type="button" data-unit="kg" aria-pressed="true">kg</button><button type="button" data-unit="lb" aria-pressed="false">lb</button><button type="button" data-unit="g" aria-pressed="false">g</button></span>', table(['Ingredient', 'Supplier', '#%', '#<span class="u">kg</span> / batch', 'Allergen'], rows,
      { foot: `<tr><td>Total</td><td></td><td class="num">${fmt(total, 2)}</td><td class="num" data-kg="${f.batch}">${fmt(f.batch, 1)}</td><td></td></tr>` }));
    const specPanel = panel('Spec limits', 'Shared with Qualane', `<ul class="specs">${f.specs.map(([k, v]) => `<li><b>${k}</b><span class="mono">${v}</span></li>`).join('')}</ul>`);
    const versions = panel('Versions', '', `<ul class="timeline">
      <li><time>${f.upd}</time><span class="tdot info"></span><div><b>v${f.ver}</b> ${f.st[1].toLowerCase()} · ${f.owner}</div></li>
      <li><time>Jun 03</time><span class="tdot ok"></span><div><b>v${(parseFloat(f.ver) - 0.1).toFixed(1)}</b> approved · in production until today</div></li>
      <li><time>Jan 17</time><span class="tdot"></span><div><b>v${(parseFloat(f.ver) - 0.2 > 0 ? parseFloat(f.ver) - 0.2 : 0.1).toFixed(1)}</b> retired</div></li></ul>`);
    const approvals = panel('Sign-off', 'Needed before release', `<ul class="doclist">
      <li><span class="grow"><b>R&amp;D lead</b><small>${f.owner}</small></span>${chip('ok', 'Signed')}</li>
      <li><span class="grow"><b>Head of QC</b><small>M. Chen</small></span>${f.st[0] === 'ok' ? chip('ok', 'Signed') : chip('idle', 'Waiting')}</li>
      <li><span class="grow"><b>Plant manager</b><small>T. Okafor</small></span>${f.st[0] === 'ok' ? chip('ok', 'Signed') : chip('idle', 'Waiting')}</li></ul>`);
    return guide('A <b>detail page</b> for one formula. The sub-tabs split it into parts so the page stays short.', ['Ingredients: % and kg for the batch size, supplier, allergens', 'Specs: limits the finished product must meet', 'Versions: every saved version and which one is in production', 'Sign-off: who must approve before it goes to the plant']) +
      head(`Formulas / ${f.cat} / ${f.code}`, f.name, `<code>${f.code}</code><span>Version <code>${f.ver}</code></span><span>Batch <code>${f.batch} kg</code></span>${chip(...f.st)}`,
        `<button type="button" class="btn" data-open="cr-0087">Request change</button><button type="button" class="btn primary" data-open="appr">Send for approval</button>`) +
      subtabs(f.id, ['Ingredients', 'Specs', 'Versions', 'Sign-off']) + subpanels(f.id, [ingPanel, specPanel, versions, approvals]);
  }));

  // ---------- FORMULANE · Ingredients ----------
  def('rm-list', 'formulane', 'ingredients', 'Ingredient library', () =>
    guide('The <b>library of raw materials</b>. Formulas pick ingredients from here, so when a price or allergen changes, every formula that uses it updates.', ['Code, supplier, cost per kg, allergens', 'Document status: spec sheet, allergen statement, certificates (with expiry dates)', '“Used in”: how many formulas use it']) +
    head('Ingredients & suppliers', 'Ingredient library', `<span>${Object.keys(RM).length} raw materials</span>${chip('warn', '1 doc expiring')}${chip('bad', '1 doc expired')}`, '<button type="button" class="btn primary">Add ingredient</button>') +
    panel('Raw materials', 'Click a row to open it', table(['Code', 'Ingredient', 'Supplier', '#Cost / kg', 'Allergen', 'Documents', '#Used in'],
      Object.entries(RM).map(([n, r]) => tr([td(r.code, 'mono'), td(`<b>${n}</b>`), td(r.sup, 'muted'), td('$' + fmt(r.cost, r.cost < 0.1 ? 3 : 2), 'num'), td(r.all ? `<span class="allergen">${r.all}</span>` : '<span class="muted">—</span>'), td(chip(r.doc, { ok: 'Valid', warn: 'Expiring', bad: 'Expired' }[r.doc])), td(FORMULAS.filter(f => f.ings.some(([i]) => i === n)).length, 'num')], 'rm-' + r.code)))));

  Object.entries(RM).forEach(([n, r]) => def('rm-' + r.code, 'formulane', 'ingredients', n, () => {
    const used = FORMULAS.filter(f => f.ings.some(([i]) => i === n));
    return guide('A <b>detail page</b> for one ingredient: what it is, who supplies it, what it costs, and the documents that prove it is safe and as described.') +
      head(`Ingredients / ${r.code}`, n, `<code>${r.code}</code><span>${r.sup}</span>${r.all ? `<span class="allergen">Allergen: ${r.all}</span>` : ''}`, '<button type="button" class="btn">Upload document</button>') +
      `<div class="two">${panel('Details', '', fields([['Supplier', r.sup === 'Prairie Mills' ? `<button type="button" class="link" data-open="sup-prairie">${r.sup}</button>` : r.sup], ['Cost', '$' + fmt(r.cost, r.cost < 0.1 ? 3 : 2) + ' / kg'], ['Allergens', r.all || 'None'], ['Storage', 'Dry, below 25 °C'], ['Shelf life', '9 months'], ['Country of origin', 'Canada']]))}
      ${panel('Documents', 'Expiry is tracked', `<ul class="doclist">
        <li><span class="grow"><b>Spec sheet</b><small>${r.doc === 'warn' ? 'Expires Oct 20, 2026' : r.doc === 'bad' ? 'Expired Sep 15, 2026' : 'Valid to Mar 2027'}</small></span>${chip(r.doc, { ok: 'Valid', warn: 'Expiring', bad: 'Expired' }[r.doc])}</li>
        <li><span class="grow"><b>Allergen statement</b><small>Valid to Jan 2027</small></span>${chip('ok', 'Valid')}</li>
        <li><span class="grow"><b>Certificate of analysis</b><small>Per delivery · last Sep 26</small></span>${chip('ok', 'On file')}</li></ul>`)}</div>` +
      panel('Used in', used.length + ' formulas', used.length ? table(['Formula', '#%'], used.map(f => tr([td(f.name), td(fmt(f.ings.find(([i]) => i === n)[1], 2), 'num')], f.id))) : '<p class="empty-state">Not used in any formula yet.</p>');
  }));

  def('sup-prairie', 'formulane', 'ingredients', 'Prairie Mills', () =>
    guide('A <b>supplier page</b>: approval status, audits, contacts and the materials you buy from them.') +
    head('Ingredients / Suppliers', 'Prairie Mills', `${chip('ok', 'Approved supplier')}<span>Since 2021</span>`, '<button type="button" class="btn">Log audit</button>') +
    `<div class="two">${panel('Details', '', fields([['Contact', 'Dana Lee, Sales'], ['Email', 'orders@prairiemills.example'], ['Last audit', 'Jun 12, 2026 · score 94'], ['Next audit', 'Jun 2027'], ['Lead time', '5 business days'], ['Certification', 'SQF Level 2']]))}
    ${panel('Materials supplied', '', table(['Code', 'Ingredient'], Object.entries(RM).filter(([, r]) => r.sup === 'Prairie Mills').map(([n, r]) => tr([td(r.code, 'mono'), td(n)], 'rm-' + r.code))))}</div>`);

  // ---------- FORMULANE · Specs ----------
  const SPEC_ROWS = [];
  FORMULAS.forEach(f => f.specs.forEach(([k, v]) => SPEC_ROWS.push([f, k, v])));
  def('spec-list', 'formulane', 'specs', 'Spec limits', () =>
    guide('The <b>limits</b> every finished product must meet, and how each one is tested. Qualane reads these same limits to colour lab results green, amber or red, so they are written once and used in both apps.', ['Product, parameter, limit, test method, how often to test']) +
    head('Specs', 'Spec limits', `<span>${SPEC_ROWS.length} limits</span><span>${FORMULAS.length} products</span>`, '<button type="button" class="btn primary">Add limit</button>') +
    panel('All limits', 'Click a method to see how the test is done', table(['Product', 'Parameter', 'Limit', 'Method', 'Frequency'],
      SPEC_ROWS.map(([f, k, v]) => tr([td(f.name), td(`<b>${k}</b>`), td(v, 'mono'), td(k === 'pH' ? '<button type="button" class="link" data-open="tm-ph">TM-02 pH meter</button>' : k === 'Moisture' ? 'TM-01 Oven 105 °C' : k.includes('weight') ? 'TM-05 Check-weigher' : 'TM-0' + (k.length % 6 + 3) + ' Lab'), td(k === 'pH' || k.includes('weight') ? 'Every 30 min' : 'Once per batch', 'muted')], k === 'pH' ? 'tm-ph' : null)))));
  def('tm-ph', 'formulane', 'specs', 'TM-02 pH meter', () =>
    guide('A <b>test method</b>: the written steps a technician follows so every result is measured the same way. Qualane shows these steps on the tablet during a check.') +
    head('Specs / Test methods', 'TM-02 · pH by meter', '<code>TM-02</code><span>Rev. 4 · Jan 2026</span>', '<button type="button" class="btn">Edit method</button>') +
    `<div class="two">${panel('Steps', '', `<ol class="steps">
      <li><span class="stepn">1</span><div><h4>Calibrate</h4><p>Two-point calibration with pH 4.00 and 7.00 buffers at the start of each shift.</p></div></li>
      <li><span class="stepn">2</span><div><h4>Prepare sample</h4><p>Bring 50 mL of sample to 20–25 °C. Stir gently.</p></div></li>
      <li><span class="stepn">3</span><div><h4>Measure</h4><p>Immerse the probe, wait for a stable reading (30 s), record to 2 decimals.</p></div></li>
      <li><span class="stepn">4</span><div><h4>Rinse</h4><p>Rinse the probe with distilled water and store in KCl.</p></div></li></ol>`)}
    ${panel('Equipment', '', fields([['Meter', 'Benchtop pH meter, ±0.01'], ['Buffers', 'pH 4.00, 7.00'], ['Temperature', '20–25 °C'], ['Used for', '5 products']]))}</div>`);

  // ---------- FORMULANE · Change requests ----------
  const CRS = [
    { id:'cr-0089', code:'CR-0089', t:'Reduce sugar in Brioche Bun', col:0, who:'D. Moreau', f:'FRM-0150' },
    { id:'cr-0085', code:'CR-0085', t:'Switch rye flour supplier', col:1, who:'S. Rahimi', f:'FRM-0131' },
    { id:'cr-0087', code:'CR-0087', t:'Salt reduction, Sourdough', col:2, who:'S. Rahimi', f:'FRM-0142' },
    { id:'cr-0086', code:'CR-0086', t:'Thicker Caesar, new oil ratio', col:2, who:'A. Novak', f:'FRM-0215' },
    { id:'cr-0081', code:'CR-0081', t:'Allergen label update', col:3, who:'A. Novak', f:'FRM-0215' }
  ];
  def('cr-board', 'formulane', 'changes', 'Change requests', () =>
    guide('A <b>board</b> of every proposed change. Any edit to an approved formula starts here: why, what changes, trial results, and who must approve. Cards move left to right.', ['Draft → In trial → Review → Approved']) +
    head('Change requests', 'Change requests', `<span>${CRS.length} open or recent</span>`, '<button type="button" class="btn primary">New change request</button>') +
    `<div class="kanban">${['Draft', 'In trial', 'Review', 'Approved'].map((c, i) => `<div class="kcol"><h4>${c}<span>${CRS.filter(x => x.col === i).length}</span></h4>${CRS.filter(x => x.col === i).map(x => `<div class="kcard" data-open="${x.id === 'cr-0087' ? 'cr-0087' : 'cr-board'}" tabindex="0"><code>${x.code} · ${x.f}</code><b>${x.t}</b><div class="meta"><span>${x.who}</span>${i === 3 ? chip('ok', 'Done') : i === 2 ? chip('info', 'Review') : ''}</div></div>`).join('')}</div>`).join('')}</div>`);
  def('cr-0087', 'formulane', 'changes', 'CR-0087 Salt reduction', () =>
    guide('A <b>change request page</b>: the reason, the exact before/after, trial results and the impact on cost, nutrition and the label. Approving it creates the new formula version.') +
    head('Change requests / CR-0087', 'Salt reduction, Sourdough Country Loaf', `<code>CR-0087</code><span>Formula <button type="button" class="link" data-open="f-0142">FRM-0142</button></span>${chip('info', 'Review')}`, '<button type="button" class="btn">Comment</button><button type="button" class="btn primary" data-open="appr">Go to approval</button>') +
    `<div class="two">${panel('What changes', 'v3.1 → v3.2', table(['Ingredient', '#Before', '#After'], [
        tr([td('Sea salt, fine'), td('<span class="diff-old">1.30 %</span>', 'num'), td('<span class="diff-new">1.10 %</span>', 'num')]),
        tr([td('Water'), td('<span class="diff-old">37.30 %</span>', 'num'), td('<span class="diff-new">37.50 %</span>', 'num')])]))}
      ${panel('Why', '', `<p style="margin:0;padding:12px 14px">Customer (Northwind Grocers) asked for sodium under 430 mg / 100 g by Q1 2027. Current v3.1 is 486 mg.</p>`)}</div>
    <div class="two">${panel('Trial results', 'Trial bake Sep 24', table(['Test', '#Result', 'Status'], [
        tr([td('Sodium'), td('412 mg', 'num'), td(chip('ok'))]), tr([td('Moisture'), td('37.8 %', 'num'), td(chip('ok'))]), tr([td('pH'), td('4.41', 'num'), td(chip('ok'))]), tr([td('Taste panel (n=8)'), td('7.4 / 9', 'num'), td(chip('ok'))])]))}
      ${panel('Impact', '', fields([['Cost per kg', '$0.552 → $0.551'], ['Sodium', '486 → 412 mg'], ['Label', 'Nutrition panel update'], ['ERP', 'New BOM version']]))}</div>`);

  // ---------- FORMULANE · Approvals ----------
  def('appr', 'formulane', 'approvals', 'Approvals inbox', () =>
    guide('Your <b>inbox</b> of things to sign. Approving releases the version to production and sends it to the ERP. Try the buttons.', ['Waiting on you · waiting on others · approved · rejected', 'ERP sync log at the bottom']) +
    head('Approvals', 'Waiting on you', `${chip('warn', '2 waiting')}`, '') +
    panel('Waiting on you', '', `<ul class="doclist">
      <li><span class="grow"><b><button type="button" class="link" data-open="f-0142">Sourdough Country Loaf v3.2</button></b><small>CR-0087 salt reduction · requested by S. Rahimi · today 11:05</small></span><span class="row" style="display:flex;gap:6px"><button type="button" class="btn" data-decide="reject">Reject</button><button type="button" class="btn primary" data-decide="approve">Approve</button></span></li>
      <li><span class="grow"><b><button type="button" class="link" data-open="f-0215">Caesar Dressing v2.3</button></b><small>CR-0086 oil ratio · requested by A. Novak · Sep 30</small></span><span class="row" style="display:flex;gap:6px"><button type="button" class="btn" data-decide="reject">Reject</button><button type="button" class="btn primary" data-decide="approve">Approve</button></span></li></ul>`) +
    panel('Waiting on others', '', `<ul class="doclist"><li><span class="grow"><b>Brioche Bun 80 g v0.3</b><small>Waiting on R&amp;D lead D. Moreau</small></span>${chip('idle', 'Waiting')}</li></ul>`) +
    panel('Sent to ERP', 'Last 7 days', table(['When', 'Formula', 'Version', 'Status'], [
      tr([td('Sep 28 14:02', 'mono'), td('Tomato Basil Sauce'), td('v5.1', 'mono'), td(chip('ok', 'Synced'))]),
      tr([td('Sep 22 09:40', 'mono'), td('Multigrain Sandwich'), td('v2.0', 'mono'), td(chip('ok', 'Synced'))])])));

  // ---------- FORMULANE · Reports ----------
  const sd = FORMULAS[0];
  const costRows = sd.ings.map(([n, p]) => [n, p * sd.batch / 100 * RM[n].cost]);
  const costTotal = costRows.reduce((a, [, c]) => a + c, 0);
  def('rep-cost', 'formulane', 'reports', 'Cost per batch', () =>
    guide('<b>Reports</b> are read-only pages built from the data. Each one answers one question, e.g. “what does a batch cost and where does the money go?”', ['Cost per batch and per kg', 'Nutrition panel', 'Allergen matrix across all formulas']) +
    head('Reports', 'Cost per batch · Sourdough Country Loaf', `<span>v3.2 · 500 kg</span><span>Total <code>$${fmt(costTotal, 2)}</code></span><span><code>$${fmt(costTotal / sd.batch, 3)} / kg</code></span>`, '<button type="button" class="btn">Export</button>') +
    `<div class="two">${panel('Cost by ingredient', 'USD per 500 kg batch', `<div class="bars">${costRows.sort((a, b) => b[1] - a[1]).map(([n, c]) => `<div class="bar"><span>${n}</span><div class="track"><div class="fill" style="width:${Math.max(c / costRows[0][1] * 100, 1)}%"></div></div><span class="v">$${fmt(c, 2)}</span></div>`).join('')}</div>`)}
    ${panel('Nutrition', 'Per 100 g', table(['Nutrient', '#Amount'], [['Energy', '245 kcal'], ['Protein', '8.6 g'], ['Fat', '1.1 g'], ['Carbohydrate', '49.0 g'], ['Sodium', '412 mg']].map(([k, v]) => tr([td(k), td(v, 'num')]))))}</div>`);
  const ALLS = ['Wheat', 'Milk', 'Egg', 'Sesame', 'Fish', 'Mustard'];
  def('rep-allergen', 'formulane', 'reports', 'Allergen matrix', () =>
    guide('A <b>matrix report</b>: every formula against every allergen, built from the ingredient library. Useful for labels and plant scheduling.') +
    head('Reports', 'Allergen matrix', `<span>${FORMULAS.length} formulas</span>`, '<button type="button" class="btn">Export</button>') +
    panel('Contains', 'Dot = present', table(['Formula', ...ALLS], FORMULAS.map(f => {
      const a = f.ings.map(([n]) => ALLERGEN_OF(n)).join(' ');
      return tr([td(f.name), ...ALLS.map(x => td(a.includes(x) || (x === 'Wheat' && a.includes('gluten')) ? '<span class="mdot" title="Contains"></span>' : '<span class="mnone">·</span>', 'c'))], f.id);
    }), { cls: 'matrix' })));

  // ---------- QUALANE · Line board ----------
  def('q-board', 'qualane', 'board', 'Line board', () =>
    guide('The <b>dashboard</b> for the shift: one card per line, colored by its latest result. Problems float to the top. Click a line card for its detail page.', ['Alerts first', 'One card per line: product, latest result, status', 'Checks due this hour']) +
    head('Plant A / Shift B / Thu Oct 1, 2026', 'Line board', `<span>Shift B · 14:00–22:00</span><span>4 lines running</span>${chip('bad', '1 alert')}${chip('warn', '1 watch')}`, '<button type="button" class="btn" data-open="q-tasks">My tasks</button>') +
    `<div class="alert" role="status">${chip('bad')}<p><strong>Line 3 · Oat Drink 1 L</strong> pH 4.71 is above the 4.60 limit. Head of QC was notified at 14:12.</p><button type="button" class="btn danger" data-open="h-0112">Open hold</button></div>
    <div class="lines">${LINES.map(l => `<div class="line-card ${l.st} clickable" data-open="${l.id}" tabindex="0"><div class="lc-top"><span class="lc-name">Line ${l.n}</span>${chip(l.st)}</div><div class="lc-prod">${l.prod}</div><div class="lc-val">${l.val}</div></div>`).join('')}</div>` +
    panel('Checks this hour', 'Click a row to start it', table(['Window', 'Line', 'Check', '#Result', 'Status'], [
      tr([td('14:00–14:15', 'mono'), td('L3'), td('pH'), td('4.71', 'num'), td(chip('bad'))], 'l3'),
      tr([td('14:00–14:30', 'mono'), td('L2'), td('Brix'), td('12.1', 'num'), td(chip('warn'))], 'l2'),
      tr([td('14:30–14:45', 'mono'), td('L1'), td('Fill weight'), td('356.2 g', 'num'), td(chip('ok'))], 'l1'),
      tr([td('14:22–14:32', 'mono'), td('L3'), td('pH re-sample'), td('—', 'num muted'), td(chip('idle', 'Due now'))], 'q-check')])));
  LINES.forEach(l => def(l.id, 'qualane', 'board', `Line ${l.n} · ${l.prod.split(' ').slice(0, 2).join(' ')}`, () =>
    guide('A <b>line detail page</b>: what is running, the latest results and the next checks for this one line.') +
    head(`Line board / Line ${l.n}`, `Line ${l.n} · ${l.prod}`, `${chip(l.st)}<span>Lot <code>${l.lot}</code></span><span>${l.speed}</span><span>Operator ${l.op}</span>`, l.st === 'bad' ? '<button type="button" class="btn danger" data-open="h-0112">Open hold</button><button type="button" class="btn primary" data-open="q-check">Re-sample now</button>' : '<button type="button" class="btn primary" data-open="q-check">Start a check</button>') +
    `<div class="two">${panel('Latest results', '', table(['Time', 'Check', '#Result', 'Status'], l.id === 'l3'
        ? [tr([td('14:00', 'mono'), td('pH'), td('4.71', 'num'), td(chip('bad'))]), tr([td('13:30', 'mono'), td('pH'), td('4.59', 'num'), td(chip('warn'))]), tr([td('13:00', 'mono'), td('pH'), td('4.53', 'num'), td(chip('ok'))])]
        : [tr([td('14:00', 'mono'), td(l.val.split(' ')[0]), td(l.val.split(' ')[1], 'num'), td(chip(l.st))]), tr([td('13:30', 'mono'), td(l.val.split(' ')[0]), td(l.val.split(' ')[1], 'num'), td(chip('ok'))])]))}
    ${panel('Next checks', '', `<ul class="doclist"><li><span class="grow"><b>${l.id === 'l3' ? 'pH re-sample' : 'Routine check'}</b><small>${l.id === 'l3' ? '14:22–14:32' : '15:00–15:15'}</small></span><button type="button" class="btn" data-open="q-check">Start</button></li><li><span class="grow"><b>Label &amp; date code</b><small>15:30–15:45</small></span>${chip('idle', 'Later')}</li></ul>`)}</div>`));

  // ---------- QUALANE · My tasks ----------
  def('q-tasks', 'qualane', 'tasks', 'My tasks', () =>
    guide('The technician’s <b>to-do list</b> for the shift, ordered by time window. “Start” opens the check form on the tablet.', ['Time window, line, what to test, status', 'Overdue tasks turn red']) +
    head('My tasks', 'My tasks · Shift B', `<span>J. Patel</span>${chip('idle', '2 due now')}<span>23 done</span>`, '') +
    panel('Due now and next', '', `<ul class="doclist">
      <li><span class="grow"><b>L3 · pH re-sample</b><small>14:22–14:32 · after a failed result</small></span>${chip('bad', 'Due now')}<button type="button" class="btn primary" data-open="q-check">Start</button></li>
      <li><span class="grow"><b>L4 · Seal strength</b><small>15:00–15:15</small></span>${chip('idle', 'Due')}<button type="button" class="btn" data-open="q-check">Start</button></li>
      <li><span class="grow"><b>L2 · Brix</b><small>15:00–15:30</small></span>${chip('idle', 'Due')}<button type="button" class="btn" data-open="q-check">Start</button></li>
      <li><span class="grow"><b>All lines · Label &amp; date code</b><small>15:30–15:45</small></span>${chip('idle', 'Later')}<button type="button" class="btn" data-open="q-check">Start</button></li></ul>`) +
    panel('Done this shift', '23 checks', `<p class="empty-state">23 checks completed. Last: L1 fill weight 356.2 g at 14:31.</p>`));
  def('q-check', 'qualane', 'tasks', 'Check · L3 pH', () =>
    guide('The <b>check form</b> on the plant tablet. Scan proves you were at the line, the photo proves the sample, and the result is colored against the spec as you type. Try it: scan, add photo, type a pH (e.g. 4.38 or 4.72), save.') +
    head('My tasks / Check', 'L3 · pH re-sample', '<span>Oat Drink 1 L</span><span>Lot <code>26-0274-L3</code></span><span>Limit <code>4.20–4.60</code></span><span>Method <button type="button" class="link" data-open="tm-ph">TM-02</button></span>', '') +
    panel('Steps', 'Large buttons for gloves', `<ol class="steps" id="check-steps">
      <li data-step="scan"><span class="stepn">1</span><div><h4>Scan the line tag</h4><p>Hold the tablet to the RFID tag on Line 3.</p><div class="res"><button type="button" class="btn primary big" data-act="scan">Simulate scan</button><span data-out="scan"></span></div></div></li>
      <li data-step="photo"><span class="stepn">2</span><div><h4>Photo of the sample</h4><p>Show the cup with its sample label.</p><div class="res"><button type="button" class="btn big" data-act="photo">Add photo</button><span data-out="photo"></span></div></div></li>
      <li data-step="value"><span class="stepn">3</span><div><h4>Enter the pH</h4><p>Two decimals. Color updates as you type.</p><div class="res"><input class="big-input" id="ph-input" inputmode="decimal" placeholder="4.__" aria-label="pH result"><span data-out="value"></span></div></div></li>
      <li data-step="save"><span class="stepn">4</span><div><h4>Save result</h4><p>A fail alerts the Head of QC automatically.</p><div class="res"><button type="button" class="btn primary big" data-act="save" disabled>Save result</button></div><div data-out="save" style="margin-top:10px"></div></div></li></ol>`));

  // ---------- QUALANE · Batch records ----------
  const BATCHES = [['26-0274-L3', 'Oat Drink 1 L', 'L3', '18 / 24', 'bad', 'On hold'], ['26-0273-L2', 'Cold Brew 300 mL', 'L2', '20 / 24', 'warn', 'Running'], ['26-0272-L1', 'Sparkling Lemon 355 mL', 'L1', '22 / 24', 'ok', 'Running'], ['26-0271-L4', 'Peach Iced Tea 500 mL', 'L4', '24 / 24', 'ok', 'Released'], ['26-0268-L1', 'Sparkling Lemon 355 mL', 'L1', '24 / 24', 'ok', 'Released']];
  def('q-batches', 'qualane', 'batches', 'Batch records', () =>
    guide('The <b>permanent record</b> of every batch: all checks, photos, signatures and holds in one place. This is what an auditor or customer asks for.', ['Lot, product, line, checks done, result, release status']) +
    head('Batch records', 'Batch records', '<span>Last 7 days · 38 batches</span>', '<button type="button" class="btn">Export for audit</button>') +
    panel('Batches', 'Click a row to open it', table(['Lot', 'Product', 'Line', '#Checks', 'Result', 'Release'],
      BATCHES.map(b => tr([td(b[0], 'mono'), td(b[1]), td(b[2]), td(b[3], 'num'), td(chip(b[4])), td(b[5], 'muted')], b[0] === '26-0274-L3' ? 'b-0274' : b[0] === '26-0271-L4' ? 'coa-0271' : null)))));
  def('b-0274', 'qualane', 'batches', 'Batch 26-0274-L3', () =>
    guide('A <b>batch record page</b>: the full timeline of one lot, from start-up to release, with every result and who did it.') +
    head('Batch records / 26-0274-L3', 'Batch 26-0274-L3 · Oat Drink 1 L', `${chip('bad', 'On hold')}<span>Line 3</span><span>Started 12:10</span>`, '<button type="button" class="btn danger" data-open="h-0112">View hold</button>') +
    panel('Timeline', '', `<ul class="timeline">
      <li><time>14:12</time><span class="tdot bad"></span><div><b>Hold placed</b> · pH 4.71 above 4.60 · auto-alert to M. Chen</div></li>
      <li><time>14:00</time><span class="tdot bad"></span><div>pH 4.71 · J. Patel · photo ✓ · tag ✓</div></li>
      <li><time>13:40</time><span class="tdot info"></span><div>Tank changeover (Tank B → Tank C)</div></li>
      <li><time>13:30</time><span class="tdot warn"></span><div>pH 4.59 · J. Patel</div></li>
      <li><time>13:00</time><span class="tdot ok"></span><div>pH 4.53 · Fill 1,012 g · Seal OK</div></li>
      <li><time>12:10</time><span class="tdot ok"></span><div>Batch started · pre-op check signed by L. Haddad</div></li></ul>`));

  // ---------- QUALANE · CoA ----------
  def('q-coa', 'qualane', 'coa', 'Certificates', () =>
    guide('<b>Certificates of analysis</b> are generated from the batch record and sent to customers. Only released batches can get one.', ['Lot, customer, status (draft / sent)', 'Open one to see the certificate']) +
    head('Certificates (CoA)', 'Certificates of analysis', '<span>12 this week</span>', '') +
    panel('Certificates', 'Click to preview', table(['Lot', 'Product', 'Customer', 'Status'], [
      tr([td('26-0271-L4', 'mono'), td('Peach Iced Tea 500 mL'), td('Northwind Grocers'), td(chip('info', 'Ready to send'))], 'coa-0271'),
      tr([td('26-0268-L1', 'mono'), td('Sparkling Lemon 355 mL'), td('Harbor Market'), td(chip('ok', 'Sent Sep 30'))], 'coa-0271'),
      tr([td('26-0274-L3', 'mono'), td('Oat Drink 1 L'), td('Northwind Grocers'), td(chip('bad', 'Blocked · on hold'))], 'h-0112')])));
  def('coa-0271', 'qualane', 'coa', 'CoA 26-0271-L4', () =>
    guide('The <b>certificate itself</b>, built automatically from the batch results and spec limits. Send emails it to the customer and logs it.') +
    head('Certificates / 26-0271-L4', 'CoA · Peach Iced Tea 500 mL', `${chip('info', 'Ready to send')}<span>Customer Northwind Grocers</span>`, '<button type="button" class="btn">Download PDF</button><button type="button" class="btn primary" data-decide="send">Send to customer</button>') +
    `<div class="paper"><div class="ph"><div><h3>Certificate of Analysis</h3><small>Plant A · Coformia demo co-packer</small></div><div style="text-align:right"><b>Lot 26-0271-L4</b><small>Produced Oct 1, 2026 · Best before Apr 1, 2027</small></div></div>
      <div>Product: <b>Peach Iced Tea 500 mL</b> · Customer: <b>Northwind Grocers</b> · PO 88417</div>
      ${table(['Parameter', 'Spec', '#Result', 'Status'], [['Brix', '9.2–10.0 °Bx', '9.6'], ['pH', '2.9–3.3', '3.08'], ['Seal strength', '≥ 4.0 N', '4.8'], ['Fill volume', '500 ± 5 mL', '501.2'], ['Micro (TPC)', '< 100 cfu/mL', '< 10']].map(([a, b, c]) => tr([td(a), td(b, 'mono'), td(c, 'num'), td('<span class="pass">Pass</span>')])))}
      <div class="sig"><span>Approved by<br><b>M. Chen</b><br>Head of Quality</span><span style="text-align:right">Issued Oct 1, 2026<br>Generated by Qualane</span></div></div>`);

  // ---------- QUALANE · Holds ----------
  def('q-holds', 'qualane', 'holds', 'Holds & deviations', () =>
    guide('Every <b>lot on hold</b> and every <b>out-of-spec result</b>. Each one needs a cause, a fix (corrective action) and a sign-off before the lot is released or destroyed.') +
    head('Holds & deviations', 'Holds & deviations', `${chip('bad', '1 open')}<span>2 closed this month</span>`, '') +
    panel('Holds', 'Click to open', table(['ID', 'Lot', 'Reason', 'Opened', 'Status'], [
      tr([td('H-0112', 'mono'), td('26-0274-L3', 'mono'), td('pH 4.71 above limit'), td('Today 14:12', 'muted'), td(chip('bad', 'Open'))], 'h-0112'),
      tr([td('H-0109', 'mono'), td('26-0266-L2', 'mono'), td('Label misprint'), td('Sep 24', 'muted'), td(chip('ok', 'Closed'))]),
      tr([td('H-0105', 'mono'), td('26-0251-L4', 'mono'), td('Low seal strength'), td('Sep 12', 'muted'), td(chip('ok', 'Closed'))])])));
  def('h-0112', 'qualane', 'holds', 'Hold H-0112', () =>
    guide('A <b>deviation page</b>: what went wrong, why, what was done, and who decided what happens to the product.', ['Problem · root cause · corrective action · disposition · sign-off']) +
    head('Holds / H-0112', 'Hold H-0112 · Lot 26-0274-L3', `${chip('bad', 'Open')}<span>Oat Drink 1 L</span><span>4,180 cartons held</span>`, '<button type="button" class="btn" data-open="b-0274">Batch record</button><button type="button" class="btn primary" data-decide="approve">Sign off</button>') +
    `<div class="two">${panel('Investigation', '', fields([['Problem', 'pH 4.71, limit ≤ 4.60'], ['Likely cause', 'Low citric acid dose after tank changeover 13:40'], ['Corrective action', 'Recalibrate dosing pump; re-sample every 10 min for 1 h'], ['Disposition', 'Pending re-test']]))}
    ${panel('Sign-off', '', `<ul class="doclist"><li><span class="grow"><b>QC technician</b><small>J. Patel</small></span>${chip('ok', 'Signed')}</li><li><span class="grow"><b>Maintenance</b><small>Pump check</small></span>${chip('idle', 'Waiting')}</li><li><span class="grow"><b>Head of QC</b><small>M. Chen</small></span>${chip('idle', 'Waiting')}</li></ul>`)}</div>`);

  // ---------- QUALANE · Trends ----------
  let trendKey = 'ph3';
  def('q-trends', 'qualane', 'trends', 'Trends', () => {
    const t = TRENDS[trendKey];
    return guide('<b>Charts</b> of results over time, with the spec band shaded. They show drift before it becomes a failure, like Line 3 pH climbing all morning.') +
      head('Trends', t.label, `<span>Last 12 samples · today</span>${chip(evalStatus(t.v[t.v.length - 1], t.lo, t.hi))}`, '') +
      `<div class="seg-sm" role="group" aria-label="Parameter">${Object.entries(TRENDS).map(([k, x]) => `<button type="button" data-trend="${k}" aria-pressed="${k === trendKey}">${x.label}</button>`).join('')}</div>` +
      panel(t.label, 'Shaded band = within spec', `<div class="chart-wrap">${lineChart(t)}</div>`);
  });

  // ---------- Shared · Settings ----------
  ['formulane', 'qualane'].forEach(p => def('set-' + p, p, 'settings', 'Settings', () =>
    guide('<b>Settings</b> sit at the bottom of the icon bar in every app: users and roles, plant setup, connections. Same layout in every product.') +
    head('Settings', 'Settings', '<span>Admin: Ali K.</span>', '') +
    `<div class="two">${panel('Users & roles', '', table(['Name', 'Role'], [['Ali K.', 'Admin'], ['S. Rahimi', 'R&amp;D formulator'], ['M. Chen', 'Head of QC'], ['J. Patel', 'QC technician']].map(([a, b]) => tr([td(a), td(b, 'muted')]))))}
    ${panel(p === 'formulane' ? 'ERP connection' : 'Plant & lines', '', p === 'formulane'
      ? fields([['System', 'ERP (demo)'], ['Status', chip('ok', 'Connected')], ['Sends', 'Approved formula versions as BOMs'], ['Last sync', 'Sep 28 14:02']])
      : fields([['Plant', 'Plant A'], ['Lines', '4 · RFID tags installed'], ['Shifts', 'A 06–14 · B 14–22 · C 22–06'], ['Gateway', chip('ok', 'Online')]]))}</div>`));

  /* ================= PRODUCTS / SECTIONS ================= */
  const tree = blocks => blocks.map(b => `<div class="side-head"><span>${b.h}</span><span>${b.c || ''}</span></div><ul class="tree">${b.items.map(([label, open, dot, lvl, count]) =>
    `<li class="${lvl ? 'lvl' + lvl : ''}"${open ? ` data-open="${open}"` : ''}>${dot === '>' ? '<span class="chev">▾</span>' : dot ? `<span class="dot ${dot}"></span>` : ''}${label}${count ? `<span class="count">${count}</span>` : ''}</li>`).join('')}</ul>`).join('');
  const byCat = c => FORMULAS.filter(f => f.cat === c).map(f => [f.name, f.id, f.st[0] === 'info' ? 'warn' : f.st[0] === 'idle' ? 'idle' : f.st[0], 1]);

  const PRODUCTS = {
    formulane: {
      hint: 'Search formulas, ingredients, change requests…',
      sections: [
        { id:'formulas', icon:'files', label:'Formulas', desc:'Every recipe, with versions, specs and sign-off.', home:'f-list',
          side: () => tree([{ h:'Formulas', c:FORMULAS.length, items:[['All formulas', 'f-list'], ['Bakery', null, '>', 0, 4], ...byCat('Bakery'), ['Sauces & dressings', null, '>', 0, 2], ...byCat('Sauces & dressings'), ['Beverages', null, '>', 0, 1], ...byCat('Beverages')] }]) },
        { id:'ingredients', icon:'leaf', label:'Ingredients & suppliers', desc:'Raw-material library, prices, allergens, documents.', home:'rm-list',
          side: () => tree([{ h:'Ingredients', c:Object.keys(RM).length, items:[['All ingredients', 'rm-list'], ...Object.entries(RM).slice(0, 7).map(([n, r]) => [n, 'rm-' + r.code, r.doc === 'ok' ? '' : r.doc, 1])] }, { h:'Suppliers', c:7, items:[['Prairie Mills', 'sup-prairie', 'ok'], ['Northfield Grain', null, 'warn'], ['Valley Dairy', null, 'ok']] }]) },
        { id:'specs', icon:'flask', label:'Specs', desc:'Product limits and test methods, shared with Qualane.', home:'spec-list',
          side: () => tree([{ h:'Spec limits', items:[['All limits', 'spec-list'], ...FORMULAS.slice(0, 4).map(f => [f.name, f.id, '', 1])] }, { h:'Test methods', c:6, items:[['TM-01 Moisture, oven', null], ['TM-02 pH meter', 'tm-ph'], ['TM-05 Check-weigher', null]] }]) },
        { id:'changes', icon:'swap', label:'Change requests', desc:'Proposed edits and trials, as a board.', home:'cr-board',
          side: () => tree([{ h:'Change requests', c:CRS.length, items:[['Board', 'cr-board'], ...CRS.map(c => [c.code + ' ' + c.t.split(',')[0], c.id === 'cr-0087' ? 'cr-0087' : 'cr-board', c.col === 3 ? 'ok' : c.col === 2 ? 'warn' : 'idle'])] }]) },
        { id:'approvals', icon:'stamp', label:'Approvals', desc:'Your sign-off inbox and ERP releases.', home:'appr',
          side: () => tree([{ h:'Approvals', items:[['Waiting on you', 'appr', 'warn', 0, 2], ['Waiting on others', 'appr', '', 0, 1], ['Sent to ERP', 'appr', 'ok', 0, 11]] }]) },
        { id:'reports', icon:'chart', label:'Reports', desc:'Cost, nutrition and allergen reports.', home:'rep-cost',
          side: () => tree([{ h:'Reports', items:[['Cost per batch', 'rep-cost'], ['Allergen matrix', 'rep-allergen'], ['Nutrition panels', 'rep-cost']] }]) }
      ],
      settings: 'set-formulane',
      start: ['f-list', 'f-0142'],
      status: v => `<span class="sb-prod">Formulane</span><span>${v.title}</span><span class="hide-sm">2 approvals waiting</span><span class="sp"></span><span class="hide-sm">ERP: synced 4 min ago</span><span>✦ AI ready</span>`,
      chat: { title:'Formulane AI', sugg:['Compare v3.1 and v3.2', 'Check allergens', 'Draft a change request'],
        msgs: `<div class="msg user"><div class="who">Ali K.</div><div class="bubble">What happens to sodium if we cut salt to 1.0%?</div></div>
          <div class="msg ai"><div class="who">✦ Formulane AI</div><p>At 1.00% salt, sodium drops to about <b>375 mg / 100 g</b>, under the 430 mg limit. Water goes up 0.10% to keep the total at 100%.</p>
          <div class="proposal"><div class="ph">Proposed change · v3.3 draft</div><ul><li>Sea salt&nbsp; 1.10 → 1.00 %</li><li>Water&nbsp;&nbsp;&nbsp;&nbsp; 37.50 → 37.60 %</li></ul>
          <div class="row"><button type="button" class="btn primary" data-apply>Apply as draft</button><button type="button" class="btn" data-discard>Discard</button></div><div class="signoff">AI suggests. Head of QC approves before anything changes.</div></div></div>` }
    },
    qualane: {
      hint: 'Search lines, lots, batches, CoAs…',
      sections: [
        { id:'board', icon:'lines', label:'Line board', desc:'Live status of every line this shift.', home:'q-board',
          side: () => tree([{ h:'Lines · Shift B', c:4, items:[['All lines', 'q-board', '>'], ...LINES.map(l => [`Line ${l.n} · ${l.prod.split(' ').slice(0, 2).join(' ')}`, l.id, l.st, 1])] }]) },
        { id:'tasks', icon:'tasks', label:'My tasks', desc:'Checks assigned to you, with time windows.', home:'q-tasks',
          side: () => tree([{ h:'My tasks', c:6, items:[['Due now', 'q-tasks', 'bad', 0, 2], ['Next 60 min', 'q-tasks', 'idle', 0, 4], ['L3 pH re-sample', 'q-check', '', 1]] }]) },
        { id:'batches', icon:'batch', label:'Batch records', desc:'Full QC history of every batch and lot.', home:'q-batches',
          side: () => tree([{ h:'Batches', items:[['Last 7 days', 'q-batches'], ['26-0274-L3', 'b-0274', 'bad', 1], ['26-0273-L2', 'q-batches', 'warn', 1], ['26-0272-L1', 'q-batches', 'ok', 1]] }]) },
        { id:'coa', icon:'coa', label:'Certificates (CoA)', desc:'Certificates of analysis for customers.', home:'q-coa',
          side: () => tree([{ h:'Certificates', items:[['All certificates', 'q-coa'], ['Ready to send', 'coa-0271', 'warn', 0, 1], ['Sent', 'q-coa', 'ok', 0, 11]] }]) },
        { id:'holds', icon:'holds', label:'Holds & deviations', desc:'Lots on hold, out-of-spec results, fixes.', home:'q-holds',
          side: () => tree([{ h:'Holds', items:[['All holds', 'q-holds'], ['H-0112 · 26-0274-L3', 'h-0112', 'bad', 1]] }]) },
        { id:'trends', icon:'chart', label:'Trends', desc:'pH, Brix and weight charts over time.', home:'q-trends',
          side: () => tree([{ h:'Charts', items:Object.entries(TRENDS).map(([k, t]) => [t.label, 'q-trends', '', 0])  }]) }
      ],
      settings: 'set-qualane',
      start: ['q-board'],
      status: v => `<span class="sb-prod">Qualane</span><span>${v.title}</span><span class="hide-sm">1 alert · 1 watch</span><span class="sp"></span><span class="hide-sm">Gateway online · synced 1 min ago</span><span>✦ AI ready</span>`,
      chat: { title:'Qualane AI', sugg:['Summarize Shift B', 'Draft CoA for 26-0271', 'Why is Line 3 failing?'],
        msgs: `<div class="msg user"><div class="who">Ali K.</div><div class="bubble">Why is Line 3 pH high?</div></div>
          <div class="msg ai"><div class="who">✦ Qualane AI</div><p>pH has climbed over the last three samples: <b class="mono">4.53 → 4.59 → 4.71</b>. The last time this happened (Aug 14) the cause was a low citric acid dose after a tank changeover. There was a changeover on Line 3 at 13:40.</p>
          <div class="proposal"><div class="ph">Suggested actions</div><ul><li>1. Hold lot 26-0274-L3</li><li>2. Check citric acid dosing pump</li><li>3. Re-sample in 10 min</li></ul>
          <div class="row"><button type="button" class="btn primary" data-apply>Place hold</button><button type="button" class="btn" data-discard>Notify maintenance</button></div><div class="signoff">Head of QC signs off on the hold.</div></div></div>` }
    }
  };

  /* ================= STATE + RENDER ================= */
  const params = new URLSearchParams(location.search);
  const lockedProduct = params.get('product') === 'qualane' || params.get('product') === 'formulane' ? params.get('product') : null;
  const embed = params.get('embed') === '1';
  if (embed) document.body.classList.add('embed');
  if (lockedProduct) document.body.classList.add('locked');
  const state = { palette:'nord', mode:'light', product: lockedProduct || 'formulane', guides:'on', section:null, tabs:[], active:null };
  let modeChosen = embed;
  if (!embed) {
    try {
      const t = document.documentElement.getAttribute('data-theme');
      state.mode = t === 'dark' || t === 'light' ? t : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } catch (e) {}
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  document.title = (lockedProduct === 'qualane' ? 'Qualane' : 'Formulane') + ' — sample app';
  const $ = id => document.getElementById(id);
  const ds = $('ds'), app = $('app'), chat = $('chat'), aiBtn = $('ai-toggle');
  const prod = () => PRODUCTS[state.product];
  const secOf = id => prod().sections.find(s => s.id === id);

  function tokens() {
    const t = THEMES[state.palette][state.mode], a = t.accent[state.product];
    return [['bar','Title & icon bar',t.bar],['side','Sidebar',t.side],['bg','Main background',t.bg],['panel','Panel / card',t.panel],['line','Border',t.line],['fg','Text',t.fg],['muted','Muted text',t.muted],['hover','Hover',t.hover],['sel','Selected row',t.sel],['accent','Product accent',a.a],['accent-strong','Accent fill',a.s],['on-accent','Text on accent',a.on],['ok','Status · Pass',t.ok],['warn','Status · Watch',t.warn],['bad','Status · Fail',t.bad]];
  }
  function applyTheme() {
    const list = tokens();
    list.forEach(([k,,v]) => ds.style.setProperty('--c-' + k, v));
    const cap = LABEL[state.palette] + ' · ' + LABEL[state.mode] + ' · ' + LABEL[state.product];
    $('sw-caption').textContent = cap;
    $('swatches').innerHTML = list.map(([k,n,v]) => `<div class="sw"><div class="chipc" style="background:${v}"></div><b>${n}</b><code>--cf-${k} ${v}</code></div>`).join('');
    $('css-out').textContent = `/* Coformia · ${cap} */\n:root {\n` + list.map(([k,,v]) => `  --cf-${k}: ${v};`).join('\n') +
      `\n  --cf-font-sans: "IBM Plex Sans", system-ui, sans-serif;\n  --cf-font-mono: "IBM Plex Mono", ui-monospace, monospace;\n  --cf-radius: 6px;\n  --cf-radius-card: 8px;\n  --cf-space: 4px; /* 4 · 8 · 12 · 16 · 24 · 32 */\n  --cf-touch: 44px;\n}`;
    app.classList.toggle('hide-guides', state.guides === 'off');
    document.querySelectorAll('[data-set]').forEach(b => b.setAttribute('aria-pressed', String(state[b.dataset.set] === b.dataset.val)));
  }

  function renderActivity() {
    const p = prod();
    $('activity').innerHTML = p.sections.map(s => `<button type="button" data-section="${s.id}" data-tip="${s.label}" aria-label="${s.label}"${s.id === state.section ? ' aria-current="true"' : ''}>${svg(s.icon)}</button>`).join('') +
      `<div class="spacer"></div><button type="button" data-tip="Ask AI" aria-label="Ask AI" data-ai${!chat.hidden ? ' aria-current="true"' : ''}>${svg('spark')}</button><button type="button" data-section="settings" data-tip="Settings" aria-label="Settings"${state.section === 'settings' ? ' aria-current="true"' : ''}>${svg('gear')}</button>`;
  }
  function renderSidebar() {
    const s = secOf(state.section);
    $('sidebar').innerHTML = s ? s.side() : tree([{ h:'Settings', items:[['Users & roles', prod().settings], [state.product === 'formulane' ? 'ERP connection' : 'Plant & lines', prod().settings], ['Theme', prod().settings]] }]);
    markSidebar();
  }
  function markSidebar() {
    let marked = false;
    $('sidebar').querySelectorAll('li[data-open]').forEach(li => { const on = !marked && li.dataset.open === state.active; li.classList.toggle('sel', on); if (on) marked = true; });
  }
  function renderTabs() {
    $('tabs').innerHTML = state.tabs.map(id => `<button type="button" class="tab" role="tab" data-tab="${id}" aria-selected="${id === state.active}">${V[id].title}<span class="x" data-close="${id}" title="Close tab" aria-label="Close ${V[id].title}">×</span></button>`).join('');
    const act = $('tabs').querySelector('[aria-selected="true"]');
    if (act) {
      if (embed) {
        const strip = $('tabs');
        const left = act.offsetLeft - strip.scrollLeft;
        const right = left + act.offsetWidth;
        if (left < 0) strip.scrollLeft += left;
        else if (right > strip.clientWidth) strip.scrollLeft += right - strip.clientWidth;
      } else {
        act.scrollIntoView({ block:'nearest', inline:'nearest' });
      }
    }
  }
  function renderEditor() {
    const v = V[state.active];
    $('editor').innerHTML = v ? v.render() : '<p class="empty-state">No page open. Pick something in the sidebar.</p>';
    $('editor').scrollTop = 0;
    $('statusbar').innerHTML = prod().status(v || { title:'No page open' });
    $('chat-ctx').innerHTML = 'Looking at <span class="tag">' + (v ? v.title : '—') + '</span>';
    if (state.active === 'q-check') initCheck();
  }
  function openView(id) {
    const v = V[id]; if (!v || v.product !== state.product) return;
    if (!state.tabs.includes(id)) { state.tabs.push(id); if (state.tabs.length > 6) state.tabs.splice(state.tabs.findIndex(t => t !== id), 1); }
    state.active = id;
    if (v.section !== state.section) { state.section = v.section; renderActivity(); renderSidebar(); } else markSidebar();
    renderTabs(); renderEditor();
  }
  function goSection(sid) {
    const home = sid === 'settings' ? prod().settings : secOf(sid).home;
    state.section = sid; renderActivity(); renderSidebar(); openView(home);
  }
  function closeTab(id) {
    const i = state.tabs.indexOf(id); if (i < 0) return;
    state.tabs.splice(i, 1);
    if (state.active === id) {
      const next = state.tabs[Math.max(i - 1, 0)];
      if (next) { openView(next); return; }
      state.active = null; renderTabs(); renderEditor(); markSidebar();
    } else renderTabs();
  }
  function loadProduct() {
    const p = prod();
    $('brand-name').textContent = LABEL[state.product];
    $('cmd-hint').textContent = p.hint;
    $('chat-title').textContent = p.chat.title;
    $('msgs').innerHTML = p.chat.msgs;
    $('sugg').innerHTML = p.chat.sugg.map(s => `<button type="button">${s}</button>`).join('');
    state.tabs = []; state.active = null; state.section = null;
    p.start.forEach(id => { if (!state.tabs.includes(id)) state.tabs.push(id); });
    state.active = p.start[p.start.length - 1];
    state.section = V[state.active].section;
    renderActivity(); renderSidebar(); renderTabs(); renderEditor();
    renderLegend();
  }
  function renderLegend() {
    const item = (ic, label, desc) => `<li><span class="ic">${svg(ic)}</span><div><b>${label}</b><span>${desc}</span></div></li>`;
    $('legend').innerHTML = ['formulane', 'qualane'].map(k => `<div><h4>${LABEL[k]}</h4><ul>${PRODUCTS[k].sections.map(s => item(s.icon, s.label, s.desc)).join('')}</ul></div>`).join('') +
      `<div class="shared"><h4>Bottom of the bar, same in every app</h4><ul>${item('spark', 'Ask AI', 'Opens the AI chat panel on the right. Shortcut ⌘I.')}${item('gear', 'Settings', 'Users and roles, plant or ERP setup.')}${item('search', 'Search', 'Not on the bar: use the search box at the top or ⌘K.')}</ul></div>`;
  }

  /* ---------- check form (Qualane) ---------- */
  const check = { scan:false, photo:false, value:null };
  function initCheck() { check.scan = false; check.photo = false; check.value = null; }
  function refreshCheck() {
    const steps = $('check-steps'); if (!steps) return;
    const st = check.value == null ? null : evalStatus(check.value, 4.20, 4.60);
    steps.querySelector('[data-step="scan"]').classList.toggle('done', check.scan);
    steps.querySelector('[data-step="photo"]').classList.toggle('done', check.photo);
    steps.querySelector('[data-step="value"]').classList.toggle('done', !!st);
    steps.querySelector('[data-out="value"]').innerHTML = st ? chip(st) + (st === 'bad' ? ' <span class="muted" style="font-size:12px">Outside 4.20–4.60</span>' : st === 'warn' ? ' <span class="muted" style="font-size:12px">Close to the limit</span>' : '') : '';
    steps.querySelector('[data-act="save"]').disabled = !(check.scan && check.photo && st);
  }

  /* ---------- events ---------- */
  document.querySelectorAll('[data-set]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.set, v = b.dataset.val;
    state[k] = v; if (k === 'mode') modeChosen = true;
    if (k === 'product') loadProduct();
    applyTheme();
  }));

  app.addEventListener('click', e => {
    const t = e.target;
    const ai = t.closest('[data-ai]'); if (ai) { setChat(chat.hidden); return; }
    const sec = t.closest('[data-section]'); if (sec) { goSection(sec.dataset.section); return; }
    const cl = t.closest('[data-close]'); if (cl) { e.stopPropagation(); closeTab(cl.dataset.close); return; }
    const tab = t.closest('[data-tab]'); if (tab) { openView(tab.dataset.tab); return; }
    const sub = t.closest('[data-sub]');
    if (sub) { const g = sub.parentElement.dataset.subgroup; sub.parentElement.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b === sub))); $('editor').querySelectorAll(`[data-subpanel="${g}"]`).forEach(p => p.hidden = p.dataset.idx !== sub.dataset.sub); return; }
    const tr = t.closest('[data-trend]'); if (tr) { trendKey = tr.dataset.trend; renderEditor(); return; }
    const dec = t.closest('[data-decide]');
    if (dec) { const host = dec.closest('.row') || dec.parentElement; const k = dec.dataset.decide; host.outerHTML = k === 'approve' ? chip('ok', 'Approved by Ali K.') : k === 'send' ? chip('ok', 'Sent to customer') : chip('bad', 'Rejected'); return; }
    const act = t.closest('[data-act]');
    if (act && $('check-steps')) {
      const a = act.dataset.act, out = $('check-steps').querySelector(`[data-out="${a}"]`);
      if (a === 'scan') { check.scan = true; out.innerHTML = chip('ok', 'Tag L3-TAG-03 · Line 3 · 14:24'); }
      if (a === 'photo') { check.photo = true; out.innerHTML = chip('ok', 'Photo added · IMG_2041'); }
      if (a === 'save') {
        const st = evalStatus(check.value, 4.20, 4.60);
        out.innerHTML = st === 'bad' ? `<div class="notice bad">Saved to batch 26-0274-L3. <b>Fail</b>: Head of QC alerted and the hold stays open. <button type="button" class="link" data-open="h-0112">Open hold</button></div>`
          : `<div class="notice ok">Saved to batch 26-0274-L3 as <b>${STW[st]}</b>. ${st === 'ok' ? 'Head of QC can now review the hold.' : 'Next re-sample in 10 min.'} <button type="button" class="link" data-open="b-0274">Open batch record</button></div>`;
        act.disabled = true;
      }
      refreshCheck(); return;
    }
    const o = t.closest('[data-open]'); if (o) { openView(o.dataset.open); return; }
  });
  app.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.kcard,.line-card')) { e.preventDefault(); openView(e.target.dataset.open); }
  });
  app.addEventListener('input', e => {
    if (e.target.id === 'ph-input') { const v = parseFloat(e.target.value.replace(',', '.')); check.value = isNaN(v) ? null : v; refreshCheck(); }
  });

  // AI chat panel
  function setChat(open) {
    chat.hidden = !open;
    app.classList.toggle('chat-open', open);
    aiBtn.setAttribute('aria-pressed', String(open));
    const b = $('activity').querySelector('[data-ai]'); if (b) b.setAttribute('aria-current', String(open));
    if (open) setTimeout(() => $('chat-input').focus({ preventScroll:true }), 0);
  }
  aiBtn.addEventListener('click', () => setChat(chat.hidden));
  $('chat-close').addEventListener('click', () => setChat(false));
  $('chat-new').addEventListener('click', () => { $('msgs').innerHTML = '<p class="typing">New chat. Ask anything about the open page.</p>'; });
  function send(text) {
    text = text.trim(); if (!text) return;
    const msgs = $('msgs'), name = prod().chat.title, v = V[state.active];
    msgs.insertAdjacentHTML('beforeend', `<div class="msg user"><div class="who">Ali K.</div><div class="bubble">${esc(text)}</div></div><p class="typing" id="typing">${name} is thinking…</p>`);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => {
      const t = $('typing'); if (t) t.remove();
      msgs.insertAdjacentHTML('beforeend', `<div class="msg ai"><div class="who">✦ ${name}</div><p>This is a design demo. In the real app I would answer using <b>${esc(v ? v.title : 'this page')}</b> and your data, and show any change as a proposal for a person to approve.</p></div>`);
      msgs.scrollTop = msgs.scrollHeight;
    }, 700);
  }
  $('composer').addEventListener('submit', e => { e.preventDefault(); const i = $('chat-input'); send(i.value); i.value = ''; });
  $('chat-input').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('composer').requestSubmit(); } });
  $('sugg').addEventListener('click', e => { const b = e.target.closest('button'); if (b) send(b.textContent); });
  $('msgs').addEventListener('click', e => {
    const b = e.target.closest('[data-apply],[data-discard]'); if (!b) return;
    b.closest('.row').innerHTML = b.hasAttribute('data-apply') ? chip('ok', esc(b.textContent) + ' · sent for sign-off') : chip('idle', esc(b.textContent) + ' · done');
  });

  // command palette
  const COMMANDS = () => [
    ['Ask AI about this page', 'AI', () => setChat(true)],
    ...prod().sections.map(s => ['Go to ' + s.label, 'Section', () => goSection(s.id)]),
    ...Object.values(V).filter(v => v.product === state.product).map(v => ['Open ' + v.title, secOf(v.section) ? secOf(v.section).label : 'Settings', () => openView(v.id)]),
    ...(lockedProduct ? [] : [['Switch to ' + (state.product === 'formulane' ? 'Qualane' : 'Formulane'), 'Product', () => { state.product = state.product === 'formulane' ? 'qualane' : 'formulane'; loadProduct(); applyTheme(); }]]),
    ['Toggle dark mode', 'Theme', () => { state.mode = state.mode === 'dark' ? 'light' : 'dark'; modeChosen = true; applyTheme(); }]
  ];
  const pal = $('palette'), input = $('palette-input'), listEl = $('palette-list');
  let filtered = [], idx = 0;
  function drawList() {
    const q = input.value.trim().toLowerCase();
    filtered = COMMANDS().filter(c => (c[0] + ' ' + c[1]).toLowerCase().includes(q)).slice(0, 40);
    idx = Math.min(idx, Math.max(filtered.length - 1, 0));
    listEl.innerHTML = filtered.length ? filtered.map((c, i) => `<li role="option" data-i="${i}" class="${i === idx ? 'on' : ''}" aria-selected="${i === idx}"><span>${c[0]}</span><small>${c[1]}</small></li>`).join('') : '<li class="empty">No match</li>';
    const on = listEl.querySelector('.on'); if (on) on.scrollIntoView({ block:'nearest' });
  }
  function openPal() { pal.hidden = false; input.value = ''; idx = 0; drawList(); input.focus(); }
  function closePal() { pal.hidden = true; }
  function run(i) { const c = filtered[i]; if (c) { closePal(); c[2](); } }
  $('cmd-open').addEventListener('click', openPal);
  input.addEventListener('input', () => { idx = 0; drawList(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { idx = Math.min(idx + 1, filtered.length - 1); drawList(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { idx = Math.max(idx - 1, 0); drawList(); e.preventDefault(); }
    else if (e.key === 'Enter') { run(idx); e.preventDefault(); }
    else if (e.key === 'Escape') { closePal(); $('cmd-open').focus(); }
  });
  listEl.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) run(+li.dataset.i); });
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? openPal() : closePal(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') { e.preventDefault(); setChat(chat.hidden); }
  });
  document.addEventListener('click', e => { if (!pal.hidden && !pal.contains(e.target) && !e.target.closest('#cmd-open')) closePal(); });

  try {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ev => {
      if (!modeChosen && !document.documentElement.getAttribute('data-theme')) { state.mode = ev.matches ? 'dark' : 'light'; applyTheme(); }
    });
  } catch (e) {}

  /* batch units: each customer can work in kg, lb or g; % stays the same */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-unit]'); if (!b) return;
    const pnl = b.closest('.panel'); if (!pnl) return;
    const u = b.dataset.unit, k = { kg: 1, lb: 2.20462, g: 1000 }[u], d = u === 'g' ? 0 : 1;
    pnl.querySelectorAll('[data-unit]').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    pnl.querySelectorAll('[data-kg]').forEach(c => { c.textContent = fmt(parseFloat(c.dataset.kg) * k, d); });
    pnl.querySelectorAll('th .u').forEach(h => { h.textContent = u; });
  });
  $('copy-css').addEventListener('click', () => {
    const btn = $('copy-css'), text = $('css-out').textContent;
    const done = msg => { btn.textContent = msg; setTimeout(() => btn.textContent = 'Copy CSS', 1600); };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents($('css-out')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); done('Selected, press ⌘C'); };
    try { navigator.clipboard.writeText(text).then(() => done('Copied'), fallback); } catch (e) { fallback(); }
  });

  loadProduct();
  applyTheme();
})();
