#!/usr/bin/env python3
"""Headless-Prüfung: Konsolenfehler, Querscroll, Kopfzeile, Screenshots je Viewport und Scroll-Stand.
python3 tools/check.py <url> <ausgabe> [breiten...]"""
import sys, os, json
from playwright.sync_api import sync_playwright
URL, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
VPS = [(1440, 900), (1280, 800), (390, 844), (360, 740), (430, 932), (844, 390)]
STEPS = int(os.environ.get('STEPS', '14'))
res = {}
with sync_playwright() as pw:
    b = pw.chromium.launch()
    for w, h in VPS:
        pg = b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=1, is_mobile=w < 768, has_touch=w < 768)
        errs = []
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('requestfailed', lambda r: errs.append('FAIL ' + r.url))
        pg.goto(URL, wait_until='networkidle'); pg.wait_for_timeout(600)
        H = pg.evaluate('document.documentElement.scrollHeight')
        info = {'errors': errs, 'height': H}
        info['xscroll'] = pg.evaluate('document.documentElement.scrollWidth > innerWidth + 1')
        info['nav_overflow'] = pg.evaluate("[...document.querySelectorAll('.nav > *')].filter(e=>getComputedStyle(e).display!=='none').map(e=>Math.round(e.getBoundingClientRect().right)).filter(r=>r>innerWidth)")
        for i in range(STEPS + 1):
            y = round((H - h) * i / STEPS)
            pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(450)
            pg.screenshot(path=f'{OUT}/{w}x{h}_{i:02d}.jpg', type='jpeg', quality=60)
        res[f'{w}x{h}'] = info
        pg.close()
    b.close()
print(json.dumps(res, indent=1, ensure_ascii=False))
