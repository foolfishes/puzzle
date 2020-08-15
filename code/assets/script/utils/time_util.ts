
export class TimeUtil {
    /**
     * 返回 00:00形式时间（分：秒）
     * @param {} seconds 
     */
    static formatTime(seconds) {
        let min = Math.floor(seconds/60);
        let sec = seconds % 60;
        return (Array(2).join("0") + min).slice(-2) + ":" + (Array(2).join("0") + sec).slice(-2);
    }

    /**
     * 返回今天的 0 时
     */
    static getTodayZero(): number {
        let time = new Date();
        let zeroTime = time.getTime()/1000 - (time.getHours()*3600+time.getMinutes()*60+time.getSeconds());
        return Math.floor(zeroTime);
    }

}
