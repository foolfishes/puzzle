import { LevelType } from "./config_data";
import { BoardSize } from "../move_puzzle/config_data";
import { MovePuzzlePiece } from "./move_puzzle_piece";

const {ccclass, property} = cc._decorator;

@ccclass
export class MovePuzzleUI extends cc.Component {

    piece: cc.Node;
    level: number;
    colSpace: number;   // 各行/列的间隔
    gridWidth: number;  // 实际格子宽度
    pieceMap: MovePuzzlePiece[][]; // 左下角开始
    blankPiece: MovePuzzlePiece;
    shuffleStep: number[];
    isOver: boolean;
    static _instance: MovePuzzleUI;

    onLoad () {
        let imgPath = "pieces_images/10000"
        this.reset(LevelType.SIMPLE, imgPath);
        MovePuzzleUI._instance = this;
    }

    // start () {
    // },

    onDestroy() {
        this.piece = null
        this.pieceMap = null
        this.blankPiece = null
    }

    static getInstance(): MovePuzzleUI{
        return MovePuzzleUI._instance;
    }

    movePiece(x, y): boolean {
        cc.log("move: ", x,y )
        var piece = this.pieceMap[x][y]
        var nearPieces = this.getNearPieces(piece)
        for (let nearPiece of nearPieces) {
            cc.log("movelog: ", nearPiece.currRow, nearPiece.currColumn, nearPiece.isBlank)
            if (nearPiece.isBlank) {
                this.exchangeTwoPiece(piece, nearPiece);
                return true
            }
        }
        return false
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
        this.blankPiece.node.active = true
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
        cc.log("near: ", piece.currRow, piece.currColumn, nearPieces.toString())
        return nearPieces
    }

    exchangeTwoPiece(piece1, piece2): void {
        this.pieceMap[piece2.currRow][piece2.currColumn] = piece1;
        this.pieceMap[piece1.currRow][piece1.currColumn] = piece2;

        [piece1.currColumn, piece2.currColumn] = [piece2.currColumn, piece1.currColumn];
        [piece1.currRow, piece2.currRow] = [piece2.currRow, piece1.currRow];

        [piece1.node.position, piece2.node.position] = [piece2.node.position, piece1.node.position];
    }

    reset(level, imgPath) {
        let piece = this.node.getChildByName("piece");
        this.level = level;
        this.colSpace = 0;
        this.isOver = false;
        let rowCol = LevelType.RowColumn[this.level];
        let gridWidth = BoardSize.width / rowCol[1];
        let gridHeight = BoardSize.height / rowCol[0];
        let board = this.node.getChildByName("board")
        board.removeAllChildren()

        this.pieceMap = []
        for (let x = 0; x < rowCol[0]; x++) {
            this.pieceMap[x] = []
            for (let y = 0; y < rowCol[1]; y++) {
                let pieceNode = cc.instantiate(piece)
                pieceNode.active = true
                // pieceNode.on(cc.Node.EventType.TOUCH_END, () =>{this.onBoardTouch(x, y)})
                board.addChild(pieceNode)
                pieceNode.x = y * (gridWidth + this.colSpace) + this.colSpace
                pieceNode.y = -(x * (gridHeight + this.colSpace) + this.colSpace)
                this.pieceMap[x][y] = pieceNode.getComponent("move_puzzle_piece")
                this.pieceMap[x][y].initPiece(this.level, x, y, imgPath)
                if (this.pieceMap[x][y].isBlank) {
                    this.blankPiece = this.pieceMap[x][y]
                }
            }
        }
        this.shuffle()
    }

    shuffle() {
        for (let i = 0; i < 50; i++) {
            let nearPieces = this.getNearPieces(this.blankPiece)
            let n = Math.floor(Math.random() * nearPieces.length)
            this.exchangeTwoPiece(this.blankPiece, nearPieces[n])
            // this.shuffleStep.push(n)
        }
        // cc.log("shuffle: ", this.shuffleStep)
    }

    onBoardTouch(x, y) {
        if (!this.isOver) {
            let isMove = this.movePiece(x, y);
            if (!isMove) {
                cc.log("不符合规则");
            } else {
                if (this.judgeFinish()) {
                    this.over();
                }
            }
        }
    }

    over() {
        // this.winPanel.active = true
        this.isOver = true
        cc.log("game over")
    }

}
