from __future__ import annotations

from pathlib import Path
import shutil

from PIL import Image, ImageChops, ImageOps


ROOT = Path("dist")
SOURCE = ROOT / "foto" / "foto.png"
DESTINATION = ROOT / "foto" / "foto.webp"
EXPECTED_SIZE = (350, 350)


def main() -> None:
    source_directory = Path("foto")
    if not source_directory.is_dir():
        raise SystemExit(f"Missing source portrait directory: {source_directory}")
    shutil.copytree(source_directory, ROOT / "foto", dirs_exist_ok=True)

    if not SOURCE.is_file():
        raise SystemExit(f"Missing original contact portrait: {SOURCE}")

    with Image.open(SOURCE) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.size != EXPECTED_SIZE:
            raise SystemExit(
                f"Contact portrait must remain {EXPECTED_SIZE[0]}x{EXPECTED_SIZE[1]}, "
                f"got {image.width}x{image.height}"
            )

        has_alpha = "A" in image.getbands() or "transparency" in image.info
        image = image.convert("RGBA" if has_alpha else "RGB")
        image.load()

    DESTINATION.parent.mkdir(parents=True, exist_ok=True)
    image.save(DESTINATION, format="WEBP", lossless=True, method=6)

    with Image.open(DESTINATION) as encoded:
        if encoded.format != "WEBP" or encoded.size != EXPECTED_SIZE:
            raise SystemExit("Generated contact portrait is not a 350x350 WebP image")
        decoded = encoded.convert(image.mode)
        difference = ImageChops.difference(image, decoded)
        if any(channel.getbbox() is not None for channel in difference.split()):
            raise SystemExit("Lossless WebP verification failed: pixel values changed")

    source_size = SOURCE.stat().st_size
    webp_size = DESTINATION.stat().st_size
    reduction = (1 - webp_size / source_size) * 100 if source_size else 0
    print(
        "Contact portrait converted and pixel-verified: "
        f"350x350 lossless WebP, {source_size} -> {webp_size} bytes "
        f"({reduction:.1f}% size change). Original PNG remains available."
    )


if __name__ == "__main__":
    main()
