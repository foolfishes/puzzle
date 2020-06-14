// 基础图片大小(1400, 900), 基于此来进行分割
let boardSize = [1400, 900]

let splitLv = {
    "simple": [4, 7, 247, 199.88],
    "normal": [5, 8, 215, 220, 175], // ✔
    "hard": [7, 11, 156, 126.24],
    "crazy": [9, 14, 123, 99.54]
}

module.exports = {
    boardSize,
    splitLv
}