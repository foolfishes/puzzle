
export class BoardSize {
    static width: number = 1400;
    static height: number = 900;
    static scale: number = 0.6;   // 图片缩放比例，实际大小为1400*900 * scale
}

export class LevelType {
    static SIMPLE = 0;
    static NORMAL = 1;
    static HARD = 2;
    // 行数，列数
    static RowColumn = [[4, 6,], [5, 8],[7, 11]];
}

// cc.Class({
//     extends: cc.Component,

//     properties: {
//        board: cc.Node,
//        timer: cc.Node,
//        level: 5,
//        winPanel: cc.Node,
//        isOver: false,
//        beginTime: 0

//     },

//     // LIFE-CYCLE CALLBACKS:

//     // onLoad () {},

//     start () {
//         // this.addListeners()
//         this.board.getComponent("board").init(this)
//         this.begin()
//         this.isOver = false
//         this.beginTime = (new Date()).getTime()
//     },

//     update() {
//         if (!this.isOver) {
//             var time = ((new Date()).getTime() - this.beginTime) / 1000
//             this.timer.getComponent(cc.Label).string = time.toFixed(2)
//         }
//     },

//     onDestroy() {
//         this.board = null
//         this.timer = null
//         this.winPanel = null
//     },

//     begin() {
//         // this.winPanel.active = false
//         this.board.getComponent("board").reset(this.level)
//         this.timer.string = "0"
//     },

//     over() {
//         // this.winPanel.active = true
//         this.isOver = true
//         cc.log("game over")
//     },

//     onBoardTouch: function(x, y) {
//         if (!this.isOver) {
//             let isMove = this.board.getComponent("board").movePiece(x, y);
//             if (!isMove) {
//                 cc.log("不符合规则");
//             } else {
//                 if (this.board.getComponent("board").judgeFinish()) {
//                     this.over();
//                 }
//             }
//         }
//     }

// });
