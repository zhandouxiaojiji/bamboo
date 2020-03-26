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
  style?: WechatAdStyle;
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
          unit.ad.onLoad(() => {
            console.log(`wechat interstitial ad ${name} is ready`);
            unit.canUse = true;
          });
          unit.ad.onError(err => {
            console.log(`wechat interstitial ad ${name} error ${err}`)
          })
          break;
        case WechatAdType.REWARDED:
          unit.ad = wx.createRewardedVideoAd({
            adUnitId: conf.adUnitId,
          });
          unit.ad.onLoad(() => {
            console.log(`wechat rewarded ad ${name} is ready`);
            unit.canUse = true;
          });
          unit.ad.onError(err => {
            console.log(`wechat rewarded ad ${name} error ${err}`)
          })
          break;
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
          if (unit.conf.style.bottom != undefined) {
            bannerAd.style.top = systemInfo.windowHeight - bannerAd.style.realHeight - 5 - unit.conf.style.bottom;
          };
          unit.canUse = true;
        });
        bannerAd.onError(err => {
          console.log("err", err);
        });
      }
      return true;
    } else {
      console.log(`ad ${name} not exist`);
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
      console.log(`ad ${name} not exist`);
      return false;
    }
  }

  showInterstitial(name: string) {
    let unit = this.units[name];
    if (unit) {
      if (unit.canUse) {
        console.log(`wecaht showInterstitial ${name}`);
        unit.ad.show().catch((err) => {
          console.error(`wecaht showInterstitial ${name} error ${err}`);
        });
        return true;
      } else {
        console.log(`wechat interstital ${name} not ready`);
        return false;
      }
    } else {
      console.log(`ad ${name} not exist`);
      return false;
    }
  }

  async showRewarded(name: string) {
    return new Promise<Boolean>((resolve, reject) => {
      let unit = this.units[name];
      if (!unit || !unit.canUse) {
        return resolve(false);
      }
      const ad = unit.ad;
      ad.onClose(res => {
        // 用户点击了【关闭广告】按钮
        // 小于 2.1.0 的基础库版本，res 是一个 undefined
        if (res && res.isEnded || res === undefined) {
          // 正常播放结束，可以下发游戏奖励
          return resolve(true);
        }
        else {
          // 播放中途退出，不下发游戏奖励
          return resolve(false);
        }
      })
      ad.show().catch(() => {
        // 失败重试
        ad.load()
          .then(() => ad.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
            return resolve(false);
          })
      });
    });
  }
}

export default new WechatAd();