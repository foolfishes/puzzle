// 基础图片大小(1400, 900), 基于此来进行分割

export class BoardSize {
    static width: number = 1400;
    static height: number = 900;
}

export class LevelType {
    static simple = 0;
    static normal = 1;
    static hard = 2;
    static crazy = 3;
    static level_desc = ["simple", "normal", "hard", "crazy"]
    static SplitData = [
        [4, 6, 302, 296],   // 行数，列数，小图piece大小(查看裁剪后图像大小)
        [5, 8, 229, 234],
        [7, 11, 167, 168],
        [9, 14, 130, 131]]
}

