import WechatAd, { WechatAdConf } from "../Wechat/WechatAd";

export interface AdConf {
  wechat?: {[key: string]: WechatAdConf};
}

class Ad {
  init(conf: AdConf) {
    if(cc.sys.platform == cc.sys.WECHAT_GAME) {
      WechatAd.init(conf.wechat);
      return;
    }
  }
  
  showBanner(name: string) {
    if(cc.sys.platform == cc.sys.WECHAT_GAME) {
      return WechatAd.showBanner(name);
    }
  }
  
  hideBanner(name: string) {
    if(cc.sys.platform == cc.sys.WECHAT_GAME) {
      return WechatAd.hideBanner(name);
    }
  }
  
  showInterstitial(name: string) {
    if(cc.sys.platform == cc.sys.WECHAT_GAME) {
      return WechatAd.showInterstitial(name);
    }
  }

  async showRewarded(name: string) {
    if(cc.sys.platform == cc.sys.WECHAT_GAME) {
      return WechatAd.showRewarded(name);
    }
  }
}

export default new Ad();