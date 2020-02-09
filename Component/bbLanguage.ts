import bb from "../bb";
import Language from "../Language";

const { ccclass, property } = cc._decorator;
@ccclass
export default class bbNotify extends cc.Component {
    strId: string;
    onLoad() {
        this.strId = this.getComponent(cc.Label).string;
        this.onChangeCode();

        bb.on(Language.EventType.CHANGE_CODE, this.onChangeCode, this);
    }

    onChangeCode() {
        this.getComponent(cc.Label).string = Language.getStr(this.strId);
    }

};
