"""Add NEW certificate themes with DISTINCT layouts (not just recolors)."""
from __future__ import annotations

import math
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
THEMES_JS = ROOT / "js" / "themes.js"
SW = ROOT / "sw.js"
W, H = 1280, 794


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def paper_grad(a, b, c, w, h, seed):
    rng = np.random.default_rng(seed)
    aa, bb, cc = map(lambda x: np.array(hex_rgb(x), np.float32), (a, b, c))
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - w * 0.5) / w) ** 2 + ((yy - h * 0.34) / h) ** 2)
    t = np.clip(d * 1.35, 0, 1)[..., None]
    mix = aa * (1 - t) ** 2 + bb * 2 * t * (1 - t) + cc * t**2
    noise = rng.integers(-4, 5, (h, w, 3), dtype=np.int16)
    arr = np.clip(mix + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGB").filter(ImageFilter.GaussianBlur(0.5))


def paste_paper(img, spec, paper_box, radius, seed):
    x0, y0, x1, y1 = paper_box
    pw, ph = x1 - x0, y1 - y0
    paper = paper_grad(spec["paperA"], spec["paperB"], spec["paperC"], pw, ph, seed)
    mask = Image.new("L", (pw, ph), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, pw - 1, ph - 1), radius=radius, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.5))
    img.paste(paper, (x0, y0), mask)
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((x0, y0, x1 - 1, y1 - 1), radius=radius, outline=hex_rgb(spec["frame"]), width=1)
    return img


def base_canvas(spec):
    outer = hex_rgb(spec["outer"])
    img = Image.new("RGB", (W, H), outer)
    rng = np.random.default_rng(spec.get("seed", 1))
    arr = np.array(img, dtype=np.int16)
    noise = rng.integers(-7, 8, arr.shape, dtype=np.int16)
    yy, xx = np.mgrid[0:H, 0:W]
    edge = np.minimum(np.minimum(xx, W - 1 - xx), np.minimum(yy, H - 1 - yy))
    m = (edge < 64).astype(np.float32)[..., None]
    arr = np.clip(arr + noise * m, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def make_frame_overlay(img, paper_box, radius):
    x0, y0, x1, y1 = paper_box
    rgba = img.convert("RGBA")
    alpha = Image.new("L", (W, H), 255)
    ad = ImageDraw.Draw(alpha)
    ad.rounded_rectangle((x0 + 3, y0 + 3, x1 - 4, y1 - 4), radius=max(2, radius - 2), fill=0)
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.0))
    r, g, b, _ = rgba.split()
    return Image.merge("RGBA", (r, g, b, alpha))


# ---------- layout variants ----------

def layout_classic(spec, seed):
    """Round crest + scroll flourishes (existing style)."""
    img = base_canvas(spec)
    draw = ImageDraw.Draw(img)
    frame = hex_rgb(spec["frame"])
    pad, band = 26, 14
    draw.rectangle((pad, pad, W - pad, H - pad), outline=frame, width=band)
    inner = pad + band
    tone = tuple(max(0, min(255, int(c * 0.88 + 10))) for c in hex_rgb(spec["outer"]))
    draw.rectangle((inner, inner, W - inner, H - inner), fill=tone)
    g = inner + 10
    draw.rectangle((g, g, W - g, H - g), outline=frame, width=2)
    draw.rectangle((g + 6, g + 6, W - g - 6, H - g - 6), outline=frame, width=1)
    # flourishes
    for ox, oy, fx, fy in ((g + 4, g + 4, 1, 1), (W - g - 4, g + 4, -1, 1), (g + 4, H - g - 4, 1, -1), (W - g - 4, H - g - 4, -1, -1)):
        for path in _scroll(ox, oy, 1.05, fx, fy):
            draw.line(path, fill=frame, width=3, joint="curve")
    cx, cy, r = W // 2, pad + 16, 44
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=frame, width=3)
    draw.ellipse((cx - r + 7, cy - r + 7, cx + r - 7, cy + r - 7), outline=frame, width=2)
    paper = (int(W * 0.115), int(H * 0.155), int(W * 0.885), int(H * 0.912))
    img = paste_paper(img, spec, paper, int(min(W, H) * 0.04), seed)
    return img, paper, int(min(W, H) * 0.04)


