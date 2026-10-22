#!/usr/bin/env python3
"""把一张配图「派发」给 Codex CLI，用 Codex 自带的 image_gen 生成。

这个 skill 是 Claude Code skill；它本身不生图，只负责「画什么 + 派发」。
真正的生图能力是 Codex CLI 自带的 image_gen。本脚本只做一件事：
把风格锚点图(-i) 和拼好的 prompt(走 stdin) 交给 `codex exec`，
让 Codex 用 image_gen 生成，再把成品存到目标路径。

比例（--aspect，已实测验证）：
- image_gen 实际支持任意宽高比直出（尽管它自述只有 1024/1536 三种尺寸）。
  实测 2.35:1 直出 1923x818，构图完整无黑边。
- --aspect 会在 prompt 顶部注入「画幅硬性要求」，并在产出后用 PIL 校验
  实际比例（容差 5%）；不对就自动重试，重试后仍不对则退出码 3，
  错误比例的产物保留为 *_wrongaspect.png 供裁切兜底。

稳定性（教训固化）：
- 不用 subprocess.run(capture_output=True)——codex 落盘后偶尔不退出，
  孙进程占住管道会让超时永远切不下去。改为：stdout/stderr 走日志文件、
  开独立进程组、每 2 秒轮询目标文件；文件就位且大小稳定即算成功，
  随后杀掉整个进程组，不陪 codex 干等。

风格包（多风格）：
- 每个风格是 styles/<style>/ 一个文件夹，里面有 reference.png（锚点图）
  + style-dna.md + 可选 character.md + examples/。
- --style 选用哪个风格包，默认 clay。脚本据此解析锚点图：
  styles/<style>/reference.png。

约定：
- 锚点图（styles/<style>/reference.png）默认自动作为第一张 -i 喂入，
  用来锁住该风格的角色/材质/画风；--ref 是【追加】参考图，不会顶掉锚点图。
- 默认【只喂锚点图】，不喂「版式参考图」——构图/结构全部用 prompt 文字描述。
- 修图时用 --no-anchor：不喂锚点图，把要修改的那张图当第一张 --ref 喂回去。
- 成功时 stdout 打印保存文件的绝对路径。

Usage:
    gen_codex.py "<画面 prompt>" [--style clay] [--aspect 16:9]
                 [--ref <参考图> ...] [--no-anchor] [--out <dir>] [--name <basename>]
                 [--reasoning low] [--retries 1] [--timeout 480]

退出码：0 成功；2 没产出；3 产出了但比例不对(已重试)；4 环境问题。
"""
import argparse
import base64
import glob
import hashlib
import json
import os
import signal
import subprocess
import sys
import time
from shutil import which


def file_md5(path: str) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

SKILL_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STYLES_DIR = os.path.join(SKILL_ROOT, "styles")
DEFAULT_STYLE = "clay"


def style_ref(style: str) -> str:
    """返回某风格包的锚点图路径 styles/<style>/reference.png。"""
    return os.path.join(STYLES_DIR, style, "reference.png")


def available_styles() -> list:
    if not os.path.isdir(STYLES_DIR):
        return []
    return sorted(
        d for d in os.listdir(STYLES_DIR)
        if os.path.isfile(style_ref(d))
    )


# codex 0.144.6 起 exec 模式的 image_gen 不再把图落盘到 ~/.codex/generated_images/：
# 图片以 base64 内嵌在 session rollout jsonl 的 image_generation_call 条目里。
# 所以不再让 codex 找文件/存文件（它做不到，老指令会让它空等 90 秒后报失败），
# 改为：codex 只调 image_gen 然后回 DONE，落盘由本脚本从 session 日志提取。
HONESTY_LINE = (
    "【铁律】只调用一次 image_gen。调用成功后直接回复 DONE；调用失败就把工具返回的错误原文"
    "一字不差地输出后退出。不要执行任何 shell 命令、不要查找或保存文件、不要输出图片内容、不要重试。\n"
)

PREAMBLE = (
    "用你自带的图像生成能力(image_gen)生成一张图片。\n"
    + HONESTY_LINE +
    "如果用 -i 附上了图，它们只是画风参考：学习它的笔触、印刷质感和配色方法，不要照抄它的构图和内容。\n\n"
)

EDIT_PREAMBLE = (
    "用你自带的图像生成能力(image_gen)生成一张图片。\n"
    + HONESTY_LINE +
    "我用 -i 附上的第一张图是要修改的原图：按下面的指示修改，未提到的部分严格保持原样。"
    "若还有其它 -i 图，它们是修改时的参考(如角色基准)，不要照抄其版式。\n\n"
)

ASPECT_LINE = (
    "【画幅硬性要求】这张图的宽高比必须是 {aspect}（宽:高），"
    "调用 image_gen 时务必选择与该比例匹配的横向(landscape)/纵向(portrait)/方形尺寸，"
    "构图铺满整个画幅，绝对不要黑边、白边、画框或信箱式留边。\n\n"
)

