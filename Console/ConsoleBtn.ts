import Console from "./ConsoleService";
import bb from "../bb";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ConsoleBtn extends cc.Component {
    @property(cc.Prefab)
    consoleViewPrefab: cc.Prefab = null;
    
    consoleView: cc.Node = null;

    onClick() {
        if(this.consoleView) {
            this.consoleView.active = !this.consoleView.active
        } else {
            this.consoleView = cc.instantiate(this.consoleViewPrefab);
            this.node.parent.addChild(this.consoleView);
        }
    };
};
