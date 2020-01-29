import bb from "../bb";

class SdkboxPlay {
    EventType = {
        CON_STATUS: "CON_STATUS"
    }
    init() {
        if (!cc.sys.isMobile) {
            return;
        }
        sdkbox.PluginSdkboxPlay.init();
    }
    getInfo(field: string) {
        if (!cc.sys.isMobile) {
            return;
        }
        return sdkbox.PluginSdkboxPlay.getPlayerAccountField(field);
    }
    signin() {
        if (!cc.sys.isMobile) {
            cc.log("not mobile platform");
            return;
        }
        sdkbox.PluginSdkboxPlay.signin(true);
        sdkbox.PluginSdkboxPlay.setListener({
            onConnectionStatusChanged: (status: string) => {
                cc.log("onConnectionStatusChanged", status);
                cc.log("isSignin", sdkbox.PluginSdkboxPlay.isSignedIn());
                cc.log("name", this.getInfo("name"));
                cc.log("display_name", this.getInfo("display_name"));
                cc.log("player_id", this.getInfo("player_id"));
                bb.dispatch(this.EventType.CON_STATUS, status);
            }
        })
    }
    isSignin() {
        if (!cc.sys.isMobile) {
            return false;
        }
        return sdkbox.PluginSdkboxPlay.isSignedIn();
    }
    showLeaderboard(name: string) {
        sdkbox.PluginSdkboxPlay.showLeaderboard(name);
    }
    showAllLeaderboard() {
        sdkbox.PluginSdkboxPlay.showAllLeaderboards();
    }
};
export default new SdkboxPlay();