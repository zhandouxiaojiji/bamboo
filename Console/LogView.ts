import Console from "./ConsoleService";
import bb from "../bb";

const { ccclass, property } = cc._decorator;
@ccclass
export default class LogView extends cc.Component {
    @property(cc.Label)
    label: cc.Label;
    @property(cc.Node)
    content: cc.Node;

    onLoad() {
        bb.on(Console.EventType.UPDATE_LOG, this.updateLog, this);
    };

    start() {
    };

    onDestroy() {
        bb.off(Console.EventType.UPDATE_LOG, this.updateLog, this);
    };

    updateLog(str) {
        this.label.string = str;
        this.content.height = this.label.node.height + 30;
        var view_height = this.node.height;
        var content_height = this.content.height;
        this.content.y = content_height < view_height ? view_height / 2 : content_height - view_height / 2;
    };

    // update (dt) {},
};
