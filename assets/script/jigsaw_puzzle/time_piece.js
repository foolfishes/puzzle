let timeUtil = require("../common/time_util")

let TimePiece = cc.Class({

    ctor: function () {
        this.startTime = 0
        this.numText = null;
        this.timeText = null;
    },

    init: function(parent, num) {
        this.numText = parent.getChildByName("piecesnum").getChildByName("num")
        this.timeText = parent.getChildByName("time").getChildByName("lb_time")
        this.numText.getComponent(cc.Label).string = num
        this.startTime = (new Date()).getTime()
        cc.director.getScheduler().schedule(this.updateTime, this, 1)
    },

    updateTime: function() {
        let t = Math.floor((new Date().getTime() - this.startTime)/1000)
        this.timeText.getComponent(cc.Label).string = timeUtil.formatTime(t)
    },

    onDestroy: function() {
        cc.director.getScheduler().unschedule(this.updateTime, this)
    }
})

module.exports = {
    "TimePiece": TimePiece
}