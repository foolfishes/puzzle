import { TableView } from "../base_ui/tableview";
import { UIUtil } from "../utils/ui_util";
import { CfgImage, ImageDefine } from "../common/cfg_image";
import { Language } from "../common/language";

export class MainCenterPanel {
    rootNode: cc.Node;
    dataList: string[];
    tableView: TableView;

    init(rootNode){
        this.rootNode = rootNode;
        this.dataList = Object.keys(CfgImage);
        this.tableView = new TableView();
        this.tableView.setCellAtIndexCallback((cell, index)=> {this.tableViewCallback(cell, index)});
        let panelList = UIUtil.getChildByName(this.rootNode, "panel_list")
        this.tableView.init(panelList, Math.ceil(this.dataList.length/3), 1);
    }     

    tableViewCallback(cell:cc.Node, index: number) {
        for(let i=0; i<3; i++) {
            let imgId = this.dataList[index*3+1];
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
        let onTouchStart = function(event: cc.Event.EventTouch) {
            cc.log("on cell touch ", item);
            // to add touch anim here;
        }

        let onTouchEnd = function(event:cc.Event.EventTouch) {
            cc.log("touch on index: ", imgId);
        }
        item.targetOff(this);
        item.on(cc.Node.EventType.TOUCH_START, onTouchStart, this);
        item.on(cc.Node.EventType.TOUCH_END, onTouchEnd, this);
        item.getChildByName("lb_name").getComponent(cc.Label).string = data.name;
        for(let i=0; i<3; i++) {
            let star = item.getChildByName("star_"+i);
            if (i < data.quality) {
                star.active = true;
            } else {
                star.active = false;
            }
        }
    }
}