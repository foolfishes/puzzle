# -*- coding:utf-8 -*-
import sys
import os
import re


def rename(path):
    for file in os.listdir(path):
        if "-fs8" in file:
            new_file = file.replace("-fs8", "")
            new_name = "/".join([path, new_file])
            old_name = "/".join([path, file])
            os.rename(old_name, new_name)


if __name__ == "__main__":
    root_dir = os.getcwd().replace("\\", "/").rpartition("/")[0]
    # file_dir = "/".join([root_dir, "origin", str(img_id), str(crop_type)])
    file_dir = "/".join([root_dir, "origin", "packer"])
    if not os.path.exists(file_dir):
        print file_dir, "file path not exist!!!"
    else:
        rename(file_dir)
    print "finish!"
    