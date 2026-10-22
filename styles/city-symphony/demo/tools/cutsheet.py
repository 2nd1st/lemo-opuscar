"""转场自审：每个切点前一帧 / 后一帧并排 → work/cuts_sheet.jpg。用法：python tools/cutsheet.py out/picture.mp4"""
import os, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); os.chdir(os.path.join(HERE, '..'))
from PIL import Image, ImageDraw
from shots import SHOTS
from timeline import FPS
src = sys.argv[1]; W, H = 320, 180
cuts = sorted({round(s['t0'] * FPS) for s in SHOTS if s['t0'] > 0})
tiles = []
for f in cuts:
    for g in (f - 1, f):
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{g / FPS + .001:.4f}', '-i', src, '-vf', f'scale={W}:{H}', '-frames:v', '1',
                              '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
        tiles.append((f'{g / FPS:.2f}', Image.frombytes('RGB', (W, H), raw)))
cols = 8; rows = (len(tiles) + cols - 1) // cols
S = Image.new('RGB', (W * cols, H * rows)); d = ImageDraw.Draw(S)
for i, (lab, im) in enumerate(tiles):
    x, y = (i % cols) * W, (i // cols) * H; S.paste(im, (x, y)); d.rectangle([x, y, x + 44, y + 13], fill=0); d.text((x + 2, y + 1), lab, fill=(255, 255, 0))
S.save('work/cuts_sheet.jpg', quality=82); print('work/cuts_sheet.jpg', len(cuts), 'cuts')
