import sys
import os
import json

def main():
    files = sys.argv[1:]
    img_list = []
    for f in files:
        # Use forward slashes for web paths
        url = f.replace("\\", "/")
        # Trim to start with /images
        idx = url.find("/images")
        if idx != -1:
            url = url[idx:]
        img_list.append({"url": url, "caption": ""})
    print("\"img\": " + json.dumps(img_list, ensure_ascii=False, separators=(",", ":")) + ",")

if __name__ == "__main__":
    main()