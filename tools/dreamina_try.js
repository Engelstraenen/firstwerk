// Dreamina: einen Gratis-Versuch abschicken (Prompt steht schon im Feld). Klickt NUR, wenn Unlimited an und Preis 0.
// Ergebnis: {r:'belegt'|'gestartet?'|'STOP …'}
(async () => {
  const S = ms => new Promise(r => setTimeout(r, ms));
  const bottom = el => el.offsetParent && el.getBoundingClientRect().top > innerHeight - 160;
  const ta = [...document.querySelectorAll('textarea')].find(e => e.offsetParent);
  const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
  const v = ta.value.trimEnd(); set.call(ta, ta.value.endsWith(' ') ? v : v + ' '); ta.dispatchEvent(new Event('input', { bubbles: true })); await S(1500);
  const b = [...document.querySelectorAll('button.lv-btn-shape-circle.lv-btn-primary')].find(bottom);
  const sw = [...document.querySelectorAll('.lv-switch')].find(bottom);
  let p = b, price = ''; for (let i = 0; i < 6 && p; i++) { p = p.parentElement; const m = (p.innerText || '').match(/(?:^|\n)\s*(\d+)\s*\n\s*(\d+)\s*$/); if (m) { price = m[1] + '/' + m[2]; break; } }
  if (!b || b.disabled) return { r: 'STOP Knopf aus' };
  if (!sw || !sw.classList.contains('lv-switch-checked')) return { r: 'STOP Unlimited aus' };
  if (!/^0\//.test(price)) return { r: 'STOP Preis ' + price };
  const cnt = () => (document.body.innerText.match(/You can run up to 1 generation at a time/g) || []).length;
  const f0 = cnt(); b.click(); await S(14000);
  return { r: cnt() > f0 ? 'belegt' : 'gestartet?', price, t: new Date().toLocaleTimeString() };
})()
