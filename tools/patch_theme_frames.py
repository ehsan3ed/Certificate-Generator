from pathlib import Path
import re

p = Path(r"D:\App-Certificate\js\themes.js")
t = p.read_text(encoding="utf-8")
# remove any previous frame lines to keep idempotent
t = re.sub(r"\n\s*frame: \"./assets/theme-frame-[a-z0-9-]+\.png\",", "", t)

def add_frame(m: re.Match) -> str:
    preview = m.group(0)
    name = re.search(r"theme-([a-z0-9-]+)\.png", preview).group(1)
    return f'{preview}\n    frame: "./assets/theme-frame-{name}.png",'

t2 = re.sub(r'preview: "./assets/theme-[a-z0-9-]+\.png",', add_frame, t)
p.write_text(t2, encoding="utf-8")
print("frames", t2.count("frame:"))
