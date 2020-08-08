import {BoardSize, LevelType} from "./config_data";
import {TopPanel} from "./top_panel";
import {UIUtil} from "../utils/ui_util";
import {DialogUI} from "../base_ui/dialog_ui";
import {OriginImageUI} from "../common/origin_image_ui";
import {UserStorage} from "../common/user_storage";
import {TableViewUse} from "./tableview_use";
import { DataUtil } from "../utils/data_util";

const {ccclass, property} = cc._decorator;

interface PieceData {
    node: cc.Node;
    index: number;
    fit: number
}

@ccclass
export class JigsawPuzzleUI extends cc.Component{

    piece: cc.Node = null;
    level: number = 0;
    pieceList: PieceData[] = [];
    topPanel: TopPanel = null;
    boardPanel: cc.Node = null;
    pieceNum: number = 0;
    imgId: number = 0;
    pieceStatus: number[][];  // 对应piece个数的数组，每个表示当前坐标，默认为空

    onLoad () {
        // var that = this
        // cc.loader.loadRes("food", cc.SpriteAtlas, function(err,atlas) {
        //     cc.log("load finish ")
        //     that.init()
        // })
        // UserStorage.clear();
        this.boardPanel = this.node.getChildByName("board");
        this.piece = this.boardPanel.getChildByName("piece");
        // this.init(10000, LevelType.simple);
    }
 
    init(imgId: number, lv: number) {
        cc.log("imgId: ", imgId)
        this.imgId = imgId;
        this.level = lv;
        let splitData = LevelType.SplitData[this.level];
        this.pieceNum = splitData[0]*splitData[1]
        this.pieceStatus = this.getPieceStatus();
        let recoverList = this.recoverWithStatus();
        let tablePanel = this.node.getChildByName("tableview-h");
        let tablevewUse: TableViewUse = tablePanel.getComponent("tableview_use");
        tablevewUse.init(this.pieceNum-recoverList.length, recoverList, 1, this);
        this.topPanel = new TopPanel();
        let topNode = this.node.getChildByName("top");
        this.topPanel.reset(topNode, this.pieceNum);
      
        let closeBtn = this.node.getChildByName("btn_close");
        closeBtn.on(cc.Node.EventType.TOUCH_END, this.close, this);
        let rightPanel = this.node.getChildByName("right");
        rightPanel.getChildByName("btn_show").on(cc.Node.EventType.TOUCH_END, this.showOriginImage, this);
        rightPanel.getChildByName("btn_set").on(cc.Node.EventType.TOUCH_END, this.showSettingPanel, this);
        rightPanel.getChildByName("btn_tool").on(cc.Node.EventType.TOUCH_END, this.showToolPanel, this);
        // 防止事件穿透
        UIUtil.addListener(this.node.getChildByName("bg"), (event:cc.Event.EventTouch)=>{event.stopPropagation()})
        // 定时保存状态
        this.schedule(this.savePieceStatus, 30);
    }
    /**
     * 完全拼接全图，测试用
     * @param lv 
     * @param originImgPath 
     */
    initFull(lv: number, ori:string = null) {
        this.level = lv;
        let splitData = LevelType.SplitData[this.level];
        for(let i=0; i< splitData[0]; i++) {
            for(let j=0; j<splitData[1]; j++) {
                let index = i*splitData[1]+j;
                let pos: cc.Vec3 = this.getCropPos(index);
                this.createNewPices(index, pos);
            }
        }
    }

    getCropPos(index: number): cc.Vec3 {
        let splitData = LevelType.SplitData[this.level];
        let i = Math.floor(index / splitData[1]);
        let j = index % splitData[1];
        let xOffset = 1400.0 / splitData[1];
        let yOffset = 900.0 / splitData[0];
        let x = xOffset * j;
        let y = yOffset * i - (splitData[3]-yOffset);
        let fitPos = cc.v3(-700 + x, 450 - y, 0);  // 初始位置偏移
        return fitPos
    } 

    /**
     * 判读 pos 是否在本节点范围内
     * @param {} position 
     */
    isInArea(position: cc.Vec2, local:boolean=false) {
        let pos
        if (local) {
            pos = position;
        } else {
            pos = this.boardPanel.convertToNodeSpaceAR(position);
        }
        let sliptData = LevelType.SplitData[this.level];
        let height = BoardSize.height;
        let width = BoardSize.width;
        // 适当考虑边缘，
        if (-width/2-sliptData[2]/2 <= pos.x && pos.x<= width/2-sliptData[2]/2 && -height/2+sliptData[3]/2 <= pos.y && pos.y<= height/2+sliptData[3]/2) {
            return true;
        }
        return false;
    }

