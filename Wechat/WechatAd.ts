import bb from "../bb";

export enum WechatAdType {
  BANNER,
  INTERSTITIAL,
  REWARDED,
  ICON_AD,
}

export interface WechatAdConf {
  adName: string;
  adType: WechatAdType;
  adUnitId: string;
  style?: any;
  count?: number
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
        case WechatAdType.ICON_AD:
          if (wx.createGameIcon) {
            unit.ad = wx.createGameIcon({
              adUnitId: conf.adUnitId,
              count: conf.count,
              style: conf.style,
            });
          }
          if (unit.ad) {
            unit.ad.load().then(() => {
              unit.canUse = true;
            }).catch(err => {
              console.error(`wechat icon ad ${name} error ${err}`);
            })
          }
          break;
      }
    }
  }

  translateStyle(style: any) {
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
        unit.ad = wx.createBannerAd({
          adUnitId: unit.conf.adUnitId,
          adIntervals: 30,
          style: this.translateStyle(unit.conf.style),
        });
        unit.ad.show();
        unit.ad.onResize(res => {
          if (unit.conf.style.bottom != undefined) {
            unit.ad.style.top = systemInfo.windowHeight - unit.ad.style.realHeight - 5 - unit.conf.style.bottom;
          };
          unit.canUse = true;
        });
        unit.ad.onError(err => {
          console.log("err", err);
        });
      } else {
        unit.ad.show();
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
        bb.notify("暂时没有广告哦~");
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
            bb.notify("暂时没有广告哦~");
            return resolve(false);
          })
      });
    });
  }

  showIconAd(name: string) {
    let unit = this.units[name];
    if (unit) {
      if (unit.canUse) {
        console.log(`wechat showIconAd ${name}`);
        unit.ad.show();
        return true;
      } else {
        console.log(`wechat icon ad ${name} not ready`);
        return false;
      }
    } else {
      console.log(`ad ${name} not exist`);
      return false;
    }
  }

  hideIconAd(name: string) {
    let unit = this.units[name];
    if (unit) {
      if (unit.canUse) {
        console.log(`wechat showIconAd ${name}`);
        unit.ad.hide();
        return true;
      } else {
        console.log(`wechat icon ad ${name} not ready`);
        return false;
      }
    } else {
      console.log(`ad ${name} not exist`);
      return false;
    }
  }
}

export default new WechatAd();