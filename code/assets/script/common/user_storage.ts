
/**
 * 保存用户状态数据，key 格式为：jigsaw_{难度等级}_{资源id}
 */
export class UserStorage {
    static getUserData(key: string): string {
        return cc.sys.localStorage.getItem(key);
    }
    
    static setUserData(key: string, value: string): void {
        cc.sys.localStorage.setItem(key, value);
    }

    static hasKey(key: string): boolean {
        let data = UserStorage.getUserData(key);
        if (data == "" || data == null) {
            return false
        } else {
            return true
        }
    }

    static clear() {
        cc.sys.localStorage.clear();
    }

    /**
     * 只删除不重要的数据
     */
    static clearCache() {
        let keys = Object.keys(LocalKey)
        let dataCache = {};
        for (let i=0; i<keys.length; i++) {
            let data = UserStorage.getUserData(keys[i]);
            if (data != null && data != "") {
                dataCache[keys[i]] = data;
            }
        }
        UserStorage.clear();
        for (let key in dataCache) {
            UserStorage.setUserData(key, dataCache[key]);
        }
    }

}


export class LocalKey {
    /**
     * 此处有键值得不会被清理
     */
    static user_type_select = "user_type_select";
    static user_level_select = "user_level_select";
    static user_task_state = "user_task_state"; // {state:[], time:}
    static user_pieces_num = "user_pieces_num"; // 拥有碎片个数
    static user_gold_num = "user_gold_num";   // 拥有金币个数
    static user_played_image = "user_played_image";  // 玩过的图片

}