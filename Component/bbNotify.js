cc.Class({
    extends: cc.Component,

    properties: {
        msgText: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.opacity = 0;
    },

    show(msg){
        this.node.opacity = 255;
        this.msgText.string = msg;
        this.node.runAction(cc.spawn(
            cc.fadeOut(1),
            cc.moveTo(1, cc.v2(0, 50))    
        ))
    }

    // update (dt) {},
});
