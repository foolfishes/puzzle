// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        dataNum: 0,
        item: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("scroll onLoad")
        this.item = this.node.getChildByName("item")
        this.item.active = false
        var width = this.item.getContentSize().width
        this.node.width = width * this.dataNum
        for (let i=0; i< this.dataNum; i++) {
            let item = cc.instantiate(this.item)
            item.active = true
            item.x = (i-(this.dataNum/2)) * width
            this.node.addChild(item)
            item.on(cc.Node.EventType.TOUCH_END, this.onItemTouch, this)
        }
        
    },

    onItemTouch: function(event) {
        cc.log('iten touch')
    },

    start () {

    },

    // update (dt) {},
});
