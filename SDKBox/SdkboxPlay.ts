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
    submitScore(name: string, score: number) {
        var localScore = parseInt(cc.sys.localStorage.getItem(name)) || 0;
        if (score > localScore) {
            cc.sys.localStorage.setItem(name, score);
            localScore = score;
        }
        if (this.isSignin()) {
            const ret = sdkbox.PluginSdkboxPlay.getMyScore(name, 2, 2);
            const remoteScore = ret ? ret["score"] : 0;
            if (localScore > remoteScore) {
                sdkbox.PluginSdkboxPlay.submitScore(name, score);
            }
        }
    }
    getMyScore(name: string) {
        const localScore = parseInt(cc.sys.localStorage.getItem(name)) || 0;
        if (this.isSignin()) {
            const ret = sdkbox.PluginSdkboxPlay.getMyScore(name, 2, 2);
            const remoteScore = ret ? ret["score"] : 0;
            if (localScore < remoteScore) {
                cc.sys.localStorage.setItem(name, remoteScore);
            }
            return localScore > remoteScore ? localScore : remoteScore;
        } else {
            return localScore;
        }
    }
};
export default new SdkboxPlay();