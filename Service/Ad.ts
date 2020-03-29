import WechatAd, { WechatAdConf } from "../Wechat/WechatAd";
import Admob from "../SDKBox/Admob";

export interface AdConf {
  wechat?: {[key: string]: WechatAdConf};
}

class Ad {
  init(conf: AdConf) {
    if(cc.sys.platform == cc.sys.WECHAT_GAME) {
      WechatAd.init(conf.wechat);
      return;
    }
    if(cc.sys.isNative) {
      Admob.init();
    }
  }
  
  showBanner(name: string) {
    if(cc.sys.platform == cc.sys.WECHAT_GAME) {
      return WechatAd.showBanner(name);
    }
    if(cc.sys.isNative) {
      return Admob.show(name);
    }
  }
  
  hideBanner(name: string) {
    if(cc.sys.platform == cc.sys.WECHAT_GAME) {
      return WechatAd.hideBanner(name);
    }
    if(cc.sys.isNative) {
      return Admob.hide(name);
    }
  }
  
  showInterstitial(name: string) {
    if(cc.sys.platform == cc.sys.WECHAT_GAME) {
      return WechatAd.showInterstitial(name);
    }
    if(cc.sys.isNative) {
      return Admob.show(name);
    }
  }

  async showRewarded(name: string) {
    if(cc.sys.platform == cc.sys.WECHAT_GAME) {
      return WechatAd.showRewarded(name);
    }
    if(cc.sys.isNative) {
      return Admob.reward(name);
    }
  }
}

export default new Ad();