let UIUtil = require("../common/ui_util")
let popWin = require("../common/pop_win").popWin

cc.Class({
    extends: popWin,

    ctor: function() {
        this.resPath = "prefabs/layer_origin_img"
    },

    init: function(imgPath) {
        let img = this.node.getChildByName("image")
        this.contentNode = img
        // img.getChildByName("btn_close").on(cc.Node.EventType.TOUCH_END, this.close, this)
        UIUtil.addListener(img.getChildByName("btn_close"), this.closeWin.bind(this))
        UIUtil.addListener(img, (event)=>{event.stopPropagation()})
        UIUtil.loadTexture(img, imgPath, this.onShow.bind(this))
    },
})