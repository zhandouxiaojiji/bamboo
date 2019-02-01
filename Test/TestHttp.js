var bb = require("bb")
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        bb.Console.addCustom("测试Http", function(){
            bb.log("test http");
            bb.Http.init("http://mini.coding1024.com");
            bb.Http.post("/api/ping", {}, function(){
                bb.log("callback!!");
            });
        });
    },

    // update (dt) {},
});
