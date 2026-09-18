from PIL import Image
import os

src = r"D:\App-Certificate\assets\pandenik-logo.png"
out = r"D:\App-Certificate\assets\pandenik-logo-transparent.png"

img = Image.open(src).convert("RGBA")
pixels = img.load()
w, h = img.size
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r < 35 and g < 35 and b < 35:
            pixels[x, y] = (0, 0, 0, 0)
        elif r < 55 and g < 55 and b < 55:
            fade = int((max(r, g, b) / 55) * 255)
            pixels[x, y] = (r, g, b, min(a, fade))

img.save(out, "PNG")
print("saved", out, img.size, os.path.getsize(out))
