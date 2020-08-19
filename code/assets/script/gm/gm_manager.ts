import {DialogUI} from "../base_ui/dialog_ui";
import { UIManager } from "../base_ui/ui_manager";
import { UserStorage, LocalKey } from "../common/user_storage";



export class GmManager {

    private static _instance: GmManager;
    private static pressedKey: cc.macro.KEY[];   

    static getInstance() {
        if (GmManager._instance == null) {
            GmManager._instance = new GmManager();
            GmManager.pressedKey = new Array();
        }
        return GmManager._instance;
    }

    static destroyInstance() {
        if (GmManager._instance != null) {
            GmManager.pressedKey = null;
            GmManager._instance = null;
        }
    }

    constructor() {
        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown (event: cc.Event.EventKeyboard) {
        // 一直按住了会一直有这个事件
        if (GmManager.pressedKey.indexOf(event.keyCode)== -1) {
            GmManager.pressedKey.push(event.keyCode)
        }
    }

    onKeyUp (event: cc.Event.EventKeyboard) {
        // cc.log("on key up: ", event.keyCode)
        let index = GmManager.pressedKey.indexOf(event.keyCode);
        if (index != -1) {
            GmManager.pressedKey.slice(index, 1);
        }
        // ctrl + ?
        if (GmManager.pressedKey.indexOf(cc.macro.KEY.ctrl) != -1) {
            switch(event.keyCode) {
                case cc.macro.KEY.a:
                    GmManager.testA()
                    break;
            }
        }
    }

    static testA() {
        UserStorage.setUserData(LocalKey.user_task_state, "");
        
    }


}