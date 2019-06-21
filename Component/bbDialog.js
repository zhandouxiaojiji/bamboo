cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        content: cc.Label,
        okBtn: cc.Button,
        cancelBtn: cc.Button,
    },

    start() {

    },

    show(param) {
        this.title.string = param.title;
        this.content.string = param.content;
        this.okBtn.on("click", () => {
            this.node.active = false;
            if (param.ok) {
                param.ok();
            }
        });
        if (param.cancel) {
            this.node.active = false;
            this.cancelBtn.on("click");
        }
    }

    // update (dt) {},
});
