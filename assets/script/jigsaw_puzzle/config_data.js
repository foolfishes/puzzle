// 基础图片大小(1400, 900), 基于此来进行分割
var splitLv = {
    "simple": [4, 7, 247, 199.88],   // rows, columns, size(outer), size(inner, =out*140/173)
    "normal": [5, 8, 216, 174.8],
    "hard": [7, 11, 156, 126.24],
    "crazy": [9, 14, 123, 99.54]
}


module.exports = {
    splitLv
}