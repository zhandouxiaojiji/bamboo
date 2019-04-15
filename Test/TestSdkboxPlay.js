var bb = require("bb");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onConnect(status) {
        bb.log("on connect !!!", status);

    },
    testUser() {
        bb.Console.addCustom("SdkboxPlay", function () {
            bb.SdkboxPlay.init();
            bb.SdkboxPlay.signin();
        });
    },


    start() {
        bb.on(bb.SdkboxPlay.EventType.CON_STATUS, this.onConnect, this);
        this.testUser();
    },

    onDestroy() {
        bb.off(bb.SdkboxPlay.EventType.CON_STATUS, this.onConnect, this)
    }

    // update (dt) {},
});
