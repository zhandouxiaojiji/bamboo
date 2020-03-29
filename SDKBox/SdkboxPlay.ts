import bb from "../bb";

class SdkboxPlay {
    EventType = {
        CON_STATUS: "CON_STATUS"
    }
    init() {
        sdkbox.PluginSdkboxPlay.init();
    }

    getInfo(field: string) {
        if (!cc.sys.isNative) {
            return;
        }
        return sdkbox.PluginSdkboxPlay.getPlayerAccountField(field);
    }

    async signin() {
        return new Promise<any>((resolve, reject) => {
            sdkbox.PluginSdkboxPlay.signin(true);
            sdkbox.PluginSdkboxPlay.setListener({
                onConnectionStatusChanged: (status: string) => {
                    if(!this.isSignin()) {
                        return reject(status);
                    }
                    
                    console.log("onConnectionStatusChanged", status);
                    console.log("isSignin", sdkbox.PluginSdkboxPlay.isSignedIn());
                    console.log("name", this.getInfo("name"));
                    console.log("display_name", this.getInfo("display_name"));
                    console.log("player_id", this.getInfo("player_id"));
                    bb.dispatch(this.EventType.CON_STATUS, status);
                    
                    if(cc.sys.os == cc.sys.OS_ANDROID) {
                        return resolve(this.getInfo("server_auth_code"));
                    } else if (cc.sys.os == cc.sys.OS_IOS) {
                        return resolve(sdkbox.PluginSdkboxPlay.generateIdentityVerificationSignature())
                    }
                }
            });
        });
    }

    isSignin() {
        if (!cc.sys.isNative) {
            return false;
        }
        return sdkbox.PluginSdkboxPlay.isSignedIn();
    }
    showLeaderboard(name: string) {
        if (this.isSignin()) {
            sdkbox.PluginSdkboxPlay.showLeaderboard(name);
        }
    }
    showAllLeaderboard() {
        if (this.isSignin()) {
            sdkbox.PluginSdkboxPlay.showAllLeaderboards();
        }
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
    unlockAchievement(name: string) {
        if (this.isSignin()) {
            sdkbox.PluginSdkboxPlay.unlockAchievement(name);
        }
    }
    incrementAchievement(name: string, increment: number) {
        if (this.isSignin()) {
            sdkbox.PluginSdkboxPlay.incrementAchievement(name, increment);

        }
    }
    showAchievements() {
        if (this.isSignin()) {
            sdkbox.PluginSdkboxPlay.showAchievements();
        }
    }
};
export default new SdkboxPlay();