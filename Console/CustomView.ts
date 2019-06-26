import Console from "./ConsoleService";
import bb from "../bb";

const { ccclass, property } = cc._decorator;
@ccclass
export default class CustomView extends cc.Component {
    @property(cc.Node)
    content: cc.Node;
    @property(cc.Prefab)
    btnPrefab: cc.Prefab

    onLoad() {
        bb.on(Console.EventType.UPDATE_CUSTOM, this.updateCustomList, this);
    };

    start() {
        this.updateCustomList(Console.customs);
    };

    onDestroy() {
        bb.off(Console.EventType.UPDATE_CUSTOM, this.updateCustomList, this);
    };

    updateCustomList(customs) {
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
