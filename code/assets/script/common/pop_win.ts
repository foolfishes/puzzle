const {ccclass, property} = cc._decorator;

@ccclass
export class PopWin extends cc.Component{
    contentNode: cc.Node = null;
    resPath: string = "";
    closeOnBgTouch: boolean = true;

    onShow() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBgTouch, this);
        cc.find("Canvas").addChild(this.node);
        this.contentNode.scale = 0.8;
        this.contentNode.opacity = 0;
        let fadeIn = cc.fadeIn(0.2);
        let scale = cc.scaleTo(0.2, 1);
        this.contentNode.runAction(cc.spawn(fadeIn, scale));
    }

    onClose(clear=true) {
        let after = function() {
            this.node.destroy();
            if (this.resPath != null && clear) {
                cc.loader.releaseRes(this.resPath);
                cc.log("release res: ", this.resPath);
            }
        }
        let fadeOut = cc.fadeOut(0.2);
        let scale = cc.scaleTo(0.2, 0.8);
        let call = cc.callFunc(after, this);
        this.contentNode.runAction(cc.sequence(cc.spawn(fadeOut, scale), call));
    }

    onBgTouch(event: cc.Event) {
        // 防止穿透
        event.stopPropagation();
        if (this.closeOnBgTouch) {
            this.onClose();
        }
    }

    closeWin(clear=true) {
        this.onClose(clear);
    }
}