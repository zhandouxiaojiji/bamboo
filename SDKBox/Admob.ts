
class Admob {
    loadCallbacks: {};
    rewardCallbacks: {};
    init() {
        cc.log("bb.Admob init");
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.setListener({
                adViewDidReceiveAd: (name) => {
                    var cb = this.loadCallbacks[name];
                    cc.log('adViewDidReceiveAd name=' + name);
                    if (cb) {
                        cb();
                    }
                },
                adViewDidFailToReceiveAdWithError: (name, msg) => {
                    cc.log('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
                },
                adViewWillPresentScreen: (name) => {
                    cc.log('adViewWillPresentScreen name=' + name);
                },
                adViewDidDismissScreen: (name) => {
                    cc.log('adViewDidDismissScreen name=' + name);
                },
                adViewWillDismissScreen: (name) => {
                    cc.log('adViewWillDismissScreen=' + name);
                },
                adViewWillLeaveApplication: (name) => {
                    cc.log('adViewWillLeaveApplication=' + name);
                },
                reward: (name, currency, amount) => {
                    cc.log('reward:' + name + ',' + currency + ',' + amount);
                    var cb = this.rewardCallbacks[name];
                    if (cb) {
                        cb(currency, amount);
                    }
                }
            });
            sdkbox.PluginAdMob.init();
        }
    };

    cache(name: string) {
        cc.log("cache admob " + name);
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.cache(name);
        }
    };

    hide(name: string) {
        cc.log("hide admob " + name);
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.hide(name);
        }
    };

    show(name: string) {
        cc.log("show admob ", name);
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.show(name);
        }
    };

    reward(name: string, cb: () => void) {
        cc.log("show reward " + name);
        this.rewardCallbacks[name] = cb;
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.show(name);
        }
    };

    setLoadCallback(name: string, cb: () => void) {
        this.loadCallbacks[name] = cb;
    };
    removeLoadCallback(name: string) {
        this.loadCallbacks[name] = null;
    };
};

export default new Admob;