# 可选的 C2PA 清理脚本(环境变量 STRIP_C2PA 指向它):产物通过校验后自动剥掉 caBX 元数据块(像素不动)。
# 没设或脚本不存在时只警告、不阻断生成。
STRIP_C2PA = os.environ.get("STRIP_C2PA", "")

MIN_BYTES = 8 * 1024   # 小于这个大小的产物视为损坏/占位文件
POLL_SEC = 2           # 轮询目标文件的间隔
ASPECT_TOL = 0.05      # 比例校验容差(5%)


def parse_aspect(s: str) -> float:
    try:
        w, h = s.split(":")
        v = float(w) / float(h)
        if v <= 0:
            raise ValueError
        return v
    except (ValueError, ZeroDivisionError):
        print(f"--aspect 格式应为 宽:高，如 16:9、2.35:1、1:1，收到：{s}", file=sys.stderr)
        sys.exit(4)


def check_aspect(path: str, want: float):
    """返回 (是否合格, 实际比例或 None)。没装 PIL 就跳过校验。"""
    try:
        from PIL import Image
    except ImportError:
        return True, None
    with Image.open(path) as im:
        w, h = im.size
    got = w / h
    return abs(got / want - 1) <= ASPECT_TOL, got


def extract_image_from_sessions(start_ts: float, target: str, token: str = "") -> bool:
    """从本次运行期间更新的 codex session rollout jsonl 里提取 image_gen 产物。

    codex 0.144.6+ 的 exec 模式把生成图以 base64 放在 image_generation_call
    (status=completed) 条目的 result 字段里，不再写文件。取本次运行内最后一次
    完成的调用，解码写入 target。成功返回 True。"""
    root = os.path.join(os.environ.get("CODEX_HOME", os.path.expanduser("~/.codex")),
                        "sessions")
    cands = [f for f in glob.glob(os.path.join(root, "*", "*", "*", "rollout-*.jsonl"))
             if os.path.getmtime(f) >= start_ts - 5]
    result_b64 = None
    for f in sorted(cands, key=os.path.getmtime):
        try:
            if token:
                with open(f, errors="ignore") as fh:
                    if token not in fh.read():
                        continue
            with open(f, errors="ignore") as fh:
                for line in fh:
                    if '"image_gen.generation"' in line:
                        # codex 0.159+：图片写在 generated_images/<thread>/<item id>.png
                        try:
                            ev = json.loads(line).get("payload", {})
                        except json.JSONDecodeError:
                            continue
                        it = ev.get("item", {})
                        if it.get("status") == "completed":
                            png = os.path.join(os.path.dirname(root), "generated_images",
                                               ev.get("thread_id", ""), it.get("id", "") + ".png")
                            if os.path.isfile(png):
                                with open(png, "rb") as src:
                                    result_b64 = base64.b64encode(src.read()).decode()
                        continue
                    if '"image_generation_call"' not in line:
                        continue
                    try:
                        p = json.loads(line).get("payload", {})
                    except json.JSONDecodeError:
                        continue
                    if (p.get("type") == "image_generation_call"
                            and p.get("status") == "completed" and p.get("result")):
                        result_b64 = p["result"]
        except OSError:
            continue
    if not result_b64:
        return False
    try:
        data = base64.b64decode(result_b64)
    except (ValueError, TypeError):
        return False
    with open(target, "wb") as f:
        f.write(data)
    return True


