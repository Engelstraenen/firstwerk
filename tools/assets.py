#!/usr/bin/env python3
"""4K-Rohbilder (assets-roh/4k/<id>.jpg|png) -> site/assets/img/<id>.webp (3840) + <id>-m.webp (1800).
Cache: nur neu rechnen, wenn Quelle neuer als Ziel. Wärmebild-Fundstelle (s5) wird gemessen -> site/assets/js/geo.js"""
import os, glob, json
from PIL import Image
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DST = os.path.join(R, 'assets-roh/4k'), os.path.join(R, 'site/assets/img')
os.makedirs(DST, exist_ok=True)
geo = {}
for f in sorted(glob.glob(SRC + '/*')):
    k = os.path.splitext(os.path.basename(f))[0]
    big, mob = f'{DST}/{k}.webp', f'{DST}/{k}-m.webp'
    if os.path.exists(mob) and os.path.getmtime(mob) >= os.path.getmtime(f) and k != 's5':
        continue
    im = Image.open(f).convert('RGB')
    for out, w, q in ((big, 3840, 82), (mob, 1800, 80)):
        x = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        x.save(out, 'WEBP', quality=q, method=6)
    print(k, im.size, '->', os.path.getsize(big) // 1024, 'KB /', os.path.getsize(mob) // 1024, 'KB')
    if k == 's5':  # wärmster Fleck = höchste Rot-minus-Blau-Helligkeit (grob gerastert)
        s = im.resize((160, 90)); px = s.load(); best = (-1, 0, 0)
        for y in range(90):
            for xx in range(160):
                r, g, b = px[xx, y]; v = r + g * .6 - b
                if v > best[0]: best = (v, xx, y)
        geo['s5'] = {'x': round(best[1] / 160 * 100, 1), 'y': round(best[2] / 90 * 100, 1)}
if geo:
    open(os.path.join(R, 'site/assets/js/geo.js'), 'w').write('window.FW_GEO=' + json.dumps(geo) + ';\n')
    print('geo', geo)
