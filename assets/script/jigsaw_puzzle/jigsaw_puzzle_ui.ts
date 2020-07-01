import {BoardSize, SplitLv} from "./config_data";
import {TimePiece} from "./time_piece";
import {UIUtil} from "../common/ui_util";
import { DialogUI } from "../common/dialog_ui";
const {ccclass, property} = cc._decorator;

interface PieceData {
    node: cc.Node;
    index: number;
    fit: number
}

@ccclass
export class JigsawPuzzleUI extends cc.Component{

    piece: cc.Node = null;
    lv: string = "normal";
    pieceList: PieceData[] = [];
    timePieceJs: TimePiece = null;
    boardPanel: cc.Node = null;
    originImgPath: string = null;
    pieceNum: number = 0;

    onLoad () {
        // var that = this
        // cc.loader.loadRes("food", cc.SpriteAtlas, function(err,atlas) {
        //     cc.log("load finish ")
        //     that.init()
        // })
        this.boardPanel = this.node.getChildByName("board");
        this.piece = this.boardPanel.getChildByName("piece");
        this.init(SplitLv.normal);
    }
 
    init(lv: string, originImgPath:string = null) {
        this.lv = lv;
        this.originImgPath = "single_image/1";
        let splitData = SplitLv.SplitData[this.lv];
        this.pieceNum = splitData[0]*splitData[1]
        let tablePanel = this.node.getChildByName("tableview-h");
        tablePanel.getComponent("tableview_use").init(this.pieceNum, 1, this);
        this.timePieceJs = new TimePiece();
        let topNode = this.node.getChildByName("top");
        this.timePieceJs.init(topNode, this.pieceNum);

        let closeBtn = this.node.getChildByName("btn_close");
        closeBtn.on(cc.Node.EventType.TOUCH_END, this.close, this);
        let rightPanel = this.node.getChildByName("right");
        rightPanel.getChildByName("btn_show").on(cc.Node.EventType.TOUCH_END, this.showOriginImage, this);
        rightPanel.getChildByName("btn_set").on(cc.Node.EventType.TOUCH_END, this.showSettingPanel, this);
        rightPanel.getChildByName("btn_tool").on(cc.Node.EventType.TOUCH_END, this.showToolPanel, this);
        // for(let i=0; i< splitData[0]; i++) {
        //     for(let j=0; j<splitData[1]; j++) {
        //         let data = this.getCropPos(i, j, splitData)
        //         var node = cc.instantiate(this.piece)
        //         node.setContentSize(cc.Size(splitData[2], splitData[3]))
        //         node.active = true
        //         node.x = this.initPos.x + data[0]
        //         node.y = this.initPos.y - data[1]
        //         boardPanel.addChild(node)
        //         let img = lv + "_" + (i*splitData[1]+j)
        //         // let imgedge = "mask_edge/mask_edge_" + data[2]
        //         // cc.log("img: ", img, imgedge)
        //         let nodet = node
        //         // nodet.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("food", cc.SpriteAtlas).getSpriteFrame(img)
        //         // nodet.getChildByName("mask").getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("food", cc.SpriteAtlas).getSpriteFrame(imgedge)
        //         cc.loader.loadRes(img, cc.SpriteFrame, function(err,spriteFrame) {
        //             cc.log("load: ",img, err, spriteFrame)
        //             nodet.getComponent(cc.Sprite).spriteFrame = spriteFrame
        //         })
        //         // cc.loader.loadRes(imgedge, cc.SpriteFrame, function(err, spriteFrame) {
        //         //     let mask = nodet.getChildByName("mask")
        //         //     mask.setContentSize(splitData[2], splitData[2])
        //         //     mask.getComponent(cc.Sprite).spriteFrame = spriteFrame
        //         // })
        //     }
        // }

    }

