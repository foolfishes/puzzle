import { UserStorage, LocalKey } from "../common/user_storage";


export class UserData {
    private static _instance: UserData;
    pieces: number;
    gold: number;
    imageIds: number[];

    static getInstance() {
        if (UserData._instance != null) {
            return UserData._instance;
        }
        return new UserData();
    }

    constructor() {
        UserData._instance = this;
        let data = UserStorage.getUserData(LocalKey.user_pieces_num);
        if (data != null && data != "") {
            this.pieces = parseInt(data);
        } else {
            this.pieces = 10;
        }
        this.gold = 0;
        let img = UserStorage.getUserData(LocalKey.user_played_image);
        if (img == null || img == "") {
            this.imageIds = [];
        } else {
            this.imageIds = JSON.parse(img);
        }
    }

    consumePiece(num: number) {
        this.pieces -= num;
        UserStorage.setUserData(LocalKey.user_pieces_num, this.pieces.toString());
    }

    receivePiece(num: number) {
        this.pieces += num;
        UserStorage.setUserData(LocalKey.user_pieces_num, this.pieces.toString());
    }

    consumeGold(num: number) {
        this.gold -= num;
        UserStorage.setUserData(LocalKey.user_gold_num, this.gold.toString());
    }

    receiveGold(num: number) {
        this.gold += num;
        UserStorage.setUserData(LocalKey.user_gold_num, this.gold.toString());
    }

    addImg(imgid: number) {
        this.imageIds.push(imgid);
        UserStorage.setUserData(LocalKey.user_played_image, JSON.stringify(this.imageIds));
    }
}