var bb = require("bb")
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        bb.Console.addCustom("测试字符串", function () {
            bb.log("test string");
            var str = "aa bb cc";
            bb.log(str.split(" "));
        });
    },

    // update (dt) {},
});