def strip_c2pa(target: str):
    """交付前剥掉产物里的 C2PA(caBX) 元数据块。失败只警告,不影响产物交付。"""
    if not os.path.isfile(STRIP_C2PA):
        print(f"警告:找不到 C2PA 清理脚本 {STRIP_C2PA},产物未剥离元数据。",
              file=sys.stderr)
        return
    r = subprocess.run([sys.executable, STRIP_C2PA, "--in-place", "--no-backup", target],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print(f"警告:C2PA 清理失败(产物仍可用):{r.stderr.strip()[:200]}",
              file=sys.stderr)


def run_codex_once(cmd, full_prompt, target, timeout) -> str:
    """跑一次 codex exec。产出判定看目标文件而不是进程退出：
    文件就位且大小稳定即成功，然后杀掉整个进程组。返回日志尾巴。"""
    logpath = target + ".log"
    with open(logpath, "w") as log:
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=log, stderr=log,
                                text=True, start_new_session=True)
        try:
            proc.stdin.write(full_prompt)
            proc.stdin.close()
        except BrokenPipeError:
            pass
        deadline = time.time() + timeout
        last_size = -1
        while time.time() < deadline:
            if os.path.isfile(target):
                size = os.path.getsize(target)
                if size >= MIN_BYTES and size == last_size:
                    break  # 写完且稳定，不等 codex 自己退出
                last_size = size
            elif proc.poll() is not None:
                break  # codex 退了还没有文件 = 失败
            time.sleep(POLL_SEC)
    if proc.poll() is None:
        try:
            os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
        except (ProcessLookupError, PermissionError):
            proc.kill()
    tail = ""
    try:
        with open(logpath) as f:
            tail = f.read().strip()[-800:]
        os.remove(logpath)
    except OSError:
        pass
    return tail


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("prompt")
    ap.add_argument("--style", default=DEFAULT_STYLE,
                    help=f"用哪个风格包(styles/<style>/)。默认 {DEFAULT_STYLE}")
    ap.add_argument("--aspect", default=None,
                    help="输出宽高比，如 16:9 / 2.35:1 / 1:1。注入画幅硬性要求并校验产物比例")
    ap.add_argument("--ref", action="append", default=[],
                    help="追加参考图(可重复)。锚点图 styles/<style>/reference.png "
                         "默认自动排在第一张，不会被 --ref 顶掉")
    ap.add_argument("--no-anchor", action="store_true",
                    help="不自动喂锚点图。修图时用：把要改的图当第一张 --ref 喂回去")
    ap.add_argument("--out", default=".")
    ap.add_argument("--name", default="illust", help="文件名基底，如 01-topic")
    ap.add_argument("--reasoning", default="low",
                    help="codex 推理强度(low 够用且快；复杂构图可 medium)")
    ap.add_argument("--retries", type=int, default=1)
    ap.add_argument("--timeout", type=int, default=480)
    args = ap.parse_args()

    if which("codex") is None:
        print("找不到 codex CLI。先确认已安装 codex。", file=sys.stderr)
        return 4

    want_aspect = parse_aspect(args.aspect) if args.aspect else None

    default_ref = style_ref(args.style)
    refs = [os.path.abspath(r) for r in args.ref]
    if False:
        anchor = os.path.abspath(default_ref)
        if not os.path.isfile(anchor):
            styles = available_styles()
            hint = ("、".join(styles) if styles else "（styles/ 下还没有风格包）")
            print(f"风格 '{args.style}' 没有锚点图：{default_ref}\n"
                  f"可用风格：{hint}\n"
                  f"用 --style 选一个，或把锚点图放到 styles/{args.style}/reference.png。",
                  file=sys.stderr)
            return 4
        if anchor not in refs:
            refs.insert(0, anchor)
    for r in refs:
        if not os.path.isfile(r):
            print(f"参考图不存在: {r}", file=sys.stderr)
            return 4

    os.makedirs(args.out, exist_ok=True)
    stamp = time.strftime("%Y%m%d-%H%M%S")
    target = os.path.abspath(os.path.join(args.out, f"{args.name}_{stamp}.png"))
    preamble = PREAMBLE
    aspect_line = ASPECT_LINE.format(aspect=args.aspect) if args.aspect else ""
    run_token = f"RUN-{os.getpid()}-{int(time.time()*1000)}"
    full_prompt = preamble + aspect_line + args.prompt + f"\n\n(任务编号 {run_token}，无需理会)"

    cmd = ["codex", "exec", "--dangerously-bypass-approvals-and-sandbox",
           "-c", f"model_reasoning_effort={args.reasoning}"]
    # 默认 provider(sub2api 网关)不提供 image_gen；生图走官方 ChatGPT 登录
    pass  # 走默认网关 sub2api（2026-10-17 起网关能生图）
    for r in refs:
        cmd += ["-i", r]   # prompt 走 stdin：-i 是变长参数，跟在后面的位置参数会被它吞掉

    ref_sums = {file_md5(r) for r in refs}

    last = ""
    wrong_aspect_file = None
    for attempt in range(args.retries + 1):
        start_ts = time.time()
        tail = run_codex_once(cmd, full_prompt, target, args.timeout)
        if not os.path.isfile(target) and extract_image_from_sessions(start_ts, target, run_token):
            tail += "\n(已从 session 日志提取 image_gen 产物)"
        if os.path.isfile(target):
            size = os.path.getsize(target)
            if size < MIN_BYTES:
                tail += f"\n产物过小({size}B)，视为损坏，已删除重试。"
                os.remove(target)
            elif file_md5(target) in ref_sums:
                tail += "\n产物与参考图逐字节相同(codex 抄参考图充数)，已删除重试。"
                os.remove(target)
            elif want_aspect is not None:
                ok, got = check_aspect(target, want_aspect)
                if ok:
                    strip_c2pa(target)
                    print(target)
                    return 0
                wrong_aspect_file = target.replace(".png", "_wrongaspect.png")
                os.replace(target, wrong_aspect_file)
                tail += (f"\n产物比例 {got:.3f} 不符合 --aspect {args.aspect}"
                         f"(目标 {want_aspect:.3f}±5%)，已存为 {wrong_aspect_file}，重试。")
            else:
                strip_c2pa(target)
                print(target)
                return 0
        last = tail.strip()[-800:]
        if attempt < args.retries:
            time.sleep(4 * (attempt + 1))

    if wrong_aspect_file and os.path.isfile(wrong_aspect_file):
        print(f"重试后比例仍不对。产物保留在：{wrong_aspect_file}\n"
              f"可用 export_platform.py 裁切兜底，或改 prompt 重生成。\n"
              f"最后输出片段：\n{last}", file=sys.stderr)
        return 3
    print(f"Codex 未生成目标文件。最后输出片段：\n{last}", file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
