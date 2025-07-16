import os
import time
from datetime import datetime
from PIL import Image

# === Configuration ===
input_folder = '.'
output_folder = None  # None = overwrite originals
quality = 70  # JPEG quality level

# Set a cutoff time: Skip files modified after this time
# Format: 'YYYY-MM-DD HH:MM:SS'
cutoff_str = '2025-07-16 00:00:00'
cutoff_timestamp = time.mktime(datetime.strptime(cutoff_str, '%Y-%m-%d %H:%M:%S').timetuple())

def compress_jpgs(root_folder, output_folder=None, quality=70, cutoff=None):
    for foldername, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.lower().endswith(('.jpg', '.jpeg')):
                full_path = os.path.join(foldername, filename)
                
                # Skip if file is newer than cutoff
                last_modified = os.path.getmtime(full_path)
                if cutoff and last_modified > cutoff:
                    print(f"Skipping (too new): {full_path}")
                    continue

                try:
                    with Image.open(full_path) as img:
                        img = img.convert("RGB")
                        if output_folder:
                            rel_path = os.path.relpath(foldername, root_folder)
                            save_dir = os.path.join(output_folder, rel_path)
                            os.makedirs(save_dir, exist_ok=True)
                            save_path = os.path.join(save_dir, filename)
                        else:
                            save_path = full_path

                        img.save(save_path, "JPEG", quality=quality, optimize=True)
                        print(f"Compressed: {save_path}")
                except Exception as e:
                    print(f"Failed to compress {full_path}: {e}")

# === Run the script ===
compress_jpgs(input_folder, output_folder=output_folder, quality=quality, cutoff=cutoff_timestamp)
