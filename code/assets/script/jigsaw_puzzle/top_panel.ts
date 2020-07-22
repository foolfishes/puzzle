import {TimeUtil} from "../utils/time_util";


export class TopPanel{
    timeText: cc.Node = null;

    reset(parent: cc.Node, piece: number, level: number=null) {
        let numText = parent.getChildByName("piecesnum").getChildByName("num");
        numText.getComponent(cc.Label).string = piece.toString();
        if (level != null) {
            let levelText = parent.getChildByName("level").getChildByName("lb_level");
            levelText.getComponent(cc.Label).string = level.toString();
        }
        let startTime = (new Date()).getTime();
        let updateTime = function () {
            let t = Math.floor((new Date().getTime() - startTime)/1000);
            this.string = TimeUtil.formatTime(t);
        }
        if (this.timeText != null) {
            this.timeText.getComponent(cc.Label).unscheduleAllCallbacks();
        } else {
            this.timeText = parent.getChildByName("time").getChildByName("lb_time");
        }
        this.timeText.getComponent(cc.Label).schedule(updateTime, 1);
    }

    stop() {
        this.timeText.getComponent(cc.Label).unscheduleAllCallbacks();
    }

    // reset(piece) {
    //     this.timeText.getComponent(cc.Label).unscheduleAllCallbacks();
    //     let startTime = (new Date()).getTime();
    //     let updateTime = function () {
    //         let t = Math.floor((new Date().getTime() - startTime)/1000);
    //         this.string = TimeUtil.formatTime(t);
    //     }
    //     this.timeText.getComponent(cc.Label).schedule(updateTime, 1);
    // }

    destroy() {
        this.timeText = null;
    }
}