"""Few mono industry themes: ONE continuous color field (no light center panel).

Difference = silhouette of ornaments / structure only.
Fixes themes.js registration.
"""
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
APP_JS = ROOT / "js" / "app.js"
W, H = 1280, 794


def hex_rgb(h):
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def rgb_hex(rgb):
    return "#{:02x}{:02x}{:02x}".format(*[max(0, min(255, int(c))) for c in rgb])


def mix(a, b, t):
    return tuple(int(a[i] * (1 - t) + b[i] * t) for i in range(3))


def shade(rgb, f):
    if f >= 1:
        return mix(rgb, (255, 255, 255), min(1.0, f - 1))
    return tuple(max(0, min(255, int(c * f))) for c in rgb)


def unified_field(base, seed):
    """Single mono surface — tiny grain, NO light center panel."""
    rng = np.random.default_rng(seed)
    # slight edge darkening only (same hue), never a bright middle box
    mid = np.array(shade(base, 1.08), np.float32)
    edge = np.array(shade(base, 0.92), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx - W / 2) / (W * 0.55)) ** 2 + ((yy - H / 2) / (H * 0.55)) ** 2)
    t = np.clip((d - 0.55) / 0.55, 0, 1)[..., None]
    arr = mid * (1 - t) + edge * t
    noise = rng.integers(-3, 4, (H, W, 3), dtype=np.int16)
    return Image.fromarray(np.clip(arr + noise, 0, 255).astype(np.uint8), "RGB")


def ink(base):
    return shade(base, 0.32)


def deep(base):
    return shade(base, 0.55)


