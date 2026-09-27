from PIL import Image, ImageFilter
import glob
import os

assets = r"D:\App-Certificate\assets"
count = 0
for fp in sorted(glob.glob(os.path.join(assets, "theme-frame-*.png"))):
    name = os.path.basename(fp).replace("theme-frame-", "theme-")
    pp = os.path.join(assets, name)
    if not os.path.exists(pp):
        continue
    frame = Image.open(fp).convert("RGBA")
    preview = Image.open(pp).convert("RGBA")
    if frame.size != preview.size:
        frame = frame.resize(preview.size, Image.Resampling.LANCZOS)

    # Expand ornaments slightly so they cover cream corners that cut them off
    channels = list(frame.split())
    alpha = channels[-1].filter(ImageFilter.MaxFilter(size=9))
    alpha = alpha.filter(ImageFilter.GaussianBlur(radius=1.5))
    channels[-1] = alpha
    frame2 = Image.merge("RGBA", channels)

    out = Image.alpha_composite(preview, frame2)
    out.convert("RGB").save(pp, "PNG", optimize=True)
    count += 1

print("updated", count)
im = Image.open(os.path.join(assets, "theme-persian-turquoise.png"))
im.crop((0, 0, 300, 240)).save(os.path.join(assets, "_debug-tl.png"))
im.crop((480, 0, 800, 180)).save(os.path.join(assets, "_debug-crest.png"))
