

 var tableView = cc.Class({
    // extends: cc.Component,

    ctor: function(){
        this.boundLen = 200
        this.offset = 0
        this.cellList = []
        this.cellListCache= []
        this.startTouchPos = null
        this.cellAtIndex = null  // callback
        this.isScrolling = false

        this.node = null
        this.cellNum = 0      // 需要显示的 cell 个数
        this.cell = null      // 提供需要显示的 cell 节点，可以获取大小等
        this.direction = 0    // 方向，水平(0)还是垂直
    },

    init: function(node, cellNum, direction) {
        this.node = node
        this.cellNum = cellNum
        this.cell = this.node.getChildByName("container").getChildByName("content")
        this.direction = direction

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
        let num = 0
        if (this.direction == 0) {
            this.cell.setAnchorPoint(0, 0)
            num = Math.ceil(this.node.width / this.cell.width) 
        } else {
            this.cell.setAnchorPoint(0, 1)
            num = Math.ceil(this.node.height / this.cell.height) 
        }

        for (let i=0; i< num+2; i++) {
            let cell = cc.instantiate(this.cell)
            if (i < this.cellNum) {
                cell.active = true
            } else {
                cell.active = false
            }
            
            this.node.getChildByName("container").addChild(cell)
            if (this.direction == 0) {
                cell.x = i * cell.width
            } else {
                cell.y = - i * cell.height
            }
            
            let cellObj = {"node": cell, "index": i}
            this.cellList.push(cellObj)
            this.setCellContent(cell, i)
            // cell.on(cc.Node.EventType.TOUCH_START, this.onCellTouchStart, this)
            // cell.getChildByName("label").getComponent(cc.Label).string = i
        }
        if (this.direction == 0) {
            this.maxOffset = this.cellNum * this.cell.width - this.node.width
            this.maxOffset = this.maxOffset > 0 ? this.maxOffset : 0   // 防止一个元素小于0的情况
            this.maxOffset += this.boundLen
        } else {
            this.maxOffset = this.cellNum * this.cell.height - this.node.height
            this.maxOffset = this.maxOffset > 0 ? this.maxOffset : 0   // 防止一个元素小于0的情况
            this.maxOffset += this.boundLen
        }

        // 先预创建一些，防止卡顿，
        for (let i=0; i< 10; i++) {
            let cell = cc.instantiate(this.cell)
            cell.active = false
            this.node.getChildByName("container").addChild(cell)
            let cellObj = {"node": cell, "index": i}
            this.cellListCache.push(cellObj)
        }
    },

    onTouchStart: function(event) {
        this.startTouchPos = event.getLocation()
        // this.lastTime = new Date().getTime()
        // this.tempOffset = this.offset
    },

    onTouchMove: function(event) {
        // cc.log("table on touch")
        let distance = 0
        if (this.direction == 0) {
            distance = event.getLocation().x - this.startTouchPos.x
        } else {
            distance = - (event.getLocation().y - this.startTouchPos.y)
        }
        this.isScrolling = true   // 事件由 cell 来判断是否触发，到这里了就说了触发了滑动
        this.startTouchPos = event.getLocation()

        this.moveDistance(distance)
    },

    onTouchEnd: function(event) {
        if (this.offset < 0) {
            this.resetHead()
        } else if (this.offset > this.maxOffset - this.boundLen){
            this.resetTail()
        } else {
            // 需要动画实现效果，暂时不做
            // let dis = this.offset - this.tempOffset
            // cc.log("dis: ", dis)
            // if (Math.abs(dis) > 10) {
            //     this.moveDistance(-dis)
            // }
            // this.tempOffset = this.offset
        }
        this.isScrolling = false
        
    },

    onTouchCancel: function(event) {
        if (this.offset < 0) {
            this.resetHead()
        } else if (this.offset > this.maxOffset - this.boundLen){
            this.resetTail()
        }
        this.isScrolling = false
    },

    moveDistance: function(distance) {
        // cc.log("distance: ", distance, this.offset)
        this.offset -= distance
        let actualDis = distance
        if (this.offset <= 0) {  // todo 需要防止减过头
            if (this.offset < -this.boundLen) {
                actualDis = this.boundLen + this.offset + distance
                this.offset = -this.boundLen
            }
        } else if (this.offset >= this.maxOffset - this.boundLen){
            if (this.offset > this.maxOffset) {
                actualDis =  (this.offset + distance) - this.maxOffset   // 这个时候 distance 是负的，需要注意顺序
                this.offset = this.maxOffset
            }
        }
        
        let cellListNew = []
        if (this.direction == 0) {
            for (let i=0; i< this.cellList.length; i++) {
                let cellObj = this.cellList[i]
                cellObj.node.x += actualDis
                if (cellObj.node.x < -5 * this.cell.width) {
                    cellObj.node.active = false
                    this.cellListCache.push(cellObj)
                } else if (cellObj.node.x > this.node.width + 5 * this.cell.width) {
                    cellObj.node.active = false
                    this.cellListCache.push(cellObj)
                } else {
                    cellListNew.push(cellObj)
                }
                if (i==0 && cellObj.node.x > -3 * this.cell.width && cellObj.index > 0) {
                    let obj = this.getNewCell()
                    obj.node.active = true
                    obj.node.x = cellObj.node.x - this.cell.width
                    obj.index = cellObj.index - 1
                    cellListNew.unshift(obj)
                    this.setCellContent(obj.node, obj.index)
                }
                if (i == this.cellList.length -1 && 
                    cellObj.node.x < this.node.width + 3*this.cell.width && 
                    cellObj.index < this.cellNum-1) {
                    let obj = this.getNewCell()
                    obj.node.active = true
                    obj.node.x = cellObj.node.x + this.cell.width
                    obj.index = cellObj.index + 1
                    cellListNew.push(obj)
                    this.setCellContent(obj.node, obj.index)
                }
            }
        } else {
            for (let i=0; i< this.cellList.length; i++) {
                let cellObj = this.cellList[i]
                cellObj.node.y -= actualDis
                if (cellObj.node.y > 5 * this.cell.height) {
                    cellObj.node.active = false
                    this.cellListCache.push(cellObj)
                } else if (cellObj.node.y < -this.node.height - 5 * this.cell.height) {
                    cellObj.node.active = false
                    this.cellListCache.push(cellObj)
                } else {
                    cellListNew.push(cellObj)
                }
                if (i==0 && cellObj.node.y < 3 * this.cell.height && cellObj.index > 0) {
                    let obj = this.getNewCell()
                    obj.node.active = true
                    obj.node.y = cellObj.node.y + this.cell.height
                    obj.index = cellObj.index - 1
                    cellListNew.unshift(obj)
                    this.setCellContent(obj.node, obj.index)
                }
                if (i == this.cellList.length -1 && 
                    cellObj.node.y > -this.node.height - 3*this.cell.height && 
                    cellObj.index < this.cellNum-1) {
                    let obj = this.getNewCell()
                    obj.node.active = true
                    obj.node.y = cellObj.node.y - this.cell.height
                    obj.index = cellObj.index + 1
                    cellListNew.push(obj)
                    this.setCellContent(obj.node, obj.index)
                }
            }
        }
        
        this.cellList = cellListNew
    },

    setCellContent: function(cell, index) {
        if (this.cellAtIndex) {
            this.cellAtIndex(cell, index)
        }
    },

    getNewCell: function() {
        if (this.cellListCache.length > 0) {
            return this.cellListCache.pop()
        }
        let cell = cc.instantiate(this.cell)
        this.node.getChildByName("container").addChild(cell)
        let cellObj = {"node": cell, "index": 0}
        return cellObj
    },

    resetHead: function() {
        this.cellList.forEach(cellObj => {
            if (this.direction == 0) {
                cellObj.node.x += this.offset
            } else {
                cellObj.node.y += -this.offset
            }
        })
        this.offset = 0
    },

    resetTail: function() {
        this.cellList.forEach(cellObj => {
            if (this.direction == 0) {
                cellObj.node.x += this.offset - (this.maxOffset - this.boundLen)
            } else {
                cellObj.node.y -= this.offset - (this.maxOffset - this.boundLen)
            }
        })
        this.offset = this.maxOffset - this.boundLen
    },

    setCellAtIndexCallback: function(callback) {
        this.cellAtIndex = callback
    },

    getScrollState: function() {
        return this.isScrolling
    },

    getCell: function() {
        return this.cell
    },

    /**
     * 重新加载 tableView 的数据
     * @param {*} cellNum ： 新的数据个数
     * @param {*} keepOffset : 是否保存偏移量
     * @param {*} deleteHead : 是否是删除了第一个元素，如果删除了第一个元素，需要指定来获取最新的index
     */
    reloadData: function(cellNum, keepOffset=false, deleteHead=false) {
        this.cellNum = cellNum
        if (this.direction == 0) {
            this.maxOffset = this.cellNum * this.cell.width - this.node.width
            this.maxOffset = this.maxOffset > 0 ? this.maxOffset : 0   // 防止一个元素小于0的情况
            this.maxOffset += this.boundLen
        } else {
            this.maxOffset = this.cellNum * this.cell.height - this.node.height
            this.maxOffset = this.maxOffset > 0 ? this.maxOffset : 0   // 防止一个元素小于0的情况
            this.maxOffset += this.boundLen
        }
        if (keepOffset) {
            var offset = this.offset
            if (offset >= (this.maxOffset - this.boundLen)) {
                offset = this.maxOffset - this.boundLen
            }
            if (deleteHead) {
                this.resetBegin()
            } else {
                this.resetTableCell(this.cellList[0].index)
            }
        } else {
           this.resetBegin()
        }
    },

    /**
     * tableView 恢复到初始状态
     */
    resetBegin: function() {
        let index = 0
        let cellListNew = []
        for (let i=0; i< this.cellList.length; i++) {
            let cellObj = this.cellList[i]
            if (i < this.cellNum) {
                cellObj.index = index
                if (this.direction == 0) {
                    cellObj.node.x = i * this.cell.width
                } else {
                    cellObj.node.y = -i * this.cell.height
                }
                this.setCellContent(cellObj.node, cellObj.index)
                index += 1
                cellListNew.push(cellObj)
            } else {
                cellObj.node.active = false
                this.cellListCache.push(cellObj)
            }
        }
        this.offset = 0
        this.cellList = cellListNew
    },

    /**
     * 
     */
    resetTableCell: function(idx) {
        let index = idx
        let startPos = 0
        if (this.direction == 0) {
            startPos = this.cellList[0].node.x
        } else {
            startPos = this.cellList[0].node.y
        }
        let cellListNew = []
        for (let i=0; i< this.cellList.length; i++) {
            let cellObj = this.cellList[i]
            if (i < this.cellNum && index < this.cellNum) {
                cellObj.index = index
                if (this.direction == 0) {
                    cellObj.node.x = startPos +  i * this.cell.width
                } else {
                    cellObj.node.y = startPos +  -i * this.cell.height
                }
                this.setCellContent(cellObj.node, cellObj.index)
                index += 1
                cellListNew.push(cellObj)
            } else {
                cellObj.node.active = false
                this.cellListCache.push(cellObj)
            }
        }
        this.cellList = cellListNew
        this.moveDistance(0)
    }
})


module.exports = {
    "tableView": tableView
}

