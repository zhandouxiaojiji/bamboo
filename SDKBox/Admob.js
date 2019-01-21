var bb = require("bb");
var Admob = {
    reward_cb: {},
    init: function() {
        console.log("bb.Admob init");
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.setListener({
                adViewDidReceiveAd: function(name) {
                    console.log('adViewDidReceiveAd name=' + name);
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
                    var cb = reward_cb[name];
                    if(cb) {
                        cb(currency, amount);
                    }
                }
            });
            sdkbox.PluginAdMob.init();
        }
    },

    cache: function(name) {
        console.cache("cache admob "+name);
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.cache(name);
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
        reward_cb[name] = cb;
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.show(name);
        }
    }


};
bb.Admob = Admob;
