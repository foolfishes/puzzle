let popWin = cc.Class({
    extends: cc.Component,

    ctor: function() {
        // this.rootNode = null
        this.contentNode = null
        this.resPath = null
        this.closeOnBgTouch = true
    },

    onShow: function() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBgTouch, this)
        cc.find("Canvas").addChild(this.node)
        this.contentNode.scale = 0.8
        this.contentNode.opacity = 0
        let fadeIn = cc.fadeIn(0.2)
        let scale = cc.scaleTo(0.2, 1)
        this.contentNode.runAction(cc.spawn(fadeIn, scale))
    },

    onClose: function(clear=true) {
        let after = function() {
            this.node.destroy()
            if (this.resPath != null && clear) {
                cc.loader.releaseRes(this.resPath)
                cc.log("release res: ", this.resPath)
            }
        }
        let fadeOut = cc.fadeOut(0.2)
        let scale = cc.scaleTo(0.2, 0.8)
        let call = cc.callFunc(after, this)
        cc.log("this: ", this.contentNode)
        this.contentNode.runAction(cc.sequence(cc.spawn(fadeOut, scale), call))
    },

    onBgTouch: function(event) {
        // 防止穿透
        event.stopPropagation()
        if (this.closeOnBgTouch) {
            this.onClose()
        }
    },

    closeWin: function(clear=true) {
        this.onClose(clear)
    }
})

module.exports = {
    popWin
}