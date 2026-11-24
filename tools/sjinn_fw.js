// FIRSTWERK sjinn-Warteschlange (Stand 23.11.2026). Einspielen in https://sjinn.ai/tool-mode/nano-banana-2.1
// Worker-Timer (läuft im Hintergrund-Tab), Limit per MutationObserver, Annahme per „View details“, Ergebnisse in localStorage FW_RES.
// Status: FWQ.s  ·  Stop: FWQ.run = 0  ·  Edit mit Referenz: FWQ.addRef('FWM-S2', '<url im Asset-Dialog>')
(() => {
  const wk = new Worker(URL.createObjectURL(new Blob(['onmessage=e=>setTimeout(()=>postMessage(e.data.id),e.data.ms)'])));
  let n = 0; const cb = {}; wk.onmessage = e => { cb[e.data](); delete cb[e.data]; };
  const sleep = ms => new Promise(r => { const id = ++n; cb[id] = r; wk.postMessage({ id, ms }); });
  const ST = ' Photorealistic professional photograph, full-frame camera, cinematic natural lighting, realistic textures, true-to-life colors, subtle film grain, ultra sharp, 16:9. Modern German roofing reality: roofers wear modern dark work clothes, helmets and full fall-protection harnesses. No text, no letters, no logos, no watermark, no clichés, not CGI, no plastic look.';
  const MOT = {
    'FWM-S4': 'Four young roofers in their twenties standing next to an anthracite service van at blue dawn after a night shift, helmets in their hands, harnesses still on, tired but laughing together, wet street, orange warning light on the van roof glowing, rolled orange tarp in the van, cinematic, space on the left side for text.',
    'FWM-S5': 'Top-down drone photograph of a pitched clay tile roof of a German house, shown with a thermal camera overlay look: the roof surface in cool deep blue and purple tones, one bright orange-yellow warm spot near the chimney showing moisture or heat loss, crisp, technical, realistic thermal imaging aesthetic.',
    'FWM-O1': 'Aerial drone photograph at blue hour over a historic German old town full of steep slate and clay roofs, church spire in the distance, warm street lights below, one dark slate roof in the foreground catches the last warm golden light, calm, elegant, slate anthracite color world with warm copper highlights, space in the sky for a headline.',
    'FWM-O2': "Close-up of a roofer's gloved hand holding a traditional slate hammer, shaping the edge of a dark grey slate stone on a slate roof, small slate chips flying, the roofer in a safety harness kneels on the roof, shallow depth of field, warm late afternoon side light, elegant slate and copper tones.",
    'FWM-O3': 'Macro photograph of perfectly laid dark slate roofing in traditional German pattern with curved rows, a shiny new copper flashing and copper gutter at a dormer, warm low sunlight raking across the slate texture, elegant, slate anthracite with copper, space for text on the right.',
    'FWM-O5A': 'A modern German detached house with a steep pitched roof covered in dark natural slate, clean white plaster facade, large windows, neat garden, soft overcast daylight, house centered, camera straight from the front at a slight elevation, plain calm sky.',
    'FWM-O7': 'A confident young female roofer in her early twenties in modern dark work clothes, helmet and safety harness sits on the ridge of a slate roof above a German city at sunset, looking into the distance, warm golden light, cool urban skyline below, cinematic, space for a headline on the left.'
  };
  // Edit-Aufträge: Referenz = URL eines Bildes im Asset-Dialog (vorher per file_upload hochladen, neuestes steht vorn)
  const REF = JSON.parse(localStorage.FW_REF || '{}');  // z. B. {'FWM-S2':'https://edit.comfyonline.app/<id>.jpg'}
  const ED = ' Same photorealistic style, same lens, same light direction as the reference. Modern German roofing reality, roofers in modern dark work clothes, helmets and full fall-protection harnesses. No text, no letters, no logos, no watermark, no clichés, not CGI.';
  Object.assign(MOT, {
    'FWM-S2B': 'Edit the reference image. Keep the camera position, the camera angle, the framing, the house, the roof, the two roofers, the street, the garden, the neighbouring houses, the sky and the stormy night lighting exactly the same, pixel for pixel, do not move or zoom the camera. Change only this: the hole in the roof is now covered by a bright orange tarp stretched flat over it, its edges held down with wooden battens, the two roofers kneel beside it pressing it down. Lightning and rain stay.' + ED,
    'FWM-S3': 'Edit the reference image: keep the house, the roof shape, the camera angle, the framing, the street and the trees exactly the same. Change only: it is now the calm early morning after the storm, soft clear daylight with a hint of sunrise, the street still wet, the roof is completely repaired with new tiles that match the old ones, no hole, no tarp, no people, peaceful.' + ED,
    'FWM-O5B': 'Edit the reference image: keep the house, the facade, the windows, the garden, the camera angle, the framing, the sky and the light exactly the same, same roof shape, same ridge, same eaves, same chimney. Change only the roof covering: replace the dark slate with classic new red-orange clay roof tiles, neatly laid in straight rows, matching red ridge tiles.' + ED,
    'FWM-O5C': 'Edit the reference image: keep the house, the facade, the windows, the garden, the camera angle, the framing, the sky and the light exactly the same, same roof shape, same ridge, same eaves, same chimney. Change only the roof covering: replace the dark slate with new matte anthracite clay roof tiles, neatly laid in straight rows, matching anthracite ridge tiles.' + ED,
    'FWM-O5D': 'Edit the reference image: keep the house, the facade, the windows, the garden, the camera angle, the framing, the sky and the light exactly the same, same roof shape, same ridge, same eaves, same chimney. Change only the roof covering: replace the dark slate with a modern standing seam metal roof in natural grey titanium zinc, crisp vertical seams running from ridge to eaves.' + ED
  });
  const Q = window.FWQ = { s: 'init', log: [], REF, todo: JSON.parse(localStorage.FW_TODO || 'null') || Object.keys(MOT) };
  Q.addRef = (id, url) => { REF[id] = url; localStorage.FW_REF = JSON.stringify(REF); if (!Q.todo.includes(id)) Q.todo.push(id); localStorage.FW_TODO = JSON.stringify(Q.todo); return Q.todo; };
  const clearRefs = async () => { for (let k = 0; k < 6; k++) { const b = [...document.querySelectorAll('button')].find(b => /^Remove Image/.test(b.getAttribute('aria-label') || '')); if (!b) break; b.click(); await sleep(500); } };
  const setRef = async src => {
    if (!document.querySelector('[role=dialog]')) await click('Add reference images', 1500);
    const dlg = document.querySelector('[role=dialog]'); if (!dlg) return 'NODLG';
    const clr = [...dlg.querySelectorAll('button')].find(b => /Clear selection/i.test(b.innerText)); if (clr) { clr.click(); await sleep(600); }
    let img = [...dlg.querySelectorAll('img')].find(i => i.src === src);
    for (let k = 0; !img && k < 8; k++) { const lm = [...dlg.querySelectorAll('button')].find(b => /Load more/i.test(b.innerText)); if (!lm) break; lm.click(); await sleep(2500); img = [...dlg.querySelectorAll('img')].find(i => i.src === src); }
    if (img) { let c = img; for (let k = 0; k < 7; k++) { c = c.parentElement; const sb = c && c.querySelector('button[aria-label^="Select image"]'); if (sb) { sb.click(); break; } } await sleep(600); }
    const use = [...dlg.querySelectorAll('button')].find(b => /^Use \d+ image|Apply selection/i.test(b.innerText.trim()));
    if (img && use && !use.disabled) { use.click(); await sleep(900); return 'ok'; }
    const x = [...dlg.querySelectorAll('button')].find(b => b.innerText.trim() === 'Cancel' || b.getAttribute('aria-label') === 'Close'); x && x.click(); await sleep(600); return 'NOIMG';
  };
  const closeDlg = async () => { const d = document.querySelector('[role=dialog]'); if (!d) return; const x = [...d.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === 'Close' || b.innerText.trim() === 'Cancel'); x && x.click(); await sleep(600); };
  const btns = () => [...document.querySelectorAll('button,[role=button]')];
  const btn = t => btns().find(b => ((b.getAttribute('aria-label') || '') + '|' + (b.title || '') + '|' + b.innerText).toLowerCase().includes(t.toLowerCase()));
  const click = async (t, w = 800) => { const b = btn(t); if (b) { b.click(); await sleep(w); } return !!b; };
  const bar = () => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(t => /Nano|16:9|4K|2K|1K|Unlimited|credits/.test(t)).join(' | ');
  const ok = () => /Nano Banana 2\.1/.test(bar()) && /Unlimited · On/.test(bar()) && /0 credits/.test(bar()) && /16:9/.test(bar()) && /4K/.test(bar());
  const setup = async () => {
    if (!/Unlimited · On/.test(bar())) { await click('Unlimited'); const o = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && (e.innerText || '').trim() === 'No credits consumed'); o && o.click(); await sleep(800); }
    await click('Aspect ratio'); await click('16:9'); await click('Resolution'); await click('4K resolution');
  };
  // Limit-Meldung per MutationObserver zählen (Toast-Klasse unzuverlässig, Toasts nie entfernen: React stürzt sonst ab)
  if (window.__fwObs) window.__fwObs.disconnect();
  window.__fwLim = window.__fwLim || 0;
  window.__fwObs = new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (/maximum limit of 5 concurrent/.test(n.textContent || '')) { window.__fwLim++; return; } });
  window.__fwObs.observe(document.body, { childList: true, subtree: true });
  const clearToasts = () => {};
  const res = () => { const o = JSON.parse(localStorage.FW_RES || '{}'); for (const im of document.querySelectorAll('img')) { const m = (im.alt || '').match(/^(FWM-[A-Z0-9]+) /); if (m && im.src.includes('/result/')) o[m[1]] = im.src.split('?')[0]; } localStorage.FW_RES = JSON.stringify(o); return o; };
  const details = async () => { const out = []; for (const e of [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && (e.innerText || '').trim() === 'Generating')) { const c = e.parentElement.parentElement.parentElement; const v = c.querySelector('[aria-label="View details"],[title="View details"]'); if (!v) continue; v.click(); await sleep(1500); const t = document.body.innerText, i = t.indexOf('Prompt\n'); out.push(i >= 0 ? t.slice(i + 7, i + 20).trim() : '?'); const x = btns().find(b => /close/i.test(b.getAttribute('aria-label') || '')); x && x.click(); await sleep(800); } return out; };
  Q.res = res; Q.details = details;
  Q.go = async () => {
    const my = Q.run = Date.now();
    while (Q.run === my) {
      const r = res(); Q.todo = Q.todo.filter(id => !r[id]); localStorage.FW_TODO = JSON.stringify(Q.todo);
      if (!Q.todo.length) { Q.s = 'fertig ' + new Date().toLocaleTimeString(); return; }
      if (!ok()) { await setup(); if (!ok()) { Q.s = 'STOP Leiste: ' + bar(); return; } }
      const run = await details(); const mine = run.filter(x => x.startsWith('FWM-'));
      const next = Q.todo.find(id => !run.some(x => x.startsWith(id)));
      if (!next || mine.length >= 2) { Q.s = 'läuft: ' + mine.join(',') + ' ' + new Date().toLocaleTimeString(); await sleep(120000); continue; }
      clearToasts(); await closeDlg(); await clearRefs();
      if (REF[next]) { const r = await setRef(REF[next]); if (r !== 'ok') { Q.s = 'Referenz fehlt ' + next + ' ' + r; Q.todo = Q.todo.filter(i => i !== next).concat(next); await sleep(60000); continue; } }
      const ta = document.querySelector('textarea'); const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
      set.call(ta, ''); ta.dispatchEvent(new Event('input', { bubbles: true })); await sleep(300);
      set.call(ta, next + ' ' + MOT[next] + (REF[next] ? '' : ST)); ta.dispatchEvent(new Event('input', { bubbles: true })); await sleep(1200);
      const lim0 = window.__fwLim; const g = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Generate'); g && g.click(); await sleep(8000);
      if (window.__fwLim > lim0) { Q.s = 'Konto voll ' + new Date().toLocaleTimeString(); await sleep(90000); continue; }
      const after = await details();
      if (after.some(x => x.startsWith(next))) { Q.log.push(next + ' angenommen ' + new Date().toLocaleTimeString()); Q.s = 'gesendet ' + next; await sleep(20000); }
      else { Q.s = 'nicht angenommen ' + next + ' ' + new Date().toLocaleTimeString(); await sleep(90000); }
    }
  };
  return 'FWQ bereit';
})();
