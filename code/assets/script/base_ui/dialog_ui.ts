import {PopUI} from "./pop_ui"
import {ButtonStyle} from "../common/com_define"
import {Language} from "../common/language"
import {UIUtil} from "../utils/ui_util"

const {ccclass, property} = cc._decorator;

export class DialogUI extends PopUI{
    content: string;
    title: string;
    okTitle: string;
    cancelTitle: string;
    okCallback: any = null;
    cancelCallback: any = null;
    buttonStyle: ButtonStyle;

    constructor(content: string, title?: string, okTitle?: string, cancelTitle?: string,okCallback?: any,  cancelCallback?: any, buttonStyle=ButtonStyle.OK_CANCEL,) {
        super("prefabs/layer_dialog")
        this.content = content;
        this.title = title != null ? title: Language.TIPS;
        this.okTitle = okTitle !=null ? okTitle: Language.CONFIRM;
        this.cancelTitle = cancelTitle != null ? cancelTitle: Language.CANCEL;
        this.okCallback = okCallback;
        this.cancelCallback = cancelCallback;
        this.buttonStyle = buttonStyle;
    }

    initUI() {
        this.contentNode = this.rootNode.getChildByName("panel_root")
        this.contentNode.getChildByName("content").getComponent(cc.Label).string = this.content;
        UIUtil.getChildByName(this.contentNode, "cancel/Background/Label").getComponent(cc.Label).string = this.cancelTitle;
        UIUtil.getChildByName(this.contentNode, "confirm/Background/Label").getComponent(cc.Label).string = this.okTitle;
        let btnOk = this.contentNode.getChildByName("confirm");
        let btnCancel = this.contentNode.getChildByName("cancel");
        if (this.buttonStyle == ButtonStyle.OK_CANCEL) {
        } else if (this.buttonStyle == ButtonStyle.OK) {
            btnCancel.active = false;
            btnOk.x = 0;
        } else {
            btnCancel.x = 0;
            btnOk.active = false;
        }

        UIUtil.addListener(btnOk, this.onOkCallback.bind(this));
        UIUtil.addListener(btnCancel, this.onCancelCallback.bind(this));
        UIUtil.addListener(this.contentNode, (event)=>{event.stopPropagation()});
        UIUtil.addListener(this.contentNode.getChildByName("btn_close"), this.close.bind(this));
        this.onShow()
    }

    onOkCallback() {
        if (this.okCallback) {
            this.okCallback()
        }
        this.close()
    }

    onCancelCallback() {
        if (this.cancelCallback) {
            this.cancelCallback()
        }
        this.close()
    }

}
