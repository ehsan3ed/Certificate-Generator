"""Process AI blank themes into project size + frame overlays, append themes.js entries."""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
THEMES_JS = ROOT / "js" / "themes.js"
W, H = 1280, 720

AI_THEMES = [
    {
        "id": "navy-filigree",
        "name": "نیروی دریایی فیلگری",
        "nameEn": "Navy Filigree Art",
        "src": ASSETS / "theme-navy-filigree.png",
        "preferredFont": "classic",
        "style": {
            "outerBg": "#1a2744",
            "frameColor": "#c9a24b",
            "paperStart": "#fffdf6",
            "paperMid": "#f4ebd2",
            "paperEnd": "#e4d2a6",
            "accent": "#c9a24b",
            "titleColor": "#1a2744",
            "inkColor": "#4a4a4a",
            "mutedColor": "#7a6a3c",
            "courseDateColor": "#b8923c",
            "borderInnerColor": "#c9a24b",
            "borderInnerWidth": 1.5,
            "outerPad": 18,
            "framePad": 5,
            "qrBorderColor": "#c9a24b",
            "signatureColor": "#1a2744",
            "flourishColor": "#c9a24b",
        },
    },
    {
        "id": "emerald-atelier",
        "name": "زمردی آتلیه",
        "nameEn": "Emerald Atelier",
        "src": ASSETS / "theme-emerald-atelier.png",
        "preferredFont": "classic",
        "style": {
            "outerBg": "#0f3d2e",
            "frameColor": "#d4b56a",
            "paperStart": "#fbfaf4",
            "paperMid": "#f1ead4",
            "paperEnd": "#e0d3aa",
            "accent": "#d4b56a",
            "titleColor": "#0f3d2e",
            "inkColor": "#3d4a3f",
            "mutedColor": "#6f7a55",
            "courseDateColor": "#a88b3a",
            "borderInnerColor": "#d4b56a",
            "borderInnerWidth": 1.5,
            "outerPad": 18,
            "framePad": 5,
            "qrBorderColor": "#d4b56a",
            "signatureColor": "#0f3d2e",
            "flourishColor": "#d4b56a",
        },
    },
    {
        "id": "burgundy-atelier",
        "name": "بورگاندی آتلیه",
        "nameEn": "Burgundy Atelier",
        "src": ASSETS / "theme-burgundy-atelier.png",
        "preferredFont": "playfair",
        "style": {
            "outerBg": "#5c1a2e",
            "frameColor": "#c9a088",
            "paperStart": "#fff8f4",
            "paperMid": "#f7e8e0",
            "paperEnd": "#ebcfc2",
            "accent": "#c9a088",
            "titleColor": "#5c1a2e",
            "inkColor": "#5a3f3f",
            "mutedColor": "#8a6a62",
            "courseDateColor": "#b07a6a",
            "borderInnerColor": "#c9a088",
            "borderInnerWidth": 1.8,
            "outerPad": 20,
            "framePad": 6,
            "qrBorderColor": "#c9a088",
            "signatureColor": "#5c1a2e",
            "flourishColor": "#c9a088",
        },
    },
]


def make_frame(img: Image.Image) -> Image.Image:
    w, h = img.size
    rgba = img.convert("RGBA")
    alpha = Image.new("L", (w, h), 0)
    ad = ImageDraw.Draw(alpha)
    ring = int(min(w, h) * 0.11)
    ad.rectangle((0, 0, w, h), fill=255)
    ad.rounded_rectangle((ring, ring, w - ring, h - ring), radius=18, fill=0)
    c = int(min(w, h) * 0.2)
    for box in ((0, 0, c, c), (w - c, 0, w, c), (0, h - c, c, h), (w - c, h - c, w, h)):
        ad.rectangle(box, fill=255)
    alpha = alpha.filter(ImageFilter.GaussianBlur(3))
    r, g, b, _ = rgba.split()
    return Image.merge("RGBA", (r, g, b, alpha))


def emit(spec: dict) -> str:
    st = spec["style"]
    lines = [
        "  {",
        f'    id: "{spec["id"]}",',
        f'    name: "{spec["name"]}",',
        f'    nameEn: "{spec["nameEn"]}",',
        f'    preview: "./assets/theme-{spec["id"]}.png",',
        f'    frame: "./assets/theme-frame-{spec["id"]}.png",',
        '    preferredLang: "en",',
        f'    preferredFont: "{spec.get("preferredFont", "classic")}",',
        '    preferredDir: "ltr",',
        "    style: {",
    ]
    for k, v in st.items():
        lines.append(f'      {k}: "{v}",' if isinstance(v, str) else f"      {k}: {v},")
    lines += ["    }", "  }"]
    return "\n".join(lines)


def main() -> None:
    extra = []
    for spec in AI_THEMES:
        src = spec["src"]
        if not src.exists():
            print("missing", src)
            continue
        img = Image.open(src).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
        out = ASSETS / f"theme-{spec['id']}.png"
        frame = ASSETS / f"theme-frame-{spec['id']}.png"
        img.save(out, "PNG", optimize=True)
        make_frame(img).save(frame, "PNG", optimize=True)
        print("processed", out.name)
        extra.append(emit(spec))

    snippet = (ROOT / "tools" / "_new_themes_snippet.js").read_text(encoding="utf-8").rstrip()
    if snippet.endswith(","):
        snippet = snippet[:-1]
    all_new = snippet + ",\n" + ",\n".join(extra)

    text = THEMES_JS.read_text(encoding="utf-8")
    # insert before closing of CERT_THEMES
    marker = "\n];\n"
    # find last ]; that closes CERT_THEMES - the file ends with ]; after coral-cream
    idx = text.rfind("\n];")
    if idx < 0:
        raise SystemExit("cannot find CERT_THEMES end")
    # avoid duplicating if already inserted
    if "ivory-bronze" in text:
        print("themes already contain ivory-bronze; skip js merge")
        return

    updated = text[:idx] + ",\n" + all_new + text[idx:]
    THEMES_JS.write_text(updated, encoding="utf-8")
    print("themes.js updated with", 8 + len(extra), "new themes")


if __name__ == "__main__":
    main()
