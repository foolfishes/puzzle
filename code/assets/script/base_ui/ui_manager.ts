import {GmManager} from "../gm/gm_manager";


export class UIManager {

    globalScale: number;
    fullScreenScale: number;
    private static _instance: UIManager;

    // constructor() {}

    static getInstance() {
        if (UIManager._instance == null) {
            UIManager._instance = new UIManager()
            UIManager._instance.init();
        }
        return UIManager._instance
    }

    init() {
        let designWidth = 1080
        let designHeight = 1920
        let viewSize = cc.winSize
        let scaleX = viewSize.width / designWidth
        let scaleY = viewSize.height / designHeight
        this.globalScale = Math.min(scaleX, scaleY)   // 保证完全显示, 不裁剪
        this.fullScreenScale = Math.max(scaleX, scaleY)   // 保证铺满屏幕, 不黑边, 用于 bg
        console.log("resolution: ", viewSize.width, viewSize.height, designWidth, designHeight, this.globalScale, this.fullScreenScale)

        GmManager.getInstance();
    }
    

}

