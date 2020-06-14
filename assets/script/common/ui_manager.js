
let uiManager

function UIManager(g, f) {
    this.globalScale = g
    this.fullScreenScale = f
}

function init() {
    let designWidth = 1080
    let designHeight = 1920
    let viewSize = cc.winSize
    let scaleX = viewSize.width / designWidth
    let scaleY = viewSize.height / designHeight
    globalScale = Math.min(scaleX, scaleY)   // 保证完全显示, 不裁剪
    fullScreenScale = Math.max(scaleX, scaleY)   // 保证铺满屏幕, 不黑边, 用于 bg
    console.log("resolution: ", viewSize.width, viewSize.height, designWidth, designHeight, globalScale, fullScreenScale)
    uiManager = new UIManager(globalScale, fullScreenScale)
    return uiManager
}

function getUIManager() {
    if (uiManager) {
        return uiManager
    } else {
        return init()
    }
}



module.exports = {
    getUIManager
}


