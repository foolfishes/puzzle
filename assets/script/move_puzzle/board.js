// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var uiManager = require("../common/ui_manager")

cc.Class({
    extends: cc.Component,

    properties: {
        piece: cc.Node,
        level: 3,
        colSpace: 5,   // 各列的间隔
        gridWidth: 0,  // 实际格子宽度
        pieceMap: [],  // 左下角开始
        blankPiece: null,
        manager: null,
        ininStep: {
            default: [],
            visible: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    // },

    onDestroy() {
        this.piece = null
        this.pieceMap = null
        this.blankPiece = null
        this.manager = null
    },

    init: function(manager) {
        this.manager = manager
    },

    movePiece: function(x, y) {
        // console.log("move: ", this.pieceMap, x, y)
        var piece = this.pieceMap[x][y]
        var nearPieces = this.getNearPieces(piece)
        for (let nearPiece of nearPieces) {
            if (nearPiece.isBlank) {
                this.exchangeTwoPiece(piece, nearPiece);
                return true
            }
        }
        return false
    },

    judgeFinish: function() {
        for (let x = 0; x < this.level; x++) {
            for (let y = 0; y < this.level; y++) {
                if(!this.pieceMap[x][y].isFitPos()) {
                    return false
                }
            }
        }
        this.blankPiece.node.active = true
        return true
    },

    getNearPieces: function(piece) {
        var nearPieces = [];
        if (piece.currRow > 0) {
            nearPieces.push(this.pieceMap[piece.currRow - 1][piece.currColumn])
        }
        if (piece.currRow < this.level - 1) {
            nearPieces.push(this.pieceMap[piece.currRow + 1][piece.currColumn])
        }
        if (piece.currColumn > 0) { 
            nearPieces.push(this.pieceMap[piece.currRow][piece.currColumn - 1])
        }
        if (piece.currColumn < this.level - 1) {
            nearPieces.push(this.pieceMap[piece.currRow][piece.currColumn + 1])
        }
        return nearPieces
    },

    exchangeTwoPiece: function(piece1, piece2) {
        this.pieceMap[piece2.currRow][piece2.currColumn] = piece1;
        this.pieceMap[piece1.currRow][piece1.currColumn] = piece2;

        [piece1.currColumn, piece2.currColumn] = [piece2.currColumn, piece1.currColumn];
        [piece1.currRow, piece2.currRow] = [piece2.currRow, piece1.currRow];

        [piece1.node.position, piece2.node.position] = [piece2.node.position, piece1.node.position];
    },

    reset: function(level) {
        this.level = level;
        this.gridWidth = (this.node.width - this.colSpace * (this.level + 1)) / this.level
        this.node.removeAllChildren()
        this.pieceMap = []
        for (let x = 0; x < this.level; x++) {
            this.pieceMap[x] = []
            for (let y = 0; y < this.level; y++) {
                let pieceNode = cc.instantiate(this.piece)
                pieceNode.active = true
                this.node.addChild(pieceNode)
                pieceNode.x = x * (this.gridWidth + this.colSpace) + this.colSpace
                pieceNode.y = y * (this.gridWidth + this.colSpace) + this.colSpace
                this.pieceMap[x][y] = pieceNode.getComponent("pieces")
                this.pieceMap[x][y].init(this.level, x, y, this.gridWidth, this.manager)
                if (this.pieceMap[x][y].isBlank) {
                    this.blankPiece = this.pieceMap[x][y]
                }
            }
        }
        this.shuffle()
    },

    shuffle: function() {
        for (let i = 0; i < 50; i++) {
            let nearPieces = this.getNearPieces(this.blankPiece)
            let n = Math.floor(Math.random() * nearPieces.length)
            this.exchangeTwoPiece(this.blankPiece, nearPieces[n])
            this.ininStep.push(n)
        }
        cc.log("shuffle: ", this.ininStep)
    }

});
