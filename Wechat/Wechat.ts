import { decryptData } from "./WXBizDataCrypt";

class Wechat {
    userInfo: any;
    appId: string;
    sessionKey: string;
    iv: string;

    canUse() {
        return cc.sys.platform == cc.sys.WECHAT_GAME
    }

    init(appId?: string) {
        if (!this.canUse()) {
            return;
        }
        this.appId = appId;
        // this.initUserInfoButton();
        wx.getSetting({
            success: (res) => {
                console.log(res.authSetting)
                if (!res.authSetting["scope.userInfo"]) {
                    this.initUserInfoButton();
                }
                // res.authSetting = {
                //   "scope.userInfo": true,
                //   "scope.userLocation": true
                // }
            }
        })
    }

    login() {
        wx.login();
    }

    initUserInfoButton() {
        let systemInfo = wx.getSystemInfoSync();
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                lineHeight: 40,
                backgroundColor: '#00000000',
                color: '#00000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 4
            }
        });

        button.onTap((res) => {
            let userInfo = res.userInfo;
            if (!userInfo) {
                console.log(res.errMsg);
                return;
            }
            this.userInfo = res.userInfo;
            // cc.loader.load({url: userInfo.avatarUrl, type: 'png'}, (err, texture) => {
            //     if (err) {
            //         console.error(err);
            //         return;
            //     }
            //     this.avatar.spriteFrame = new cc.SpriteFrame(texture);
            // });
            // wx.getOpenDataContext().postMessage({
            //     message: "User info get success."
            // });
            button.hide();
            button.destroy();
        });
    }

    submitScore(key: string, score: number) {
        wx.setUserCloudStorage({
            KVDataList: [{ key, value: String(score) }],
            success: (ret) => {
                console.log("setUserCloudStore ok", ret);
            },
            fail: (ret) => {
                console.log("setUserCloudStorage fail", ret);
            },
            complete: (ret) => {
                console.log("setUserCloudStore complete", ret);
            }
        });
        cc.sys.localStorage.setItem(key, score);
    }

    getMyScore(key: string, cb: any) {
        var localScore = parseInt(cc.sys.localStorage.getItem(key)) || 0;
        // TODO
        // wx.getUserInteractiveStorage({
        //     keyList: [key],
        //     success: (encryptedData) => {
        //         console.log("get my encryptedData", encryptedData);
        //         let data = decryptData(encryptedData, this.iv, this.appId);
        //         console.log("get my data", data);
        //         let remoteScore = data[key] || "0";
        //         cb(parseInt(remoteScore));
        //         if (localScore < remoteScore) {
        //             cc.sys.localStorage.setItem(key, remoteScore);
        //         }
        //     },
        // });
        return localScore;
    }

    submitRank(score: number) {
        wx.setUserCloudStorage({
            wxgame: {
                score,
                update_time: Date.parse(Date()) / 1000
            }
        })
    }

    postMessageOpenContent(cmd, data) {
        wx.getOpenDataContext().postMessage({
            cmd,
            data,
        });
    }
}

export default new Wechat();