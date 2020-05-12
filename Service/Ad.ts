import WechatAd, { WechatAdConf } from "../Wechat/WechatAd";
import Admob from "../SDKBox/Admob";

export interface AdConf {
  wechat?: {[key: string]: WechatAdConf};
}

const isWechat = cc.sys.platform == cc.sys.WECHAT_GAME
const isNative = cc.sys.isNative

class Ad {
  init(conf: AdConf) {
    if(isWechat) {
      WechatAd.init(conf.wechat);
      return;
    }
    if(isNative) {
      Admob.init();
    }
  }
  
  showBanner(name: string) {
    if(isWechat) {
      return WechatAd.showBanner(name);
    }
    if(isNative) {
      return Admob.show(name);
    }
  }
  
  hideBanner(name: string) {
    if(isWechat) {
      return WechatAd.hideBanner(name);
    }
    if(isNative) {
      return Admob.hide(name);
    }
  }
  
  showInterstitial(name: string) {
    if(isWechat) {
      return WechatAd.showInterstitial(name);
    }
    if(isNative) {
      return Admob.show(name);
    }
  }

  async showRewarded(name: string) {
    if(isWechat) {
      return WechatAd.showRewarded(name);
    }
    if(isNative) {
      return Admob.reward(name);
    }
  }

  showIcon(name: string) {
    if(isWechat) {
      return WechatAd.showIconAd(name);
    }
  }

  hideIcon(name: string) {
    if(isWechat) {
      return WechatAd.hideIconAd(name);
    }
  }
}

export default new Ad();