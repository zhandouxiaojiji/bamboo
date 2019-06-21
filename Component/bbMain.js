var bb = require("bb");
var bbNotify = require("bbNotify");
var bbDialog = require("bbDialog");

cc.Class({
    extends: cc.Component,

    properties: {
        notifyPrefab: cc.Prefab,
        dialogPrefab: cc.Prefab,
    },
    notify: null,
    dialog: null,

    onLoad() {
        bb.on(bb.EventType.NOTIFY, this.onNotify, this);
        bb.on(bb.EventType.DIALOG, this.onDialog, this);
    },
    onDestroy() {
        bb.off(bb.EventType.NOTIFY, this.onNotify, this);
        bb.off(bb.EventType.DIALOG, this.onDialog, this);
    },

    start() {
        var node = cc.instantiate(this.notifyPrefab);
        cc.find("Canvas").addChild(node, 99999);
        this.notify = node.getComponent(bbNotify);

        node = cc.instantiate(this.dialogPrefab);
        cc.find("Canvas").addChild(node, 99999);
        this.dialog = node.getComponent(bbDialog);
    },

    onNotify(msg) {
        bb.log("onNotify", msg);
        this.notify.show(msg);
    },

    onDialog(title, content, ok, cancel) {
        bb.log("onDialog", title, content, ok, cancel);
        this.dialog.show(title, content, ok, cancel);
    }
    
});
