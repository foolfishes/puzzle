// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       board: cc.Node,
       timer: cc.Node,
       level: 5,
       winPanel: cc.Node,
       isOver: false,
       beginTime: 0

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.addListeners()
        this.board.getComponent("board").init(this)
        this.begin()
        this.isOver = false
        this.beginTime = (new Date()).getTime()
    },

    update() {
        if (!this.isOver) {
            var time = ((new Date()).getTime() - this.beginTime) / 1000
            this.timer.getComponent(cc.Label).string = time.toFixed(2)
        }
    },

    onDestroy() {
        this.board = null
        this.timer = null
        this.winPanel = null
    },

    begin() {
        // this.winPanel.active = false
        this.board.getComponent("board").reset(this.level)
        this.timer.string = "0"
    },

    over() {
        // this.winPanel.active = true
        this.isOver = true
        cc.log("game over")
    },

    onBoardTouch: function(x, y) {
        if (!this.isOver) {
            let isMove = this.board.getComponent("board").movePiece(x, y);
            if (!isMove) {
                cc.log("不符合规则");
            } else {
                if (this.board.getComponent("board").judgeFinish()) {
                    this.over();
                }
            }
        }
    }

});
