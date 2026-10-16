#!/usr/bin/env python3
"""Subset the Chinese fonts (OFL, Google Fonts) to the characters a scene uses.

    python3 kit/tools/fetch_fonts.py scenes/film.json [more scene files…]

Collects every character from tags, marker lettering, stamps, cards and subtitles,
asks the Google Fonts CSS API for just those glyphs (&text=) and saves the woff2 files
into kit/fonts/. Needs a network connection; run it again when the words change.
Fonts: LXGW Marker Gothic (marker lettering), Noto Sans SC 500 / 700 / 900 (subtitles,
tags, stamp). Both SIL Open Font License 1.1.
"""
import json, os, sys, urllib.parse, urllib.request, re

HERE = os.path.dirname(os.path.abspath(__file__)); KIT = os.path.dirname(HERE)
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'
BASE = '0123456789,.:;!?()-–—+×·%米 ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz，。：；！？、（）“”'

def chars(scene_files):
    s = set(BASE)
    for f in scene_files:
        d = json.load(open(f))
        for e in d.get('elements', []):
            for k in ('text',):
                if isinstance(e.get(k), str): s |= set(e[k])
            for l in e.get('lines', []) or []:
                if isinstance(l.get('text'), str): s |= set(l['text'])
        for q in d.get('subs', []):
            s |= set(q.get('zh', '')) | set(q.get('en', ''))
    return ''.join(sorted(c for c in s if c.strip()))

def fetch(family, weight, text, out):
    q = f'https://fonts.googleapis.com/css2?family={family.replace(" ", "+")}:wght@{weight}&text={urllib.parse.quote(text)}'
    css = urllib.request.urlopen(urllib.request.Request(q, headers={'User-Agent': UA}), timeout=30).read().decode()
    url = re.search(r'url\((https://[^)]+)\)', css).group(1)
    data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()
    open(out, 'wb').write(data); print(out, len(data), 'bytes')

if __name__ == '__main__':
    files = sys.argv[1:] or [os.path.join(os.path.dirname(KIT), 'scenes', 'film.json')]
    txt = chars(files)
    print(len(txt), 'characters')
    fd = os.path.join(KIT, 'fonts'); os.makedirs(fd, exist_ok=True)
    fetch('LXGW Marker Gothic', 400, txt, os.path.join(fd, 'LXGWMarkerGothic-sub.woff2'))
    for w in (500, 700, 900):
        fetch('Noto Sans SC', w, txt, os.path.join(fd, f'NotoSansSC-{w}-sub.woff2'))
    open(os.path.join(fd, 'chars.txt'), 'w').write(txt)
