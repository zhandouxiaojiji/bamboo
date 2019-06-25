const { ccclass, property } = cc._decorator;
@ccclass
export default class bbDialog extends cc.Component {
    @property(cc.Label)
    title: cc.Label;
    @property(cc.Label)
    content: cc.Label;
    @property(cc.Button)
    okBtn: cc.Button;
    @property(cc.Button)
    cancelBtn: cc.Button;

    show(title: string, content: string, ok: () => void, cancel: () => void) {
        this.title.string = title;
        this.content.string = content;
        this.okBtn.node.on("click", () => {
            this.node.active = false;
            if (ok) {
                ok();
            }
        });
        if (cancel) {
            this.node.active = false;
            this.cancelBtn.node.on("click", () => { });
        }
    }

    // update (dt) {},
};
