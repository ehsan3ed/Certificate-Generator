from pathlib import Path
import re

t = Path(r"D:/App-Certificate/js/themes.js").read_text(encoding="utf-8")
part = t.split("const CERT_THEMES")[1]
ids = re.findall(r'id: "([^"]+)"', part)
print("count", len(ids))
assets = Path(r"D:/App-Certificate/assets")
missing = []
for i in ids:
    for pref in ("theme-", "theme-frame-"):
        p = assets / f"{pref}{i}.png"
        if not p.exists():
            missing.append(p.name)
print("missing", missing)

# rebuild sw asset list lines
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
rest = Path(r"D:/App-Certificate/sw.js").read_text(encoding="utf-8")
# keep event listeners from old file
idx = rest.find("self.addEventListener")
tail = rest[idx:]
Path(r"D:/App-Certificate/sw.js").write_text("\n".join(lines) + "\n" + tail, encoding="utf-8")
print("sw.js updated")
