var bb = require("bb")
cc.Class({
    extends: cc.Component,

    properties: {
        view: cc.Node,
        logView: cc.Node,
        customView: cc.Node,
        customBtn: cc.Button,
        inputCmd: cc.EditBox,
    },

    // onLoad () {},

    start() {
        this.view.active = false;
        this.view.logView = true;
        this.view.customView = false;

        bb.Console.init();
    },

    onClickShowView() {
        this.view.active = !this.view.active;
    },

    onClickCustomBtn() {
        if (this.logView.active) {
            this.logView.active = false;
            this.customView.active = true;
            this.customBtn.node.getChildByName('Label').getComponent(cc.Label).string = "日志";
        } else {
            this.logView.active = true;
            this.customView.active = false;
            this.customBtn.node.getChildByName('Label').getComponent(cc.Label).string = "常用命令";
        }
    },

    onClickRun() {
        bb.log("run cmd", this.inputCmd.string);
        bb.Console.runCmd(this.inputCmd.string);
    }

    // update (dt) {},
});
