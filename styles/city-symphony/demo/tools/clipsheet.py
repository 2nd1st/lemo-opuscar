"""work/clips 每个片段首/中/尾帧的联系表 → work/clips_sheet.jpg"""
import glob, subprocess, os
from PIL import Image, ImageDraw
W, H, cols = 384, 216, 6; tiles = []
for f in sorted(glob.glob('work/clips/*.mp4')):
    n = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
    for k in (0, n // 2, n - 1):
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-vf', f'select=eq(n\\,{k}),scale={W}:{H}', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
        tiles.append((os.path.basename(f)[:-4] + f'_{k}', Image.frombytes('RGB', (W, H), raw)))
rows = (len(tiles) + cols - 1) // cols
S = Image.new('RGB', (W * cols, H * rows)); d = ImageDraw.Draw(S)
for i, (lab, im) in enumerate(tiles):
    x, y = (i % cols) * W, (i // cols) * H; S.paste(im, (x, y)); d.rectangle([x, y, x + 170, y + 14], fill=0); d.text((x + 2, y + 1), lab, fill=(255, 255, 0))
S.save('work/clips_sheet.jpg', quality=80); print(len(tiles))
