import bb from "../bb";
import { isTTGame } from "../Utils";

export enum WechatBannerStyle {
  TOP_LEFT,
  TOP_RIGHT,
  TOP_CENTER,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  BOTTOM_CENTER,
  CENTER,
}

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
          if (!wx.createInterstitialAd) return;
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
          if (!wx.createRewardedVideoAd) return;
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

  showBanner(name: string) {
    let unit = this.units[name];
    if (unit) {
      if (!unit.ad) {
        const systemInfo = wx.getSystemInfoSync();
        const screenWidth = systemInfo.windowWidth;
        const screenHeight = systemInfo.windowHeight;
        unit.ad = wx.createBannerAd({
          adUnitId: unit.conf.adUnitId,
          adIntervals: 30,
          style: {
            width: 200
          },
        });
        unit.ad.show();
        unit.ad.onLoad(() => {
          unit.canUse = true;
        })
        unit.ad.onError(err => {
          console.log("err", err);
        });
        unit.ad.onResize(res => {
          switch (unit.conf.style) {
            case WechatBannerStyle.TOP_LEFT:
              unit.ad.style.top = 0;
              unit.ad.style.left = 0;
              break;
            case WechatBannerStyle.TOP_RIGHT:
              unit.ad.style.top = 0;
              unit.ad.style.left = screenWidth - res.width;
              break;
            case WechatBannerStyle.TOP_CENTER:
              unit.ad.style.top = 0;
              unit.ad.style.left = (screenWidth - res.width) / 2; // 水平居中
              break;
            case WechatBannerStyle.BOTTOM_LEFT:
              unit.ad.style.top = screenHeight - res.height;
              unit.ad.style.left = 0;
              break;
            case WechatBannerStyle.BOTTOM_RIGHT:
              unit.ad.style.top = screenHeight - res.height;
              unit.ad.style.left = screenWidth - res.width;
              break;
            case WechatBannerStyle.BOTTOM_CENTER:
              unit.ad.style.top = screenHeight - res.height;
              unit.ad.style.left = (screenWidth - res.width) / 2; // 水平居中
              break;
            case WechatBannerStyle.CENTER:
              unit.ad.style.top = (screenHeight - res.height) / 2; // 垂直居中
              unit.ad.style.left = (screenWidth - res.width) / 2; // 水平居中
              break;
          }
        })
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