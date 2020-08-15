const {ccclass, property} = cc._decorator;

/**
 * 子类需要指定 contentNode,  重写 initUI
 */
export class CenterPop{
    rootNode: cc.Node;
    contentNode: cc.Node;
    closeOnBgTouch: boolean = true;
    resPath: string;

    constructor(resPath: string) {
        this.resPath = resPath;
    }

    show() {
        cc.loader.loadRes(this.resPath, (err, prefab)=> {
            this.rootNode = cc.instantiate(prefab);
            this.rootNode.active = true;
            this.rootNode.on(cc.Node.EventType.TOUCH_END, this.onBgTouch, this);
            cc.find("Canvas/pop_layer").addChild(this.rootNode);
            this.initUI();
        })
    }

    initUI() {
        // 子类重写
        this.onShow()
    }

    onShow() {
        // 出现效果
        this.contentNode.scale = 0.8;
        this.contentNode.opacity = 0;
        let fadeIn = cc.fadeIn(0.2);
        let scale = cc.scaleTo(0.2, 1);
        this.contentNode.runAction(cc.spawn(fadeIn, scale));
    }

    close(clear=true) {
        this.onClose(clear);
    }

    onClose(clear=true) {
        let after = function() {
            this.rootNode.destroy();
            if (this.resPath != null && clear) {
                cc.loader.releaseRes(this.resPath);
                cc.log("release res: ", this.resPath);
            }
        }
        let fadeOut = cc.fadeOut(0.2);
        let scale = cc.scaleTo(0.2, 0.8);
        let call = cc.callFunc(after, this);
        this.contentNode.runAction(cc.sequence(cc.spawn(fadeOut, scale), call));
        let bg = this.rootNode.getChildByName("bg");
        if(bg) bg.active = false;
    }

    onBgTouch(event: cc.Event) {
        // 防止穿透
        event.stopPropagation();
        if (this.closeOnBgTouch) {
            this.onClose();
        }
    }
}