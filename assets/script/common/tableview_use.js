var tableview = require("./tableview_ui")

cc.Class({
    extends: cc.Component,

    ctor: function(){
        this.tableView = null
        this.startTouchPos = null
        this.moveCell = null
        this.isMoving = false
        // this.cellNum = 0        // 需要显示的 cell 个数
        // this.cell = null     // 提供需要显示的 cell 节点，可以获取大小等
        // this.direction = 0      // 方向，水平(0)还是垂直
        this.board = null       // board 上js 组件
        this.originPos = null
    },

    onLoad() {
    },

    init: function(cellNum, direction, board) {
        cc.log("init")
        this.board = board
        this.tableView = new tableview.tableView()
        // 不能直接使用 this.callback ,不然该函数里面的this都将变成this.tableView对象
        // https://www.bilibili.com/read/cv1426110/
        this.tableView.setCellAtIndexCallback((cell, index)=> {this.callback(cell, index)})   
        this.tableView.init(this.node, cellNum, direction)
    },

    callback: function(cell, index){
        cc.log("callback: ", index)
        if (index < 0 || index > this.cellNum) {
            cell.getChildByName("label").getComponent(cc.Label).string = "x"
        } else {
            cc.log("load: ", this.board.getImgPath(index))
            cc.loader.loadRes(this.board.getImgPath(index), cc.SpriteFrame, function(err, spriteFrame) {
                cell.getChildByName("image").getComponent(cc.Sprite).spriteFrame = spriteFrame
            })
            cell.getChildByName("label").getComponent(cc.Label).string = index
        }
        var touchStart = function(event) {
            this.onTouchStart(event, index)
        }
        var touchMove = function(event){
            this.onTouchMove(event, index)
        }
        var touchEnd = function(event){
            this.onTouchEnd(event, index)
        }
        var touchCancel = function(event) {
            this.onTouchCancel(event, index)
        }
        // cc.log("cell: ", cell)
        cell.on(cc.Node.EventType.TOUCH_START, touchStart, this)
        cell.on(cc.Node.EventType.TOUCH_MOVE, touchMove, this)
        cell.on(cc.Node.EventType.TOUCH_END, touchEnd, this)
        cell.on(cc.Node.EventType.TOUCH_CANCEL, touchCancel, this)
    },

    onTouchStart: function(event, index){
        this.startTouchPos = event.getLocation()
        // cc.log("cell on touch")
        event.currentTarget.setScale(0.9)
    },

    onTouchMove: function(event, index) {
        cc.log("cell on touch")
        cc.log("state: ", this.tableView.getScrollState())
        if(this.tableView.getScrollState()) return

        var disy = event.getLocation().y - this.startTouchPos.y
        var disx = event.getLocation().x - this.startTouchPos.x
        // cc.log("dis: ", disy, disx, this.isMoving)
        if (this.isMoving) {
            event.stopPropagation()
        } else if (Math.abs(disy) < Math.abs(disx) - 1) {
            cc.log("yes")
            this.isMoving = true
            event.stopPropagation()
        } else {
            this.isMoving = false
            return
        }
        
        var parent = this.node.getParent()
        this.startTouchPos = event.getLocation()
        if (!this.moveCell) {
            this.moveCell = cc.instantiate(this.tableView.cell)
            this.moveCell.active = true
            let worldpos = event.currentTarget.parent.convertToWorldSpaceAR(event.currentTarget.position)
            this.moveCell.position = parent.convertToNodeSpaceAR(worldpos)
            cc.log("pos tras: ", worldpos.x, worldpos.y, this.moveCell.position.x)
            this.originPos = parent.convertToNodeSpaceAR(worldpos)
            parent.addChild(this.moveCell)
        }
        this.moveCell.x += disx
        this.moveCell.y += disy
    },

    onTouchEnd: function(event, index) {
        cc.log("cell on touch end", index)
        // this.tableView.setTouchEnabled(true)
        if (this.moveCell) {
            if (this.board.isInArea(this.moveCell.position)) {
                this.board.createNewPices(index, this.moveCell.position)
            } else {
                this.moveCell.position = this.originPos
            }
            this.originPos = null
            this.moveCell.removeFromParent(true) 
        }
        this.isMoving = false
        this.moveCell = null
        event.currentTarget.setScale(1)
    },

    onTouchCancel: function (event, index) {
        cc.log("cell on touch cancel", index)
        if (this.moveCell) {
            if (this.board.isInArea(this.moveCell.position)) {
                this.board.createNewPices(index, this.moveCell.position)
            } else {
                this.moveCell.position = this.originPos
            }
            this.originPos = null
            this.moveCell.removeFromParent(true) 
        }
        
        this.isMoving = false
        this.moveCell = null
        event.currentTarget.setScale(1)
    }
})