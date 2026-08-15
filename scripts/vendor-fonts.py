#!/usr/bin/env python3
"""Vendor the four brand faces into src/assets/fonts as self-hosted woff2.

Why this exists: `next/font/google` downloads the woff2 binaries from
fonts.gstatic.com during `next build`. Google periodically re-cuts those
binaries and rotates the hashed URLs, and the fonts.googleapis.com edge can
keep serving CSS that points at the previous generation for a while. When a
production build lands in that window the downloads 404, Next.js reports it
as a *warning* rather than an error, and the deploy ships without the font.
Vendoring removes the network from the build entirely.

Run this only when a face needs to change (new weight, new subset, upstream
release). It is not part of `npm run build`.

    pip install fonttools brotli
    python3 scripts/vendor-fonts.py

Sources are the upstream OFL originals in github.com/google/fonts; each family
keeps its OFL.txt next to the binaries. Glyph coverage is subset to the same
unicode ranges Google serves for the subsets we ask for, so the files stay
close in size to what next/font/google produced.
"""

from __future__ import annotations

import re
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "fonts"
GOOGLE_FONTS_RAW = "https://raw.githubusercontent.com/google/fonts/main"
# A modern desktop UA so the CSS API answers with woff2 + unicode-range.
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


@dataclass
class Face:
    """One output woff2 file."""

    upstream: str  # path under github.com/google/fonts
    out: str  # filename written into OUT_DIR


@dataclass
class Family:
    name: str  # Google Fonts family name, for the unicode-range lookup
    directory: str  # path under github.com/google/fonts holding OFL.txt
    subsets: list[str]  # Google subset names to keep
    faces: list[Face] = field(default_factory=list)
    # Variable axis limits, e.g. {"wght": "300:700"}. Must stay in sync with
    # the `weight` range declared for the face in src/lib/fonts.ts — shipping a
    # wider range than the CSS advertises is dead weight in a preloaded file.
    axes: dict[str, str] = field(default_factory=dict)


FAMILIES = [
    Family(
        name="Newsreader",
        directory="ofl/newsreader",
        subsets=["latin"],
        faces=[
            Face("ofl/newsreader/Newsreader[opsz,wght].ttf", "Newsreader-latin.woff2"),
            Face(
                "ofl/newsreader/Newsreader-Italic[opsz,wght].ttf",
                "Newsreader-latin-italic.woff2",
            ),
        ],
        axes={"wght": "300:700"},
    ),
    Family(
        name="JetBrains Mono",
        directory="ofl/jetbrainsmono",
        subsets=["latin"],
        faces=[
            Face(
                "ofl/jetbrainsmono/JetBrainsMono[wght].ttf",
                "JetBrainsMono-latin.woff2",
            )
        ],
        axes={"wght": "400:600"},
    ),
    Family(
        name="IBM Plex Sans Arabic",
        directory="ofl/ibmplexsansarabic",
        # Arabic copy mixes in Latin (product names, numerals, code), so both
        # scripts have to live in the same file: next/font/local has no
        # per-source unicode-range, and two @font-face rules with identical
        # family/weight/style would shadow each other instead of composing.
        subsets=["arabic", "latin"],
        faces=[
            Face(f"ofl/ibmplexsansarabic/IBMPlexSansArabic-{style}.ttf", out)
            for style, out in [
                ("Light", "IBMPlexSansArabic-300.woff2"),
                ("Regular", "IBMPlexSansArabic-400.woff2"),
                ("Medium", "IBMPlexSansArabic-500.woff2"),
                ("SemiBold", "IBMPlexSansArabic-600.woff2"),
                ("Bold", "IBMPlexSansArabic-700.woff2"),
            ]
        ],
    ),
    Family(
        name="Jomhuria",
        directory="ofl/jomhuria",
        subsets=["arabic", "latin"],
        faces=[Face("ofl/jomhuria/Jomhuria-Regular.ttf", "Jomhuria-400.woff2")],
    ),
]


def fetch(url: str, *, ua: bool = False) -> bytes:
    request = urllib.request.Request(url)
    if ua:
        request.add_header("User-Agent", UA)
    with urllib.request.urlopen(request) as response:
        return response.read()


def unicode_ranges(family: Family) -> str:
    """The union of Google's unicode-ranges for the subsets we keep.

    Read live from the CSS API rather than hardcoded, so a subset that gains
    codepoints upstream is picked up the next time this script runs.
    """
    query = urllib.parse.urlencode({"family": family.name, "display": "swap"})
    css = fetch(f"https://fonts.googleapis.com/css2?{query}", ua=True).decode()

    found: dict[str, str] = {}
    for subset, block in re.findall(r"/\*\s*([\w-]+)\s*\*/(.*?)\}", css, re.DOTALL):
        if subset not in family.subsets or subset in found:
            continue
        match = re.search(r"unicode-range:\s*([^;]+);", block)
        if match:
            found[subset] = match.group(1).strip()

    missing = [s for s in family.subsets if s not in found]
    if missing:
        raise SystemExit(
            f"{family.name}: no unicode-range for subset(s) {', '.join(missing)}"
        )

    # pyftsubset takes bare codepoints, not the CSS `U+` notation.
    merged = ",".join(found[subset] for subset in family.subsets)
    return merged.replace("U+", "").replace(" ", "")


def build_family(family: Family, tmp: Path) -> None:
    unicodes = unicode_ranges(family)

    license_text = fetch(f"{GOOGLE_FONTS_RAW}/{family.directory}/OFL.txt")
    (OUT_DIR / f"{family.directory.split('/')[-1]}-OFL.txt").write_bytes(license_text)

    for face in family.faces:
        source = tmp / Path(face.upstream).name
        source.write_bytes(
            fetch(f"{GOOGLE_FONTS_RAW}/{urllib.parse.quote(face.upstream)}")
        )

        if family.axes:
            clipped = tmp / f"clipped-{source.name}"
            subprocess.run(
                [
                    sys.executable,
                    "-m",
                    "fontTools.varLib.instancer",
                    str(source),
                    *(f"{axis}={limit}" for axis, limit in family.axes.items()),
                    f"--output={clipped}",
                ],
                check=True,
                stdout=subprocess.DEVNULL,
            )
            source = clipped

        destination = OUT_DIR / face.out
        subprocess.run(
            [
                sys.executable,
                "-m",
                "fontTools.subset",
                str(source),
                f"--unicodes={unicodes}",
                # Keep every OpenType feature: Arabic is unreadable without
                # `init`/`medi`/`fina`/`rlig` shaping, and the mono face relies
                # on `calt` for its coding ligatures.
                "--layout-features=*",
                "--flavor=woff2",
                "--desubroutinize",
                f"--output-file={destination}",
            ],
            check=True,
        )
        print(f"  {face.out}  {destination.stat().st_size / 1024:.0f} KB")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as raw:
        for family in FAMILIES:
            print(f"{family.name} [{', '.join(family.subsets)}]")
            build_family(family, Path(raw))


if __name__ == "__main__":
    main()
