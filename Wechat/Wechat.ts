import bb from "../bb";

class Wechat {
    userInfo: any;

    canUse() {
        return cc.sys.platform == cc.sys.WECHAT_GAME
    }

    init() {
        if (!this.canUse()) {
            return;
        }
        // this.initUserInfoButton();
        wx.getSetting({
            success: (res) => {
              console.log(res.authSetting)
              if(!res.authSetting["scope.userInfo"]) {
                  this.initUserInfoButton();
              }
              // res.authSetting = {
              //   "scope.userInfo": true,
              //   "scope.userLocation": true
              // }
            }
          })
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
}

export default new Wechat();