var bb = require("bb");
cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        content: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        bb.GlobalEvent.on(bb.Console.event.UPDATE_LOG, this.updateLog, this);
    },

    start () {
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
