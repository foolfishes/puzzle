// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {UIManager} from "./ui_manager"


const {ccclass, property} = cc._decorator;

@ccclass
export class FullScreen extends cc.Component{

    @property
    isBg: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let manager = UIManager.getInstance()
        if (this.isBg) {
            this.node.setScale(manager.fullScreenScale);   // bg 必须使用设计分辨率image
        } else {
            this.node.setScale(manager.globalScale);
        }
    }

    start () {
    }

    // update (dt) {},
}
