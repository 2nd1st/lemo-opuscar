"""Subset the Chinese fonts to the characters the film uses (Google Fonts CSS2 API, &text=).
usage: python -I tools/fonts.py <demo_dir>   -> fonts/NotoSansSC-400.woff2, -500.woff2, NotoSerifSC-600.woff2
Characters are collected from film.js, overlay.js and timeline.js (every CJK char + full-width punctuation),
plus the Latin digits and signs so mixed strings render in one face."""
import sys, os, re, urllib.request, urllib.parse
D = sys.argv[1]
src = ''.join(open(os.path.join(D, f), encoding='utf-8').read() for f in ('film.js', 'overlay.js', 'timeline.js'))
cjk = sorted(set(re.findall(r'[　-〿一-鿿＀-￯·×→]', src)))
extra = '0123456789%.,:;-+()/°²=→· ' + ''.join(chr(c) for c in range(65, 91)) + ''.join(chr(c) for c in range(97, 123))   # Latin inside Chinese labels (Landsat, km)
text = ''.join(cjk) + extra
print(len(cjk), 'CJK chars:', ''.join(cjk))
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()
for fam, w, out in (('Noto Sans SC', 400, 'NotoSansSC-400.woff2'), ('Noto Sans SC', 500, 'NotoSansSC-500.woff2'), ('Noto Serif SC', 600, 'NotoSerifSC-600.woff2')):
    css = get('https://fonts.googleapis.com/css2?family=' + urllib.parse.quote(fam) + f':wght@{w}&text=' + urllib.parse.quote(text)).decode()
    urls = re.findall(r'url\((https://[^)]+)\)', css)
    assert len(urls) == 1, css[:400]
    data = get(urls[0])
    open(os.path.join(D, 'fonts', out), 'wb').write(data)
    print(out, len(data), 'bytes', urls[0][:80])
