
export class UserStorage {
    static getUserKey(key: string): string {
        return cc.sys.localStorage.getItem(key)
    }
    
    static setUserKey(key: string, value: string) {
        cc.sys.localStorage.setItem(key, value)
    }
    
    static status_normal_10000 = "";

}
