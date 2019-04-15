var bb = require("bb");
bb.Admob = {
    loadCallbacks: {},
    rewardCallbacks: {},
    init: function () {
        let self = this;
        cc.log("bb.Admob init");
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.setListener({
                adViewDidReceiveAd: (name) => {
                    var cb = self.loadCallbacks[name];
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
                    var cb = self.rewardCallbacks[name];
                    if (cb) {
                        cb(currency, amount);
                    }
                }
            });
            sdkbox.PluginAdMob.init();
        }
    },

    cache: function (name) {
        cc.log("cache admob " + name);
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.cache(name);
        }
    },

    hide: function (name) {
        cc.log("hide admob " + name);
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.hide(name);
        }
    },

    show: function (name) {
        cc.log("show admob " + name);
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.show(name);
        }
    },

    reward: function (name, cb) {
        cc.log("show reward " + name);
        this.rewardCallbacks[name] = cb;
        if (cc.sys.isMobile) {
            sdkbox.PluginAdMob.show(name);
        }
    },

    setLoadCallback: function (name, cb) {
        this.loadCallbacks[name] = cb;
    },
    removeLoadCallback: function (name) {
        this.loadCallbacks[name] = null;
    }


};
