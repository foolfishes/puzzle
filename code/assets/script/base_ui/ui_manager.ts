import { Init } from "../main/int";

/**
 * creator 会将 Canvas 自动适配一个方向，使之不会被裁剪，能够完全显示
 */
export class UIManager {

    private static _instance: UIManager;
    designWidth: number;
    designHeight: number;
    globalScale: number;
    fullScreenScale: number;
    frameSize: cc.Size;
    frameRatio: number;   // 窗口宽高比例
    fitDirection: number;  // Canvas 适配的方向（那个方向没有黑边）宽：0； 高：1；
    

    // constructor() {}

    static getInstance(): UIManager {
        if (UIManager._instance == null) {
            UIManager._instance = new UIManager();
            UIManager._instance.init();
        }
        return UIManager._instance;
    }

    init() {
        this.designWidth = 1920;
        this.designHeight = 1080;
        let designActualW = this.designWidth * cc.view.getScaleX();  // 设计分辨率当前的宽度 == cc.view.getVisibleSizeInPixel()
        let designActualH = this.designHeight * cc.view.getScaleY();  // 设计分辨率当前的高度
        this.frameSize = cc.view.getFrameSize();  // 当前窗口大小，creator 自行缩放后的大小，一般*0.75 
        this.frameRatio = this.frameSize.width / this.frameSize.height;
        let scaleX = this.frameSize.width / designActualW;
        let scaleY = this.frameSize.height / designActualH;
        this.globalScale = Math.min(scaleX, scaleY);  // 保证完全显示, 不裁剪
        this.fullScreenScale = Math.max(scaleX, scaleY);  // 保证铺满屏幕, 不黑边, 用于 bg
        if (this.frameSize.width/this.frameSize.height < this.designWidth / this.designHeight) {
            this.fitDirection = 0;
        } else {
            this.fitDirection = 1;
        }
        console.log("resolution: ", this.frameSize.width, this.frameSize.height, this.designWidth, this.designHeight, this.globalScale, this.fullScreenScale);
        // cc.log("size1: ", cc.view.getFrameSize().toString());
        // cc.log("size2: ", cc.view.getVisibleSize().toString()); // 等于设计分辨率
        // cc.log("size3: ", cc.view.getVisibleSizeInPixel().toString());   // 等于设计分辨率当前实际的大小
        // cc.log("scale: ", cc.view.getScaleX(), cc.view.getScaleY());   // 上面两者的比值；
        Init.init();
    }
    

}

