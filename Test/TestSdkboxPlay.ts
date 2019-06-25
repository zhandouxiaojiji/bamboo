import Console from "../Console/ConsoleService";
import SdkboxPlay from "../SDKBox/SdkboxPlay";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TestSdkboxPlay extends cc.Component {
    onConnect(status: string) {
        bb.log("on connect !!!", status);
    };

    testUser() {
        Console.addCustom("SdkboxPlay", function () {
            SdkboxPlay.init();
            SdkboxPlay.signin();
        });
    };


    start() {
        bb.on(SdkboxPlay.EventType.CON_STATUS, this.onConnect, this);
        this.testUser();
    };

    onDestroy() {
        bb.off(SdkboxPlay.EventType.CON_STATUS, this.onConnect, this)
    }
};
