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

        this.node.width = BoardSize.width / splitData[1];
        this.node.height = BoardSize.height / splitData[0];
        this.isBlank = this.oriColumn === splitData[1]- 1 && this.oriRow === splitData[0]- 1;
        if (this.isBlank) {
            this.node.active = false;
        }
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBoardTouch, this);
    }

    onBoadTouchStart (event){
        cc.log("touch start: ", event.getLocation())
    }

    isFitPos(): boolean{
        if (this.currRow == this.oriRow && this.currColumn == this.oriColumn) {
            return true;
        } else {
            return false;
        }
    }

    onBoardTouch(event) {
        cc.log("pieces on board touch ")
        MovePuzzleUI.getInstance().onBoardTouch(this.currRow, this.currColumn);
    }
}
