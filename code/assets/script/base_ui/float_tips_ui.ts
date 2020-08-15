
export class FloatTipsUI {

    private static _instance: FloatTipsUI;

    rootNode: cc.Node;
    inAnim: boolean;  // 防止覆盖

    static getInstance() {
        if (FloatTipsUI._instance != null) {
            return FloatTipsUI._instance;
        }
        return new FloatTipsUI();
    }

    static destoryInstance() {
        if (FloatTipsUI._instance) {
            FloatTipsUI._instance = null;
        }
    }

    constructor() {
        FloatTipsUI._instance = this;
        cc.resources.load("prefabs/float_tips_layer", (err, prefabs:cc.Prefab)=> {
            this.rootNode = cc.instantiate(prefabs);
            cc.find("Canvas/float_layer").addChild(this.rootNode);
            this.rootNode.active = false;
        })
        this.inAnim = false;
    }

    show(text: string, fadeTime=2) {
        if (this.rootNode == null) return;
        if (this.inAnim) return;
        this.inAnim = true;
        this.rootNode.active = true;
        this.rootNode.opacity = 255;
        cc.log("show")
        this.rootNode.getChildByName("tips_lb").getComponent(cc.Label).string = text;
        let animation = this.rootNode.getChildByName("bg").getComponent(cc.Animation);
        animation.on('finished', ()=>(this._onAnimFinish(fadeTime)), this);
        animation.play();
    }

    _onAnimFinish(fadeTime: number) {
        let animation = this.rootNode.getChildByName("bg").getComponent(cc.Animation);
        let fade = cc.fadeOut(fadeTime);
        this.rootNode.runAction(cc.sequence([fade, cc.callFunc(this._onHide.bind(this))]));
        animation.off('finished', this._onAnimFinish, this);
    }

    _onHide() {
        this.rootNode.active = false;
        this.inAnim = false;
    }
}