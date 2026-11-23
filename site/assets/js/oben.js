/* Variante 3 – Von oben: Sturzflug, Drohnen-Check, Konfigurator */
(() => {
  const { seg, ease, scene, kinetic } = FW;

  /* Sturzflug: Luftbild zoomt aufs Dach → Hand mit Hammer → Schiefer-Makro */
  const hero = document.querySelector('#hero');
  const [o1, o2, o3] = ['.o1', '.o2', '.o3'].map(s => hero.querySelector(s));
  const [t1, t2, t3] = ['.t1', '.t2', '.t3'].map(s => hero.querySelector(s));
  const alt = hero.querySelector('[data-alt]');
  const show = (el, v, y = 0) => { el.style.opacity = v; el.style.transform = `translateY(${(1 - v) * y}px)`; };
  scene(hero, p => {
    const z1 = ease(seg(p, 0, .4));
    o1.style.transform = `scale(${1 + z1 * 1.6})`;
    const a = ease(seg(p, .32, .44)), b = ease(seg(p, .64, .76));
    o2.style.opacity = a; o2.style.transform = `scale(${1.25 - .25 * seg(p, .32, .7)})`;
    o3.style.opacity = b; o3.style.transform = `scale(${1.15 - .15 * seg(p, .64, 1)})`;
    show(t1, 1 - seg(p, .1, .2), -30);
    show(t2, seg(p, .42, .48) * (1 - seg(p, .6, .66)), 30);
    show(t3, seg(p, .78, .86), 30);
    alt.textContent = Math.round(120 - 118 * seg(p, 0, .42)) + ' m';
  });

  /* Drohnen-Check: Wärmebild öffnet sich kreisförmig um die Fundstelle */
  const ck = document.querySelector('.check');
  FW.spot(ck, (window.FW_GEO || {}).s5);
  if (ck) {
    const li = [...ck.querySelectorAll('.flow li')];
    scene(ck, p => {
      ck.style.setProperty('--r', ease(seg(p, .15, .6)).toFixed(3));
      ck.style.setProperty('--done', seg(p, .55, .65).toFixed(3));
      li.forEach((l, i) => l.classList.toggle('on', p > .1 + i * .22));
    });
  }

  /* Konfigurator: Material wechselt das Dach; fehlende Bilder → Knopf weg */
  const st = document.querySelector('.kstage');
  if (st) {
    const imgs = [...st.querySelectorAll('.km')], btns = [...document.querySelectorAll('.swatches button')];
    const ok = m => { const im = imgs.find(i => i.dataset.m === m); return im && im.style.display !== 'none' && !(im.complete && im.naturalWidth === 0); };
    const sync = () => { btns.forEach(b => { b.hidden = !ok(b.dataset.m); }); if (!ok('schiefer')) document.querySelector('#konfigurator').style.display = 'none'; };
    imgs.forEach(i => i.addEventListener('error', sync)); addEventListener('load', sync);
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.classList.toggle('on', x === b));
      imgs.forEach(i => i.classList.toggle('on', i.dataset.m === b.dataset.m));
    }));
  }

  kinetic(document.querySelector('.benefits'));
})();
