import { TableView } from "../base_ui/tableview";
import { Language } from "../common/language";
import { UIUtil } from "../utils/ui_util";
import { MainLeftPanel } from "./main_left_panel";
import { MainCenterPanel } from "./main_center_panel";
import { MainTopPanel } from "./main_top_panel";
import { UIManager } from "../base_ui/ui_manager";

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

    static getInstance(): MainUI {
        return MainUI._instance;
    }

    initUI() {
        let uiManager = UIManager.getInstance();
        let topPanel = this.node.getChildByName("top_panel");
        let leftPanel = this.node.getChildByName("left_panel");
        let centerPanel = this.node.getChildByName("main_panel");

        if (uiManager.fitDirection == 0) {
            let edgeHeight = uiManager.designWidth / uiManager.frameRatio - uiManager.designHeight;  // Canvas 居中，上下都有一半黑边；
            topPanel.y += edgeHeight / 2;
            leftPanel.y -= edgeHeight / 2;
            leftPanel.setContentSize(leftPanel.width, leftPanel.height + edgeHeight);
            leftPanel.getChildByName("panel_list").y = leftPanel.height;// 适配自适应
            centerPanel.y -= edgeHeight / 2;
            centerPanel.setContentSize(centerPanel.width, centerPanel.height + edgeHeight);
            centerPanel.getChildByName("panel_list").y = centerPanel.height;
        } else {
            let edgeWidth = uiManager.designHeight * uiManager.frameRatio - uiManager.designWidth;
            topPanel.setContentSize(topPanel.width + edgeWidth, topPanel.height);
            topPanel.x -= edgeWidth / 2;
            leftPanel.x -= edgeWidth / 2;
            centerPanel.x -= edgeWidth / 2;
            centerPanel.setContentSize(centerPanel.width + edgeWidth, centerPanel.height);
            centerPanel.getChildByName("panel_list").x += edgeWidth / 2
        }
        this.mainLeftPanel = new MainLeftPanel();
        this.mainLeftPanel.init(leftPanel, this);
        this.mainCenterPanel = new MainCenterPanel();
        this.mainCenterPanel.init(centerPanel);
        this.mainTopPanel = new MainTopPanel();
        this.mainTopPanel.init(topPanel);      
    }

    onTypeTabChange(type: number) {
        this.mainCenterPanel.reloadData(type);
    }

    updateTop() {
        this.mainTopPanel.updateData();
    }

    

    
}