import bb from "../bb";
import Language from "../Service/Language";

const { ccclass, property } = cc._decorator;
@ccclass
export default class bbNotify extends cc.Component {
    @property(cc.String)
    strId: string = "";
    @property(cc.Boolean)
    isSprite: boolean = false;

    onLoad() {
        if(this.strId == ""){
            this.strId = this.getComponent(cc.Label).string;
        }
        this.onChangeCode();
        bb.on(Language.EventType.CHANGE_LANGUAGE, this.onChangeCode, this);
    }

    onChangeCode() {
        if(this.isSprite) {
            cc.loader.loadRes(Language.getStr(this.strId), cc.SpriteFrame, (err, spriteFrame) => {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        } else {
            this.getComponent(cc.Label).string = Language.getStr(this.strId);
        }
    }

};
