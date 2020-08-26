# -*- coding:utf-8 -*-
import sys
import os
import re

# 将当前目录下的资源文件按照顺序重新命名
# 需要在当前文件路径下执行 **


def rename(path):
    pattern = r".+?-Piece-([0-9]+\.png)"
    for file in os.listdir(path):
        result = re.match(pattern, file)
        if not result:
            continue
        new_name = "/".join([path, result.group(1)])
        old_name = "/".join([path, file])
        os.rename(old_name, new_name)
        

# 执行参数 python rename_piece.py # id type

IMG_ID = 10000
CROP_TYPE = "normal"

if __name__ == "__main__":
    args = sys.argv
    # img_id = args[1] if len(args)>1 else IMG_ID
    # crop_type = args[2] if len(args)>2 else CROP_TYPE
    root_dir = os.getcwd().replace("\\", "/").rpartition("/")[0]
    # file_dir = "/".join([root_dir, "origin", str(img_id), str(crop_type)])
    file_dir = "/".join([root_dir, "origin", "tmp"])
    if not os.path.exists(file_dir):
        print file_dir, "file path not exist!!!"
    else:
        rename(file_dir)
    print "finish!"
    