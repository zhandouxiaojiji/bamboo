// 嵌套使用Prefab

const { ccclass, executeInEditMode, property } = cc._decorator;
@ccclass
@executeInEditMode
export default class LinkPrefab extends cc.Component {
    @property({ visible: false })
    private linkPrefab: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: true, displayName: "预制体" })
    set prefab(value: cc.Prefab) {
        this.linkPrefab = value;
        if (value) {
            this.node.removeAllChildren();
            let prefabNode = cc.instantiate(value);
            if (prefabNode) {
                // cc.Object["Flags"].DontSave          // 当前节点不会被保存到prefab文件里
                // cc.Object["Flags"].LockedInEditor    // 当前节点及子节点在编辑器里不会被点击到
                // cc.Object["Flags"].HideInHierarchy   // 当前节点及子节点在编辑器里不显示
                prefabNode["_objFlags"] |= (cc.Object["Flags"].DontSave | cc.Object["Flags"].LockedInEditor | cc.Object["Flags"].HideInHierarchy);
                this.node.addChild(prefabNode, -1) // 添加到最底层
            }
        }
    }

    get prefab(): cc.Prefab {
        return this.linkPrefab;
    }

    onLoad() {
        if (CC_EDITOR) {
            // 编辑器模式
            this.prefab = this.linkPrefab;
        } else {
            // 运行模式
            const node = cc.instantiate(this.linkPrefab);
            this.node.parent.addChild(node);
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

}