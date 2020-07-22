import { LevelType } from "./config_data";
import { BoardSize } from "../move_puzzle/config_data";
import { MovePuzzlePiece } from "./move_puzzle_piece";
import { OriginImageUI} from "../common/origin_image_ui";
import { DialogUI } from "../base_ui/dialog_ui";
import { TopPanel } from "../jigsaw_puzzle/top_panel";

const {ccclass, property} = cc._decorator;

@ccclass
export class MovePuzzleUI extends cc.Component {

    piece: cc.Node;
    level: number;
    gridWidth: number;  // 实际格子宽度
    pieceMap: MovePuzzlePiece[][]; // 左上角开始
    shuffleStep: number[];
    isOver: boolean;
    imgId: number;
    topPanel: TopPanel;
    static _instance: MovePuzzleUI;

    onLoad () {
        this.imgId = 10000;
        let imgPath = "pieces_images/" + this.imgId;
        this.initUI();
        this.reset(LevelType.SIMPLE, imgPath);
        MovePuzzleUI._instance = this;
    }

    // start () {
    // },

    onDestroy() {
        this.piece = null;
        this.pieceMap = null;
        this.topPanel.destroy();
    }

    static getInstance(): MovePuzzleUI{
        return MovePuzzleUI._instance;
    }

    initUI() {
        let closeBtn = this.node.getChildByName("btn_close");
        closeBtn.on(cc.Node.EventType.TOUCH_END, this.close, this);
        let rightPanel = this.node.getChildByName("right");
        rightPanel.getChildByName("btn_show").on(cc.Node.EventType.TOUCH_END, this.showOriginImage, this);
        rightPanel.getChildByName("btn_set").on(cc.Node.EventType.TOUCH_END, this.showSettingPanel, this);
        rightPanel.getChildByName("btn_tool").on(cc.Node.EventType.TOUCH_END, this.showToolPanel, this);
    }

    judgeFinish():boolean {
        let rowCol = LevelType.RowColumn[this.level];
        for (let x = 0; x < rowCol[0]; x++) {
            for (let y = 0; y < rowCol[1]; y++) {
                if(!this.pieceMap[x][y].isFitPos()) {
                    return false
                }
            }
        }
        return true
    }

    getNearPieces(piece:MovePuzzlePiece): MovePuzzlePiece[] {
        let nearPieces = [];
        let rowCol = LevelType.RowColumn[this.level];
        if (piece.currRow > 0) {
            nearPieces.push(this.pieceMap[piece.currRow - 1][piece.currColumn])
        }
        if (piece.currRow < rowCol[0] - 1) {
            nearPieces.push(this.pieceMap[piece.currRow + 1][piece.currColumn])
        }
        if (piece.currColumn > 0) { 
            nearPieces.push(this.pieceMap[piece.currRow][piece.currColumn - 1])
        }
        if (piece.currColumn < rowCol[1] - 1) {
            nearPieces.push(this.pieceMap[piece.currRow][piece.currColumn + 1])
        }
        return nearPieces
    }

    exchangeTwoPiece(piece1: MovePuzzlePiece, piece2: MovePuzzlePiece): void {
        this.pieceMap[piece2.currRow][piece2.currColumn] = piece1;
        this.pieceMap[piece1.currRow][piece1.currColumn] = piece2;
        piece1.node.position = this.getPiecePos(piece2.currRow, piece2.currColumn);
        piece2.node.position = this.getPiecePos(piece1.currRow,piece1.currColumn);
        
        [piece1.currColumn, piece2.currColumn] = [piece2.currColumn, piece1.currColumn];
        [piece1.currRow, piece2.currRow] = [piece2.currRow, piece1.currRow];

        if (!this.isOver) {
            if (this.judgeFinish()) {
                this.over();
            }
        }
    }

    reset(level, imgPath) {
        let piece = this.node.getChildByName("piece");
        this.level = level;
        this.isOver = false;
        let rowCol = LevelType.RowColumn[this.level];
        let board = this.node.getChildByName("board")
        board.removeAllChildren()

        this.pieceMap = []
        for (let x = 0; x < rowCol[0]; x++) {
            this.pieceMap[x] = []
            for (let y = 0; y < rowCol[1]; y++) {
                let pieceNode = cc.instantiate(piece)
                pieceNode.active = true
                board.addChild(pieceNode)
                pieceNode.position = this.getPiecePos(x, y);
                this.pieceMap[x][y] = pieceNode.getComponent("move_puzzle_piece")
                this.pieceMap[x][y].initPiece(this.level, x, y, imgPath)
            }
        }
        this.shuffle()
        if (this.topPanel == null) {
            this.topPanel = new TopPanel();
        }
        let topNode = this.node.getChildByName("top_panel");
        this.topPanel.reset(topNode, rowCol[0]*rowCol[1], this.level+1);
    }

    shuffle() {
        let rowCol = LevelType.RowColumn[this.level];
        for (let i = 0; i < 50; i++) {
            let x = Math.floor(Math.random() * rowCol[0]);
            let y = Math.floor(Math.random() * rowCol[1]);
            let x1 = Math.floor(Math.random() * rowCol[0]);
            let y1 = Math.floor(Math.random() * rowCol[1]);
            
            this.exchangeTwoPiece(this.pieceMap[x][y], this.pieceMap[x1][y1]);
            // this.shuffleStep.push(n)
        }
        // cc.log("shuffle: ", this.shuffleStep)
    }

    getPiecePos(row, column): cc.Vec3 {
        let rowCol = LevelType.RowColumn[this.level];
        let gridWidth = BoardSize.width / rowCol[1];
        let gridHeight = BoardSize.height / rowCol[0];
        let x = column * gridWidth;
        let y = - row * gridHeight;
        return cc.v3(x, y, 0);
    }

    getRowCol(pos: cc.Vec3): number[] {
        let rowCol = LevelType.RowColumn[this.level];
        let gridWidth = BoardSize.width / rowCol[1];
        let gridHeight = BoardSize.height / rowCol[0];
        let row = Math.round(-pos.y / gridHeight);
        let column = Math.round(pos.x / gridWidth);
        if (row < 0) {
            row = 0;
        }
        if (row > rowCol[0]-1) {
            row = rowCol[0]-1;
        }
        if(column < 0) {
            column = 0;
        }
        if(column > rowCol[1]-1) {
            column = rowCol[1]-1;
        }
        return [row, column];
    }

    getPieceByRow(row, column): MovePuzzlePiece {
        return this.pieceMap[row][column];
    }

    resetZIndex() {
        let rowCol = LevelType.RowColumn[this.level];
        for(let i=0; i<rowCol[0]; i++) {
            for(let j=0; j<rowCol[1]; j++) {
                this.pieceMap[i][j].node.zIndex = 0;
            }
        }
    }

    over() {
        // this.winPanel.active = true
        this.isOver = true
        cc.log("game over")
    }

    close(event: cc.Event.EventTouch) {
        // this.node.removeFromParent(true)
        this.node.destroy();
    }

    showOriginImage(event: cc.Event.EventTouch) {
        let originImg = "pieces_images/" + this.imgId.toString()
        new OriginImageUI(originImg).show();
    }

    showSettingPanel(event: cc.Event.EventTouch) {
        new DialogUI("setting").show();
    }
    
    showToolPanel(event: cc.Event.EventTouch) {
        cc.log("tool");
        let originImg = "pieces_images/" + this.imgId.toString()
        this.reset(this.level, originImg);
    }

}
