
class Admob {
    loadCallbacks: any;
    rewardCallbacks: any;
    failCallbacks: any;
    fullScreenCallbacks: any;
    dismissScreenCallbacks: any;

    init() {
        this.loadCallbacks = {};
        this.rewardCallbacks = {};
        this.failCallbacks = {};
        this.fullScreenCallbacks = {};
        this.dismissScreenCallbacks = {}

        var callback = (cbs, name) => {
            var cb = cbs[name]
            if(cb){
                cb();
            }
        }
        
        cc.log("bb.Admob init");
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.setListener({
                adViewDidReceiveAd: (name) => {
                    cc.log('adViewDidReceiveAd name=' + name);
                    callback(this.loadCallbacks, name);
                },
                adViewDidFailToReceiveAdWithError: (name, msg) => {
                    cc.log('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
                    callback(this.failCallbacks, name);
                },
                adViewWillPresentScreen: (name) => {
                    cc.log('adViewWillPresentScreen name=' + name);
                    callback(this.fullScreenCallbacks, name);
                },
                adViewDidDismissScreen: (name) => {
                    cc.log('adViewDidDismissScreen name=' + name);
                    callback(this.dismissScreenCallbacks, name)
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

    reward(name: string, cb: (currency?, amount?) => void) {
        cc.log("show reward " + name);
        this.rewardCallbacks[name] = cb;
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.show(name);
        }
    };

    isAvailable(name: string) {
        return sdkbox.PluginAdMob.isAvailable(name);
    }
};

export default new Admob;
