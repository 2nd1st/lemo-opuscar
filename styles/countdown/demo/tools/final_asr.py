"""成片回听：用 faster-whisper 把成片音轨转写一遍，逐段打印（片中秒），确认原声和旁白在混音里都听得清。
用法：$LIB/.venv/bin/python -I tools/final_asr.py <film.mp4> [model=small.en]"""
import subprocess, sys, tempfile, os
from faster_whisper import WhisperModel
mp4 = sys.argv[1]; model = sys.argv[2] if len(sys.argv) > 2 else "small.en"
wav = os.path.join(tempfile.mkdtemp(), "a.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp4, "-ac", "1", "-ar", "16000", wav], check=True)
segs, _ = WhisperModel(model, device="cpu", compute_type="int8").transcribe(wav, language="en", vad_filter=False)
for s in segs: print(f"[{s.start:6.2f}–{s.end:6.2f}] {s.text.strip()}")
