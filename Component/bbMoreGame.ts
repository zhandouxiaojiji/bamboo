const {ccclass, property} = cc._decorator;

export interface bbMoreGameItem {
    icon: string;
    url: string; // market://details?id=com.xxx.xxx
    width?: number;
    height?: number;
} 

@ccclass
export default class bbMoreGame extends cc.Component {
    init (item_confs: bbMoreGameItem[], isLocal: boolean = false) {
        if(isLocal) {
            item_confs.forEach((conf) => {
                cc.loader.loadRes(conf.icon, cc.SpriteFrame, (err, spriteFrame) => {
                    this.addIcon(conf, spriteFrame);
                })
            })
            return;
        }
        // 远程加载需要服务端处理跨域问题
        item_confs.forEach((conf) => {
            cc.loader.load({ url: conf.icon }, (err, texture) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.addIcon(conf, new cc.SpriteFrame(texture));
            });
        })
    }
    addIcon(conf: bbMoreGameItem, spriteFrame: cc.SpriteFrame) {
        const node = new cc.Node();
        node.addComponent(cc.Sprite);
        node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        node.width = conf.width ? conf.width : 100;
        node.height = conf.height ? conf.height : 100;
        node.getComponent(cc.Sprite).type = cc.Sprite.Type.SIMPLE;
        node.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.CUSTOM;
        node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.sys.openURL(conf.url);
        })
        this.node.addChild(node);
    }
}
