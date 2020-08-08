import { TableView } from "../base_ui/tableview";
import { Language } from "../common/language";
import { UIUtil } from "../utils/ui_util";
import { MainLeftPanel } from "./main_left_panel";
import { MainCenterPanel } from "./main_center_panel";
import { MainTopPanel } from "./main_top_panel";

const {ccclass, property} = cc._decorator;

@ccclass
export class MainUI extends cc.Component {

    mainLeftPanel: MainLeftPanel;
    mainCenterPanel: MainCenterPanel;
    mainTopPanel: MainTopPanel;

    static _instance;


    onLoad() {
        this.initUI();
        MainUI._instance = this;
    }

    static getInstance() {
        return MainUI._instance;
    }

    initUI() {
        this.mainLeftPanel = new MainLeftPanel();
        this.mainLeftPanel.init(this.node.getChildByName("left_panel"), this);
        this.mainCenterPanel = new MainCenterPanel();
        this.mainCenterPanel.init(this.node.getChildByName("main_panel"));
        this.mainTopPanel = new MainTopPanel();
        this.mainTopPanel.init(this.node.getChildByName("top_panel"));
    }

    onTypeTabChange(type: number) {
        this.mainCenterPanel.reloadData(type);
    }

    setActive(status: boolean) {
        this.node.active = status;
    }

    

    
}