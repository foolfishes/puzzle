import { TableView } from "../base_ui/tableview";
import { UIUtil } from "../utils/ui_util";
import { CfgImage, ImageDefine } from "../common/cfg_image";
import { Language } from "../common/language";
import { SelectConfirmUI } from "./select_confirm_ui";
import { TaskDaily } from "../common/com_define";
import { UserData } from "../game_data/user_data";

export class MainCenterPanel {
    rootNode: cc.Node;
    dataList: string[];
    tableView: TableView;
    showSelect: boolean;

    init(rootNode){
        this.rootNode = rootNode;
        this.reloadData(0);
        this.tableView = new TableView();
        this.tableView.setCellAtIndexCallback((cell, index)=> {this.tableViewCallback(cell, index)});
        let panelList = UIUtil.getChildByName(this.rootNode, "panel_list")
        this.tableView.init(panelList, Math.ceil(this.dataList.length/3), 1);
        this.showSelect = true;
    }     

    tableViewCallback(cell:cc.Node, index: number) {
        for(let i=0; i<3; i++) {
            let imgId = this.dataList[index*3+i];
            let item:cc.Node = cell.getChildByName("item_"+i);
            if (imgId != null) {
                item.active = true;
                let imageData: ImageDefine = CfgImage[this.dataList[index*3+i]];
                this._setItemState(item, imageData);
            } else {
                item.active = false;
            }
        }
    }

    _setItemState(item:cc.Node, data: ImageDefine) {
        let imgId = data.imageid;
        let onTouchMove = function(event: cc.Event.EventTouch) {
            if (this.tableView.getScrollState()) {
                this.showSelect = false;
            }
        }

        let onTouchEnd = function(event:cc.Event.EventTouch) {
            let selectConfirmUI = new SelectConfirmUI(imgId);
            if (this.showSelect) {
                selectConfirmUI.show();
            }
            this.showSelect = true;
        }
        item.getChildByName("lb_name").getComponent(cc.Label).string = data.name;
        for(let i=0; i<3; i++) {
            let star = item.getChildByName("star_"+i);
            if (i < data.quality) {
                star.active = true;
            } else {
                star.active = false;
            }
        }
        item.targetOff(this);
        item.on(cc.Node.EventType.TOUCH_MOVE, onTouchMove.bind(this), this);
        item.on(cc.Node.EventType.TOUCH_END, onTouchEnd.bind(this), this);
    }

    reloadData(type: number) {
        this.dataList = [];
        if (type == -1) {   // 我的
            this.dataList = UserData.getInstance().imageIds.map(String);
        }
        if (type == 0) {
            this.dataList = Object.keys(CfgImage);
        } else {
            for(let key in CfgImage) {
                let data = CfgImage[key];
                if (data.type == type) {
                    this.dataList.push(key);
                }
            }
        }
        let nullTips = UIUtil.getChildByName(this.rootNode, "panel_list/null_tips_label");
        if (this.dataList.length == 0) {
            nullTips.getComponent(cc.Label).string = Language.RES_NULL_TIPS;
            nullTips.active = true;
        } else {
            nullTips.active = false;
        }
        if (this.tableView != null) {
            this.tableView.reloadData(Math.ceil(this.dataList.length/3), false);
        }
    }
}