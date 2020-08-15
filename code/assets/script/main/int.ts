// 调用一些需要提前初始化的内容

import { FloatTipsUI } from "../base_ui/float_tips_ui";
import { GmManager } from "../gm/gm_manager";

export class Init {

    static init() {
        FloatTipsUI.getInstance();
        GmManager.getInstance();
    }
}