def layout_geometric(spec, seed):
    """Angular corners, diamond crest, stepped border."""
    img = base_canvas(spec)
    draw = ImageDraw.Draw(img)
    frame = hex_rgb(spec["frame"])
    pad = 22
    draw.rectangle((pad, pad, W - pad, H - pad), outline=frame, width=16)
    draw.rectangle((pad + 20, pad + 20, W - pad - 20, H - pad - 20), outline=frame, width=2)
    # stepped corners
    for ox, oy, sx, sy in ((pad + 18, pad + 18, 1, 1), (W - pad - 18, pad + 18, -1, 1), (pad + 18, H - pad - 18, 1, -1), (W - pad - 18, H - pad - 18, -1, -1)):
        pts = [(ox, oy), (ox + 70 * sx, oy), (ox + 70 * sx, oy + 18 * sy), (ox + 18 * sx, oy + 18 * sy), (ox + 18 * sx, oy + 70 * sy), (ox, oy + 70 * sy)]
        draw.line(pts + [pts[0]], fill=frame, width=3)
        draw.polygon([(ox + 28 * sx, oy + 28 * sy), (ox + 40 * sx, oy + 28 * sy), (ox + 34 * sx, oy + 40 * sy)], outline=frame)
    # diamond crest
    cx, cy = W // 2, pad + 28
    d = 36
    draw.polygon([(cx, cy - d), (cx + d, cy), (cx, cy + d), (cx - d, cy)], outline=frame)
    draw.polygon([(cx, cy - d + 10), (cx + d - 10, cy), (cx, cy + d - 10), (cx - d + 10, cy)], outline=frame)
    paper = (int(W * 0.12), int(H * 0.16), int(W * 0.88), int(H * 0.90))
    img = paste_paper(img, spec, paper, 8, seed)
    return img, paper, 8


