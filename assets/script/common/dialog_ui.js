let comDefine = require("../common/com_define")
let language = require("../common/language").languege
let popWin = require("../common/pop_win").popWin
let UIUtil = require("../common/ui_util")

cc.Class({
    extends: popWin,

    ctor: function() {
        this.okCallback = null
        this.cancelCallback = null
        this.resPath = "prefabs/layer_dialog"
    },

    init: function(tips, title=null, buttonStyle=comDefine.buttonStyle.ok_cancel, okCallback=null, 
        cancelCallback=null, okTitle=null, cancelTitle=null) {
        this.contentNode = this.node.getChildByName("panel_root")
        title = title != null ? title: language.title
        okTitle = okTitle !=null ? okTitle: language.confirm
        cancelTitle = cancelTitle != null ? cancelTitle: language.cancel
        this.okCallback = okCallback
        this.cancelCallback = cancelCallback
        UIUtil.getChildByName(this.contentNode, "cancel/Background/Label").string = cancelTitle
        UIUtil.getChildByName(this.contentNode, "confirm/Background/Label").string = okTitle
        let btnOk = this.contentNode.getChildByName("confirm")
        let btnCancel = this.contentNode.getChildByName("cancel")
        if (buttonStyle == comDefine.buttonStyle.ok_cancel) {
        } else if (buttonStyle == comDefine.buttonStyle.ok) {
            btnCancel.active = false
            btnOk.x = 0
        } else {
            btnCancel.x = 0
            btnOk.active = false
        }

        UIUtil.addListener(btnOk, this.onOkCallback.bind(this))
        UIUtil.addListener(btnCancel, this.onCancelCallback.bind(this))
        UIUtil.addListener(this.contentNode, (event)=>{event.stopPropagation()})
        UIUtil.addListener(this.contentNode.getChildByName("btn_close"), this.closeWin.bind(this))
        this.onShow()
    },

    onOkCallback: function() {
        if (this.okCallback) {
            this.okCallback()
        }
        this.closeWin()
    },

    onCancelCallback: function() {
        if (this.cancelCallback) {
            this.cancelCallback()
        }
        this.closeWin()
    }

});