# ─── MEDICAL: ECG waves as the frame itself (no inner panel) ────────────────
def layout_clinic(base, seed):
    img = unified_field(base, seed)
    d = ImageDraw.Draw(img)
    k = ink(base)

    # double rounded outer
    d.rounded_rectangle((20, 20, W - 21, H - 21), radius=36, outline=k, width=8)
    d.rounded_rectangle((40, 40, W - 41, H - 41), radius=28, outline=k, width=2)

    # ECG as continuous frame path (top + bottom thick ornaments)
    def wave_band(y0, amp=28):
        pts = []
        x = 70
        while x < W - 70:
            pts += [
                (x, y0),
                (x + 14, y0),
                (x + 22, y0 - amp),
                (x + 30, y0 + amp // 2),
                (x + 38, y0),
                (x + 58, y0),
            ]
            x += 64
        d.line(pts, fill=k, width=3)

    wave_band(58, 22)
    wave_band(H - 58, 22)

    # side serpentine staffs
    for x in (60, W - 60):
        pts = []
        for i in range(24):
            yy = 100 + i * 24
            pts.append((x + (14 if i % 2 == 0 else -14), yy))
        d.line(pts, fill=k, width=3, joint="curve")
        d.ellipse((x - 12, 88, x + 12, 112), outline=k, width=2)

    # cross medallion
    cx, cy = W // 2, 86
    d.ellipse((cx - 44, cy - 44, cx + 44, cy + 44), outline=k, width=3)
    d.ellipse((cx - 34, cy - 34, cx + 34, cy + 34), outline=k, width=1)
    d.rectangle((cx - 9, cy - 28, cx + 9, cy + 28), fill=k)
    d.rectangle((cx - 28, cy - 9, cx + 28, cy + 9), fill=k)
    return img


# ─── BEAUTY: petal ring + soft oval stroke only ─────────────────────────────
def layout_beauty(base, seed):
    img = unified_field(base, seed)
    d = ImageDraw.Draw(img)
    k = ink(base)

    # large petal flowers in corners
    def flower(cx, cy, r=50):
        for i in range(8):
            a = i * math.pi / 4
            px = cx + r * 0.7 * math.cos(a)
            py = cy + r * 0.55 * math.sin(a)
            d.ellipse((px - r * 0.35, py - r * 0.25, px + r * 0.35, py + r * 0.25), outline=k, width=2)
        d.ellipse((cx - 12, cy - 12, cx + 12, cy + 12), fill=k)

    flower(90, 90, 48)
    flower(W - 90, 90, 48)
    flower(90, H - 90, 48)
    flower(W - 90, H - 90, 48)

    # concentric soft ovals (frame), no fill panel
    for i, w in enumerate((6, 2, 1)):
        inset = 28 + i * 16
        d.ellipse((inset, inset - 4, W - inset, H - inset + 4), outline=k, width=w)

    # dashed oval between
    for i in range(0, 360, 8):
        a = math.radians(i)
        if (i // 8) % 2:
            continue
        x1 = W / 2 + (W * 0.42) * math.cos(a)
        y1 = H / 2 + (H * 0.40) * math.sin(a)
        x2 = W / 2 + (W * 0.45) * math.cos(a)
        y2 = H / 2 + (H * 0.43) * math.sin(a)
        d.line((x1, y1, x2, y2), fill=k, width=2)

    # crest flower
    flower(W // 2, 78, 36)
    return img


# ─── TECH: full hex mesh + corner circuit hubs + chip (no center plate) ─────
def layout_tech(base, seed):
    img = unified_field(base, seed)
    d = ImageDraw.Draw(img)
    k = ink(base)

    def hexagon(cx, cy, r):
        pts = [(cx + r * math.cos(math.pi / 6 + i * math.pi / 3), cy + r * math.sin(math.pi / 6 + i * math.pi / 3)) for i in range(6)]
        d.polygon(pts, outline=k)

    # sparse mesh (not dense noise) — structural identity
    for y in range(40, H - 20, 52):
        off = 26 if (y // 52) % 2 else 0
        for x in range(40 + off, W - 20, 60):
            hexagon(x, y, 18)

    # bold outer angular frame (octagon-ish)
    m = 28
    oct_pts = [
        (m + 40, m), (W - m - 40, m), (W - m, m + 40), (W - m, H - m - 40),
        (W - m - 40, H - m), (m + 40, H - m), (m, H - m - 40), (m, m + 40),
    ]
    d.line(oct_pts + [oct_pts[0]], fill=k, width=7)

    # circuit hubs in corners
    for ox, oy, sx, sy in ((70, 70, 1, 1), (W - 70, 70, -1, 1), (70, H - 70, 1, -1), (W - 70, H - 70, -1, -1)):
        d.rectangle((ox - 10, oy - 10, ox + 10, oy + 10), outline=k, width=2)
        d.line((ox, oy, ox + 70 * sx, oy), fill=k, width=2)
        d.line((ox, oy, ox, oy + 70 * sy), fill=k, width=2)
        d.ellipse((ox + 60 * sx - 6, oy - 6, ox + 60 * sx + 6, oy + 6), outline=k, width=2)
        d.ellipse((ox - 6, oy + 60 * sy - 6, ox + 6, oy + 60 * sy + 6), outline=k, width=2)

    # chip crest
    cx, cy = W // 2, 70
    d.rounded_rectangle((cx - 55, cy - 24, cx + 55, cy + 24), radius=3, outline=k, width=3)
    d.rectangle((cx - 38, cy - 12, cx + 38, cy + 12), fill=k)
    for i in range(-4, 5):
        d.line((cx + i * 10, cy - 24, cx + i * 10, cy - 38), fill=k, width=2)
        d.line((cx + i * 10, cy + 24, cx + i * 10, cy + 38), fill=k, width=2)
    return img


# ─── INDUSTRIAL: only L-plates + rivets + gear — open center ────────────────
def layout_industrial(base, seed):
    img = unified_field(base, seed)
    d = ImageDraw.Draw(img)
    k = ink(base)
    plate = deep(base)

    d.rectangle((16, 16, W - 17, H - 17), outline=k, width=8)

    arm, thick = 180, 42
    for ox, oy, sx, sy in ((24, 24, 1, 1), (W - 24, 24, -1, 1), (24, H - 24, 1, -1), (W - 24, H - 24, -1, -1)):
        x0, x1 = sorted((ox, ox + arm * sx))
        ya0, ya1 = sorted((oy, oy + thick * sy))
        xb0, xb1 = sorted((ox, ox + thick * sx))
        yb0, yb1 = sorted((oy, oy + arm * sy))
        d.rectangle((x0, ya0, x1, ya1), fill=plate)
        d.rectangle((xb0, yb0, xb1, yb1), fill=plate)
        d.rectangle((x0, ya0, x1, ya1), outline=k, width=2)
        d.rectangle((xb0, yb0, xb1, yb1), outline=k, width=2)
        for t in (0.15, 0.45, 0.75):
            rx, ry = ox + int(arm * sx * t), oy + int(thick * sy * 0.5)
            d.ellipse((rx - 6, ry - 6, rx + 6, ry + 6), outline=k, width=2)
            d.ellipse((rx - 2, ry - 2, rx + 2, ry + 2), fill=k)
            rx2, ry2 = ox + int(thick * sx * 0.5), oy + int(arm * sy * t)
            d.ellipse((rx2 - 6, ry2 - 6, rx2 + 6, ry2 + 6), outline=k, width=2)

    # hazard only near corners
    for i in range(10):
        d.line((40 + i * 9, 70, 70, 40 + i * 9), fill=k, width=2)
        d.line((W - 40 - i * 9, H - 70, W - 70, H - 40 - i * 9), fill=k, width=2)

    cx, cy, r = W // 2, 78, 38
    for i in range(12):
        a = i * math.pi / 6
        d.line((cx + (r - 2) * math.cos(a), cy + (r - 2) * math.sin(a), cx + (r + 14) * math.cos(a), cy + (r + 14) * math.sin(a)), fill=k, width=7)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=k, width=4)
    d.ellipse((cx - 14, cy - 14, cx + 14, cy + 14), fill=k)
    return img


# ─── ART: splash & brush strokes as the whole border language ───────────────
def layout_art(base, seed):
    img = unified_field(base, seed)
    d = ImageDraw.Draw(img)
    k = ink(base)
    rng = np.random.default_rng(seed)

    # brush stroke frame (wavy)
    for side in range(4):
        pts = []
        if side == 0:
            for x in range(24, W - 24, 5):
                pts.append((x, 28 + int(14 * math.sin(x * 0.04))))
        elif side == 1:
            for y in range(24, H - 24, 5):
                pts.append((W - 28 + int(14 * math.sin(y * 0.045)), y))
        elif side == 2:
            for x in range(W - 24, 24, -5):
                pts.append((x, H - 28 + int(14 * math.sin(x * 0.04 + 1))))
        else:
            for y in range(H - 24, 24, -5):
                pts.append((24 + int(14 * math.sin(y * 0.045 + 2)), y))
        d.line(pts, fill=k, width=12, joint="curve")

    # paint splatters near edges only
    for _ in range(90):
        x = int(rng.integers(20, W - 20))
        y = int(rng.integers(20, H - 20))
        if 160 < x < W - 160 and 130 < y < H - 130:
            continue
        r = int(rng.integers(4, 18))
        d.ellipse((x - r, y - r, x + r, y + r), fill=k)

    # big brush swipes in corners
    for ox, oy, sx, sy in ((80, 100, 1, 1), (W - 80, 100, -1, 1), (80, H - 100, 1, -1), (W - 80, H - 100, -1, -1)):
        pts = [(ox, oy)]
        for i in range(1, 18):
            t = i / 17
            pts.append((ox + int(120 * sx * t), oy + int(sy * 18 * math.sin(t * math.pi * 2))))
        d.line(pts, fill=k, width=6, joint="curve")

    # palette crest
    cx, cy = W // 2, 80
    d.ellipse((cx - 48, cy - 30, cx + 48, cy + 34), outline=k, width=3)
    d.ellipse((cx + 30, cy - 6, cx + 52, cy + 18), fill=shade(base, 1.08))
    d.ellipse((cx + 32, cy - 4, cx + 50, cy + 16), outline=k, width=2)
    for dx, dy in ((-20, -8), (-2, -14), (16, -8), (-12, 14), (10, 16), (24, 6)):
        d.ellipse((cx + dx - 7, cy + dy - 7, cx + dx + 7, cy + dy + 7), fill=k)
    return img


# ─── MUSIC: piano side walls + staff — center stays same color ──────────────
def layout_music(base, seed):
    img = unified_field(base, seed)
    d = ImageDraw.Draw(img)
    k = ink(base)
    side = deep(base)

    kw = 78
    for x0 in (0, W - kw):
        d.rectangle((x0, 0, x0 + kw, H), fill=side)
        y, i = 0, 0
        while y < H:
            d.rectangle((x0 + 5, y + 2, x0 + kw - 5, y + 34), outline=k, width=1)
            if i % 3 != 1:
                d.rectangle((x0 + 12, y + 4, x0 + kw - 24, y + 22), fill=k)
            y += 36
            i += 1

    # staves across top & bottom between pianos
    for by in (36, H - 70):
        for i in range(5):
            d.line((kw + 16, by + i * 9, W - kw - 16, by + i * 9), fill=k, width=2)
        d.arc((kw + 24, by - 8, kw + 60, by + 48), 200, 500, fill=k, width=3)
        # notes on staff
        for nx in range(kw + 120, W - kw - 80, 140):
            d.ellipse((nx, by + 20, nx + 16, by + 34), fill=k)
            d.line((nx + 14, by + 26, nx + 14, by - 4), fill=k, width=2)

    # big notes crest
    cx, cy = W // 2, 100
    d.ellipse((cx - 20, cy + 4, cx + 4, cy + 26), fill=k)
    d.ellipse((cx + 14, cy - 2, cx + 38, cy + 20), fill=k)
    d.line((cx + 2, cy + 10, cx + 2, cy - 34), fill=k, width=4)
    d.line((cx + 36, cy + 4, cx + 36, cy - 40), fill=k, width=4)
    d.polygon([(cx + 2, cy - 34), (cx + 36, cy - 40), (cx + 36, cy - 30), (cx + 2, cy - 24)], fill=k)
    return img


# ─── PHOTO: film strip IS the canvas edge; gate = same color open area ──────
def layout_photo(base, seed):
    # film base slightly deeper, gate same unified mid — no white
    img = Image.new("RGB", (W, H), deep(base))
    d = ImageDraw.Draw(img)
    k = ink(base)
    mid = shade(base, 1.08)

    # sprockets
    hole = shade(base, 1.2)
    for y in (10, H - 42):
        for x in range(28, W - 20, 46):
            d.rounded_rectangle((x, y, x + 22, y + 30), radius=4, fill=hole)
            d.rounded_rectangle((x, y, x + 22, y + 30), radius=4, outline=k, width=1)
    for x in (10, W - 34):
        for y in range(55, H - 55, 40):
            d.rounded_rectangle((x, y, x + 22, y + 22), radius=3, fill=hole)
            d.rounded_rectangle((x, y, x + 22, y + 22), radius=3, outline=k, width=1)

    # open gate — SAME mono mid as other themes (not white)
    d.rounded_rectangle((48, 55, W - 49, H - 56), radius=6, fill=mid)
    d.rounded_rectangle((48, 55, W - 49, H - 56), radius=6, outline=k, width=4)

    # grain on gate to match field
    rng = np.random.default_rng(seed)
    arr = np.array(img, dtype=np.int16)
    noise = rng.integers(-3, 4, arr.shape, dtype=np.int16)
    # only inside gate roughly
    arr[55:H - 56, 48:W - 49] = np.clip(arr[55:H - 56, 48:W - 49] + noise[55:H - 56, 48:W - 49], 0, 255)
    img = Image.fromarray(arr.astype(np.uint8), "RGB")
    d = ImageDraw.Draw(img)

    # viewfinder corners
    for ox, oy, sx, sy in ((70, 75, 1, 1), (W - 70, 75, -1, 1), (70, H - 75, 1, -1), (W - 70, H - 75, -1, -1)):
        d.line((ox, oy, ox + 48 * sx, oy), fill=k, width=4)
        d.line((ox, oy, ox, oy + 48 * sy), fill=k, width=4)

    # aperture on top strip
    cx, cy, r = W // 2, 32, 18
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=k, width=2)
    for i in range(6):
        a = i * math.pi / 3
        d.polygon(
            [
                (cx, cy),
                (cx + r * 0.85 * math.cos(a), cy + r * 0.85 * math.sin(a)),
                (cx + r * 0.85 * math.cos(a + 0.45), cy + r * 0.85 * math.sin(a + 0.45)),
            ],
            outline=k,
        )
    return img


# ─── LEGAL: classical temple line-art on open field ─────────────────────────
def layout_legal(base, seed):
    img = unified_field(base, seed)
    d = ImageDraw.Draw(img)
    k = ink(base)

    d.rectangle((22, 22, W - 23, H - 23), outline=k, width=5)

    # pediment spanning top (structure, not a panel)
    d.polygon([(90, 150), (W // 2, 40), (W - 90, 150)], outline=k)
    d.line([(90, 150), (W - 90, 150)], fill=k, width=4)
    for x in range(110, W - 110, 14):
        d.rectangle((x, 152, x + 8, 164), fill=k)

    # tall columns
    for x in (85, W - 85):
        d.rectangle((x - 18, 170, x + 18, H - 70), outline=k, width=3)
        for yy in range(185, H - 80, 26):
            d.line((x - 16, yy, x + 16, yy), fill=k, width=1)
        d.rectangle((x - 28, 160, x + 28, 174), outline=k, width=2)
        d.rectangle((x - 28, H - 72, x + 28, H - 58), outline=k, width=2)

    # base steps
    for i in range(3):
        inset = 50 + i * 18
        d.line([(inset, H - 50 + i * 10), (W - inset, H - 50 + i * 10)], fill=k, width=3)

    # scales in pediment
    cx, cy = W // 2, 100
    d.line((cx, cy - 24, cx, cy + 16), fill=k, width=3)
    d.line((cx - 46, cy - 8, cx + 46, cy - 8), fill=k, width=2)
    d.polygon([(cx - 7, cy - 24), (cx + 7, cy - 24), (cx, cy - 36)], fill=k)
    for sx in (-34, 34):
        d.line((cx + sx, cy - 8, cx + sx, cy + 6), fill=k, width=2)
        d.arc((cx + sx - 16, cy + 2, cx + sx + 16, cy + 22), 0, 180, fill=k, width=2)
    return img


THEMES = [
    {"id": "clinic-care", "name": "کلینیک و پزشکی", "nameEn": "Clinic & Medical", "fn": layout_clinic, "base": "#1a5c5c", "cat": "medical", "seed": 501},
    {"id": "beauty-glow", "name": "زیبایی و آرایش", "nameEn": "Beauty & Spa", "fn": layout_beauty, "base": "#8a3d55", "cat": "beauty", "seed": 502},
    {"id": "tech-circuit", "name": "فناوری و نرم‌افزار", "nameEn": "Tech & Software", "fn": layout_tech, "base": "#1e3a5f", "cat": "tech", "seed": 503},
    {"id": "industrial-forge", "name": "صنعت و تولید", "nameEn": "Industrial", "fn": layout_industrial, "base": "#4a4538", "cat": "industrial", "seed": 504},
    {"id": "atelier-paint", "name": "هنر و نقاشی", "nameEn": "Art Studio", "fn": layout_art, "base": "#4a3560", "cat": "arts", "seed": 505},
    {"id": "music-stage", "name": "موسیقی و اجرا", "nameEn": "Music Stage", "fn": layout_music, "base": "#2c2a4a", "cat": "arts", "seed": 506},
    {"id": "photo-studio", "name": "عکاسی و تصویر", "nameEn": "Photo Studio", "fn": layout_photo, "base": "#2a2a2a", "cat": "arts", "seed": 507},
    {"id": "legal-brief", "name": "حقوق و وکالت", "nameEn": "Legal Hall", "fn": layout_legal, "base": "#1c2b4a", "cat": "business", "seed": 508},
]


def style_of(base_hex):
    base = hex_rgb(base_hex)
    k = shade(base, 0.4)
    # paper colors ≈ outer (unified) — slight tint only for CSS fallbacks
    return {
        "outerBg": base_hex,
        "frameColor": rgb_hex(k),
        "paperStart": rgb_hex(shade(base, 1.1)),
        "paperMid": rgb_hex(shade(base, 1.05)),
        "paperEnd": rgb_hex(shade(base, 0.95)),
        "accent": rgb_hex(k),
        "titleColor": rgb_hex(shade(base, 0.22)),
        "inkColor": rgb_hex(shade(base, 0.18)),
        "mutedColor": rgb_hex(shade(base, 0.35)),
        "courseDateColor": rgb_hex(k),
        "borderInnerColor": rgb_hex(k),
        "borderInnerWidth": 1.5,
        "outerPad": 18,
        "framePad": 5,
        "qrBorderColor": rgb_hex(k),
        "signatureColor": rgb_hex(k),
        "flourishColor": rgb_hex(k),
    }


def emit(spec):
    st = style_of(spec["base"])
    lines = [
        "  {",
        f'    id: "{spec["id"]}",',
        f'    name: "{spec["name"]}",',
        f'    nameEn: "{spec["nameEn"]}",',
        f'    preview: "./assets/theme-{spec["id"]}.png",',
        f'    frame: "./assets/theme-frame-{spec["id"]}.png",',
        f'    category: "{spec["cat"]}",',
        "    mono: true,",
        '    preferredLang: "en",',
        '    preferredFont: "classic",',
        '    preferredDir: "ltr",',
        "    style: {",
    ]
    items = list(st.items())
    for i, (k, v) in enumerate(items):
        c = "," if i < len(items) - 1 else ""
        lines.append(f'      {k}: "{v}"{c}' if isinstance(v, str) else f"      {k}: {v}{c}")
    lines += ["    }", "  }"]
    return "\n".join(lines)


def frame_overlay(img):
    """Ornaments-only frame: punch soft center transparency for optional overlay use."""
    rgba = img.convert("RGBA")
    alpha = Image.new("L", (W, H), 255)
    ImageDraw.Draw(alpha).ellipse((int(W * 0.14), int(H * 0.16), int(W * 0.86), int(H * 0.88)), fill=0)
    alpha = alpha.filter(ImageFilter.GaussianBlur(2))
    r, g, b, _ = rgba.split()
    return Image.merge("RGBA", (r, g, b, alpha))


def repair_js(specs):
    text = THEMES_JS.read_text(encoding="utf-8")
    for tid in [
        "clinic-care", "beauty-glow", "tech-circuit", "industrial-forge",
        "atelier-paint", "music-stage", "culinary-chef", "legal-brief",
        "fitness-pulse", "photo-studio", "architect-line", "edu-scholar",
    ]:
        text = re.sub(rf',\s*\{{\s*id:\s*"{tid}"[\s\S]*?\n  \}}', "", text)
        text = re.sub(rf'\s*\{{\s*id:\s*"{tid}"[\s\S]*?\n  \}}\s*,?', "", text)
    text = re.sub(r"},\s*,+", "},", text)
    text = re.sub(r",\s*,+", ",", text)
    text = re.sub(r",\s*\n\];", "\n];", text)

    start = text.find("const CERT_THEMES")
    end = text.find("\n];", start)
    before = text[:end].rstrip()
    if not before.endswith(","):
        before += ","
    block = "\n" + ",\n".join(emit(s) for s in specs)
    THEMES_JS.write_text(before + block + "\n];" + text[end + 3 :], encoding="utf-8")


def bump_cache(ids):
    sw = SW.read_text(encoding="utf-8")
    sw = re.sub(r"certificate-studio-v\d+", "certificate-studio-v28", sw, count=1)
    for gone in ("culinary-chef", "fitness-pulse", "architect-line", "edu-scholar"):
        sw = re.sub(rf'\s*"./assets/theme-{gone}\.png",', "", sw)
        sw = re.sub(rf'\s*"./assets/theme-frame-{gone}\.png",', "", sw)
    for i in ids:
        for p in (f'  "./assets/theme-{i}.png",', f'  "./assets/theme-frame-{i}.png",'):
            if p not in sw:
                m = list(re.finditer(r'"./assets/theme-[^"]+\.png",', sw))
                if m:
                    sw = sw[: m[-1].end()] + "\n" + p + sw[m[-1].end() :]
    SW.write_text(sw, encoding="utf-8")
    app = APP_JS.read_text(encoding="utf-8")
    APP_JS.write_text(re.sub(r"certificate-studio-v\d+", "certificate-studio-v28", app, count=1), encoding="utf-8")


def main():
    for spec in THEMES:
        base = hex_rgb(spec["base"])
        img = spec["fn"](base, spec["seed"])
        framed = frame_overlay(img)
        img.save(ASSETS / f"theme-{spec['id']}.png", "PNG", optimize=True)
        framed.save(ASSETS / f"theme-frame-{spec['id']}.png", "PNG", optimize=True)
        print("wrote", spec["id"])
    repair_js(THEMES)
    bump_cache([s["id"] for s in THEMES])
    t = THEMES_JS.read_text(encoding="utf-8")
    if ",,," in t or "},," in t:
        raise RuntimeError("themes.js commas broken")
    print("done", len(THEMES))


if __name__ == "__main__":
    main()
