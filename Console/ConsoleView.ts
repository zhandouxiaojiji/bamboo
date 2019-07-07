import Console from "./ConsoleService";
import bb from "../bb";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ConsoleView extends cc.Component {
    @property(cc.Node)
    view: cc.Node = null;
    @property(cc.Node)
    logView: cc.Node = null;
    @property(cc.Node)
    customView: cc.Node = null;
    @property(cc.Button)
    customBtn: cc.Button = null;
    @property(cc.EditBox)
    inputCmd: cc.EditBox = null;

    // onLoad () {},

    start() {
        this.view.active = false;
        this.logView.active = true;
        this.customView.active = false;
        Console.init();
    };

    onClickShowView() {
        this.view.active = !this.view.active;
    };

    onClickCustomBtn() {
        if (this.logView.active) {
            this.logView.active = false;
            this.customView.active = true;
            this.customBtn.node.getChildByName('Label').getComponent(cc.Label).string = "日志";
        } else {
            this.logView.active = true;
            this.customView.active = false;
            this.customBtn.node.getChildByName('Label').getComponent(cc.Label).string = "常用命令";
        }
    };

    onClickRun() {
        cc.log("run cmd", this.inputCmd.string);
        Console.runCmd(this.inputCmd.string);
    };

    // update (dt) {},
};
