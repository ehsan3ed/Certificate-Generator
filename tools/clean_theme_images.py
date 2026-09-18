"""
Rebuild clean theme backgrounds:
- keep outer frame, colors, corner ornaments
- remove text, QR, seals, signature by replacing interior with paper
"""
from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
BAK = ASSETS / "_theme_source_bak"


def sample_paper(bgr: np.ndarray) -> np.ndarray:
    h, w = bgr.shape[:2]
    pts = [(0.40, 0.50), (0.48, 0.42), (0.48, 0.58), (0.55, 0.50), (0.35, 0.50)]
    samples = []
    for fy, fx in pts:
        y, x = int(h * fy), int(w * fx)
        patch = bgr[y - 8 : y + 9, x - 8 : x + 9].reshape(-1, 3)
        for b, g, r in patch:  # BGR
            if r > 185 and g > 175 and b > 140 and abs(int(r) - int(g)) < 40:
                samples.append([b, g, r])
    if not samples:
        return np.array([217, 240, 248], np.uint8)  # BGR cream
    return np.median(np.array(samples), axis=0).astype(np.uint8)


def make_paper(h: int, w: int, base_bgr: np.ndarray, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    paper = np.clip(base_bgr.astype(np.int16) + rng.integers(-4, 5, (h, w, 3), dtype=np.int16), 0, 255).astype(
        np.uint8
    )
    return cv2.GaussianBlur(paper, (3, 3), 0)


def is_gold_bgr(bgr: np.ndarray) -> np.ndarray:
    b, g, r = bgr[:, :, 0].astype(np.int16), bgr[:, :, 1].astype(np.int16), bgr[:, :, 2].astype(np.int16)
    return (r > 115) & (g > 80) & (b < 205) & (r + g > b * 2 + 25) & (r > b)


def is_plain_paper_bgr(bgr: np.ndarray) -> np.ndarray:
    b, g, r = bgr[:, :, 0].astype(np.int16), bgr[:, :, 1].astype(np.int16), bgr[:, :, 2].astype(np.int16)
    return (r > 195) & (g > 185) & (b > 150) & (np.abs(r - g) < 35) & (np.abs(g - b) < 50)


def qr_zones(h: int, w: int) -> np.ndarray:
    m = np.zeros((h, w), np.uint8)
    # QR sits inside the paper area near bottom corners (not on outer frame)
    boxes = [
        (int(w * 0.055), int(h * 0.72), int(w * 0.20), int(h * 0.93)),
        (int(w * 0.80), int(h * 0.72), int(w * 0.945), int(h * 0.93)),
    ]
    for x0, y0, x1, y1 in boxes:
        cv2.rectangle(m, (x0, y0), (x1, y1), 255, -1)
    return m > 0


def clean_one(src: Path, dst_clean: Path, dst_frame: Path) -> None:
    bgr = cv2.imread(str(src), cv2.IMREAD_COLOR)
    if bgr is None:
        raise RuntimeError(src)
    h, w = bgr.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]

    paper = make_paper(h, w, sample_paper(bgr), seed=hash(src.name) % 10_000)
    out = paper.copy()

    ring_x, ring_y = int(w * 0.078), int(h * 0.090)
    outer = (xx < ring_x) | (xx >= w - ring_x) | (yy < ring_y) | (yy >= h - ring_y)

    c = int(min(w, h) * 0.22)
    corners = np.zeros((h, w), bool)
    corners[:c, :c] = True
    corners[:c, w - c :] = True
    corners[h - c :, :c] = True
    corners[h - c :, w - c :] = True

    gold = is_gold_bgr(bgr)
    plain = is_plain_paper_bgr(bgr)
    qr = qr_zones(h, w)

    # Keep decorative frame material (not plain paper) on outer ring + corners
    keep = outer.copy()
    keep |= corners & ~plain
    keep |= corners & gold
    # thin inner gold border around content
    ix, iy = int(w * 0.055), int(h * 0.065)
    thick = max(3, int(min(w, h) * 0.007))
    inner = (
        ((xx >= ix) & (xx < ix + thick) & (yy >= iy) & (yy < h - iy))
        | ((xx <= w - ix) & (xx > w - ix - thick) & (yy >= iy) & (yy < h - iy))
        | ((yy >= iy) & (yy < iy + thick) & (xx >= ix) & (xx < w - ix))
        | ((yy <= h - iy) & (yy > h - iy - thick) & (xx >= ix) & (xx < w - ix))
    )
    keep |= inner & gold

    # Never keep QR / seal / signature / center content — but never wipe the outer frame
    seal = ((xx - w * 0.5) ** 2) / ((w * 0.09) ** 2) + ((yy - h * 0.145) ** 2) / ((h * 0.14) ** 2) <= 1
    sig = (xx > int(w * 0.30)) & (xx < int(w * 0.70)) & (yy > int(h * 0.78)) & (yy < int(h * 0.95))
    wipe = (qr | seal | sig) & ~outer
    keep &= ~wipe
    # center content always paper (inside ring)
    center = (xx > int(w * 0.14)) & (xx < int(w * 0.86)) & (yy > int(h * 0.16)) & (yy < int(h * 0.84))
    keep &= ~(center & ~outer)
    # restore corner ornaments (gold / non-paper) even near QR
    keep |= corners & gold & ~outer
    keep |= corners & ~plain & ~outer & ~(qr & plain)
    keep |= outer

    out[keep] = bgr[keep]

    # Soft transition around keep edges
    keep_u8 = keep.astype(np.uint8) * 255
    soft = cv2.GaussianBlur(keep_u8, (9, 9), 0).astype(np.float32) / 255.0
    soft[wipe] = 0
    soft[outer] = 1
    soft[corners & gold] = 1
    mixed = out.astype(np.float32) * soft[..., None] + paper.astype(np.float32) * (1 - soft[..., None])
    mixed[keep] = bgr[keep]
    mixed[wipe] = paper[wipe]
    mixed[outer] = bgr[outer]
    out = np.clip(mixed, 0, 255).astype(np.uint8)

    cv2.imwrite(str(dst_clean), out)

    # Frame alpha: borders + ornaments only
    alpha = np.zeros((h, w), np.uint8)
    alpha[outer] = 255
    alpha[corners & gold & ~qr] = 255
    alpha[inner & gold] = 255
    # include non-plain decorative rim
    rim = (xx < int(w * 0.11)) | (xx >= w - int(w * 0.11)) | (yy < int(h * 0.13)) | (yy >= h - int(h * 0.13))
    alpha[rim & ~plain & ~qr & ~seal] = 255
    alpha[qr & ~outer] = 0
    alpha[seal & ~outer] = 0
    alpha[center & ~(corners & gold)] = 0
    alpha = cv2.GaussianBlur(alpha, (5, 5), 0)
    alpha[corners & gold] = 255
    alpha[outer] = 255

    rgba = cv2.cvtColor(out, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = alpha
    rgba[alpha < 12, :3] = (255, 255, 255)
    cv2.imwrite(str(dst_frame), rgba)

    g = cv2.cvtColor(out, cv2.COLOR_BGR2GRAY)
    cstat = g[int(h * 0.3) : int(h * 0.7), int(w * 0.3) : int(w * 0.7)]
    print(f"OK {src.name} center_std={cstat.std():.1f} ink%={(cstat < 120).mean()*100:.1f}")


def main() -> None:
    BAK.mkdir(exist_ok=True)
    sources = sorted(p for p in ASSETS.glob("theme-*.png") if not p.name.startswith("theme-frame-"))
    for src in sources:
        backup = BAK / src.name
        if not backup.exists():
            Image.open(src).convert("RGBA").save(backup)

    for src in sources:
        origin = BAK / src.name if (BAK / src.name).exists() else src
        name = src.stem.removeprefix("theme-")
        clean_one(origin, ASSETS / f"theme-{name}.png", ASSETS / f"theme-frame-{name}.png")


if __name__ == "__main__":
    main()
