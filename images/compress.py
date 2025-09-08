import os
import time
from datetime import datetime
from PIL import Image
from PIL.ExifTags import TAGS

# === Configuration ===
input_folder = os.path.dirname(os.path.abspath(__file__))
output_folder = None  # None = overwrite originals
quality = 70  # JPEG quality level

def get_photo_taken_date(image_path):
    """获取照片的拍摄日期"""
    try:
        with Image.open(image_path) as img:
            exif_data = img._getexif()
            if exif_data:
                for tag_id, value in exif_data.items():
                    tag = TAGS.get(tag_id, tag_id)
                    if tag == "DateTime":
                        return datetime.strptime(value, '%Y:%m:%d %H:%M:%S').timestamp()
    except Exception:
        pass
    return None

def is_already_compressed(file_path):
    """判断文件是否已经压缩过：修改日期和拍摄日期差距大于1天"""
    try:
        # 获取文件修改时间
        modified_time = os.path.getmtime(file_path)
        
        # 获取照片拍摄时间
        taken_time = get_photo_taken_date(file_path)
        
        if taken_time is None:
            # 如果无法获取拍摄时间，则认为未压缩过
            # print(f"Cannot get taken date for {file_path}, assuming compressed.")
            return True

        # 计算时间差（秒）
        time_diff = abs(modified_time - taken_time)
        
        # 如果差距大于1天（86400秒），则认为已经压缩过
        return time_diff > 86400
    except Exception:
        return False

def compress_jpgs(root_folder, output_folder=None, quality=70):
    for foldername, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.lower().endswith(('.jpg', '.jpeg')):
                full_path = os.path.join(foldername, filename)
                
                # 检查是否已经压缩过
                if is_already_compressed(full_path):
                    # print(f"Skipping (already compressed): {full_path}")
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
compress_jpgs(input_folder, output_folder=output_folder, quality=quality)
