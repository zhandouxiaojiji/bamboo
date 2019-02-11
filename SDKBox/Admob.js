var bb = require("bb");
bb.Admob = {
    loadCallbacks: {},
    rewardCallbacks: {},
    init: function() {
        let self = this;
        console.log("bb.Admob init");
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.setListener({
                adViewDidReceiveAd: function(name) {
                    var cb = self.loadCallbacks[name];
                    console.log('adViewDidReceiveAd name=' + name);
                    if(cb) {
                        cb();
                    }
                },
                adViewDidFailToReceiveAdWithError: function(name, msg) {
                    console.log('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
                },
                adViewWillPresentScreen: function(name) {
                    console.log('adViewWillPresentScreen name=' + name);
                },
                adViewDidDismissScreen: function(name) {
                    console.log('adViewDidDismissScreen name=' + name);
                },
                adViewWillDismissScreen: function(name) {
                    console.log('adViewWillDismissScreen=' + name);
                },
                adViewWillLeaveApplication: function(name) {
                    console.log('adViewWillLeaveApplication=' + name);
                },
                reward : function(name, currency, amount){
                    console.log('reward:'+name+','+currency+','+amount);
                    var cb = self.rewardCallbacks[name];
                    if(cb) {
                        cb(currency, amount);
                    }
                }
            });
            sdkbox.PluginAdMob.init();
        }
    },

    cache: function(name) {
        console.log("cache admob "+name);
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.cache(name);
        }
    },

    hide: function(name) {
        console.log("hide admob "+name);
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.hide(name);
        }
    },

    show: function(name) {
        console.log("show admob "+name);
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.show(name);
        }
    },

    reward: function(name, cb){
        console.log("show reward "+ name);
        this.rewardCallbacks[name] = cb;
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.show(name);
        }
    },

    setLoadCallback: function(name, cb){
        this.loadCallbacks[name] = cb;
    },
    removeLoadCallback: function(name){
        this.loadCallbacks[name] = null;
    }


};
