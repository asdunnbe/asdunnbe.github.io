#!/usr/bin/env python3
import os
import sys
from PIL import Image

MAX_EDGE = 500  # pixels

# Optional HEIC support: pip install pillow-heif
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    print('Missing pillow-heif support. ')

def convert_folder(input_dir, output_dir, out_ext="jpg"):
    """
    Convert every file in input_dir to out_ext (jpg or png),
    saving into output_dir as 1.jpg, 2.jpg, …
    """
    os.makedirs(output_dir, exist_ok=True)
    # list & sort all files
    files = sorted(
        f for f in os.listdir(input_dir)
        if os.path.isfile(os.path.join(input_dir, f))
    )
    for idx, fname in enumerate(files, start=1):
        src = os.path.join(input_dir, fname)
        dst_name = f"{idx}.{out_ext.lower()}"
        dst  = os.path.join(output_dir, dst_name)

        try:
            with Image.open(src) as img:
                # if saving JPEG, drop alpha channel
                if out_ext.lower() in ("jpg", "jpeg"):
                    img = img.convert("RGB")
                    out_format = "JPEG"
                else:
                    img = img.convert("RGBA")
                    out_format = "PNG"

                # resize so the longest edge is at most MAX_EDGE
                resample_filter = getattr(Image, "Resampling", None)
                if resample_filter:
                    resample = Image.Resampling.LANCZOS
                else:
                    resample = Image.LANCZOS
                img.thumbnail((MAX_EDGE, MAX_EDGE), resample=resample)

                img.save(dst, format=out_format)
                print(f"[OK] {src} → {dst}")
        except Exception as e:
            print(f"[SKIP] {src}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_images.py <input_folder> <output_folder> [jpg|png]")
        sys.exit(1)

    in_folder  = sys.argv[1]
    out_folder = sys.argv[2]
    ext = sys.argv[3] if len(sys.argv) > 3 else "jpg"

    if ext.lower() not in ("jpg", "jpeg", "png"):
        print("Error: output extension must be jpg or png")
        sys.exit(1)

    convert_folder(in_folder, out_folder, ext)
