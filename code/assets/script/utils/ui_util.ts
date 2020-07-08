
export class UIUtil {
    /**
     * 加载图片
     * @param node 
     * @param path 
     * @param callback 
     */
    static loadTexture(node: cc.Node, path: string, callback: any=null): void {
        cc.loader.loadRes(path, cc.SpriteFrame, function(err, spriteFrame) {
            // cc.log("loadtxture: ", node)
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            if (callback) {
                callback();
            }
        })
    }

    static loadTextureAtlas(node: cc.Node, path: string, file: string, callback: any=null) :void {
        cc.loader.loadRes(path, cc.SpriteAtlas, function(err, atlas) {
            // cc.log("loadtextureatlas: ", path, file)
            let frame = atlas.getSpriteFrame(file);
            node.getComponent(cc.Sprite).spriteFrame = frame;
            if (callback) {
                callback();
            }
        })
    }

    /**
     * 节点添加触摸结束事件监听，
     * @param node 
     * @param callback 
     * @param params 
     */
    static addListener(node: cc.Node, callback: Function, params=null) {
        let _callback = function(event) {
            if (params) {
                callback(event, params);
            } else {
                callback(event);
            }   
        }
        node.on(cc.Node.EventType.TOUCH_END, _callback, this);
    }

    /**
     * 递归获取子节点
     * @param {*} node 
     * @param {*} path 
     */
    static getChildByName(node: cc.Node, path: string): cc.Node {
        let pathList = path.split("/");
        let child = node;
        for(let i=0; i<pathList.length; i++) {
            child = child.getChildByName(pathList[i]);
            if (child == null) {
                return null;
            }
        }
        return child;
    }
}




