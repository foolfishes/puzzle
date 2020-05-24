var tableview = require("./tableview_ui")

cc.Class({
    extends: cc.Component,

    ctor: function(){
        this.tableView = null
        this.startTouchPos = null
        this.moveCell = null
        this.isMoving = false
    },

    properties: {
        cellNum: 0,        // 需要显示的 cell 个数
        cell: cc.Node,     // 提供需要显示的 cell 节点，可以获取大小等
        direction: 0,      // 方向，水平(0)还是垂直
    },

    onLoad() {
        cc.log("onload")
        this.tableView = new tableview.tableView()
        // 不能直接使用 this.callback ,不然该函数里面的this都将变成this.tableView对象
        // https://www.bilibili.com/read/cv1426110/
        this.tableView.setCellAtIndexCallback((cell, index)=> {this.callback(cell, index)})   
        this.tableView.init(this.node, this.cellNum, this.cell, this.direction)
    },

    callback: function(cell, index){
        // cc.log("callback: ", index)
        if (index < 0 || index > this.cellNum) {
            cell.getChildByName("label").getComponent(cc.Label).string = "x"
        } else {
            cell.getChildByName("label").getComponent(cc.Label).string = index
        }
        var touchStart = (event) => {
            this.onTouchStart(event, index)
            this.startTouchPos = event.getLocation()
        }
        var touchMove = function(event){
            this.onTouchMove(event, index)
        }
        var touchEnd = function(event){
            this.onTouchEnd(event, index)
        }
        var touchCancel = function(evnet, index) {
            this.onTouchCancel(event, index)
        }
        // cc.log("cell: ", cell)
        cell.on(cc.Node.EventType.TOUCH_START, touchStart, this)
        cell.on(cc.Node.EventType.TOUCH_MOVE, touchMove, this)
        cell.on(cc.Node.EventType.TOUCH_END, touchEnd, this)
        cell.on(cc.Node.EventType.TOUCH_CANCEL, touchEnd, this)
    },

    onTouchStart: function(event, index){
        this.startTouchPos = event.getLocation()
        // cc.log("cell on touch")
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
        // var targetpos = event.currentTarget.position
        // var touchpos = event.getLocation()
        // var transpos = event.currentTarget.parent.convertToWorldSpaceAR(targetpos)
        // var actupos = parent.convertToNodeSpaceAR(transpos)
        // cc.log("pos: ", targetpos.x, targetpos.y, transpos.x, transpos.y, actupos.x, actupos.y)
        this.startTouchPos = event.getLocation()
        if (!this.moveCell) {
            this.moveCell = cc.instantiate(this.cell)
            this.moveCell.active = true
            let worldpos = event.currentTarget.parent.convertToWorldSpaceAR(event.currentTarget.position)
            this.moveCell.position = parent.convertToNodeSpaceAR(worldpos)
            parent.addChild(this.moveCell)
        }
        this.moveCell.x += disx
        this.moveCell.y += disy
    },

    onTouchEnd: function(event, index) {
        cc.log("cell on touch end")
        // this.tableView.setTouchEnabled(true)
        this.isMoving = false
        this.moveCell = null
    },

    onTouchCancel: function (event, index) {
        this.isMoving = false
        this.moveCell = null
    }

})