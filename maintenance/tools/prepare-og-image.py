from __future__ import annotations

from io import BytesIO
from pathlib import Path
import shutil

from PIL import Image, ImageOps

SOURCE = Path("og.png")
ROOT_OUTPUT = Path("og.jpg")
SITE_OUTPUT = Path("plain-site/og.jpg")
EXPECTED_SIZE = (1200, 630)
JPEG_QUALITY = 93


def main() -> None:
    if not SOURCE.is_file() or SOURCE.stat().st_size == 0:
        raise SystemExit("Missing source image: og.png")

    with Image.open(SOURCE) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.size != EXPECTED_SIZE:
            raise SystemExit(
                f"Source must be exactly {EXPECTED_SIZE[0]}x{EXPECTED_SIZE[1]}; "
                f"got {image.width}x{image.height}"
            )
        image = image.convert("RGB")

    buffer = BytesIO()
    image.save(
        buffer,
        format="JPEG",
        quality=JPEG_QUALITY,
        subsampling=0,
        optimize=True,
        progressive=True,
    )
    jpeg_bytes = buffer.getvalue()
    if not jpeg_bytes:
        raise SystemExit("JPEG conversion produced an empty file")

    ROOT_OUTPUT.write_bytes(jpeg_bytes)
    SITE_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    SITE_OUTPUT.write_bytes(jpeg_bytes)

    with Image.open(ROOT_OUTPUT) as result:
        if result.format != "JPEG" or result.size != EXPECTED_SIZE:
            raise SystemExit("Generated root og.jpg failed format/dimension validation")
    if ROOT_OUTPUT.read_bytes() != SITE_OUTPUT.read_bytes():
        raise SystemExit("plain-site/og.jpg is not byte-identical to root og.jpg")

    print(
        f"Created {ROOT_OUTPUT} and synchronized {SITE_OUTPUT}: "
        f"{EXPECTED_SIZE[0]}x{EXPECTED_SIZE[1]}, "
        f"{len(jpeg_bytes):,} bytes, JPEG quality {JPEG_QUALITY}. "
        "Original og.png was preserved."
    )


if __name__ == "__main__":
    main()
