var bb = require("bb")
cc.Class({
    extends: cc.Component,

    properties: {
        view: cc.Node,
        logView: cc.Node,
        customView: cc.Node,
        customBtn: cc.Button,
    },

    // onLoad () {},

    start () {
        this.view.active = false;
    },

    onClickShowView(){
        this.view.active = !this.view.active;
    },

    onClickCustomBtn() {
        if(this.logView.active){
            this.logView.active = false;
            this.customBtn.active = true;
            bb.log("show custom view");
        }else{
            this.logView.active = true;
            this.customBtn.active = false;
            bb.log("show log view");
        }
    },

    onClickRun() {
        bb.log("xxx", this.view, null, "ooo");
    }

    // update (dt) {},
});