    getCropPos(index: number): cc.Vec3 {
        let splitData = SplitLv.SplitData[this.lv];
        let i = Math.floor(index / splitData[1]);
        let j = index % splitData[1];
        let xOffset = 1400.0 / splitData[1];
        let yOffset = 900.0 / splitData[0];
        let x = xOffset * j;
        let y = yOffset * i - (splitData[3]-yOffset);
        let fitPos = cc.v3(-700 + x, 450 - y, 0);
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
        let sliptData = SplitLv.SplitData[this.lv];
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
     */
    createNewPices(index: number, worldpos: cc.Vec3) {
        let splitData: number[] = SplitLv.SplitData[this.lv];
        // let data = this.getCropPos(index, splitData)
        let node = cc.instantiate(this.piece);
        node.setContentSize(cc.size(splitData[2], splitData[3]));
        node.active = true;
        node.position = this.boardPanel.convertToNodeSpaceAR(worldpos);
        let img = this.lv + "_" + (index);
        cc.log("new piece: ", index, img)
        UIUtil.loadTexture(node, img);
        this.boardPanel.addChild(node);
        this.pieceList.push({"node": node, "index": index, "fit": 0});
        node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    /**通过索引获取对应 piece 图片路径 */
    getImgPath(index: number) {
        let img = this.lv + "_" + index;
        return img;
    }
    
    onTouchStart(event: cc.Event.EventTouch) {
        // this.touchBeginPos = event.getLocation();
        event.currentTarget.zIndex = 1;  // 默认都是0
    }

    onTouchMove(event: cc.Event.EventTouch) {
        // let pos = event.getLocation();
        // let disX = pos.x - this.touchBeginPos.x;
        // let disY = pos.y - this.touchBeginPos.y;
        let disX: number = event.getDeltaX();
        let disY: number = event.getDeltaY();
        let newPos = cc.v2(event.currentTarget.x + disX, event.currentTarget.y + disY);
        if (this.isInArea(newPos, true)) {
            event.currentTarget.position = newPos;
        }
        // this.touchBeginPos = pos;
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
    autoFitPos(piece: cc.Node) {
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
            this.pieceList[indexInList].fit = 1;
        } else {
            this.pieceList[indexInList].fit = 0;
        }
        if (this.isSuccess()) {
            this.timePieceJs.stop();
            this.resetGame();
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
            // let index: number = pieceData.index;
            // let rightPos: cc.Vec3 = this.getCropPos(index);
            // if (Math.abs(pieceData.node.x-rightPos.x) > 0.5 || Math.abs(pieceData.node.y-rightPos.y) > 0.5) {
            //     return false;
            // }
        }
        return true;
    }

    showResultUI() {
        let that: JigsawPuzzleUI = this;
        cc.loader.loadRes("prefabs/layer_dialog", function(err, prefab) {
            let panel = cc.instantiate(prefab);
            panel.active = true;
            let dialogCp: DialogUI =  panel.getComponent("dialog_ui");
            dialogCp.init("恭喜完成拼图！！！", "over", "重新开始", "退出", that.resetGame, that.close);
        })
    }

    onDestroy() {
        this.pieceList = null;
        this.timePieceJs.destroy();
        this.timePieceJs = null;
        this.boardPanel = null;
    }

    close(event: cc.Event.EventTouch) {
        // this.node.removeFromParent(true)
        this.node.destroy();
    }

    /**
     * 重新开始
     */
    resetGame() {
        for(let i=0; i< this.pieceList.length; i++) {
            this.pieceList[i].node.destroy();
        }
        this.pieceList = [];
        let tablePanel = this.node.getChildByName("tableview-h");
        tablePanel.getComponent("tableview_use").reset(this.pieceNum);
        this.timePieceJs.reset();
    }

    showOriginImage(event: cc.Event.EventTouch) {
        let that = this;
        cc.loader.loadRes("prefabs/layer_origin_img", function(err, prefab) {
            let panel = cc.instantiate(prefab);
            panel.active = true;
            panel.getComponent("origin_image_ui").init(that.originImgPath);
            // that.node.getParent().addChild(panel)
        })
    }

    showSettingPanel(event: cc.Event.EventTouch) {
        let that = this;
        cc.loader.loadRes("prefabs/layer_dialog", function(err, prefab) {
            let panel = cc.instantiate(prefab);
            panel.active = true;
            panel.getComponent("dialog_ui").init("setting");
            // that.node.getParent().addChild(panel)
        })
    }
    
    showToolPanel(event: cc.Event.EventTouch) {
        cc.log("show tool panel")
    }
}