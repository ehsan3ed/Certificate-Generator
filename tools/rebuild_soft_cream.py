"""Safely shrink/fade cream rectangle at corners & crest without teal holes."""
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import numpy as np
import glob
import os

assets = r"D:\App-Certificate\assets"


def process(preview_path, frame_path, out_path):
    preview = Image.open(preview_path).convert("RGB")
    frame = Image.open(frame_path).convert("RGBA")
    if frame.size != preview.size:
        frame = frame.resize(preview.size, Image.Resampling.LANCZOS)

    w, h = preview.size
    pr = np.array(preview).astype(np.float32)
    fa = np.array(frame)[:, :, 3]

    cream = (pr[:, :, 0] > 220) & (pr[:, :, 1] > 205) & (pr[:, :, 2] > 168) & (fa < 40)
    if cream.sum() < 500:
        preview.save(out_path)
        return False

    ys, xs = np.where(cream)
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())

    # Soft keep-mask: rounded rect inset so corners/crest/bottom clear ornaments
    keep = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(keep)
    inset_x = int(w * 0.012)
    inset_top = int(h * 0.028)  # clear crest
    inset_bot = int(h * 0.022)
    rad = int(min(w, h) * 0.085)
    draw.rounded_rectangle(
        [x0 + inset_x, y0 + inset_top, x1 - inset_x, y1 - inset_bot],
        radius=rad,
        fill=255,
    )
    # Extra corner scoops
    scoop = Image.new("L", (w, h), 0)
    sd = ImageDraw.Draw(scoop)
    sr = int(min(w, h) * 0.09)
    corners = [
        (x0 + inset_x, y0 + inset_top),
        (x1 - inset_x, y0 + inset_top),
        (x0 + inset_x, y1 - inset_bot),
        (x1 - inset_x, y1 - inset_bot),
    ]
    for cx, cy in corners:
        sd.ellipse([cx - sr, cy - sr, cx + sr, cy + sr], fill=255)
    # crest notch
    cw, ch = int(w * 0.14), int(h * 0.055)
    sd.ellipse([w // 2 - cw, y0 + inset_top - ch // 2, w // 2 + cw, y0 + inset_top + ch], fill=255)
    scoop = scoop.filter(ImageFilter.GaussianBlur(8))
    keep_arr = np.array(keep, dtype=np.float32)
    scoop_arr = np.array(scoop, dtype=np.float32)
    keep_arr = np.clip(keep_arr - scoop_arr * 0.85, 0, 255)
    keep = Image.fromarray(keep_arr.astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))
    keep_a = np.array(keep, dtype=np.float32) / 255.0

    # Margin fill color: average of a ring just outside cream (parchment near ornaments)
    ring = np.zeros((h, w), dtype=bool)
    ring[max(0, y0 - 6) : y0 + 2, x0:x1] = True
    ring[y1 - 2 : min(h, y1 + 6), x0:x1] = True
    ring[y0:y1, max(0, x0 - 6) : x0 + 2] = True
    ring[y0:y1, x1 - 2 : min(w, x1 + 6)] = True
    ring &= ~cream & (fa < 200)
    if ring.sum() < 50:
        # fallback: slightly darker cream
        fill = pr[cream].mean(axis=0) * 0.92
    else:
        fill = pr[ring].mean(axis=0)

    # Where cream exists but keep is low, blend cream -> fill (soft fade), then frame on top
    fade = cream.astype(np.float32) * (1.0 - keep_a)
    out = pr.copy()
    for c in range(3):
        out[:, :, c] = pr[:, :, c] * (1.0 - fade) + fill[c] * fade

    out_img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).convert("RGBA")
    out_img = Image.alpha_composite(out_img, frame)
    out_img.convert("RGB").save(out_path, "PNG", optimize=True)
    return True


def main():
    frames = sorted(glob.glob(os.path.join(assets, "theme-frame-*.png")))
    n = 0
    for fp in frames:
        name = os.path.basename(fp).replace("theme-frame-", "theme-")
        pp = os.path.join(assets, name)
        if not os.path.exists(pp):
            continue
        if process(pp, fp, pp):
            n += 1
    print("processed", n)
    # debug crops
    im = Image.open(os.path.join(assets, "theme-persian-turquoise.png"))
    im.crop((0, 0, 300, 240)).save(os.path.join(assets, "_debug-tl.png"))
    im.crop((480, 0, 800, 180)).save(os.path.join(assets, "_debug-crest.png"))


if __name__ == "__main__":
    main()
