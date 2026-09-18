"""Extract border/ornament-only overlays from full theme certificate mockups."""
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"


def make_frame(src: Path, dst: Path) -> None:
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)

    # Keep only a thin outer ring + corner ornaments.
    ring_x = int(w * 0.085)
    ring_y = int(h * 0.10)
    feather = int(min(w, h) * 0.035)

    draw.rectangle((0, 0, w, h), fill=255)
    # Large content hole
    draw.rounded_rectangle(
        (ring_x + feather, ring_y + feather, w - ring_x - feather, h - ring_y - feather),
        radius=int(min(w, h) * 0.035),
        fill=0,
    )
    # Seal / emblem
    draw.ellipse((int(w * 0.33), int(h * 0.02), int(w * 0.67), int(h * 0.34)), fill=0)
    # Title + body text band
    draw.rounded_rectangle(
        (int(w * 0.12), int(h * 0.14), int(w * 0.88), int(h * 0.86)),
        radius=20,
        fill=0,
    )
    # Signature caption
    draw.rectangle((int(w * 0.30), int(h * 0.78), int(w * 0.70), int(h * 0.96)), fill=0)
    # Mockup QR codes
    qr = int(min(w, h) * 0.16)
    m = int(min(w, h) * 0.035)
    draw.rectangle((m, h - m - qr, m + qr, h - m), fill=0)
    draw.rectangle((w - m - qr, h - m - qr, w - m, h - m), fill=0)

    # Soften, but keep corners strong
    mask = mask.filter(ImageFilter.GaussianBlur(radius=max(6, feather // 2)))

    # Boost corner regions so ornaments stay opaque
    boost = Image.new("L", (w, h), 0)
    bdraw = ImageDraw.Draw(boost)
    corner = int(min(w, h) * 0.18)
    for box in (
        (0, 0, corner, corner),
        (w - corner, 0, w, corner),
        (0, h - corner, corner, h),
        (w - corner, h - corner, w, h),
    ):
        bdraw.rectangle(box, fill=255)
    # Do not boost QR zones
    bdraw.rectangle((m, h - m - qr, m + qr, h - m), fill=0)
    bdraw.rectangle((w - m - qr, h - m - qr, w - m, h - m), fill=0)
    mask = ImageChops.lighter(mask, ImageChops.multiply(boost, mask.point(lambda p: 255 if p > 20 else 0)))

    r, g, b, a = im.split()
    out = Image.merge("RGBA", (r, g, b, ImageChops.multiply(a, mask)))
    out.save(dst, "PNG", optimize=True)

    # Sanity: center should be mostly transparent
    cx, cy = w // 2, h // 2
    center_a = out.getpixel((cx, cy))[3]
    print(f"wrote {dst.name} center_alpha={center_a}")


def main() -> None:
    for src in sorted(ASSETS.glob("theme-*.png")):
        if src.name.startswith("theme-frame-"):
            continue
        name = src.stem.removeprefix("theme-")
        dst = ASSETS / f"theme-frame-{name}.png"
        make_frame(src, dst)


if __name__ == "__main__":
    main()
