
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
            if (cb) {
                cb();
            }
        }

        console.log("bb.Admob init");
        sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: (name) => {
                console.log('adViewDidReceiveAd name=' + name);
                callback(this.loadCallbacks, name);
            },
            adViewDidFailToReceiveAdWithError: (name, msg) => {
                console.log('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
                callback(this.failCallbacks, name);
            },
            adViewWillPresentScreen: (name) => {
                console.log('adViewWillPresentScreen name=' + name);
                callback(this.fullScreenCallbacks, name);
            },
            adViewDidDismissScreen: (name) => {
                console.log('adViewDidDismissScreen name=' + name);
                callback(this.dismissScreenCallbacks, name)
            },
            adViewWillDismissScreen: (name) => {
                console.log('adViewWillDismissScreen=' + name);
            },
            adViewWillLeaveApplication: (name) => {
                console.log('adViewWillLeaveApplication=' + name);
            },
            reward: (name, currency, amount) => {
                console.log('reward:' + name + ',' + currency + ',' + amount);
                var cb = this.rewardCallbacks[name];
                if (cb) {
                    cb(currency, amount);
                }
            }
        });
        sdkbox.PluginAdMob.init();
    };

    cache(name: string) {
        console.log("cache admob " + name);
        sdkbox.PluginAdMob.cache(name);
    };

    hide(name: string) {
        console.log("hide admob " + name);
        sdkbox.PluginAdMob.hide(name);
    };

    show(name: string) {
        console.log("show admob ", name);
        sdkbox.PluginAdMob.show(name);
    };

    async reward(name: string) {
        return new Promise<Boolean>((resolve, reject) => {
            console.log("show reward " + name);
            sdkbox.PluginAdMob.show(name);
            this.rewardCallbacks[name] = (currency, amount) => {
                if(amount > 0){
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    };

    isAvailable(name: string) {
        return sdkbox.PluginAdMob.isAvailable(name);
    }
};

export default new Admob();
