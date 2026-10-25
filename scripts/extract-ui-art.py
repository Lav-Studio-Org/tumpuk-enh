"""Cut the DOM UI art out of the melonJS texture atlases.

The canvas game reads the atlases directly; the DOM layer (js/ui/) needs single
images. Run from the repo root after changing an atlas:  python3 scripts/extract-ui-art.py
"""
import json
import os
import re

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "ui")

# (atlas, frame) -> (output name, max width)
ART = {
    ("ResultUI", "result BG"): ("panel", 600),
    ("ResultUI", "result"): ("header", 520),
    ("ResultUI", "result info"): ("ribbon", 593),
    ("ResultUI", "result red"): ("btn-orange", 433),
    ("ResultUI", "result green"): ("btn-green", 452),
    ("ResultUI", "result HS"): ("row-crown", 520),
    ("ResultUI", "result star"): ("row-star", 486),
    ("ResultUI", "result coin"): ("row-coin", 499),
    ("ResultUI", "close result"): ("btn-close", 184),
    ("ResultUI", "home button"): ("btn-home", 207),
    ("ResultUI", "restart button"): ("btn-restart", 217),
    ("ResultUI", "result crown"): ("crown", 206),
    ("ResultUI", "result trophy"): ("trophy", 163),
    ("SettingsUI", "settingsBG"): ("panel-small", 561),
    ("SettingsUI", "slider bg"): ("slider-bg", 345),
    ("SettingsUI", "slider value"): ("slider-fill", 345),
    ("SettingsUI", "slider knob"): ("slider-knob", 115),
    ("Level_Gameplay", "blow"): ("skill-blower", 220),
    ("Level_Gameplay", "hammer"): ("skill-hammer", 220),
    ("Level_Gameplay", "bomb"): ("skill-bomb", 220),
    ("Level_Gameplay", "backBtn"): ("btn-back", 207),
    ("Level_Gameplay", "highscore"): ("plaque-crown", 308),
    ("LoadingAsset", "coin"): ("coin", 99),
    ("LoadingAsset", "logoGame"): ("logo", 462),
    ("image", "sign"): ("sign", 302),
}

WORLDS = {
    "KEBUN": "Kebun", "PASAR": "Pasar", "WARUNG": "Warung", "PANTAI": "Pantai",
    "HUTAN": "Hutan", "DESA": "Desa", "MISTERI": "Misteri",
}


def frames(atlas):
    with open(os.path.join(ROOT, "data/json", f"texture_{atlas}_0.json")) as f:
        data = json.load(f)
    image = Image.open(os.path.join(ROOT, "data/image", f"texture_{atlas}_0.webp")).convert("RGBA")
    out = {}
    for fr in data["frames"]:
        r = fr["frame"]
        crop = image.crop((r["x"], r["y"], r["x"] + r["w"], r["y"] + r["h"]))
        if fr.get("rotated"):
            crop = crop.rotate(90, expand=True)
        out[fr["filename"]] = crop
    return out


def save(img, path, max_w):
    if img.width > max_w:
        img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "WEBP", quality=88, method=6)


def preview_map():
    """suikaPreviewImages from config.js: LEVEL -> {ObjectKey: frameName}."""
    with open(os.path.join(ROOT, "js/script/config.js")) as f:
        src = f.read()
    block = src[src.index("game.var.suikaPreviewImages"):]
    block = block[: block.index("};") + 2]
    result, level = {}, None
    for line in block.splitlines():
        m = re.match(r"\s*([A-Z]+): \{", line)
        if m:
            level = m.group(1)
            result[level] = {}
            continue
        m = re.match(r'\s*(\w+): "([^"]+)"', line)
        if m and level:
            result[level][m.group(1)] = m.group(2)
    return result


def main():
    cache = {}
    for (atlas, name), (out, max_w) in ART.items():
        cache.setdefault(atlas, frames(atlas))
        save(cache[atlas][name], os.path.join(OUT, f"{out}.webp"), max_w)

    for level, objs in preview_map().items():
        fr = frames(WORLDS[level])
        save(fr[WORLDS[level]], os.path.join(OUT, "world", f"{level.lower()}.webp"), 360)
        for key, frame_name in objs.items():
            save(fr[frame_name], os.path.join(OUT, "obj", level.lower(), f"{key}.webp"), 128)


if __name__ == "__main__":
    main()
