import { CenterPop } from "../base_ui/center_pop";
import { TaskDaily, Task, ResType } from "../common/com_define";
import { TableView } from "../base_ui/tableview";
import { UIUtil } from "../utils/ui_util";
import { Language } from "../common/language";
import { UserStorage, LocalKey } from "../common/user_storage";
import { TimeUtil } from "../utils/time_util";
import { UserData } from "../game_data/user_data";
import { FloatTipsUI } from "../base_ui/float_tips_ui";
import { MainUI } from "./main_ui";

interface TaskState {
    state: number[];  // 每个任务完成情况 0,1;
    award: number[];  // 是否领取0,1
    time: number;     // 数据更新时间，保证每天更新；
}

export class TaskUI extends CenterPop {

    dataList: Task[];
    tableView: TableView;
    taskState: TaskState;

    constructor() {
        super("prefabs/task_layer");
        this.dataList = TaskDaily;
        this.tableView = new TableView()
        this._initTastState();
    }
    
    initUI() {
        this.contentNode = this.rootNode.getChildByName("content_panel");
        UIUtil.addListener(this.contentNode, (event)=>{event.stopPropagation()}, this);
        UIUtil.addListener(this.contentNode.getChildByName("close_btn"), this.close.bind(this), this);
        this.tableView.setCellAtIndexCallback((cell, index)=> {this.tableViewCallback(cell, index)});
        this.tableView.init(this.contentNode.getChildByName("list_panel"), this.dataList.length, 1);
    }

    _initTastState() {
        let json = UserStorage.getUserData(LocalKey.user_task_state);
        let initState = {
            state: new Array(this.dataList.length).fill(0),
            award: new Array(this.dataList.length).fill(0),
            time: new Date().getTime()}
        initState.state[0] = 1;  // 每日登录
        if (json == "" || json == null) {
            this.taskState = initState;
        } else {
            this.taskState = JSON.parse(json);
            if (this.taskState.time < TimeUtil.getTodayZero()) {
                this.taskState  = initState;
            }
        }
        this.taskState.state[0] = 1
        UserStorage.setUserData(LocalKey.user_task_state, JSON.stringify(this.taskState));
    }

    tableViewCallback(cell: cc.Node, index: number) {
        let data: Task = this.dataList[index];
        cell.getChildByName("desc_lb").getComponent(cc.Label).string = data.desc;
        let numLb = cell.getChildByName("num_lb");
        let stateBtn = cell.getChildByName("status_btn");
        let finish = cell.getChildByName("finish_img");
        stateBtn.targetOff(this);
        if (this.taskState.state[data.taskid] == 1) {
            numLb.getComponent(cc.Label).string = "1/1";
            if (this.taskState.award[data.taskid] == 1) {
                finish.active = true;
                stateBtn.active = false;
            } else {
                finish.active = false;
                stateBtn.active = true;
                UIUtil.getChildByName(stateBtn, "Background/Label").getComponent(cc.Label).string = Language.RECEIVE;
                UIUtil.addListener(stateBtn, ()=>{this._receiveReward(data.taskid)}, this);
            }
        } else {
            numLb.getComponent(cc.Label).string = "0/1";
            finish.active = false;
            stateBtn.active = true;
            UIUtil.getChildByName(stateBtn, "Background/Label").getComponent(cc.Label).string = Language.GOTO;
            UIUtil.addListener(stateBtn, ()=>{this.close()}, this);
        }
    }

    _receiveReward(taskid: number) {
        let award: number[] = TaskDaily[taskid].award;
        for (let i=0; i<award.length; i+=2) {
            if (award[i] == ResType.RES_PIECE) {
                UserData.getInstance().receivePiece(award[i+1]);
                let tips = Language.GET + award[i+1] + Language.RES_TYPE[0];
                FloatTipsUI.getInstance().show(tips);
            } else {
                UserData.getInstance().receiveGold(award[i+1]);
                let tips = Language.GET + award[i+1] + Language.RES_TYPE[1];
                FloatTipsUI.getInstance().show(tips);
            }
        }
        MainUI.getInstance().updateTop();
        this.updateTaskState(taskid, 1);
    }

    /**
     * 
     * @param taskId 任务id
     * @param state 激活：0， 领取：1
     */
    updateTaskState(taskId, state) {
        if (state == 1) {
            this.taskState.award[taskId] = 1;
        } else {
            this.taskState.state[taskId] = 1;
        }
        let allFinish = true;
        for (let i=0; i<this.taskState.state.length-1; i++) {
            if (this.taskState.state[i] == 0) {
                allFinish = false;
                break;
            }
        }
        if (allFinish) {
            this.taskState.state[this.taskState.state.length-1] = 1;
        }
        this.taskState.time = new Date().getTime();
        UserStorage.setUserData(LocalKey.user_task_state, JSON.stringify(this.taskState));
        this.tableView.reloadData(this.dataList.length);
    }
}