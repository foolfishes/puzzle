import { TableView } from "../base_ui/tableview";
import { Language } from "../common/language";
import { UIUtil } from "../utils/ui_util";
import { MainUI } from "./main_ui";

export class MainLeftPanel {
    rootNode: cc.Node;
    mainUI: MainUI;
    dataList: number[];
    tableView: TableView;

    init(rootNode: cc.Node, mainUI: MainUI) {
        this.rootNode = rootNode;
        this.mainUI = mainUI;
        this.dataList = [0, 1, 2, 3, 4, 5, 6];
        this.tableView = new TableView();
        this.tableView.setCellAtIndexCallback((cell, index)=> {this.tableViewCallback(cell, index)});
        let panelList = UIUtil.getChildByName(this.rootNode, "panel_list")
        this.tableView.init(panelList, this.dataList.length, 1);
    }

    tableViewCallback(cell:cc.Node, index: number) {
        let imgType: number;
        let lbName: string;
        if (index == 0) {
            imgType = -1;
            lbName = Language.MINE;
        } else {
            imgType = this.dataList[index-1];
            lbName = Language.IMAGE_TYPE[imgType];
        }
        cell.getChildByName("label").getComponent(cc.Label).string = lbName;
        cell.targetOff(this);
        
        let onTouchStart = function(event: cc.Event.EventTouch) {
        }

        let onTouchEnd = (event:cc.Event.EventTouch)=> {
            this.mainUI.onTypeTabChange(imgType);
        }
        cell.on(cc.Node.EventType.TOUCH_START, onTouchStart, this);
        cell.on(cc.Node.EventType.TOUCH_END, onTouchEnd, this);
    }
}