import { CenterPop } from "../base_ui/center_pop";
import { UIUtil } from "../utils/ui_util";
import { DataUtil } from "../utils/data_util";
import { ToggleGroup } from "../base_ui/toggle_group";
import { JigsawPuzzleUI } from "../jigsaw_puzzle/jigsaw_puzzle_ui";
import { LevelType } from "../jigsaw_puzzle/config_data";
import { MovePuzzleUI } from "../move_puzzle/move_puzzle_ui";
import { UserStorage, LocalKey } from "../common/user_storage";


export class SelectConfirmUI extends CenterPop {
    imgId: number;
    typeTG: ToggleGroup;
    levelTG: ToggleGroup;
    typeSelected: number;
    levelSelected: number;

    constructor(imgId:number) {
        super("prefabs/game_select_layer")
        this.imgId = imgId;
    }

    initUI() {
        this.contentNode = this.rootNode.getChildByName("content_panel");
        let selectedImg = this.contentNode.getChildByName("selected_img");
        UIUtil.loadTexture(selectedImg, DataUtil.getImageById(this.imgId));
        let typeNodes = [this.contentNode.getChildByName("custom_btn"),
                         this.contentNode.getChildByName("move_btn")];
        let levelNodes = [this.contentNode.getChildByName("lv_simple_btn"),
                          this.contentNode.getChildByName("lv_normal_btn"),
                          this.contentNode.getChildByName("lv_hard_btn"),
                          this.contentNode.getChildByName("lv_crazy_btn"),]
        this.typeSelected = this._getLocalData(LocalKey.user_type_select);
        this.levelSelected = this._getLocalData(LocalKey.user_level_select);
        this.typeTG = new ToggleGroup(typeNodes, this._onTypeChoose.bind(this), this.typeSelected);
        this.levelTG = new ToggleGroup(levelNodes, this._onLevelChoose.bind(this), this.levelSelected);
        UIUtil.addListener(this.contentNode, (event)=>{event.stopPropagation()});
        UIUtil.addListener(this.contentNode.getChildByName("close_btn"), this.close.bind(this));
        UIUtil.addListener(this.contentNode.getChildByName("begin_btn"), this._beginGame.bind(this));
    }

    _onTypeChoose(index: number) {
        this.typeSelected = index;
    }

    _onLevelChoose(index: number) {
        this.levelSelected = index;
    }

    _beginGame(event: cc.Event.EventTouch) {
        let imgId = this.imgId;
        let level = this.levelSelected;
        let that: SelectConfirmUI = this;
        this._setLocalData(LocalKey.user_type_select, this.typeSelected.toString());
        this._setLocalData(LocalKey.user_level_select, this.levelSelected.toString());
        if (this.typeSelected == 0) { // jigsaw
            cc.resources.load("prefabs/jigsaw_puzzle_layer", function(err, prefabs:cc.Prefab) {
                let jigsawLayer:cc.Node = cc.instantiate(prefabs);
                cc.find("Canvas").addChild(jigsawLayer);
                let JigsawJs: JigsawPuzzleUI = jigsawLayer.getComponent("jigsaw_puzzle_ui");
                JigsawJs.init(imgId, level);
                that.close();
            })
        } else {  // move
            cc.resources.load("prefabs/move_puzzle_layer", function(err, prefabs:cc.Prefab) {
                let moveLayer:cc.Node = cc.instantiate(prefabs);
                cc.find("Canvas").addChild(moveLayer);
                let MoveJs: MovePuzzleUI = moveLayer.getComponent("move_puzzle_ui");
                MoveJs.init(imgId, level);
                that.close();
            })
        }
    } 

    _getLocalData(key: string): number {
        let data = UserStorage.getUserData(key);
        if (data == "" || data == null) {
            return 0;
        }
        return parseInt(data);
    }

    _setLocalData(key: string, value: string): void {
        UserStorage.setUserData(key, value);
    }

}