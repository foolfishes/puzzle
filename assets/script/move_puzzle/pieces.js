// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        level: 0,
        oriRow: 0,
        oriColumn: 0,
        currRow: 0, 
        currColumn: 0,
        isBlank: false,
        texture: {
            type: cc.Texture2D,
            default: null
        },
        manager: null

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // cc.log("pieces onload")
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onBoadTouch, this)
        // this.node.on(cc.Node.EventType.TOUCH_START, this.onBoadTouchStart, this)
    },

    start () {
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onBoadTouch, this)

    },

    onBoadTouchStart: function(event){
        cc.log("touch start: ", event.getLocation())
    },

    init: function(rows, oriRow, oriColumn, width, manager){
        this.level = rows
        this.oriRow = oriRow
        this.oriColumn = oriColumn
        this.currRow = oriRow
        this.currColumn = oriColumn
        var sprite = this.node.getComponent(cc.Sprite)
        var rect = cc.Rect(0, 0, this.texture.width, this.texture.height)
        let pieceWidth = rect.width / rows
        let pieceHeight = rect.height / rows
        let rectX = this.currRow * pieceWidth
        let rectY = (rows - this.currColumn -1)* pieceHeight
        let newRect = cc.rect(rectX, rectY, pieceWidth, pieceHeight)
        // sprite.spriteFrame.setRect(newRect);
        sprite.spriteFrame = new cc.SpriteFrame(this.texture, newRect)

        this.node.width = width;
        this.node.height = width;

        this.isBlank = this.oriColumn === 0 && this.oriRow === this.level - 1;
        if (this.isBlank) {
            this.node.active = false;
        }
        this.manager = manager
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBoardTouch, this)
    },

    // update (dt) {},
    isFitPos: function(){
        if (this.currRow == this.oriRow && this.currColumn == this.oriColumn) {
            return true
        } else {
            return false
        }
    },

    onBoardTouch: function(event) {
        cc.log("pieces on board touch ")
        this.manager.onBoardTouch(this.currRow, this.currColumn)
    }
});
