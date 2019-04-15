var bb = require("bb")
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    testPing() {
        bb.Console.addCustom("测试Http", () => {
            bb.log("test http");
            bb.Http.post("/user/ping", {}, () => {
                bb.log("callback!!");
            });
        });
    },

    testSignIn() {
        bb.Console.addCustom("测试登陆", () => {
            bb.log("test signin")
            bb.Http.init("https://coding1024.com");
            bb.Http.post("/user/sign_in", {
                acc: "test"
            }, (data) => {
                bb.Http.authorization = data.authorization;
            })
        })
    },

    testVersion() {
        bb.Console.addCustom("测试版本号", () => {
            var num = bb.Version.tonumber("99.88.77");
            bb.log(`version num ${num}`);
            var str = bb.Version.tostring(num);
            bb.log(`version str ${str}`);
            bb.log(`check version ${bb.Version.isLegal("1.1.0", "1.1.1")}`);
            bb.log(`check version ${bb.Version.isLegal("1.1.0", "1.2.0")}`);
        });
    },

    start() {
        this.testPing();
        this.testSignIn();
        this.testVersion();
    },

    // update (dt) {},
});
