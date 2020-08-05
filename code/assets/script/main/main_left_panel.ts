import { TableView } from "../base_ui/tableview";
import { Language } from "../common/language";
import { UIUtil } from "../utils/ui_util";

export class MainLeftPanel {
    rootNode: cc.Node;
    dataList: number[];
    tableView: TableView;

    init(rootNode: cc.Node) {
        this.rootNode = rootNode;
        this.dataList = [0,1,2,3,4,5];
        this.tableView = new TableView();
        this.tableView.setCellAtIndexCallback((cell, index)=> {this.tableViewCallback(cell, index)});
        let panelList = UIUtil.getChildByName(this.rootNode, "panel_list")
        this.tableView.init(panelList, this.dataList.length, 1);
    }

    tableViewCallback(cell:cc.Node, index: number) {
        let imgType = this.dataList[index];
        let lbName = Language.IMAGE_TYPE[imgType];
        cell.getChildByName("label").getComponent(cc.Label).string = lbName;
        cell.targetOff(this);
        
        let onTouchStart = function(event: cc.Event.EventTouch) {
            cc.log("on cell touch ", cell);
            // to add touch anim here;
        }

        let onTouchEnd = function(event:cc.Event.EventTouch) {
            cc.log("touch on index: ", index);
        }
        cell.on(cc.Node.EventType.TOUCH_START, onTouchStart, this);
        cell.on(cc.Node.EventType.TOUCH_END, onTouchEnd, this);
    }
}