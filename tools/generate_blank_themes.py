"""Generate blank certificate backgrounds (no text/logo/QR) + transparent frame overlays."""
from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
W, H = 1280, 720


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def paper_layer(start: str, mid: str, end: str, seed: int = 0) -> Image.Image:
    rng = np.random.default_rng(seed)
    a = np.array(hex_to_rgb(start), np.float32)
    b = np.array(hex_to_rgb(mid), np.float32)
    c = np.array(hex_to_rgb(end), np.float32)
    yy, xx = np.mgrid[0:H, 0:W]
    cy, cx = H * 0.34, W * 0.5
    d = np.sqrt(((xx - cx) / W) ** 2 + ((yy - cy) / H) ** 2)
    t = np.clip(d * 1.35, 0, 1)[..., None]
    # two-stop blend via mid
    mix = a * (1 - t) * (1 - t) + b * 2 * t * (1 - t) + c * t * t
    noise = rng.integers(-5, 6, (H, W, 3), dtype=np.int16)
    arr = np.clip(mix + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGB").filter(ImageFilter.GaussianBlur(0.6))


def draw_double_rect(draw: ImageDraw.ImageDraw, box, color, width=2, gap=4):
    x0, y0, x1, y1 = box
    draw.rectangle(box, outline=color, width=width)
    draw.rectangle((x0 + gap, y0 + gap, x1 - gap, y1 - gap), outline=color, width=max(1, width - 1))


def flourish_paths(ox: int, oy: int, scale: float, flip_x=False, flip_y=False):
    """Return list of polylines for a corner ornament."""
    sx = -1 if flip_x else 1
    sy = -1 if flip_y else 1

    def pt(x, y):
        return (ox + int(x * scale * sx), oy + int(y * scale * sy))

    curves = []
    # main scroll
    main = []
    for i in range(28):
        t = i / 27
        x = 8 + t * 92
        y = 95 - 70 * math.sin(t * math.pi * 0.85) - t * 18
        main.append(pt(x, y))
    curves.append(main)
    # secondary
    sec = []
    for i in range(22):
        t = i / 21
        x = 12 + t * 58
        y = 72 - 40 * math.sin(t * math.pi) - t * 8
        sec.append(pt(x, y))
    curves.append(sec)
    # leaf tip
    leaf = []
    for i in range(14):
        t = i / 13
        x = 30 + t * 36
        y = 88 - 28 * math.sin(t * math.pi * 0.9)
        leaf.append(pt(x, y))
    curves.append(leaf)
    return curves


def draw_flourishes(draw: ImageDraw.ImageDraw, color: str, inset: int, scale=1.05):
    c = hex_to_rgb(color)
    corners = [
        (inset + 8, inset + 8, False, False),
        (W - inset - 8, inset + 8, True, False),
        (inset + 8, H - inset - 8, False, True),
        (W - inset - 8, H - inset - 8, True, True),
    ]
    for ox, oy, fx, fy in corners:
        for path in flourish_paths(ox, oy, scale, fx, fy):
            if len(path) > 1:
                draw.line(path, fill=c, width=3, joint="curve")
        # accent dots
        for dx, dy in ((18, 88), (48, 32), (78, 18)):
            x = ox + (-dx if fx else dx)
            y = oy + (-dy if fy else dy)
            draw.ellipse((x - 3, y - 3, x + 3, y + 3), fill=c)


def draw_diamond_rule(draw: ImageDraw.ImageDraw, color: str, y: int):
    c = hex_to_rgb(color)
    x0, x1 = int(W * 0.28), int(W * 0.72)
    draw.line((x0, y, x1, y), fill=c, width=2)
    cx = W // 2
    draw.polygon([(cx, y - 6), (cx + 6, y), (cx, y + 6), (cx - 6, y)], fill=c)
    # small end flourishes
    for x in (x0, x1):
        draw.line((x - 12, y, x + 12, y), fill=c, width=3)


def make_theme(spec: dict) -> tuple[Image.Image, Image.Image]:
    outer = hex_to_rgb(spec["outer"])
    frame = hex_to_rgb(spec["frame"])
    paper = paper_layer(spec["paperA"], spec["paperB"], spec["paperC"], seed=spec.get("seed", 1))

    img = Image.new("RGB", (W, H), outer)
    draw = ImageDraw.Draw(img)

    # outer metallic frame band
    pad = spec.get("pad", 22)
    band = spec.get("band", 10)
    draw.rectangle((pad, pad, W - pad, H - pad), fill=frame)
    # paper inset
    inner = pad + band
    paper_resized = paper.resize((W - 2 * inner, H - 2 * inner))
    img.paste(paper_resized, (inner, inner))

    # optional patterned outer (subtle)
    if spec.get("pattern") == "damask":
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        for y in range(pad, H - pad, 28):
            for x in range(pad, W - pad, 28):
                if (x // 28 + y // 28) % 2 == 0:
                    od.ellipse((x, y, x + 10, y + 10), outline=(*frame, 40), width=1)
        img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
        draw = ImageDraw.Draw(img)

    # inner gold line
    g = pad + band + 14
    draw_double_rect(draw, (g, g, W - g, H - g), frame, width=2, gap=5)

    # corner flourishes
    draw_flourishes(draw, spec["frame"], inset=g + 6, scale=spec.get("flourish", 1.05))

    # optional subtle top arch notch decoration (no seal/logo)
    if spec.get("arch"):
        cx = W // 2
        ay = g
        draw.arc((cx - 48, ay - 28, cx + 48, ay + 28), 200, 340, fill=frame, width=3)

    # optional faint center diamond divider (decorative only, no text)
    if spec.get("divider"):
        draw_diamond_rule(draw, spec["frame"], int(H * 0.52))

    # second thin inner border
    if spec.get("triple"):
        t = g + 22
        draw.rectangle((t, t, W - t, H - t), outline=frame, width=1)

    # Frame overlay with transparent center
    frame_rgba = img.convert("RGBA")
    alpha = Image.new("L", (W, H), 0)
    ad = ImageDraw.Draw(alpha)
    # keep outer ring
    ring = int(min(W, H) * 0.11)
    ad.rectangle((0, 0, W, H), fill=255)
    ad.rounded_rectangle((ring, ring, W - ring, H - ring), radius=18, fill=0)
    # keep corners
    c = int(min(W, H) * 0.2)
    for box in ((0, 0, c, c), (W - c, 0, W, c), (0, H - c, c, H), (W - c, H - c, W, H)):
        ad.rectangle(box, fill=255)
    alpha = alpha.filter(ImageFilter.GaussianBlur(3))
    r, gch, b, _ = frame_rgba.split()
    framed = Image.merge("RGBA", (r, gch, b, alpha))

    return img.convert("RGBA"), framed


DESIGNS = [
    {
        "id": "ivory-bronze",
        "name": "عاج و برنز",
        "nameEn": "Ivory & Bronze",
        "outer": "#3b2a1a",
        "frame": "#b08d57",
        "paperA": "#fffaf2",
        "paperB": "#f4e6cf",
        "paperC": "#e5d0a8",
        "pad": 20,
        "band": 9,
        "arch": True,
        "divider": False,
        "triple": True,
        "seed": 11,
        "style": {
            "outerBg": "#3b2a1a",
            "frameColor": "#b08d57",
            "paperStart": "#fffaf2",
            "paperMid": "#f4e6cf",
            "paperEnd": "#e5d0a8",
            "accent": "#b08d57",
            "titleColor": "#3b2a1a",
            "inkColor": "#4a3b2c",
            "mutedColor": "#7a6548",
            "courseDateColor": "#9a7540",
            "borderInnerColor": "#b08d57",
            "borderInnerWidth": 1.5,
            "outerPad": 18,
            "framePad": 5,
            "qrBorderColor": "#b08d57",
            "signatureColor": "#3b2a1a",
            "flourishColor": "#b08d57",
        },
    },
    {
        "id": "charcoal-copper",
        "name": "ذغالی و مس",
        "nameEn": "Charcoal & Copper",
        "outer": "#1f2428",
        "frame": "#c47a4a",
        "paperA": "#f7f4ef",
        "paperB": "#ebe4da",
        "paperC": "#d9cfc0",
        "pad": 18,
        "band": 8,
        "arch": False,
        "divider": True,
        "triple": False,
        "flourish": 0.95,
        "seed": 22,
        "style": {
            "outerBg": "#1f2428",
            "frameColor": "#c47a4a",
            "paperStart": "#f7f4ef",
            "paperMid": "#ebe4da",
            "paperEnd": "#d9cfc0",
            "accent": "#c47a4a",
            "titleColor": "#1f2428",
            "inkColor": "#3d4348",
            "mutedColor": "#6b7278",
            "courseDateColor": "#a8643a",
            "borderInnerColor": "#c47a4a",
            "borderInnerWidth": 1.5,
            "outerPad": 16,
            "framePad": 4,
            "qrBorderColor": "#c47a4a",
            "signatureColor": "#1f2428",
            "flourishColor": "#c47a4a",
        },
    },
    {
        "id": "sage-linen",
        "name": "سبز مریم‌گلی",
        "nameEn": "Sage & Linen",
        "outer": "#4f5d4a",
        "frame": "#c4b48a",
        "paperA": "#fcfbf7",
        "paperB": "#f0eee4",
        "paperC": "#ddd8c6",
        "pad": 22,
        "band": 10,
        "arch": True,
        "divider": False,
        "triple": True,
        "pattern": "damask",
        "seed": 33,
        "style": {
            "outerBg": "#4f5d4a",
            "frameColor": "#c4b48a",
            "paperStart": "#fcfbf7",
            "paperMid": "#f0eee4",
            "paperEnd": "#ddd8c6",
            "accent": "#c4b48a",
            "titleColor": "#3d4a38",
            "inkColor": "#445043",
            "mutedColor": "#6d7568",
            "courseDateColor": "#8f8458",
            "borderInnerColor": "#c4b48a",
            "borderInnerWidth": 1.8,
            "outerPad": 20,
            "framePad": 6,
            "qrBorderColor": "#c4b48a",
            "signatureColor": "#3d4a38",
            "flourishColor": "#c4b48a",
        },
    },
    {
        "id": "wine-champagne",
        "name": "شرابی و شامپاین",
        "nameEn": "Wine & Champagne",
        "outer": "#5a1f2e",
        "frame": "#d2b48c",
        "paperA": "#fff8f5",
        "paperB": "#f6e6df",
        "paperC": "#e8cfc4",
        "pad": 21,
        "band": 11,
        "arch": True,
        "divider": True,
        "triple": True,
        "seed": 44,
        "style": {
            "outerBg": "#5a1f2e",
            "frameColor": "#d2b48c",
            "paperStart": "#fff8f5",
            "paperMid": "#f6e6df",
            "paperEnd": "#e8cfc4",
            "accent": "#d2b48c",
            "titleColor": "#5a1f2e",
            "inkColor": "#5a3f3f",
            "mutedColor": "#8a6a62",
            "courseDateColor": "#b07a6a",
            "borderInnerColor": "#d2b48c",
            "borderInnerWidth": 1.8,
            "outerPad": 20,
            "framePad": 6,
            "qrBorderColor": "#d2b48c",
            "signatureColor": "#5a1f2e",
            "flourishColor": "#d2b48c",
        },
    },
    {
        "id": "arctic-platinum",
        "name": "قطبی پلاتینیوم",
        "nameEn": "Arctic Platinum",
        "outer": "#2a3440",
        "frame": "#a8b4c0",
        "paperA": "#f8fafc",
        "paperB": "#e8eef4",
        "paperC": "#d3dbe4",
        "pad": 17,
        "band": 7,
        "arch": False,
        "divider": False,
        "triple": True,
        "flourish": 0.88,
        "seed": 55,
        "style": {
            "outerBg": "#2a3440",
            "frameColor": "#a8b4c0",
            "paperStart": "#f8fafc",
            "paperMid": "#e8eef4",
            "paperEnd": "#d3dbe4",
            "accent": "#a8b4c0",
            "titleColor": "#2a3440",
            "inkColor": "#3a4450",
            "mutedColor": "#6b7580",
            "courseDateColor": "#7a8490",
            "borderInnerColor": "#a8b4c0",
            "borderInnerWidth": 1.2,
            "outerPad": 16,
            "framePad": 4,
            "qrBorderColor": "#8a94a0",
            "signatureColor": "#2a3440",
            "flourishColor": "#9aa3b0",
        },
    },
    {
        "id": "terracotta-sand",
        "name": "سفالی و شن",
        "nameEn": "Terracotta & Sand",
        "outer": "#8a4b32",
        "frame": "#d9b27c",
        "paperA": "#fff9f0",
        "paperB": "#f3e4cb",
        "paperC": "#e2cb9f",
        "pad": 23,
        "band": 10,
        "arch": True,
        "divider": False,
        "triple": False,
        "seed": 66,
        "style": {
            "outerBg": "#8a4b32",
            "frameColor": "#d9b27c",
            "paperStart": "#fff9f0",
            "paperMid": "#f3e4cb",
            "paperEnd": "#e2cb9f",
            "accent": "#d9b27c",
            "titleColor": "#6e3a26",
            "inkColor": "#5a4332",
            "mutedColor": "#8a6d4a",
            "courseDateColor": "#b88848",
            "borderInnerColor": "#d9b27c",
            "borderInnerWidth": 2,
            "outerPad": 22,
            "framePad": 6,
            "qrBorderColor": "#d9b27c",
            "signatureColor": "#6e3a26",
            "flourishColor": "#d9b27c",
        },
    },
    {
        "id": "teal-pearl",
        "name": "سبزآبی مرواریدی",
        "nameEn": "Teal & Pearl",
        "outer": "#0f4c5c",
        "frame": "#d6c39a",
        "paperA": "#f9fcfb",
        "paperB": "#e7f0ee",
        "paperC": "#cfe0dc",
        "pad": 20,
        "band": 9,
        "arch": True,
        "divider": True,
        "triple": True,
        "pattern": "damask",
        "seed": 77,
        "style": {
            "outerBg": "#0f4c5c",
            "frameColor": "#d6c39a",
            "paperStart": "#f9fcfb",
            "paperMid": "#e7f0ee",
            "paperEnd": "#cfe0dc",
            "accent": "#d6c39a",
            "titleColor": "#0f4c5c",
            "inkColor": "#2f4a4f",
            "mutedColor": "#5d7370",
            "courseDateColor": "#9a8860",
            "borderInnerColor": "#d6c39a",
            "borderInnerWidth": 1.6,
            "outerPad": 18,
            "framePad": 5,
            "qrBorderColor": "#d6c39a",
            "signatureColor": "#0f4c5c",
            "flourishColor": "#d6c39a",
        },
    },
    {
        "id": "espresso-gold",
        "name": "اسپرسو طلایی",
        "nameEn": "Espresso Gold",
        "outer": "#2c2118",
        "frame": "#c9a24b",
        "paperA": "#fffdf6",
        "paperB": "#f5ebd2",
        "paperC": "#e4d2a4",
        "pad": 24,
        "band": 12,
        "arch": True,
        "divider": False,
        "triple": True,
        "flourish": 1.12,
        "seed": 88,
        "style": {
            "outerBg": "#2c2118",
            "frameColor": "#c9a24b",
            "paperStart": "#fffdf6",
            "paperMid": "#f5ebd2",
            "paperEnd": "#e4d2a4",
            "accent": "#c9a24b",
            "titleColor": "#2c2118",
            "inkColor": "#4a3d2c",
            "mutedColor": "#7a6a3c",
            "courseDateColor": "#b8923c",
            "borderInnerColor": "#c9a24b",
            "borderInnerWidth": 2,
            "outerPad": 22,
            "framePad": 7,
            "qrBorderColor": "#c9a24b",
            "signatureColor": "#2c2118",
            "flourishColor": "#c9a24b",
        },
    },
]


def js_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def emit_theme_js(spec: dict) -> str:
    st = spec["style"]
    lines = [
        "  {",
        f'    id: "{spec["id"]}",',
        f'    name: "{js_escape(spec["name"])}",',
        f'    nameEn: "{js_escape(spec["nameEn"])}",',
        f'    preview: "./assets/theme-{spec["id"]}.png",',
        f'    frame: "./assets/theme-frame-{spec["id"]}.png",',
        '    preferredLang: "en",',
        '    preferredFont: "classic",',
        '    preferredDir: "ltr",',
        "    style: {",
    ]
    for k, v in st.items():
        if isinstance(v, str):
            lines.append(f'      {k}: "{v}",')
        else:
            lines.append(f"      {k}: {v},")
    lines.append("    }")
    lines.append("  }")
    return "\n".join(lines)


def main() -> None:
    ASSETS.mkdir(exist_ok=True)
    blocks = []
    for spec in DESIGNS:
        full, framed = make_theme(spec)
        full_path = ASSETS / f"theme-{spec['id']}.png"
        frame_path = ASSETS / f"theme-frame-{spec['id']}.png"
        full.save(full_path, "PNG", optimize=True)
        framed.save(frame_path, "PNG", optimize=True)
        print("wrote", full_path.name, frame_path.name)
        blocks.append(emit_theme_js(spec))

    # Write a snippet file for easy merge
    snippet = ROOT / "tools" / "_new_themes_snippet.js"
    snippet.write_text(",\n".join(blocks) + "\n", encoding="utf-8")
    print("snippet ->", snippet)


if __name__ == "__main__":
    main()
