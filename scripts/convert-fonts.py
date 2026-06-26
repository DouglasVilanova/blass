# Converte os OTFs da Exo 2 (pasta do mockup) para woff2 subsetado (latin + acentos PT).
# Uso: python scripts/convert-fonts.py
import os
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options, parse_unicodes

SRC = os.path.join("SITE BLASS NOVO", "exo_2")
OUT = os.path.join("public", "fonts", "exo2")
os.makedirs(OUT, exist_ok=True)

JOBS = [
    ("Exo2-Regular.otf", "exo2-400.woff2"),
    ("Exo2-Medium.otf", "exo2-500.woff2"),
    ("Exo2-SemiBold.otf", "exo2-600.woff2"),
    ("Exo2-Bold.otf", "exo2-700.woff2"),
    ("Exo2-ExtraBold.otf", "exo2-800.woff2"),
]

# Latin básico + Latin-1 (acentos PT-BR) + pontuação tipográfica comum
UNICODES = parse_unicodes("U+0020-007F,U+00A0-00FF,U+2013-2014,U+2018-201E,U+2026,U+20AC,U+2122")

total = 0
for src, out in JOBS:
    font = TTFont(os.path.join(SRC, src))
    opt = Options()
    opt.desubroutinize = True
    opt.layout_features = ["kern", "liga"]
    ss = Subsetter(options=opt)
    ss.populate(unicodes=UNICODES)
    ss.subset(font)
    font.flavor = "woff2"
    path = os.path.join(OUT, out)
    font.save(path)
    kb = os.path.getsize(path) // 1024
    total += kb
    print(f"{out}  {kb}KB")
print(f"total: {total}KB")
