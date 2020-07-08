export class GmManager {

    onLoad() {
        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                console.log('Press a key');
                break;
        }
    }

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                console.log('release a key');
                break;
        }
    }
    // https://docs.cocos.com/creator/manual/zh/scripting/player-controls.html


}