import {PopWin} from "./pop_win"
import {ButtonStyle} from "./com_define"
import {Language} from "./language"
import {UIUtil} from "../utils/ui_util"

const {ccclass, property} = cc._decorator;

@ccclass
export class DialogUI extends PopWin{

    okCallback: any = null;
    cancelCallback: any = null;
    static resPath: string = "prefabs/layer_dialog";

    static createInstance() {
        cc.loader.loadRes(this.resPath, (err, prefab)=> {
            let panel = cc.instantiate(prefab);
            panel.active = true;
            let dialogCp: DialogUI =  panel.getComponent("dialog_ui");
            dialogCp.init("恭喜完成拼图！！！", "over", "重新开始", "退出");
        })
    }


    init(tips: string, 
        title?: string,
        okTitle?: string, 
        cancelTitle?: string,
        okCallback?: any, 
        cancelCallback?: any, 
        buttonStyle=ButtonStyle.OK_CANCEL, ) {
            this.contentNode = this.node.getChildByName("panel_root")
            title = title != null ? title: Language.TIPS;
            okTitle = okTitle !=null ? okTitle: Language.CONFIRM;
            cancelTitle = cancelTitle != null ? cancelTitle: Language.CANCEL;
            this.okCallback = okCallback;
            this.cancelCallback = cancelCallback;
            this.contentNode.getChildByName("content").getComponent(cc.Label).string = tips;
            UIUtil.getChildByName(this.contentNode, "cancel/Background/Label").getComponent(cc.Label).string = cancelTitle;
            UIUtil.getChildByName(this.contentNode, "confirm/Background/Label").getComponent(cc.Label).string = okTitle;
            let btnOk = this.contentNode.getChildByName("confirm");
            let btnCancel = this.contentNode.getChildByName("cancel");
            if (buttonStyle == ButtonStyle.OK_CANCEL) {
            } else if (buttonStyle == ButtonStyle.OK) {
                btnCancel.active = false;
                btnOk.x = 0;
            } else {
                btnCancel.x = 0;
                btnOk.active = false;
            }

            UIUtil.addListener(btnOk, this.onOkCallback.bind(this));
            UIUtil.addListener(btnCancel, this.onCancelCallback.bind(this));
            UIUtil.addListener(this.contentNode, (event)=>{event.stopPropagation()});
            UIUtil.addListener(this.contentNode.getChildByName("btn_close"), this.closeWin.bind(this));
            this.onShow();
    }

    onOkCallback() {
        if (this.okCallback) {
            this.okCallback()
        }
        this.closeWin()
    }

    onCancelCallback() {
        if (this.cancelCallback) {
            this.cancelCallback()
        }
        this.closeWin()
    }

}
