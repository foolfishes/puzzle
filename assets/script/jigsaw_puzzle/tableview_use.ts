import {TableView} from "../common/tableview_ui";
import {UIUtil} from "../common/ui_util";

const {ccclass, property} = cc._decorator

@ccclass
export class TableViewUse extends cc.Component{
    tableView: TableView = null;
    moveCell: cc.Node = null;
    isMoving: boolean = false;
    boardJs: any = null;
    originPos: cc.Vec2 = null;
    dataList: number[] = [];

    init(cellNum: number, direction: number, boardJs: cc.Component) {
        this.dataList = [];
        for(let i=0; i < cellNum; i++) {
            this.dataList.push(i);
        }
        for(let i=cellNum-1; i>-1; i--) {   // 打乱
            let index = Math.floor(Math.random()*(i+1));
            let data = this.dataList[index];
            this.dataList[index] = this.dataList[i];
            this.dataList[i] = data;
        }
        this.boardJs = boardJs;
        this.tableView = new TableView();
        // 不能直接使用 this.callback ,不然该函数里面的this都将变成this.tableView对象
        // https://www.bilibili.com/read/cv1426110/
        this.tableView.setCellAtIndexCallback((cell, index)=> {this.callback(cell, index)});
        this.tableView.init(this.node, cellNum, direction);
    }

    callback(cell: cc.Node, index: number){
        if (index < 0 || index > this.dataList.length) {
            cell.getChildByName("label").getComponent(cc.Label).string = "x";
        } else {
            let idx = this.dataList[index]
            UIUtil.loadTexture(cell.getChildByName("image"), this.boardJs.getImgPath(idx));
            cell.getChildByName("label").getComponent(cc.Label).string = idx.toString();
        }
        var touchStart = function(event) {
            this.onTouchStart(event, index);
        }
        var touchMove = function(event){
            this.onTouchMove(event, index);
        }
        var touchEnd = function(event){
            this.onTouchEnd(event, index);
        }
        var touchCancel = function(event) {
            this.onTouchCancel(event, index);
        }
        cell.targetOff(this);
        cell.on(cc.Node.EventType.TOUCH_START, touchStart, this);
        cell.on(cc.Node.EventType.TOUCH_MOVE, touchMove, this);
        cell.on(cc.Node.EventType.TOUCH_END, touchEnd, this);
        cell.on(cc.Node.EventType.TOUCH_CANCEL, touchCancel, this);
    }

    onTouchStart(event: cc.Event.EventTouch, index: number){
        // cc.log("cell on touch")
        // event.currentTarget.setScale(0.9)
    }

    onTouchMove(event: cc.Event.EventTouch, index: number) {
        // cc.log("cell on touch index: ", index)
        // cc.log("state: ", this.tableView.getScrollState())
        if(this.tableView.getScrollState()) return;

        let dis = event.getDelta()
        let disAbs = Math.sqrt(dis.x * dis.x + dis.y * dis.y);
        if (disAbs < 6) {
            event.stopPropagation();
            return;
        }
        // cc.log("dis delta: ", dis.x, dis.y, Math.atan(dis.y, dis.x))
        if (this.isMoving) {
            event.stopPropagation();
        } else if (Math.atan2(dis.y, dis.x) > 2.356 || Math.atan2(dis.y, dis.x) < -2.356) {
            // 135度到180，-135到-180
            this.isMoving = true;
            event.stopPropagation()
        } else {
            this.isMoving = false;
            return;
        }
        
        let parent = this.node.getParent();
        if (!this.moveCell) {
            this.moveCell = cc.instantiate(this.tableView.cell);
            this.moveCell.active = true;
            UIUtil.loadTexture(this.moveCell.getChildByName("image"), this.boardJs.getImgPath(this.dataList[index]));
            let worldpos = event.currentTarget.parent.convertToWorldSpaceAR(event.currentTarget.position);
            this.moveCell.position = parent.convertToNodeSpaceAR(worldpos);
            this.originPos = parent.convertToNodeSpaceAR(worldpos);
            parent.addChild(this.moveCell);
        }
        this.moveCell.x += dis.x;
        this.moveCell.y += dis.y;
    }

    onTouchEnd(event: cc.Event.EventTouch, index: number) {
        // cc.log(event)
        this.onTouchCancel(event, index);
    }

    onTouchCancel(event: cc.Event.EventTouch, index: number) {
        if (this.moveCell) {
            let worldPos = this.node.getParent().convertToWorldSpaceAR(this.moveCell.position);
            if (this.boardJs.isInArea(worldPos)) {
                let idx = this.dataList.splice(index, 1);
                this.boardJs.createNewPices(idx, worldPos);
                this.moveCell.removeFromParent(true) ;
                this.moveCell = null;
                this.tableView.reloadData(this.dataList.length, true, index==0);
            } else {
                let action = cc.moveTo(0.05, this.originPos);
                let callback = cc.callFunc(this.clearMoveCell, this);
                this.moveCell.runAction(cc.sequence(action, callback));
            }
            this.originPos = null;
        }
        
        this.isMoving = false;
        // event.currentTarget.setScale(1)
    }

    clearMoveCell() {
        this.moveCell.destroy();
        this.moveCell = null;
    }
}