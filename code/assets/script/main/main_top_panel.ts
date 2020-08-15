import { UIUtil } from "../utils/ui_util";
import { SettingUI } from "./setting_ui";
import { TaskUI } from "./task_ui";
import { UserData } from "../game_data/user_data";
import { FloatTipsUI } from "../base_ui/float_tips_ui";
import { Language } from "../common/language";


export class MainTopPanel {
    rootNode: cc.Node;

    init(rootNode) {
        this.rootNode = rootNode;
        // btn pos
        let achieve = this.rootNode.getChildByName("achieve");
        let piecePanel = this.rootNode.getChildByName("piece_panel");
        let goldPanel = this.rootNode.getChildByName("gold_panel");
        let setBtn = this.rootNode.getChildByName("set_btn");
        let msgBtn = this.rootNode.getChildByName("msg_btn");
        let skinBtn = this.rootNode.getChildByName("skin_btn");
        // let searchBtn = this.rootNode.getChildByName("search_panel").getChildByName("search_btn");
        this.rootNode.getChildByName("search_panel").active = false; // todo 暂时关闭

        let width = this.rootNode.width;
        setBtn.x = width - 90;
        msgBtn.x = width - 180;
        skinBtn.x = width - 270;
        goldPanel.x = width - 480;
        piecePanel.x = width - 800;

        achieve.on(cc.Node.EventType.TOUCH_END, this._onAchieveClick.bind(this), this);
        piecePanel.on(cc.Node.EventType.TOUCH_END, this._onPieceClick.bind(this), this);
        goldPanel.on(cc.Node.EventType.TOUCH_END, this._onGoldClick.bind(this), this);
        skinBtn.on(cc.Node.EventType.TOUCH_END, this._onSkinClick.bind(this), this);
        msgBtn.on(cc.Node.EventType.TOUCH_END, this._onMsgClick.bind(this), this);
        setBtn.on(cc.Node.EventType.TOUCH_END, this._onSetClick.bind(this), this);
        // searchBtn.on(cc.Node.EventType.TOUCH_END, this._onSearchClick.bind(this), this);
        
        this.updateData();
    }

    updateData() {
        UIUtil.getChildByName(this.rootNode, "piece_panel/lb_num").getComponent(cc.Label).string = UserData.getInstance().pieces.toString();
        UIUtil.getChildByName(this.rootNode, "gold_panel/lb_num").getComponent(cc.Label).string = UserData.getInstance().gold.toString();
    }
    _onAchieveClick(event: cc.Event.EventTouch) {
        new TaskUI().show();
    }
    _onPieceClick(event: cc.Event.EventTouch) {
        FloatTipsUI.getInstance().show(Language.GET_PIECE_TIPS);
    }

    _onGoldClick(event: cc.Event.EventTouch) {
        FloatTipsUI.getInstance().show(Language.GET_GOLD_TIPS);
    }

    _onSkinClick(event: cc.Event.EventTouch) {
        cc.log("skin click");
    }

    _onMsgClick(event: cc.Event.EventTouch) {
        cc.log("msg click");
    }

    _onSetClick(evet: cc.Event.EventTouch) {
        cc.log("set click");
        new SettingUI().show();
    }

    _onSearchClick(event: cc.Event.EventTouch) {
        let editbox = UIUtil.getChildByName(this.rootNode, "search_panel/editbox");
        let input:string = editbox.getComponent(cc.EditBox).textLabel.string;
        cc.log("search: ", input);
    }
}