def layout_ribbon(spec, seed):
    """Top ribbon banner instead of round crest."""
    img = base_canvas(spec)
    draw = ImageDraw.Draw(img)
    frame = hex_rgb(spec["frame"])
    outer = hex_rgb(spec["outer"])
    pad = 28
    draw.rectangle((pad, pad, W - pad, H - pad), outline=frame, width=12)
    draw.rectangle((pad + 16, pad + 16, W - pad - 16, H - pad - 16), outline=frame, width=1)
    # ribbon
    ry = pad + 8
    rw, rh = 320, 52
    rx0 = W // 2 - rw // 2
    draw.rectangle((rx0, ry, rx0 + rw, ry + rh), fill=frame)
    # ribbon tails
    draw.polygon([(rx0, ry), (rx0 - 40, ry + rh // 2), (rx0, ry + rh)], fill=tuple(max(0, c - 30) for c in frame))
    draw.polygon([(rx0 + rw, ry), (rx0 + rw + 40, ry + rh // 2), (rx0 + rw, ry + rh)], fill=tuple(max(0, c - 30) for c in frame))
    # inner ribbon highlight
    draw.rectangle((rx0 + 8, ry + 8, rx0 + rw - 8, ry + rh - 8), outline=outer, width=1)
    # side brackets
    for x in (pad + 40, W - pad - 40):
        draw.line((x, pad + 70, x, H - pad - 40), fill=frame, width=2)
        draw.line((x - 12, pad + 70, x + 12, pad + 70), fill=frame, width=2)
        draw.line((x - 12, H - pad - 40, x + 12, H - pad - 40), fill=frame, width=2)
    paper = (int(W * 0.11), int(H * 0.17), int(W * 0.89), int(H * 0.91))
    img = paste_paper(img, spec, paper, 18, seed)
    return img, paper, 18


def layout_art_deco(spec, seed):
    """Sunburst top + fan corners."""
    img = base_canvas(spec)
    draw = ImageDraw.Draw(img)
    frame = hex_rgb(spec["frame"])
    pad = 24
    draw.rectangle((pad, pad, W - pad, H - pad), outline=frame, width=14)
    draw.rectangle((pad + 18, pad + 18, W - pad - 18, H - pad - 18), outline=frame, width=2)
    # sunburst from top center
    cx, cy = W // 2, pad + 14
    for i in range(-12, 13):
        ang = math.pi / 2 + i * 0.08
        x2 = cx + math.cos(ang) * 120
        y2 = cy + math.sin(ang) * 78
        draw.line((cx, cy + 8, x2, y2), fill=frame, width=2)
    draw.ellipse((cx - 24, cy - 4, cx + 24, cy + 44), outline=frame, width=3)
    draw.ellipse((cx - 10, cy + 10, cx + 10, cy + 30), fill=frame)
    # fan corners with rays
    for ox, oy, sx, sy in (
        (pad + 36, pad + 36, 1, 1),
        (W - pad - 36, pad + 36, -1, 1),
        (pad + 36, H - pad - 36, 1, -1),
        (W - pad - 36, H - pad - 36, -1, -1),
    ):
        for j in range(7):
            t = j / 6
            ang = t * math.pi / 2
            draw.line(
                (
                    ox,
                    oy,
                    ox + int(75 * sx * math.cos(ang)),
                    oy + int(75 * sy * math.sin(ang)),
                ),
                fill=frame,
                width=2,
            )
        draw.arc(
            (ox - 40 if sx > 0 else ox - 40, oy - 40 if sy > 0 else oy - 40, ox + 40, oy + 40),
            0,
            360,
            fill=frame,
            width=2,
        )
    paper = (int(W * 0.13), int(H * 0.18), int(W * 0.87), int(H * 0.90))
    img = paste_paper(img, spec, paper, 4, seed)
    return img, paper, 4


def layout_minimal(spec, seed):
    """Thin elegant lines, tiny corner ticks."""
    img = base_canvas(spec)
    draw = ImageDraw.Draw(img)
    frame = hex_rgb(spec["frame"])
    pad = 36
    draw.rectangle((pad, pad, W - pad, H - pad), outline=frame, width=2)
    draw.rectangle((pad + 10, pad + 10, W - pad - 10, H - pad - 10), outline=frame, width=1)
    # corner ticks
    L = 28
    for ox, oy, sx, sy in ((pad, pad, 1, 1), (W - pad, pad, -1, 1), (pad, H - pad, 1, -1), (W - pad, H - pad, -1, -1)):
        draw.line((ox, oy, ox + L * sx, oy), fill=frame, width=3)
        draw.line((ox, oy, ox, oy + L * sy), fill=frame, width=3)
    # small top mark
    cx = W // 2
    draw.line((cx - 40, pad + 18, cx + 40, pad + 18), fill=frame, width=2)
    draw.ellipse((cx - 5, pad + 12, cx + 5, pad + 22), fill=frame)
    paper = (int(W * 0.10), int(H * 0.12), int(W * 0.90), int(H * 0.90))
    img = paste_paper(img, spec, paper, 2, seed)
    return img, paper, 2


def layout_oval_baroque(spec, seed):
    """Oval crest + denser corner vines."""
    img = base_canvas(spec)
    draw = ImageDraw.Draw(img)
    frame = hex_rgb(spec["frame"])
    pad, band = 20, 18
    draw.rectangle((pad, pad, W - pad, H - pad), outline=frame, width=band)
    g = pad + band + 8
    draw.rectangle((g, g, W - g, H - g), outline=frame, width=2)
    # dense vines
    for ox, oy, fx, fy in ((g, g, 1, 1), (W - g, g, -1, 1), (g, H - g, 1, -1), (W - g, H - g, -1, -1)):
        for path in _scroll(ox, oy, 1.25, fx, fy):
            draw.line(path, fill=frame, width=2, joint="curve")
        for path in _scroll(ox + 20 * fx, oy + 14 * fy, 0.75, fx, fy):
            draw.line(path, fill=frame, width=2, joint="curve")
    # oval crest
    cx, cy = W // 2, pad + 22
    draw.ellipse((cx - 58, cy - 34, cx + 58, cy + 34), outline=frame, width=3)
    draw.ellipse((cx - 48, cy - 26, cx + 48, cy + 26), outline=frame, width=2)
    draw.ellipse((cx - 6, cy - 6, cx + 6, cy + 6), fill=frame)
    paper = (int(W * 0.12), int(H * 0.165), int(W * 0.88), int(H * 0.905))
    img = paste_paper(img, spec, paper, 28, seed)
    return img, paper, 28


def layout_star_border(spec, seed):
    """Islamic-inspired geometric stars along border."""
    img = base_canvas(spec)
    draw = ImageDraw.Draw(img)
    frame = hex_rgb(spec["frame"])
    pad = 30
    draw.rectangle((pad, pad, W - pad, H - pad), outline=frame, width=10)
    draw.rectangle((pad + 14, pad + 14, W - pad - 14, H - pad - 14), outline=frame, width=1)

    def star(cx, cy, r, n=8):
        pts = []
        for i in range(n * 2):
            ang = -math.pi / 2 + i * math.pi / n
            rr = r if i % 2 == 0 else r * 0.45
            pts.append((cx + rr * math.cos(ang), cy + rr * math.sin(ang)))
        draw.polygon(pts, outline=frame)

    # stars along edges
    for x in range(pad + 50, W - pad - 40, 90):
        star(x, pad + 28, 14)
        star(x, H - pad - 28, 14)
    for y in range(pad + 80, H - pad - 70, 90):
        star(pad + 28, y, 14)
        star(W - pad - 28, y, 14)
    # center top large star
    star(W // 2, pad + 36, 26, 8)
    paper = (int(W * 0.125), int(H * 0.155), int(W * 0.875), int(H * 0.90))
    img = paste_paper(img, spec, paper, 12, seed)
    return img, paper, 12


def layout_double_medallion(spec, seed):
    """Two side medallions + top line ornament."""
    img = base_canvas(spec)
    draw = ImageDraw.Draw(img)
    frame = hex_rgb(spec["frame"])
    pad = 26
    draw.rectangle((pad, pad, W - pad, H - pad), outline=frame, width=13)
    draw.rectangle((pad + 18, pad + 18, W - pad - 18, H - pad - 18), outline=frame, width=2)
    # top ornamental line
    y = pad + 36
    draw.line((pad + 80, y, W // 2 - 50, y), fill=frame, width=2)
    draw.line((W // 2 + 50, y, W - pad - 80, y), fill=frame, width=2)
    draw.ellipse((W // 2 - 28, y - 28, W // 2 + 28, y + 28), outline=frame, width=3)
    draw.ellipse((W // 2 - 10, y - 10, W // 2 + 10, y + 10), fill=frame)
    # side medallions mid-height
    for cx in (pad + 55, W - pad - 55):
        cy = H // 2
        draw.ellipse((cx - 32, cy - 32, cx + 32, cy + 32), outline=frame, width=3)
        draw.ellipse((cx - 22, cy - 22, cx + 22, cy + 22), outline=frame, width=1)
        for i in range(8):
            ang = i * math.pi / 4
            draw.line((cx + 12 * math.cos(ang), cy + 12 * math.sin(ang), cx + 28 * math.cos(ang), cy + 28 * math.sin(ang)), fill=frame, width=1)
    paper = (int(W * 0.14), int(H * 0.14), int(W * 0.86), int(H * 0.90))
    img = paste_paper(img, spec, paper, 20, seed)
    return img, paper, 20


def _scroll(ox, oy, scale, fx, fy):
    def pt(x, y):
        return (ox + int(x * scale * fx), oy + int(y * scale * fy))

    curves = []
    main = []
    for i in range(28):
        t = i / 27
        main.append(pt(6 + t * 95, 96 - 70 * math.sin(t * math.pi * 0.85) - t * 14))
    curves.append(main)
    sec = []
    for i in range(20):
        t = i / 19
        sec.append(pt(12 + t * 55, 72 - 38 * math.sin(t * math.pi)))
    curves.append(sec)
    return curves


LAYOUTS = {
    "classic": layout_classic,
    "geometric": layout_geometric,
    "ribbon": layout_ribbon,
    "art-deco": layout_art_deco,
    "minimal": layout_minimal,
    "oval-baroque": layout_oval_baroque,
    "star-border": layout_star_border,
    "double-medallion": layout_double_medallion,
}


NEW_THEMES = [
    {
        "id": "obsidian-geometric",
        "name": "ابسیدین هندسی",
        "nameEn": "Obsidian Geometric",
        "layout": "geometric",
        "outer": "#12141a",
        "frame": "#d4af37",
        "paperA": "#fffcf5",
        "paperB": "#f3ebd8",
        "paperC": "#e2d4b4",
        "preferredFont": "modern",
        "seed": 101,
    },
    {
        "id": "crimson-ribbon",
        "name": "کریمسون روبان",
        "nameEn": "Crimson Ribbon",
        "layout": "ribbon",
        "outer": "#6b1423",
        "frame": "#e8c47c",
        "paperA": "#fff8f6",
        "paperB": "#f6e4df",
        "paperC": "#e8cbc3",
        "preferredFont": "playfair",
        "seed": 102,
    },
    {
        "id": "azure-deco",
        "name": "آبی آرت‌دکو",
        "nameEn": "Azure Art Deco",
        "layout": "art-deco",
        "outer": "#133a5c",
        "frame": "#c9b27a",
        "paperA": "#f7fbff",
        "paperB": "#e6eef6",
        "paperC": "#cfdceb",
        "preferredFont": "modern",
        "seed": 103,
    },
    {
        "id": "pearl-minimal",
        "name": "مروارید مینیمال",
        "nameEn": "Pearl Minimal",
        "layout": "minimal",
        "outer": "#3d4450",
        "frame": "#b8c0cc",
        "paperA": "#ffffff",
        "paperB": "#f2f4f7",
        "paperC": "#e3e7ed",
        "preferredFont": "modern",
        "seed": 104,
    },
    {
        "id": "amber-baroque",
        "name": "کهربایی باروک",
        "nameEn": "Amber Baroque",
        "layout": "oval-baroque",
        "outer": "#4a2c0a",
        "frame": "#e0a84a",
        "paperA": "#fffaf0",
        "paperB": "#f5e6c8",
        "paperC": "#e6cfa0",
        "preferredFont": "classic",
        "seed": 105,
    },
    {
        "id": "jade-star",
        "name": "یشم ستاره‌ای",
        "nameEn": "Jade Star Geometry",
        "layout": "star-border",
        "outer": "#0d3b2e",
        "frame": "#c6a96a",
        "paperA": "#f8fcf8",
        "paperB": "#e6f0e6",
        "paperC": "#cfe0cf",
        "preferredFont": "persian-elegant",
        "preferredDir": "rtl",
        "preferredLang": "fa",
        "seed": 106,
    },
    {
        "id": "violet-medallion",
        "name": "بنفش مدالیون",
        "nameEn": "Violet Twin Medallion",
        "layout": "double-medallion",
        "outer": "#2e1a45",
        "frame": "#d4b48a",
        "paperA": "#fbf7ff",
        "paperB": "#efe6f7",
        "paperC": "#dccfe8",
        "preferredFont": "playfair",
        "seed": 107,
    },
    {
        "id": "graphite-deco",
        "name": "گرافیت دکو",
        "nameEn": "Graphite Deco",
        "layout": "art-deco",
        "outer": "#2a2e33",
        "frame": "#a8b0b8",
        "paperA": "#fafbfc",
        "paperB": "#ebeef1",
        "paperC": "#d6dce3",
        "preferredFont": "modern",
        "seed": 108,
    },
]


def style_from(spec: dict) -> dict:
    return {
        "outerBg": spec["outer"],
        "frameColor": spec["frame"],
        "paperStart": spec["paperA"],
        "paperMid": spec["paperB"],
        "paperEnd": spec["paperC"],
        "accent": spec["frame"],
        "titleColor": spec["outer"],
        "inkColor": "#3a3a3a",
        "mutedColor": "#6a6a6a",
        "courseDateColor": spec["frame"],
        "borderInnerColor": spec["frame"],
        "borderInnerWidth": 1.5,
        "outerPad": 18,
        "framePad": 5,
        "qrBorderColor": spec["frame"],
        "signatureColor": spec["outer"],
        "flourishColor": spec["frame"],
    }


def emit_entry(spec: dict) -> str:
    st = style_from(spec)
    lines = [
        "  {",
        f'    id: "{spec["id"]}",',
        f'    name: "{spec["name"]}",',
        f'    nameEn: "{spec["nameEn"]}",',
        f'    preview: "./assets/theme-{spec["id"]}.png",',
        f'    frame: "./assets/theme-frame-{spec["id"]}.png",',
        f'    preferredLang: "{spec.get("preferredLang", "en")}",',
        f'    preferredFont: "{spec.get("preferredFont", "classic")}",',
        f'    preferredDir: "{spec.get("preferredDir", "ltr")}",',
        "    style: {",
    ]
    items = list(st.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        if isinstance(v, str):
            lines.append(f'      {k}: "{v}"{comma}')
        else:
            lines.append(f"      {k}: {v}{comma}")
    lines.append("    }")
    lines.append("  }")
    return "\n".join(lines)


def append_to_themes_js(specs: list[dict]) -> None:
    text = THEMES_JS.read_text(encoding="utf-8")
    start = text.find("const CERT_THEMES")
    if start < 0:
        raise RuntimeError("CERT_THEMES missing")
    end = text.find("\n];", start)
    if end < 0:
        raise RuntimeError("CERT_THEMES end missing")
    # avoid duplicate ids
    specs = [s for s in specs if f'id: "{s["id"]}"' not in text]
    if not specs:
        print("all new themes already in themes.js")
        return
    block = ",\n" + ",\n".join(emit_entry(s) for s in specs)
    THEMES_JS.write_text(text[:end] + block + text[end:], encoding="utf-8")


def update_sw(ids: list[str]) -> None:
    text = SW.read_text(encoding="utf-8")
    text = re.sub(r"certificate-studio-v\d+", "certificate-studio-v24", text, count=1)
    extras = []
    for i in ids:
        p = f'  "./assets/theme-{i}.png",'
        f = f'  "./assets/theme-frame-{i}.png",'
        if p not in text:
            extras.append(p)
        if f not in text:
            extras.append(f)
    if extras:
        needle = '"./assets/theme-frame-burgundy-atelier.png",'
        if needle in text:
            text = text.replace(needle, needle + "\n" + "\n".join(extras))
        else:
            # append before ASSETS closing
            text = text.replace("];", ",\n" + ",\n".join(extras) + "\n];", 1)
    SW.write_text(text, encoding="utf-8")


def main():
    for i, spec in enumerate(NEW_THEMES):
        layout_fn = LAYOUTS[spec["layout"]]
        img, paper_box, radius = layout_fn(spec, spec["seed"])
        framed = make_frame_overlay(img, paper_box, radius)
        img.save(ASSETS / f"theme-{spec['id']}.png", "PNG", optimize=True)
        framed.save(ASSETS / f"theme-frame-{spec['id']}.png", "PNG", optimize=True)
        print("wrote", spec["id"], "layout=", spec["layout"])

    append_to_themes_js(NEW_THEMES)
    update_sw([s["id"] for s in NEW_THEMES])
    print("added", len(NEW_THEMES), "new layout themes")


if __name__ == "__main__":
    main()
