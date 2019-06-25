const { ccclass, property } = cc._decorator;
@ccclass
export default class bbNotify extends cc.Component {
    msgText: cc.Label;

    start() {
        this.node.opacity = 0;
    };

    show(msg: string) {
        this.node.opacity = 255;
        this.msgText.string = msg;
        this.node.runAction(cc.spawn(
            cc.fadeOut(1),
            cc.moveTo(1, cc.v2(0, 50))
        ))
    };
};
