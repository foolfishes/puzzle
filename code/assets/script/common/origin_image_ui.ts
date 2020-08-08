
import {UIUtil} from "../utils/ui_util"
import {CenterPop} from "../base_ui/center_pop"


const {ccclass, property} = cc._decorator;

export class OriginImageUI extends CenterPop{

    imgPath: string;
    
    constructor(imgPath: string) {
        super("prefabs/origin_img_layer");
        this.imgPath = imgPath;
    }

    initUI() {
        let img = this.rootNode.getChildByName("image");
        this.contentNode = img;
        UIUtil.addListener(img.getChildByName("btn_close"), this.close.bind(this));
        UIUtil.addListener(img, (event)=>{event.stopPropagation()});
        UIUtil.loadTexture(img, this.imgPath, this.onShow.bind(this));
        this.contentNode.active = false;
    }

    onShow() {
        this.contentNode.active = true;
        super.onShow();
    }
}