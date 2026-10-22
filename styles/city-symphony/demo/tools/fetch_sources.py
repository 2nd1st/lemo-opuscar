"""从干净的 clone 重建素材：按 SOURCES.jsonl 下载 raw/ 里缺的文件（整文件直接下；截取的段落按记录里的起止秒重新截），
再下两款 OFL 字体到 fonts/。已有的文件跳过。用法：python3 tools/fetch_sources.py"""
import json, os, re, subprocess, sys, time, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(os.path.join(HERE, '..'))
UA = 'LemoOpuscar/1.0 (https://github.com/lemomo-ai/lemo-opuscar)'
FONTS = {
    'fonts/Michroma-Regular.ttf': 'https://github.com/google/fonts/raw/main/ofl/michroma/Michroma-Regular.ttf',
    'fonts/OFL-Michroma.txt': 'https://github.com/google/fonts/raw/main/ofl/michroma/OFL.txt',
    'fonts/NotoSansSC-VF.ttf': 'https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf',
    'fonts/OFL-NotoSansSC.txt': 'https://github.com/google/fonts/raw/main/ofl/notosanssc/OFL.txt',
}


def get(url, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    for k in range(5):
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=300).read()
            open(dest, 'wb').write(data); print('ok', dest, f'{len(data) / 1e6:.1f} MB'); return
        except Exception as e:
            print('retry', dest, e, file=sys.stderr); time.sleep(20 * (k + 1))
    sys.exit(f'下载失败：{url}')


for dest, url in FONTS.items():
    if not os.path.exists(dest): get(url, dest)
for line in open('SOURCES.jsonl'):
    r = json.loads(line)
    if os.path.exists(r['file']): continue
    m = re.search(r'原片 ([\d.]+)–([\d.]+) s 截取', r.get('note', ''))
    if m:      # 大文件只截需要的一段（seg.py 同款参数）
        a, b = float(m.group(1)), float(m.group(2))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-user_agent', UA, '-ss', str(a), '-i', r['url'], '-t', str(b - a),
                        '-vf', "scale='min(1920,iw)':-2:flags=lanczos", '-c:v', 'libx264', '-crf', '14', '-preset', 'fast',
                        '-pix_fmt', 'yuv420p', '-an', r['file']], check=True)
        print('ok', r['file'])
    else:
        get(r['url'], r['file'])
