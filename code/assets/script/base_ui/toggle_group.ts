import { UIUtil } from "../utils/ui_util";

/**
 * 单选框，管理一系列按钮，每次只能选中一个
 */
export class ToggleGroup {

    groupNode: cc.Node[];  // 节点列表
    callback: any;  // 选中后的回调；
    current: number;
    
    constructor(nodes: cc.Node[], callback: any, select=0) {
        this.groupNode = nodes;
        this.callback = callback;
        for (let i=0; i<nodes.length; i++) {
            let node = nodes[i];
            UIUtil.addListener(node, this._onItemClicked.bind(this));
            if (i == select) {
                node.getChildByName("selected_img").active = true;
            } else {
                node.getChildByName("selected_img").active = false;
            }
        }
        this.current = select;
    }

    _onItemClicked(event: cc.Event.EventTouch) {
        let target:cc.Node = event.currentTarget;
        for (let i=0; i< this.groupNode.length; i++) {
            let node = this.groupNode[i];
            if (target == node) {
                node.getChildByName("selected_img").active = true;
                this.current = i;
            } else {
                node.getChildByName("selected_img").active = false;
            }
        }
        this.callback(this.current);
    }

}