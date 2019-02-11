var bb = require("bb");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onConnect(status){
        bb.log("on connect !!!", status);
    },
    testUser() {
        bb.Console.addCustom("SdkboxPlay", function(){
            bb.SdkboxPlay.init();
            bb.SdkboxPlay.signin();
        });
    },


    start () {
        bb.GlobalEvent.on(bb.SdkboxPlay.event.CON_STATUS, this.onConnect, this);
        this.testUser();
    },

    onDestroy(){
        bb.GlobalEvent.off(bb.SdkboxPlay.event.CON_STATUS, this.onConnect, this)
    }

    // update (dt) {},
});
