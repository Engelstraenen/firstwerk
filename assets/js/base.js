/* FIRSTWERK – gemeinsame Logik: Szenen-Fortschritt, Einblenden, Kinetik, Zähler, Bewerbung, Menü */
const FW = (() => {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const scenes = [];

  // Firmenname per ?firma=
  const firma = new URLSearchParams(location.search).get('firma');
  document.querySelectorAll('[data-firma]').forEach(el => { if (firma) el.textContent = `Demo für ${firma.slice(0, 40)} · Musterseite, Formulare senden nichts`; });

  // Bilder ohne Datei ausblenden (nie Platzhalter)
  document.querySelectorAll('img[data-need]').forEach(img => {
    const hide = () => { const box = img.closest('[data-hide]'); (box || img).style.display = 'none'; };
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) hide();
    img.addEventListener('error', hide);
  });

  // Navigation
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu');
  document.querySelector('.burger')?.addEventListener('click', () => menu.classList.add('open'));
  menu?.querySelectorAll('a,.x').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

  // Szenen registrieren: Höhe in vh = data-len
  function scene(el, fn) { scenes.push({ el, fn }); }
  function tick() {
    const vh = innerHeight;
    nav && nav.classList.toggle('solid', scrollY > vh * .6);
    for (const s of scenes) {
      const r = s.el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      const p = clamp(-r.top / Math.max(1, r.height - vh));
      s.el.style.setProperty('--p', p.toFixed(4));
      s.fn && s.fn(p, r);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Kinetik-Wörter: jedes Wort bekommt eigenes Fenster im Fortschritt
  function kinetic(sceneEl, from = .1, to = .85) {
    const ws = [...sceneEl.querySelectorAll('.kin .w')];
    scene(sceneEl, p => ws.forEach((w, i) => {
      const a = from + (to - from) * i / ws.length, b = a + (to - from) / ws.length * .9;
      w.style.setProperty('--k', ease(seg(p, a, b)).toFixed(3));
    }));
  }

  // Einblenden + Zähler + Sterne
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.add('in'); io.unobserve(el);
    if (el.dataset.count) {
      const to = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, t0 = performance.now();
      const step = t => { const k = ease(clamp((t - t0) / 1800)); el.textContent = (to * k).toFixed(dec).replace('.', ','); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
    if (el.dataset.fill) el.style.setProperty('--fill', el.dataset.fill);
  }), { threshold: .25 });
  document.querySelectorAll('.rv,[data-count],[data-fill]').forEach(el => io.observe(el));

  // Beispiel-Zitate wechseln (nie Text über Text)
  document.querySelectorAll('.quote').forEach(q => {
    const ps = [...q.querySelectorAll('p')]; let i = 0; if (!ps.length) return; ps[0].classList.add('on');
    setInterval(() => { ps[i].classList.remove('on'); i = (i + 1) % ps.length; setTimeout(() => ps[i].classList.add('on'), 700); }, 6000);
  });

  // Bewerbung in 60 Sekunden
  function apply(root) {
    if (!root) return;
    const cards = [...root.querySelectorAll('.card')], bar = root.querySelector('.bar i'), fg = root.querySelector('.ring .fg'), sec = root.querySelector('[data-sec]');
    const C = 2 * Math.PI * 20; if (fg) { fg.style.strokeDasharray = C; fg.style.strokeDashoffset = 0; }
    let i = 0, left = 60, timer = null;
    const lay = () => cards.forEach((c, k) => { c.classList.toggle('back', k === i + 1); c.classList.toggle('hide', k > i + 1); c.style.zIndex = 50 - k; });
    lay();
    const start = () => { if (timer) return; timer = setInterval(() => { left = Math.max(0, left - 1); if (sec) sec.textContent = left; if (fg) fg.style.strokeDashoffset = C * (1 - left / 60); if (!left) clearInterval(timer); }, 1000); };
    const next = dir => { start(); const c = cards[i]; if (!c) return; c.classList.add(dir === 'l' ? 'out-l' : 'out-r'); i++; lay(); if (bar) bar.style.width = (i / (cards.length - 1) * 100) + '%'; };
    cards.forEach(c => {
      c.querySelectorAll('.opts button').forEach((b, k) => b.addEventListener('click', () => next(k ? 'l' : 'r')));
      const f = c.querySelector('form');
      f && f.addEventListener('submit', e => { e.preventDefault(); clearInterval(timer); next('r'); });
      let x0 = null; c.addEventListener('pointerdown', e => { if (e.target.closest('input,button')) return; x0 = e.clientX; });
      c.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 60 && c.querySelector('.opts')) next(dx > 0 ? 'r' : 'l'); });
    });
  }
  document.querySelectorAll('[data-apply]').forEach(apply);

  // Punkt im 16:9-Bild (object-fit:cover) -> Position im Element in %
  // Bild mit object-fit:cover; Ausschnitt wird so verschoben, dass die Fundstelle (x/y in % des Bildes) sichtbar bleibt
  function spot(sec, G, ar = 16 / 9) {
    if (!sec || !G) return; const st = sec.querySelector('.stick') || sec, imgs = st.querySelectorAll('img.layer');
    const set = () => {
      const W = st.clientWidth, H = st.clientHeight, iw = Math.max(W, H * ar), ih = iw / ar;
      const px = iw > W + 1 ? clamp((G.x / 100 * iw - W * .55) / (iw - W), 0, 1) : .5, py = ih > H + 1 ? clamp((G.y / 100 * ih - H * .45) / (ih - H), 0, 1) : .5;
      imgs.forEach(i => i.style.objectPosition = (px * 100).toFixed(1) + '% ' + (py * 100).toFixed(1) + '%');
      sec.style.setProperty('--sx', ((G.x / 100 * iw - (iw - W) * px) / W * 100).toFixed(1) + '%');
      sec.style.setProperty('--sy', ((G.y / 100 * ih - (ih - H) * py) / H * 100).toFixed(1) + '%');
    };
    set(); addEventListener('resize', set);
  }
  return { clamp, seg, ease, scene, kinetic, spot };
})();
