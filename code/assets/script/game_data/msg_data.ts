import { UserStorage } from "../common/user_storage";

interface MsgDef {
    content: string;
    time: number;
}


export class MsgData {

    static MSG_TYPE_0 = 0;   // 完成动作记录
    static MSG_TYPE_1 = 1;   // 领取奖励记录
    static MSG_KEY = "user_msg_data";

    private static _instance: MsgData;
    msgList: MsgDef[];


    static getInstance(): MsgData {
        if (MsgData._instance != null) {
            return MsgData._instance;
        }
        return new MsgData();
    }

    static destroyInstance() {
        if (MsgData._instance) {
            MsgData._instance.destroy();
            MsgData._instance = null;
        }
    }

    constructor() {
        let data = UserStorage.getUserData(MsgData.MSG_KEY);
        if (data == null || data == "") {
            this.msgList = [];
        } else {
            this.msgList = JSON.parse(data);
        }
        this.msgList.sort(function(a: MsgDef, b: MsgDef) {
            return a.time - b.time;
        })
    }

    addMsg(msg: MsgDef) {
        this.msgList.push(msg);
        if (this.msgList.length > 20) {   // 超过20条丢弃
            this.msgList = this.msgList.slice(-20);
        }
        UserStorage.setUserData(MsgData.MSG_KEY, JSON.stringify(this.msgList));
    }

    destroy() {
        this.msgList = null;
    }

}