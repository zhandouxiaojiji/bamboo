import bb from "../bb";

const { ccclass, property } = cc._decorator;
@ccclass
export default class bbDialog extends cc.Component {
    @property(cc.Label)
    title: cc.Label = null;
    @property(cc.Label)
    content: cc.Label = null;
    @property(cc.Button)
    okBtn: cc.Button = null;
    @property(cc.Button)
    cancelBtn: cc.Button = null;

    show(title: string, content: string, ok: () => void, cancel: () => void) {
        bb.log(title, content);
        this.node.active = true;
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
