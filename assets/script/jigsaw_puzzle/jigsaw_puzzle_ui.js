var configData = require("./config_data")
var UIUtil = require("../common/ui_util")
var timePiece = require("./time_piece")

cc.Class({
    extends: cc.Component,

    ctor: function () {
        this.piece = null
        this.lv = null
        this.pieceList = []   // {node:?,index:?}
        this.touchBeginPos = null
        this.timePieceJs = null
        this.boardPanel = null
        this.originImgPath = null
    },

    onLoad () {
        // var that = this
        // cc.loader.loadRes("food", cc.SpriteAtlas, function(err,atlas) {
        //     cc.log("load finish ")
        //     that.init()
        // })
        this.boardPanel = this.node.getChildByName("board")
        this.piece = this.boardPanel.getChildByName("piece")
        this.init("normal")
    }, 
 
    init: function(lv, originImgPath=null) {
        this.lv = lv
        this.originImgPath = "single_image/1"
        let splitData = configData.splitLv[lv]
        tablePanel = this.node.getChildByName("tableview-h")
        tablePanel.getComponent("tableview_use").init(splitData[0]*splitData[1], 1, this)
        this.timePieceJs = new timePiece.TimePiece()
        let topNode = this.node.getChildByName("top")
        this.timePieceJs.init(topNode, splitData[0]*splitData[1])

        let closeBtn = this.node.getChildByName("btn_close")
        closeBtn.on(cc.Node.EventType.TOUCH_END, this.closePanel, this)
        let rightPanel = this.node.getChildByName("right")
        rightPanel.getChildByName("btn_show").on(cc.Node.EventType.TOUCH_END, this.showOriginImage, this)
        rightPanel.getChildByName("btn_set").on(cc.Node.EventType.TOUCH_END, this.showSettingPanel, this)
        rightPanel.getChildByName("btn_tool").on(cc.Node.EventType.TOUCH_END, this.showToolPanel, this)
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

    },

    getCropPos: function(index) {
        let splitData = configData.splitLv[this.lv]
        let i = Math.floor(index / splitData[1])
        let j = index % splitData[1]
        let xOffset = 1400.0 / splitData[1]
        let yOffset = 900.0 / splitData[0]
        let x = xOffset * j
        let y = yOffset * i - (splitData[3]-yOffset)
        let fitPos = cc.v2(-700 + x, 450 - y)
        return fitPos
    }, 

    /**
     * 判读 pos 是否在本节点范围内
     * @param {} position 
     */
    isInArea: function(position, local=false) {
        let pos
        if (local) {
            pos = position
        } else {
            pos = this.boardPanel.convertToNodeSpaceAR(position)
        }
        let sliptData = configData.splitLv[this.lv]
        let height = configData.boardSize[1]
        let width = configData.boardSize[0]
        // 适当考虑边缘，
        if (-width/2-sliptData[2]/2 <= pos.x && pos.x<= width/2-sliptData[2]/2 && -height/2+sliptData[3]/2 <= pos.y && pos.y<= height/2+sliptData[3]/2) {
            return true
        }
        return false
    },

    /**
     * 创建一个piece
     * @param {int}} index 
     * @param {*} pos 
     */
    createNewPices: function(index, worldpos) {
        let splitData = configData.splitLv[this.lv]
        // let data = this.getCropPos(index, splitData)
        let node = cc.instantiate(this.piece)
        node.setContentSize(cc.Size(splitData[2], splitData[3]))
        node.active = true
        node.position = this.boardPanel.convertToNodeSpaceAR(worldpos)
        let img = this.lv + "_" + (index)
        cc.log("new piece: ", index, img)
        UIUtil.loadTexture(node, img)
        this.boardPanel.addChild(node)
        this.pieceList.push({"node": node, "index": index})
        node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
        node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    },

    /**通过索引获取对应 piece 图片路径 */
    getImgPath: function(index) {
        let img = this.lv + "_" + index
        return img
    },
    
    onTouchStart: function(event) {
        this.touchBeginPos = event.getLocation()
        event.currentTarget.zIndex = 1  // 默认都是0
    },

    onTouchMove: function(event) {
        let pos = event.getLocation()
        let disX = pos.x - this.touchBeginPos.x
        let disY = pos.y - this.touchBeginPos.y
        let newPos = cc.v2(event.currentTarget.x + disX, event.currentTarget.y + disY)
        if (this.isInArea(newPos, true)) {
            event.currentTarget.position = newPos
        }
        this.touchBeginPos = pos
    },

    onTouchEnd: function(event) {
        this.autoFitPos(event.currentTarget)
    },

    onTouchCancel: function(event) {
        this.autoFitPos(event.currentTarget)
    },

    /**
     * 自动对齐pieces的位置，如果当前位置位于正确的位置，则对齐到准确的位置
     * @param {*} piece 
     */
    autoFitPos: function(piece) {
        let index = 0
        for(let i=0; i < this.pieceList.length; i++) {
            let data = this.pieceList[i]
            if (data.node == piece) {
                index = data.index
            }
            data.node.zIndex = 0
        }
        let fitPos = this.getCropPos(index)
        if (Math.abs(piece.x-fitPos.x) < 30 && Math.abs(piece.y-fitPos.y) < 30) {
            piece.position = fitPos
        }
    },
    
    onDestroy: function() {
        this.pieceList = null
        this.timePieceJs.onDestroy()
        this.timePieceJs = null
        this.boardPanel = null
    },

    closePanel: function(event) {
        // this.node.removeFromParent(true)
        this.node.destroy()
    },

    showOriginImage: function(event) {
        let that = this
        cc.loader.loadRes("prefabs/layer_origin_img", function(err, prefab) {
            let panel = cc.instantiate(prefab)
            panel.active = true
            panel.getComponent("origin_image_ui").init(that.originImgPath)
            // that.node.getParent().addChild(panel)
        })
    },

    showSettingPanel: function(event) {
        cc.log("show setting  panel")
        let that = this
        cc.loader.loadRes("prefabs/layer_dialog", function(err, prefab) {
            let panel = cc.instantiate(prefab)
            panel.active = true
            panel.getComponent("dialog_ui").init("setting")
            // that.node.getParent().addChild(panel)
        })
    },
    
    showToolPanel: function(event) {
        cc.log("show tool panel")
    }
})