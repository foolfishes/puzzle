// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MovePuzzleUI } from "./move_puzzle_ui";
import { LevelType } from "./config_data";
import { BoardSize } from "../move_puzzle/config_data";

const {ccclass, property} = cc._decorator;

@ccclass
export class MovePuzzlePiece extends cc.Component{
    level: number;
    oriRow: number;
    oriColumn: number;
    currRow: number;  // 当前所在行
    currColumn: number; //当前所在列
    isBlank: boolean;
    imgPath: string;
    movePuzzleUI: MovePuzzleUI;
    isMoving: boolean;
    threshHold: number;

    constructor() {
        super()
        this.isMoving = false;
    }

    initPiece(level:number, oriRow:number, oriColumn:number, imgPath:string) {
        this.level = level;
        this.oriRow = oriRow;
        this.oriColumn = oriColumn;
        this.currRow = oriRow;
        this.currColumn = oriColumn;
        this.imgPath = imgPath;
        let splitData: number[] = LevelType.RowColumn[this.level];
        let pieceWidth = BoardSize.scale * BoardSize.width / splitData[1]
        let pieceHeight = BoardSize.scale * BoardSize.height / splitData[0]
        let rectX = this.currColumn * pieceWidth
        let rectY = this.currRow * pieceHeight
        let newRect = cc.rect(rectX, rectY, pieceWidth, pieceHeight)
        let sprite = this.node.getComponent(cc.Sprite);
        cc.resources.load(this.imgPath, function(err, texture:cc.Texture2D){
            let spriteFrame = new cc.SpriteFrame(texture, newRect);
            sprite.spriteFrame = spriteFrame;
        })
        this.threshHold = pieceWidth * 0.35;

        this.node.width = BoardSize.width / splitData[1];
        this.node.height = BoardSize.height / splitData[0];

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    isFitPos(): boolean{
        if (this.currRow == this.oriRow && this.currColumn == this.oriColumn) {
            return true;
        } else {
            return false;
        }
    }

    onTouchEnd(event:cc.Event.EventTouch) {
        let newRc = MovePuzzleUI.getInstance().getRowCol(this.node.position);
        let pos = MovePuzzleUI.getInstance().getPiecePos(newRc[0], newRc[1]);
        if (Math.abs(this.node.x - pos.x) < this.threshHold && Math.abs(this.node.y - pos.y) < this.threshHold) {
            let piece = MovePuzzleUI.getInstance().getPieceByRow(newRc[0], newRc[1]);
            MovePuzzleUI.getInstance().exchangeTwoPiece(this, piece);
        } else {
            this.node.position = MovePuzzleUI.getInstance().getPiecePos(this.currRow, this.currColumn);
        }
        this.isMoving = false;
        MovePuzzleUI.getInstance().resetZIndex();
    }

    onTouchMove(event:cc.Event.EventTouch) {
        this.node.zIndex = 1;
        let dis = event.getDelta()
        let disAbs = Math.sqrt(dis.x * dis.x + dis.y * dis.y);
        if (!this.isMoving && disAbs < 6) {  // 小距离排除
            event.stopPropagation();
            return;
        }
        this.isMoving = true;
        this.node.x += dis.x;
        this.node.y += dis.y;
    }
}
