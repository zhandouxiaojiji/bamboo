export enum WechatAdType {
  BANNER,
  INTERSTITIAL,
  REWARDED,
}

export interface WechatAdStyle {
  left?: number;
  top?: number;
  bottom?: number;
  width?: number;
  height?: number;
}

export interface WechatAdConf {
  adName: string;
  adType: WechatAdType;
  adUnitId: string;
  style: WechatAdStyle;
}

export interface WechatAdUnit {
  ad?: any;
  conf: WechatAdConf;
  canUse: boolean;
}

class WechatAd {
  confs: { [key: string]: WechatAdConf };
  units: { [key: string]: WechatAdUnit } = {};
  systemInfo: any;

  init(confs: { [key: string]: WechatAdConf }) {
    this.systemInfo = wx.getSystemInfoSync();
    this.confs = confs;
    for (let name in confs) {
      let conf = confs[name];
      let unit: WechatAdUnit = {
        canUse: false,
        conf,
      }
      this.units[name] = unit;
      switch (conf.adType) {
        case WechatAdType.INTERSTITIAL:
          unit.ad = wx.createInterstitialAd({
            adUnitId: conf.adUnitId,
          });
          break;
        case WechatAdType.REWARDED:
          unit.ad = wx.createRewardedVideoAd({
            adUnitId: conf.adUnitId,
          })
      }
    }
  }

  translateStyle(style: WechatAdStyle) {
    let left = style.left;
    let top = style.top;
    let width = style.width;
    if (width == 0) {
      width = this.systemInfo.windowWidth;
    }
    if (!left && width) {
      left = (this.systemInfo.windowWidth - width) / 2;
    }
    if (style.bottom != undefined) {
      top = this.systemInfo.windowHeight * 0.9;
    }
    return {
      left,
      top,
      width,
    }
  }

  showBanner(name: string) {
    let unit = this.units[name];
    if (unit) {
      if (!unit.ad) {
        const systemInfo = wx.getSystemInfoSync();
        let bannerAd = wx.createBannerAd({
          adUnitId: unit.conf.adUnitId,
          adIntervals: 30,
          style: this.translateStyle(unit.conf.style),
        });
        bannerAd.show();
        bannerAd.onResize(res => {
          if(unit.conf.style.bottom != undefined) {
            bannerAd.style.top = systemInfo.windowHeight - bannerAd.style.realHeight - 5 - unit.conf.style.bottom;
          };
          unit.canUse = true;
        });
        bannerAd.onError(err => {
          console.log("err", err);
        });
      }
      if (unit.canUse) {
        return true;
      } else {
        console.log(`wechat banner ${name} not ready`);
        return false;
      }
    } else {
      console.log("ad", name, "not exist");
      return false;
    }
  }

  hideBanner(name: string) {
    let unit = this.units[name];
    if (unit) {
      if (unit.canUse) {
        unit.ad.hide();
        return true;
      } else {
        console.log(`wechat banner ${name} not ready`);
        return false;
      }
    } else {
      console.log("ad", name, "not exist");
      return false;
    }
  }

  async showInterstitial(name: string) {
    return new Promise<Boolean>((resolve, reject) => {
      let ad = this.units[name];
      if (!ad) {
        return reject(false);
      }
      return ad.show();
    });
  }

  async showRewarded(name: string) {
    return new Promise<Boolean>((resolve, reject) => {
      let ad = this.units[name];
      if (!ad) {
        return reject(false);
      }
      return ad.show();
    });
  }
}

export default new WechatAd();