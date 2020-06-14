// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


cc.Class({
    extends: cc.Component,

    properties: {
        isBg: true
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let uiManager = require("./ui_manager")
        manager = uiManager.getUIManager()
        if (this.isBg) {
            this.node.setScale(manager.fullScreenScale)   // bg 必须使用设计分辨率image
        } else {
            this.node.setScale(manager.globalScale)
        }
    },

    start () {
    },

    // update (dt) {},
});
