import { CenterPop } from "../base_ui/center_pop";
import { DialogUI } from "../base_ui/dialog_ui";
import { Language } from "../common/language";
import { UserStorage } from "../common/user_storage";
import { FloatTipsUI } from "../base_ui/float_tips_ui";


export class SettingUI extends CenterPop {

    constructor() {
        super("prefabs/set_layer")
    }

    initUI() {
        this.contentNode = this.rootNode.getChildByName("content_panel");
        let bgmCheck = this.contentNode.getChildByName("bgm_checkmark");
        let musicCheck = this.contentNode.getChildByName("music_checkmark");
        let clearBtn = this.contentNode.getChildByName("clear_btn");

        bgmCheck.on(cc.Node.EventType.TOUCH_END, this._onBgmCheckClick.bind(this), this);
        musicCheck.on(cc.Node.EventType.TOUCH_END, this._onMusicCheckClick.bind(this), this);
        clearBtn.on(cc.Node.EventType.TOUCH_END, this._onClearBtn.bind(this), this);
        this.contentNode.getChildByName("close_btn").on(cc.Node.EventType.TOUCH_END, this.close.bind(this), this);
        this.contentNode.on(cc.Node.EventType.TOUCH_END, (event)=>{event.stopPropagation()}, this);
    }

    _onBgmCheckClick(event: cc.Event.EventTouch) {
        let check:cc.Toggle = event.currentTarget.getComponent(cc.Toggle);
        if (check.isChecked) {
            cc.log("checked");
        } else {
            cc.log("un checked");
        }
    }

    _onMusicCheckClick(event: cc.Event.EventTouch) {
        let check:cc.Toggle = event.currentTarget.getComponent(cc.Toggle);
        if (check.isChecked) {
            cc.log("checked");
        } else {
            cc.log("uncheck");
        }
        FloatTipsUI.getInstance().show('show');
    }

    _onClearBtn(event: cc.Event.EventTouch) {
        new DialogUI(Language.CLEAR_CAHCHE_TIPS, null, null, null, ()=>{UserStorage.clearCache();}).show();
        FloatTipsUI.getInstance().show("清理完成");
    }
}