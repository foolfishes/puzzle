// 基础图片大小(1400, 900), 基于此来进行分割

export class BoardSize {
    static width: number = 1400;
    static height: number = 900;
}

export class SplitLv {
    static simple = "simple";
    static normal = "normal";
    static hard = "hard";
    static crazy = "crazy";
    static SplitData = {
        "simple": [4, 6, 302, 296],   // 行数，列数，小图piece大小(查看裁剪后图像大小)
        "normal":[5, 8, 229, 234],
        "hard": [7, 11, 167, 168],
        "crazy": [9, 14, 130, 131]
    }
}

