function loadTexture(node, path, callback=null) {
    cc.loader.loadRes(path, cc.SpriteFrame, function(err, spriteFrame) {
        // cc.log("loadtxture: ", node)
        node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        if (callback) {
            callback()
        }
    })
}

function addListener(node, callback, params=null) {
    let _callback = function(event) {
        if (params) {
            callback(event, params)
        } else {
            callback(event)
        }   
    }
    node.on(cc.Node.EventType.TOUCH_END, _callback, this)
}

/**
 * 递归获取子节点
 * @param {*} node 
 * @param {*} path 
 */
function getChildByName(node, path) {
    let pathList = path.split("/")
    let child = node
    for(let i=0; i<pathList.length; i++) {
        child = child.getChildByName(pathList[i])
        if (child == null) {
            return null
        }
    }
    return child
}
module.exports = {
    loadTexture,
    addListener,
    getChildByName
}
