"""Rebuild ALL certificate themes from color palettes — clean, complete, no cut-off crest/corners.

Design rules:
- Outer colored border + subtle texture
- Gold double-line frame
- Full top crest (complete medallion) ABOVE the paper
- Corner flourishes OUTSIDE the paper inset
- Paper = rounded rect, inset enough so ornaments are never covered
- theme-*.png = full blank background
- theme-frame-*.png = ornaments only (transparent center)
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
# Match certificate canvas aspect closely (app uses 1123×794)
W, H = 1280, 794


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def parse_themes_from_js() -> list[dict]:
    text = THEMES_JS.read_text(encoding="utf-8")
    # CERT_THEMES array body
    m = re.search(r"const CERT_THEMES\s*=\s*\[(.*?)\];", text, re.S)
    if not m:
        raise RuntimeError("CERT_THEMES not found")
    body = m.group(1)
    themes = []
    for block in re.finditer(r"\{([^{}]*id:\s*\"[^\"]+\"[^{}]*(?:\{[^{}]*\}[^{}]*)*)\}", body, re.S):
        chunk = block.group(0)
        def grab(key: str, default: str = "") -> str:
            mm = re.search(rf'{key}:\s*"([^"]*)"', chunk)
            return mm.group(1) if mm else default

        def grab_num(key: str, default: float = 0) -> float:
            mm = re.search(rf"{key}:\s*([0-9.]+)", chunk)
            return float(mm.group(1)) if mm else default

        tid = grab("id")
        if not tid or "preferredLang" not in chunk:
            continue
        style_m = re.search(r"style:\s*\{([^}]*)\}", chunk, re.S)
        style_chunk = style_m.group(1) if style_m else ""
        def sg(key: str, default: str = "") -> str:
            mm = re.search(rf'{key}:\s*"([^"]*)"', style_chunk)
            return mm.group(1) if mm else default

        def sn(key: str, default: float = 0) -> float:
            mm = re.search(rf"{key}:\s*([0-9.]+)", style_chunk)
            return float(mm.group(1)) if mm else default

        themes.append(
            {
                "id": tid,
                "name": grab("name"),
                "nameEn": grab("nameEn"),
                "preferredLang": grab("preferredLang", "en"),
                "preferredFont": grab("preferredFont", "classic"),
                "preferredDir": grab("preferredDir", "ltr"),
                "outer": sg("outerBg", "#1c2b4a"),
                "frame": sg("frameColor", "#c9a24b"),
                "paperA": sg("paperStart", "#fffdf4"),
                "paperB": sg("paperMid", "#f8f0d9"),
                "paperC": sg("paperEnd", "#ead9ae"),
                "titleColor": sg("titleColor", sg("outerBg", "#1c2b4a")),
                "inkColor": sg("inkColor", "#4a4a4a"),
                "mutedColor": sg("mutedColor", "#7a6a3c"),
                "courseDateColor": sg("courseDateColor", sg("frameColor")),
                "accent": sg("accent", sg("frameColor")),
                "borderInnerColor": sg("borderInnerColor", sg("frameColor")),
                "borderInnerWidth": sn("borderInnerWidth", 1.5),
                "outerPad": int(sn("outerPad", 18)),
                "framePad": int(sn("framePad", 5)),
                "qrBorderColor": sg("qrBorderColor", sg("frameColor")),
                "signatureColor": sg("signatureColor", sg("titleColor")),
                "flourishColor": sg("flourishColor", sg("frameColor")),
            }
        )
    return themes


def paper_gradient(a: str, b: str, c: str, w: int, h: int, seed: int) -> Image.Image:
    rng = np.random.default_rng(seed)
    aa = np.array(hex_to_rgb(a), np.float32)
    bb = np.array(hex_to_rgb(b), np.float32)
    cc = np.array(hex_to_rgb(c), np.float32)
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - w * 0.5) / w) ** 2 + ((yy - h * 0.32) / h) ** 2)
    t = np.clip(d * 1.4, 0, 1)[..., None]
    mix = aa * (1 - t) * (1 - t) + bb * 2 * t * (1 - t) + cc * t * t
    noise = rng.integers(-4, 5, (h, w, 3), dtype=np.int16)
    arr = np.clip(mix + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGB").filter(ImageFilter.GaussianBlur(0.5))


def outer_texture(base: Image.Image, frame_rgb: tuple[int, int, int], seed: int) -> Image.Image:
    """Subtle damask-like dots on outer border only (drawn later via mask)."""
    return base


def flourish_paths(ox, oy, scale, flip_x=False, flip_y=False):
    sx = -1 if flip_x else 1
    sy = -1 if flip_y else 1

    def pt(x, y):
        return (ox + int(x * scale * sx), oy + int(y * scale * sy))

    curves = []
    main = []
    for i in range(32):
        t = i / 31
        x = 6 + t * 100
        y = 98 - 72 * math.sin(t * math.pi * 0.88) - t * 16
        main.append(pt(x, y))
    curves.append(main)
    sec = []
    for i in range(24):
        t = i / 23
        x = 10 + t * 62
        y = 74 - 42 * math.sin(t * math.pi) - t * 6
        sec.append(pt(x, y))
    curves.append(sec)
    leaf = []
    for i in range(16):
        t = i / 15
        x = 28 + t * 40
        y = 90 - 30 * math.sin(t * math.pi * 0.9)
        leaf.append(pt(x, y))
    curves.append(leaf)
    return curves


def draw_flourishes(draw, color, inset, scale=1.1):
    c = hex_to_rgb(color) if isinstance(color, str) else color
    corners = [
        (inset, inset, False, False),
        (W - inset, inset, True, False),
        (inset, H - inset, False, True),
        (W - inset, H - inset, True, True),
    ]
    for ox, oy, fx, fy in corners:
        for path in flourish_paths(ox, oy, scale, fx, fy):
            if len(path) > 1:
                draw.line(path, fill=c, width=3, joint="curve")
        for dx, dy in ((16, 90), (46, 30), (82, 16), (28, 58)):
            x = ox + (-dx if fx else dx)
            y = oy + (-dy if fy else dy)
            draw.ellipse((x - 2.5, y - 2.5, x + 2.5, y + 2.5), fill=c)


def draw_crest(draw, frame_rgb, cy: int):
    """Complete top medallion — full circle, sits on border ABOVE paper."""
    cx = W // 2
    r = 46
    # outer ring
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=frame_rgb, width=3)
    draw.ellipse((cx - r + 6, cy - r + 6, cx + r - 6, cy + r - 6), outline=frame_rgb, width=2)
    # laurel-ish arcs
    for sign in (-1, 1):
        pts = []
        for i in range(14):
            t = i / 13
            ang = math.pi * 0.15 + t * math.pi * 0.7
            rr = 18 + 6 * math.sin(t * math.pi)
            x = cx + sign * rr * math.sin(ang)
            y = cy + 8 - rr * math.cos(ang)
            pts.append((x, y))
        if len(pts) > 1:
            draw.line(pts, fill=frame_rgb, width=2, joint="curve")
    draw.ellipse((cx - 3, cy - 10, cx + 3, cy - 4), fill=frame_rgb)
    # small side ornaments on the rail
    draw.line((cx - 120, cy + 8, cx - r - 8, cy + 8), fill=frame_rgb, width=2)
    draw.line((cx + r + 8, cy + 8, cx + 120, cy + 8), fill=frame_rgb, width=2)


def make_theme(spec: dict, index: int) -> tuple[Image.Image, Image.Image]:
    outer = hex_to_rgb(spec["outer"])
    frame = hex_to_rgb(spec["frame"])
    seed = (index + 1) * 17 + sum(ord(c) for c in spec["id"]) % 1000

    # 1) Full outer field
    img = Image.new("RGB", (W, H), outer)
    draw = ImageDraw.Draw(img)

    # subtle outer texture
    rng = np.random.default_rng(seed)
    tex = np.array(img, dtype=np.int16)
    noise = rng.integers(-8, 9, tex.shape, dtype=np.int16)
    # only darken slightly in a vignette on outer band
    yy, xx = np.mgrid[0:H, 0:W]
    edge = np.minimum(np.minimum(xx, W - 1 - xx), np.minimum(yy, H - 1 - yy))
    band_m = (edge < 70).astype(np.float32)[..., None]
    tex = np.clip(tex + noise * band_m, 0, 255).astype(np.uint8)
    img = Image.fromarray(tex, "RGB")
    draw = ImageDraw.Draw(img)

    # Geometry — paper well clear of crest & corners
    pad = 26
    band = 14
    # gold frame band
    draw.rectangle((pad, pad, W - pad, H - pad), outline=frame, width=band)

    # fill inside frame with a darker tint of outer (shows behind paper edges)
    inner_pad = pad + band
    inner_tone = tuple(max(0, min(255, int(c * 0.85 + 12))) for c in outer)
    draw.rectangle((inner_pad, inner_pad, W - inner_pad, H - inner_pad), fill=inner_tone)

    # damask dots on the inner tone (visible around paper)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(inner_pad + 4, H - inner_pad - 4, 26):
        for x in range(inner_pad + 4, W - inner_pad - 4, 26):
            if (x // 26 + y // 26) % 3 == 0:
                od.ellipse((x, y, x + 9, y + 9), outline=(*frame, 36), width=1)
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    # double gold line
    g = inner_pad + 10
    draw.rectangle((g, g, W - g, H - g), outline=frame, width=2)
    draw.rectangle((g + 6, g + 6, W - g - 6, H - g - 6), outline=frame, width=1)

    # corner flourishes (on the border zone)
    draw_flourishes(draw, frame, inset=g + 4, scale=1.08)

    # crest — FULL circle on top border, above paper
    crest_cy = pad + band // 2 + 8
    draw_crest(draw, frame, crest_cy)

    # Paper: rounded, inset so it never covers crest or corner flourishes
    paper_margin_x = int(W * 0.115)
    paper_top = int(H * 0.155)  # below crest
    paper_bottom = int(H * 0.088)
    paper_left = paper_margin_x
    paper_right = W - paper_margin_x
    paper_y0 = paper_top
    paper_y1 = H - paper_bottom
    pw = paper_right - paper_left
    ph = paper_y1 - paper_y0
    radius = int(min(pw, ph) * 0.045)

    paper = paper_gradient(spec["paperA"], spec["paperB"], spec["paperC"], pw, ph, seed)
    # rounded mask
    mask = Image.new("L", (pw, ph), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, pw - 1, ph - 1), radius=radius, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.6))
    img.paste(paper, (paper_left, paper_y0), mask)

    # thin gold edge around paper
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        (paper_left, paper_y0, paper_right - 1, paper_y1 - 1),
        radius=radius,
        outline=frame,
        width=1,
    )

    # --- Frame overlay (ornaments only) ---
    # Rebuild as: full image with transparent paper hole (soft)
    rgba = img.convert("RGBA")
    alpha = Image.new("L", (W, H), 255)
    ad = ImageDraw.Draw(alpha)
    # punch soft hole slightly inside paper so paper shows through when stacked
    hole = (
        paper_left + 4,
        paper_y0 + 4,
        paper_right - 5,
        paper_y1 - 5,
    )
    ad.rounded_rectangle(hole, radius=max(4, radius - 2), fill=0)
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.2))
    r, gch, b, _ = rgba.split()
    framed = Image.merge("RGBA", (r, gch, b, alpha))

    return img.convert("RGB"), framed


def emit_theme_entry(spec: dict) -> str:
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
        f'      outerBg: "{spec["outer"]}",',
        f'      frameColor: "{spec["frame"]}",',
        f'      paperStart: "{spec["paperA"]}",',
        f'      paperMid: "{spec["paperB"]}",',
        f'      paperEnd: "{spec["paperC"]}",',
        f'      accent: "{spec["accent"]}",',
        f'      titleColor: "{spec["titleColor"]}",',
        f'      inkColor: "{spec["inkColor"]}",',
        f'      mutedColor: "{spec["mutedColor"]}",',
        f'      courseDateColor: "{spec["courseDateColor"]}",',
        f'      borderInnerColor: "{spec["borderInnerColor"]}",',
        f'      borderInnerWidth: {spec["borderInnerWidth"]},',
        f'      outerPad: {spec["outerPad"]},',
        f'      framePad: {spec["framePad"]},',
        f'      qrBorderColor: "{spec["qrBorderColor"]}",',
        f'      signatureColor: "{spec["signatureColor"]}",',
        f'      flourishColor: "{spec["flourishColor"]}"',
        "    }",
        "  }",
    ]
    return "\n".join(lines)


def replace_cert_themes_js(themes: list[dict]) -> None:
    text = THEMES_JS.read_text(encoding="utf-8")
    block = "const CERT_THEMES = [\n" + ",\n".join(emit_theme_entry(t) for t in themes) + "\n];\n"
    new_text, n = re.subn(r"const CERT_THEMES\s*=\s*\[[\s\S]*?\];\s*", block, text, count=1)
    if n != 1:
        raise RuntimeError("failed to replace CERT_THEMES")
    THEMES_JS.write_text(new_text, encoding="utf-8")


def main() -> None:
    themes = parse_themes_from_js()
    if len(themes) < 10:
        raise RuntimeError(f"too few themes parsed: {len(themes)}")
    print(f"parsed {len(themes)} themes")

    # delete old theme pngs
    for p in ASSETS.glob("theme-*.png"):
        p.unlink()
        print("deleted", p.name)

    for i, spec in enumerate(themes):
        full, framed = make_theme(spec, i)
        full_path = ASSETS / f"theme-{spec['id']}.png"
        frame_path = ASSETS / f"theme-frame-{spec['id']}.png"
        full.save(full_path, "PNG", optimize=True)
        framed.save(frame_path, "PNG", optimize=True)
        print("wrote", full_path.name)

    replace_cert_themes_js(themes)
    print("updated themes.js")

    # preview sample
    sample = ASSETS / "theme-emerald-gold.png"
    if sample.exists():
        im = Image.open(sample)
        im.crop((0, 0, W, 220)).save(ASSETS / "_rebuild-seal-check.png")
        im.crop((0, 0, 260, H)).save(ASSETS / "_rebuild-corner-check.png")


if __name__ == "__main__":
    main()
