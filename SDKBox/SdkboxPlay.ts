import bb from "../bb";

class SdkboxPlay {
    EventType = {
        CON_STATUS: "CON_STATUS"
    };
    init() {
        if (!cc.sys.isMobile) {
            return;
        }
        sdkbox.PluginSdkboxPlay.init();
    };
    getInfo(field: string) {
        if (!cc.sys.isMobile) {
            return;
        }
        return sdkbox.PluginSdkboxPlay.getPlayerAccountField(field);
    };
    signin() {
        if (!cc.sys.isMobile) {
            bb.log("not mobile platform");
            return;
        }
        sdkbox.PluginSdkboxPlay.signin(true);
        sdkbox.PluginSdkboxPlay.setListener({
            onConnectionStatusChanged: (status: string) => {
                bb.log("onConnectionStatusChanged", status);
                bb.log("isSignin", sdkbox.PluginSdkboxPlay.isSignedIn());
                bb.log("name", this.getInfo("name"));
                bb.log("display_name", this.getInfo("display_name"));
                bb.log("player_id", this.getInfo("player_id"));
                bb.dispatch(this.EventType.CON_STATUS, status);
            }
        })
    };
    isSignin() {
        if (!cc.sys.isMobile) {
            return false;
        }
        return sdkbox.PluginSdkboxPlay.isSignedIn();
    };
};

export default new SdkboxPlay;