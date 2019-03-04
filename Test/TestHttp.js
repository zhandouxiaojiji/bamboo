var bb = require("bb")
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    testPing() {
        bb.Console.addCustom("测试Http", function(){
            bb.log("test http");
            bb.Http.post("/user/ping", {}, function(){
                bb.log("callback!!");
            });
        });
    },

    testSignIn() {
        bb.Console.addCustom("测试登陆", function() {
            bb.log("test signin")
            bb.Http.init("https://coding1024.com");
            bb.Http.post("/user/sign_in", {
                acc: "test"
            }, function(data) {
                bb.Http.authorization = data.authorization;
            })
        })
    },

    start () {
        this.testPing();
        this.testSignIn();
    },

    // update (dt) {},
});
