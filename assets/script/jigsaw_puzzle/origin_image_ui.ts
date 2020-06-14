
// let popWin = require("../common/pop_win").PopWin
import {UIUtil} from "../common/ui_util"
import {PopWin} from "../common/pop_win"


const {ccclass, property} = cc._decorator;

@ccclass
export class OriginImageUI extends PopWin{
    
    resPath = "prefabs/layer_origin_img"

    init(imgPath: string) {
        let img = this.node.getChildByName("image");
        this.contentNode = img;
        // img.getChildByName("btn_close").on(cc.Node.EventType.TOUCH_END, this.close, this)
        UIUtil.addListener(img.getChildByName("btn_close"), this.closeWin.bind(this));
        UIUtil.addListener(img, (event)=>{event.stopPropagation()});
        UIUtil.loadTexture(img, imgPath, this.onShow.bind(this));
    }
}