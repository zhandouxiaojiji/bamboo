// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var bb = require("bb");
cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        content: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        bb.GlobalEvent.on(bb.Console.event.UPDATE_LOG, this.updateLog, this);
    },

    onDestroy(){
        bb.GlobalEvent.off(bb.Console.event.UPDATE_LOG, this.updateLog, this);
    },

    updateLog(str){
        this.label.string = str;
        this.content.height = this.label.node.height+30;
        var view_height = this.node.height;
        var content_height = this.content.height;
        this.content.y = content_height < view_height ? view_height/2 : content_height - view_height/2;
    }

    // update (dt) {},
});
