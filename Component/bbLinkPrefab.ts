// 嵌套使用Prefab

const { ccclass, executeInEditMode, property } = cc._decorator;
@ccclass
@executeInEditMode
export default class bbLinkPrefab extends cc.Component {
    @property({ visible: false })
    private linkPrefab: cc.Prefab = null;

    private prefabNode: cc.Node = null;

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
                this.prefabNode = prefabNode;
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
            const prefabNode = cc.instantiate(this.linkPrefab);
            this.node.addChild(prefabNode)
            this.prefabNode = prefabNode;
        }
    }

    public getPrefabComponent<T extends cc.Component>(type: { prototype: T }): T {
        let prefabNode = this.prefabNode
        return prefabNode ? prefabNode.getComponent(type) : null;
    }

}