    /**
     * 创建一个piece
     * @param {int}} index 
     * @param {*} pos 
     * @param isWorld: 是否是世界坐标
     */
    createNewPices(index: number, position: cc.Vec3, isWorld: boolean=true) {
        let splitData: number[] = LevelType.SplitData[this.level];
        // let data = this.getCropPos(index, splitData)
        let node = cc.instantiate(this.piece);
        node.setContentSize(cc.size(splitData[2], splitData[3]));
        node.active = true;
        if (isWorld) {
            node.position = this.boardPanel.convertToNodeSpaceAR(position);
        } else {
            node.position = position;
        }
        let img = this.getImgPath(index);
        UIUtil.loadTextureAtlas(node, img[0], img[1]);
        this.boardPanel.addChild(node);
        this.pieceList.push({"node": node, "index": index, "fit": 0});
        this.autoFitPos(node, false)
        this.pieceStatus[index] = [node.x, node.y]
        node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    /**
     * 通过索引获取对应 piece 图片路径
     */
    getImgPath(index: number): string[] {
        let path = "pieces_images/" + [this.imgId.toString(), LevelType.level_desc[this.level]].join("_");
        let file = index.toString();
        return [path, file];
    }
    
    onTouchStart(event: cc.Event.EventTouch) {
        event.currentTarget.zIndex = 1;  // 默认都是0
    }

    onTouchMove(event: cc.Event.EventTouch) {
        let disX: number = event.getDeltaX();
        let disY: number = event.getDeltaY();
        let newPos = cc.v2(event.currentTarget.x + disX, event.currentTarget.y + disY);
        if (this.isInArea(newPos, true)) {
            event.currentTarget.position = newPos;
        }
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        this.autoFitPos(event.currentTarget);
    }

    onTouchCancel(event: cc.Event.EventTouch) {
        this.autoFitPos(event.currentTarget);
    }

    /**
     * 自动对齐pieces的位置，如果当前位置位于正确的位置，则对齐到准确的位置
     * @param {*} piece 
     */
    autoFitPos(piece: cc.Node, detectSuccess=true) {
        let index = 0;
        let indexInList = 0;
        for(let i=0; i < this.pieceList.length; i++) {
            let data = this.pieceList[i];
            if (data.node == piece) {
                index = data.index;
                indexInList = i;
            }
            data.node.zIndex = 0;
        }
        let fitPos: cc.Vec3 = this.getCropPos(index);
        if (Math.abs(piece.x-fitPos.x) < 30 && Math.abs(piece.y-fitPos.y) < 30) {
            piece.position = fitPos
            this.pieceStatus[index] = [fitPos.x, fitPos.y]
            this.pieceList[indexInList].fit = 1;
        } else {
            this.pieceList[indexInList].fit = 0;
            this.pieceStatus[index] = [piece.x, piece.y]
        }

        if (detectSuccess && this.isSuccess()) {
            this.topPanel.stop();
            this.savePieceStatus();
            this.showResultUI()
        }
    }

    isSuccess(): boolean {
        if (this.pieceList.length != this.pieceNum) {
            return false;
        }
        for (let i=0; i< this.pieceList.length; i++) {
            let pieceData: PieceData = this.pieceList[i];
            if (pieceData.fit == 0) {
                return false;
            }
        }
        return true;
    }

    close(event?: cc.Event.EventTouch) {
        this.savePieceStatus();
        this.unschedule(this.savePieceStatus);
        this.pieceStatus = null;
        this.pieceList = null;
        this.topPanel.destroy();
        this.topPanel = null;
        this.boardPanel = null;
        this.node.destroy();
    }

    /**
     * 重新开始
     */
    resetGame() {
        for(let i=0; i< this.pieceList.length; i++) {
            this.pieceList[i].node.destroy();
        }
        this.setLocalPieceStatus("");
        this.pieceStatus = this.initPieceStatus(); 
        this.pieceList = [];
        let tablePanel = this.node.getChildByName("tableview-h");
        let tablevewUse: TableViewUse = tablePanel.getComponent("tableview_use");
        tablevewUse.reset(this.pieceNum);
        let topNode = this.node.getChildByName("top");
        this.topPanel.reset(topNode, this.pieceNum);
    }

    /**
     * 从状态数据恢复界面，返回恢复的piece数量
     */
    recoverWithStatus(): number[] {
        let recoveList = new Array();
        for(let i=0; i< this.pieceNum; i++) {
            let status = this.pieceStatus[i];
            if (status && status.length > 0) {
                let pos = cc.v3(status[0], status[1], 0);
                this.createNewPices(i, pos, false);
                recoveList.push(i)
            }
        }
        return recoveList;
    }

    getPieceStatus(): number[][] {
        let key = ["jigsaw", LevelType.level_desc[this.level], this.imgId.toString()].join("_");
        let data = UserStorage.getUserData(key);
        let status;
        if (data != null && data != "") {
            status = JSON.parse(data);
        } else {
            status = this.initPieceStatus();
        }
        return status;
    }

    savePieceStatus() {
        if (!this.pieceStatus || this.pieceStatus.length != this.pieceNum) {
            return;
        }
        let data = JSON.stringify(this.pieceStatus);
        this.setLocalPieceStatus(data);
    }

    initPieceStatus() {
        let status = new Array(this.pieceNum);
        for (let i=0; i< this.pieceNum; i++) {
            status[i] = [];
        }
        return status;
    }

    setLocalPieceStatus(data: string) {
        let key = ["jigsaw", LevelType.level_desc[this.level], this.imgId.toString()].join("_");
        UserStorage.setUserData(key, data);
    }

    showResultUI() {
        new DialogUI("恭喜完成拼图！！！", "over", "重新开始", "退出", 
                     ()=>{this.resetGame()}, ()=>{this.close()}).show()
    }

    showOriginImage(event: cc.Event.EventTouch) {
        new OriginImageUI(DataUtil.getImageById(this.imgId)).show();
    }

    showSettingPanel(event: cc.Event.EventTouch) {
        new DialogUI("setting").show();
    }
    
    showToolPanel(event: cc.Event.EventTouch) {
        this.resetGame();
    }
}