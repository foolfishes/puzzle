
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

}


export class LocalKey {

    static user_type_select = "user_type_select";
    static user_level_select = "user_level_select"

}