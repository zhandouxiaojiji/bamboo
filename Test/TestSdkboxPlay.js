var bb = require("bb");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    testUser() {
        bb.Console.addCustom("SdkboxPlay", function(){
            bb.SdkboxPlay.init();
        });
    },

    start () {
        this.testUser();
    },

    // update (dt) {},
});
