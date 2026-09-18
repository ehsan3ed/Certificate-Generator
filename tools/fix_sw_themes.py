from pathlib import Path
import re

themes_js = Path(r"D:/App-Certificate/js/themes.js").read_text(encoding="utf-8")
part = themes_js.split("const CERT_THEMES")[1]
ids = re.findall(r'preview: "\./assets/theme-([^"]+)\.png"', part)
print("themes", len(ids), ids)

# trailing commas in style objects are fine in modern JS
lines = [
    'const CACHE_NAME = "certificate-studio-v10";',
    "const ASSETS = [",
    '  "./",',
    '  "./index.html",',
    '  "./css/styles.css",',
    '  "./js/app.js",',
    '  "./js/themes.js",',
    '  "./vendor/qrcode.min.js",',
    '  "./vendor/html2canvas.min.js",',
    '  "./vendor/jspdf.umd.min.js",',
    '  "./assets/pandenik-logo.png",',
    '  "./assets/pandenik-logo-transparent.png",',
    '  "./assets/template-reference.png",',
]
for i in ids:
    lines.append(f'  "./assets/theme-{i}.png",')
for i in ids:
    lines.append(f'  "./assets/theme-frame-{i}.png",')
lines.append("];")
lines.append("")

sw = Path(r"D:/App-Certificate/sw.js")
rest = sw.read_text(encoding="utf-8")
idx = rest.find("self.addEventListener")
tail = rest[idx:]
sw.write_text("\n".join(lines) + "\n" + tail, encoding="utf-8")

assets = Path(r"D:/App-Certificate/assets")
missing = [f"theme-{i}.png" for i in ids if not (assets / f"theme-{i}.png").exists()]
missing += [f"theme-frame-{i}.png" for i in ids if not (assets / f"theme-frame-{i}.png").exists()]
print("missing", missing)
print("sw fixed")
