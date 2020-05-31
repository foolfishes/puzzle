var splitLv = require("./config_data").splitLv


cc.Class({
    extends: cc.Component,

    ctor: function () {
        this.initPos = cc.Vec2(-700, 450)
        this.piece = null
        this.lv = null
    },

    properties: {
        topNode: cc.Node,
        boardBg: cc.Node,
        tableView: cc.Node

    }, 
    onLoad () {
        // var that = this
        // cc.loader.loadRes("food", cc.SpriteAtlas, function(err,atlas) {
        //     cc.log("load finish ")
        //     that.init()
        // })
        this.piece = this.node.getChildByName("piece")
        this.init("normal")
        let splitData = splitLv[this.lv]
        this.tableView.getComponent("tableview_use").init(splitData[0]*splitData[1], 1, this)
    }, 
 
    init: function(lv) {
        this.lv = lv
        var splitData = splitLv[lv]
        if (splitData == null) return
        this.initUI(splitData)
        return
        for(let i=0; i< splitData[0]; i++) {
            for(let j=0; j<splitData[1]; j++) {
                let data = this.getCropPosAndType(i, j, splitData[0], splitData[1], splitData[3])
                var node = cc.instantiate(this.piece)
                node.setContentSize(splitData[2], splitData[2])
                node.active = true
                node.x = this.initPos.x + data[0]
                node.y = this.initPos.y - data[1]
                this.node.addChild(node)
                let img = lv + "_" + (i*splitData[1]+j)
                let imgedge = "mask_edge/mask_edge_" + data[2]
                cc.log("img: ", img, imgedge)
                let nodet = node
                // nodet.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("food", cc.SpriteAtlas).getSpriteFrame(img)
                // nodet.getChildByName("mask").getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("food", cc.SpriteAtlas).getSpriteFrame(imgedge)
                cc.loader.loadRes(img, cc.SpriteFrame, function(err,spriteFrame) {
                    cc.log("load: ",img, err, spriteFrame)
                    nodet.getComponent(cc.Sprite).spriteFrame = spriteFrame
                })
                cc.loader.loadRes(imgedge, cc.SpriteFrame, function(err, spriteFrame) {
                    let mask = nodet.getChildByName("mask")
                    mask.setContentSize(splitData[2], splitData[2])
                    mask.getComponent(cc.Sprite).spriteFrame = spriteFrame
                })
            }
        }

    },

    initUI: function(splitData) {
        // 节点居中自适应
        let height = splitData[3]*splitData[0]
        let width = splitData[3]*splitData[1]
        this.boardBg.setContentSize(width, height)
        this.topNode.x = this.node.x - width/2
        this.topNode.y = this.node.y + height/2
        // this.tableView.setContentSize(this.tableView.width, height/2)
        this.tableView.y = height/2 + this.node.y
        this.initPos = cc.Vec2(-width/2, height/2)
        
    },

    getCropPosAndType: function(i, j, row, column, hw) {
        var x = hw * j
        var y = hw * i - Math.round(hw*33.0/140)
        var types = 0  // (0: 正常，1：左上平，2：右上平，3：右下平，4:左下，5：左，6：下，7：右，8：上)
        if (i == 0) {
            if (j == 0){
                types = 1
            } else if (j == column-1) {
                types = 2
            } else {
                types = 8
            }
        } else if (i == row-1) {
            if (j == 0) {
                types = 4
            } else if (j == column-1) {
                types = 3
            } else {
                types = 6
            }
        } else {
            if (j == 0) {
                types = 5
            } else if (j == column-1) {
                types = 7
            } else {
                types = 0
            }
        }
        return [x, y, types]
    }, 

    /**
     * 判读 pos 是否在本节点范围内
     * @param {cc.Vec2} worldpos 
     */
    isInArea: function(worldpos) {
        let pos = this.node.convertToNodeSpaceAR(worldpos)
        let splitData = splitLv[this.lv]
        let height = splitData[3]*splitData[0]
        let width = splitData[3]*splitData[1]
        if (-width/2 <= pos.x <= width/2 && -height/2 <= pos.y <= height/2) {
            cc.log("in area: ", width, height, pos.x, pos.y, worldpos.x, worldpos.y)
            return true
        }
        return false
    },

    /**
     * 创建一个piece
     * @param {int}} index 
     * @param {*} pos 
     */
    createNewPices: function(index, pos) {
        let splitData = splitLv[this.lv]
        let i = Math.floor(index / splitData[1])
        let j = index % splitData[1]
        cc.log("new piece: ", pos.x, pos.y, index, i, j, this.lv, splitData)
        let data = this.getCropPosAndType(i, j, splitData[0], splitData[1], splitData[3])
        var node = cc.instantiate(this.piece)
        node.setContentSize(splitData[2], splitData[2])
        node.active = true
        node.position = pos
        this.node.addChild(node)
        let img = this.lv + "_" + (i*splitData[1]+j)
        let imgedge = "mask_edge/mask_edge_" + data[2]
        let nodet = node
        // nodet.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("food", cc.SpriteAtlas).getSpriteFrame(img)
        // nodet.getChildByName("mask").getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("food", cc.SpriteAtlas).getSpriteFrame(imgedge)
        cc.loader.loadRes(img, cc.SpriteFrame, function(err,spriteFrame) {
            cc.log("load: ",img, err, spriteFrame)
            nodet.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
        cc.loader.loadRes(imgedge, cc.SpriteFrame, function(err, spriteFrame) {
            let mask = nodet.getChildByName("mask")
            mask.setContentSize(splitData[2], splitData[2])
            mask.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
    },

    /**通过索引获取对应 piece 图片路径 */
    getImgPath: function(index) {
        let img = this.lv + "_" + index
        return img
    }
    
})