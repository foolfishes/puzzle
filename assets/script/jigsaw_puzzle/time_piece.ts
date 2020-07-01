import {TimeUtil} from "../common/time_util";


export class TimePiece{
    numText: cc.Node = null;
    timeText: cc.Node = null;

    init(parent: cc.Node, num: number) {
        this.numText = parent.getChildByName("piecesnum").getChildByName("num");
        this.timeText = parent.getChildByName("time").getChildByName("lb_time");
        this.numText.getComponent(cc.Label).string = num.toString();
        let startTime = (new Date()).getTime();
        let updateTime = function () {
            let t = Math.floor((new Date().getTime() - startTime)/1000);
            this.string = TimeUtil.formatTime(t);
        }
        this.timeText.getComponent(cc.Label).schedule(updateTime, 1);
    }

    stop() {
        this.timeText.getComponent(cc.Label).unscheduleAllCallbacks();
    }

    reset() {
        this.timeText.getComponent(cc.Label).unscheduleAllCallbacks();
        let startTime = (new Date()).getTime();
        let updateTime = function () {
            let t = Math.floor((new Date().getTime() - startTime)/1000);
            this.string = TimeUtil.formatTime(t);
        }
        this.timeText.getComponent(cc.Label).schedule(updateTime, 1);
    }

    // updateTime() {
    //     cc.log("update time")
    //     let t = Math.floor((new Date().getTime() - this.startTime)/1000)
    //     this.timeText.getComponent(cc.Label).string = TimeUtil.formatTime(t)
    // }

    destroy() {
        this.timeText = null;
        this.numText = null;
    }
}