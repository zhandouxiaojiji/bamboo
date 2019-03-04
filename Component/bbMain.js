var bb = require("bb");
var bbNotify = require("bbNotify");
cc.Class({
    extends: cc.Component,

    properties: {
        notifyPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:
    notify: null,

    onLoad () {
        bb.on(bb.EventType.NOTIFY, this.onNotify, this)
    },
    onDestroy() {
        bb.off(bb.EventType.NOTIFY, this.onNotify, this);
    },

    start () {
        var node = cc.instantiate(this.notifyPrefab);
        cc.find("Canvas").addChild(node, 99999);
        this.notify = node.getComponent(bbNotify);        
    },

    onNotify(msg) {
        bb.log("onNotify", msg);
        this.notify.show(msg);
    }

    // update (dt) {},
});
