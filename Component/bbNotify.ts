import bb from "../bb";

const { ccclass, property } = cc._decorator;
@ccclass
export default class bbNotify extends cc.Component {
    @property(cc.Label)
    msgText: cc.Label = null;

    start() {
        this.node.opacity = 0;
        bb.on(bb.EventType.NOTIFY, (msg: string) => {
            this.node.stopAllActions();
            this.node.opacity = 255;
            this.node.y = 0;
            this.msgText.string = msg;
            this.node.runAction(cc.spawn(
                cc.fadeOut(1),
                cc.moveTo(1, cc.v2(0, 50))
            ))
        });

    };
};
