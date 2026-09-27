"""Remove cream paper ONLY when a real scenic border exists (e.g. emerald palm/green)."""
from __future__ import annotations

import glob
import os

import cv2
import numpy as np

ASSETS = r"D:\App-Certificate\assets"


def is_cream(bgr: np.ndarray) -> np.ndarray:
    b, g, r = cv2.split(bgr)
    return (r > 215) & (g > 200) & (b > 145) & (np.abs(r.astype(int) - g.astype(int)) < 50)


def is_gold(bgr: np.ndarray) -> np.ndarray:
    b, g, r = cv2.split(bgr)
    return (r > 140) & (g > 100) & (b < 180) & (r.astype(int) - b.astype(int) > 35)


def cream_panel_mask(bgr: np.ndarray) -> np.ndarray:
    h, w = bgr.shape[:2]
    cream = is_cream(bgr)
    yy, xx = np.mgrid[0:h, 0:w]
    interior = (xx > w * 0.08) & (xx < w * 0.92) & (yy > h * 0.06) & (yy < h * 0.92)
    m = ((cream & interior).astype(np.uint8) * 255)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    filled = np.zeros_like(m)
    for c in cnts:
        if cv2.contourArea(c) < h * w * 0.1:
            continue
        cv2.drawContours(filled, [c], -1, 255, -1)
    c = int(min(w, h) * 0.15)
    filled[:c, :c] = 0
    filled[:c, w - c :] = 0
    filled[h - c :, :c] = 0
    filled[h - c :, w - c :] = 0
    return filled


def scenic_samples(bgr: np.ndarray) -> np.ndarray | None:
    """Pixels from mid-side border that look like scene (not cream/gold)."""
    h, w = bgr.shape[:2]
    y0, y1 = int(h * 0.30), int(h * 0.70)
    samples = []
    for x0, x1 in ((int(w * 0.035), int(w * 0.08)), (int(w * 0.92), int(w * 0.965))):
        patch = bgr[y0:y1, x0:x1]
        ok = (~is_cream(patch)) & (~is_gold(patch))
        if ok.any():
            samples.append(patch[ok])
    if not samples:
        return None
    pix = np.concatenate(samples, axis=0)
    # Require dark/mid-tone scenic bg (not light parchment border)
    # emerald palm/green is dark; skip light borders
    mean = pix.mean(axis=0)
    if float(mean.mean()) > 160:  # too light = not scenic underlay
        return None
    if len(pix) < 80:
        return None
    return pix


def smooth_fill_from_samples(pix: np.ndarray, h: int, w: int) -> np.ndarray:
    base = np.median(pix, axis=0).astype(np.float32)
    std = float(np.std(pix))
    rng = np.random.default_rng(11)
    noise = rng.normal(0, max(2.5, std * 0.3), (h, w, 3))
    low = cv2.GaussianBlur(noise.astype(np.float32), (0, 0), 32)
    return np.clip(base.reshape(1, 1, 3) + low + noise * 0.2, 0, 255).astype(np.uint8)


def process(preview_path: str, frame_path: str) -> bool:
    bgr = cv2.imread(preview_path, cv2.IMREAD_COLOR)
    if bgr is None:
        return False

    pix = scenic_samples(bgr)
    if pix is None:
        print(f"keep {os.path.basename(preview_path)} (no scenic underlay)")
        return False

    panel = cream_panel_mask(bgr)
    cov = float(panel.mean() / 255.0)
    if cov < 0.08:
        print(f"skip {os.path.basename(preview_path)}")
        return False

    h, w = bgr.shape[:2]
    fill = smooth_fill_from_samples(pix, h, w)
    seam = cv2.GaussianBlur(panel, (0, 0), 5)
    s3 = (seam.astype(np.float32) / 255.0)[..., None]
    out = bgr.astype(np.float32) * (1 - s3) + fill.astype(np.float32) * s3

    gold = is_gold(bgr)
    out[gold] = bgr[gold]
    out[panel == 0] = bgr[panel == 0]

    # restore logo/header non-cream
    top = np.zeros((h, w), bool)
    top[: int(h * 0.16), :] = True
    out[top & (~is_cream(bgr))] = bgr[top & (~is_cream(bgr))]
    out = np.clip(out, 0, 255).astype(np.uint8)

    frame = cv2.imread(frame_path, cv2.IMREAD_UNCHANGED)
    if frame is not None and frame.shape[2] == 4:
        if frame.shape[:2] != out.shape[:2]:
            frame = cv2.resize(frame, (out.shape[1], out.shape[0]), interpolation=cv2.INTER_LINEAR)
        fa = frame[:, :, 3].astype(np.float32) / 255.0
        fr = frame[:, :, :3].astype(np.float32)
        fa = fa * (~is_cream(frame[:, :, :3])).astype(np.float32)
        out = (out.astype(np.float32) * (1 - fa[..., None]) + fr * fa[..., None]).astype(np.uint8)

    cv2.imwrite(preview_path, out)
    mean = pix.mean(axis=0).astype(int)
    print(f"fixed {os.path.basename(preview_path)} cov={cov:.2f} scene_rgb={mean.tolist()}")
    return True


def main() -> None:
    n = 0
    for fp in sorted(glob.glob(os.path.join(ASSETS, "theme-frame-*.png"))):
        name = os.path.basename(fp).replace("theme-frame-", "theme-")
        pp = os.path.join(ASSETS, name)
        if os.path.exists(pp) and process(pp, fp):
            n += 1
    eg = os.path.join(ASSETS, "theme-emerald-gold.png")
    if os.path.exists(eg):
        im = cv2.imread(eg)
        h, w = im.shape[:2]
        cv2.imwrite(os.path.join(ASSETS, "_dbg-eg-full.png"), im)
        cv2.imwrite(os.path.join(ASSETS, "_dbg-eg-seal.png"), im[0:190, w // 2 - 190 : w // 2 + 190])
    print(f"done {n} scenic themes")


if __name__ == "__main__":
    main()
