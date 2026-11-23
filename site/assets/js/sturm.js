/* Variante 2 – Sturmnacht: Regen, Blitz, Hero-Ablauf, Radar, Melder, Wärmebild */
(() => {
  const { seg, ease, scene, kinetic } = FW;
  const dpr = Math.min(2, devicePixelRatio || 1);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero: Nacht → Notsicherung → repariert */
  const hero = document.querySelector('#hero');
  const l2 = hero.querySelector('.l2'), l3 = hero.querySelector('.l3'), steps = [...hero.querySelectorAll('.steps li')];
  const txt = hero.querySelector('.hero-txt'), flash = hero.querySelector('.flash');
  let storm = 1;
  scene(hero, p => {
    const a = ease(seg(p, .25, .42)), b = ease(seg(p, .62, .8));
    l2.style.opacity = a; l3.style.opacity = b;
    storm = 1 - seg(p, .6, .78);
    txt.style.opacity = 1 - seg(p, .12, .24);
    txt.style.transform = `translateY(${-seg(p, .12, .24) * 40}px)`;
    const s = p < .33 ? 0 : p < .7 ? 1 : 2;
    steps.forEach((li, i) => li.classList.toggle('on', i === s));
  });

  /* Regen auf Canvas */
  const rc = hero.querySelector('.rain'), rx = rc.getContext('2d');
  let drops = [];
  const size = () => { rc.width = rc.clientWidth * dpr; rc.height = rc.clientHeight * dpr; drops = Array.from({ length: Math.round(rc.width * rc.height / 9000) }, () => ({ x: Math.random() * rc.width, y: Math.random() * rc.height, l: 14 + Math.random() * 26, v: 18 + Math.random() * 16 })); };
  size(); addEventListener('resize', size);
  let nextFlash = performance.now() + 2500;
  const rain = t => {
    rx.clearRect(0, 0, rc.width, rc.height);
    if (storm > 0.01 && !reduce) {
      rx.strokeStyle = `rgba(190,210,240,${.35 * storm})`; rx.lineWidth = 1.2 * dpr; rx.beginPath();
      for (const d of drops) { rx.moveTo(d.x, d.y); rx.lineTo(d.x - d.l * .25, d.y + d.l); d.y += d.v * dpr; d.x -= d.v * .25 * dpr; if (d.y > rc.height) { d.y = -d.l; d.x = Math.random() * rc.width * 1.2; } }
      rx.stroke();
      if (t > nextFlash) { nextFlash = t + 3500 + Math.random() * 5000; flash.animate([{ opacity: 0 }, { opacity: .55 * storm }, { opacity: .1 }, { opacity: .4 * storm }, { opacity: 0 }], { duration: 650 }); }
    }
    requestAnimationFrame(rain);
  };
  requestAnimationFrame(rain);

  /* Radar: Stadtplan + Sturmfront zieht mit dem Scrollen */
  const rs = document.querySelector('.radar'), mc = rs.querySelector('.map'), mx = mc.getContext('2d'), live = rs.querySelector('[data-live]');
  let rnd = 7; const R = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647;
  let streets = [], pins = [];
  const build = () => {
    mc.width = mc.clientWidth * dpr; mc.height = mc.clientHeight * dpr; rnd = 7; streets = []; pins = [];
    const W = mc.width, H = mc.height;
    for (let i = 0; i < 70; i++) { const hor = R() > .5, c = R() * (hor ? H : W), a = R() * (hor ? W : H), len = (0.2 + R() * .7) * (hor ? W : H); streets.push({ hor, c, a, b: a + len, w: R() > .85 ? 3 : 1 }); }
    for (let i = 0; i < 46; i++) pins.push({ x: (.08 + R() * .9) * W, y: (.1 + R() * .85) * H });
  };
  build(); addEventListener('resize', build);
  let rp = 0;
  scene(rs, p => { rp = p; });
  const drawMap = t => {
    const W = mc.width, H = mc.height; mx.clearRect(0, 0, W, H);
    mx.strokeStyle = 'rgba(120,150,190,.16)';
    for (const s of streets) { mx.lineWidth = s.w * dpr; mx.beginPath(); if (s.hor) { mx.moveTo(s.a, s.c); mx.lineTo(s.b, s.c); } else { mx.moveTo(s.c, s.a); mx.lineTo(s.c, s.b); } mx.stroke(); }
    mx.strokeStyle = 'rgba(60,110,170,.35)'; mx.lineWidth = 18 * dpr; mx.beginPath(); mx.moveTo(-50, H * .78); mx.bezierCurveTo(W * .3, H * .6, W * .55, H * .95, W + 50, H * .7); mx.stroke();
    const fx = (-.35 + rp * 1.6) * W;
    const g = mx.createRadialGradient(fx, H * .5, 0, fx, H * .5, W * .45);
    g.addColorStop(0, 'rgba(255,106,26,.55)'); g.addColorStop(.35, 'rgba(255,60,20,.28)'); g.addColorStop(.7, 'rgba(120,40,160,.12)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    mx.fillStyle = g; mx.beginPath(); mx.ellipse(fx, H * .5, W * .45, H * .7, -.3, 0, Math.PI * 2); mx.fill();
    let n = 0;
    for (const pin of pins) {
      if (pin.x > fx + W * .05) continue; n++;
      const pulse = (Math.sin(t / 300 + pin.x) + 1) / 2;
      mx.fillStyle = 'rgba(255,106,26,.25)'; mx.beginPath(); mx.arc(pin.x, pin.y, (8 + pulse * 10) * dpr, 0, 7); mx.fill();
      mx.fillStyle = '#ff6a1a'; mx.beginPath(); mx.arc(pin.x, pin.y, 4 * dpr, 0, 7); mx.fill();
    }
    live.textContent = Math.round(n * 2.7);
    requestAnimationFrame(drawMap);
  };
  requestAnimationFrame(drawMap);

  /* Melder: 3 Schritte, Foto bleibt lokal */
  const f = document.querySelector('#mform'), st = [...f.querySelectorAll('.mstep')];
  let cur = 0; const go = i => { st[cur].classList.remove('on'); cur = i; st[cur].classList.add('on'); };
  f.querySelectorAll('.next').forEach(b => b.addEventListener('click', () => go(cur + 1)));
  f.addEventListener('submit', e => { e.preventDefault(); go(3); });
  f.querySelectorAll('.chips button').forEach(b => b.addEventListener('click', () => b.classList.toggle('sel')));
  const fi = f.querySelector('.drop input'), im = f.querySelector('.drop img');
  fi.addEventListener('change', () => { const file = fi.files[0]; if (!file) return; im.src = URL.createObjectURL(file); im.hidden = false; });

  /* Wärmebild-Scan */
  const ck = document.querySelector('.check');
  FW.spot(ck, (window.FW_GEO || {}).s5);
  if (ck) scene(ck, p => { const s = ease(seg(p, .1, .6)); ck.style.setProperty('--scan', s.toFixed(3)); ck.style.setProperty('--done', seg(p, .58, .68).toFixed(3)); });

  /* Vorteile als Kinetik-Typo */
  kinetic(document.querySelector('.benefits'));
})();
