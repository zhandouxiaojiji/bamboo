var bb = require("bb")

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        btnPrefab: cc.Prefab
    },

    onLoad() {
        bb.on(bb.Console.EventType.UPDATE_CUSTOM, this.updateCustomList, this);
    },

    start() {
        this.updateCustomList(bb.Console.customs);
    },

    onDestroy() {
        bb.off(bb.Console.EventType.UPDATE_CUSTOM, this.updateCustomList, this);
    },

    updateCustomList(customs) {
        for (const i in customs) {
            const element = customs[i];
            var node = cc.instantiate(this.btnPrefab);
            node.on("click", element.callback);
            this.content.addChild(node);
            node.getChildByName("Label").getComponent(cc.Label).string = element.name;
        }
    }

    // update (dt) {},
});
