var bb = require("bb")

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        btnPrefab: cc.Prefab
    },


    onLoad () {
        bb.GlobalEvent.on(bb.Console.event.UPDATE_CUSTOM, this.updateCustomList, this);
    },

    start () {
        bb.Console.init();
    },

    onDestroy() {
        bb.GlobalEvent.off(bb.Console.event.UPDATE_CUSTOM, this.updateCustomList, this);
    },

    updateCustomList(customs){
        bb.log("&&&&&& updateCustomList");
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
