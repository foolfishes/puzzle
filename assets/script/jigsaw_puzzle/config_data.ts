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
        "simple": [4, 7, 247, 199.88],
        "normal":[5, 8, 215, 220, 175],
        "hard": [7, 11, 156, 126.24],
        "crazy": [9, 14, 123, 99.54]
    }
}

