import bbNotify from "./bbNotify";
import bbDialog from "./bbDialog";
import bb from "../bb";

const { ccclass, property } = cc._decorator;
@ccclass
export default class bbMain extends cc.Component {
    @property(cc.Prefab)
    notifyPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    dialogPrefab: cc.Prefab = null;

    notify: bbNotify;
    dialog: bbDialog;

    onLoad() {
        bb.on(bb.EventType.NOTIFY, this.onNotify, this);
        bb.on(bb.EventType.DIALOG, this.onDialog, this);
        bb.on(bb.EventType.SCHEDULE, this.onSchedule, this);
        bb.on(bb.EventType.UNSCHEDULE, this.onUnschedule, this);

        var node = cc.instantiate(this.notifyPrefab);
        cc.find("Canvas").addChild(node, cc.macro.MAX_ZINDEX);
        this.notify = node.getComponent(bbNotify);

        node = cc.instantiate(this.dialogPrefab);
        cc.find("Canvas").addChild(node, cc.macro.MAX_ZINDEX);
        this.dialog = node.getComponent(bbDialog);
        node.active = false;
    };
    onDestroy() {
        bb.off(bb.EventType.NOTIFY, this.onNotify, this);
        bb.off(bb.EventType.DIALOG, this.onDialog, this);
        bb.off(bb.EventType.SCHEDULE, this.onSchedule, this);
        bb.off(bb.EventType.UNSCHEDULE, this.onUnschedule, this);
    };

    start() {
    };

    onNotify(msg: string) {
        bb.log("onNotify", msg);
        this.notify.show(msg);
    };

    onDialog(title: string, content: string, ok: () => void, cancel: () => void) {
        bb.log("onDialog", title, content, ok, cancel);
        this.dialog.show(title, content, ok, cancel);
        this.dialog.node.active = true;
    };

    onSchedule(callback: Function, interval?: number, repeat?: number, delay?: number) {
        this.schedule(callback, interval, repeat, delay);
    };

    onUnschedule(callback: Function){
        this.unschedule(callback);
    }

};
