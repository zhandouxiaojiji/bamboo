var bb = require("bb");
var Admob = {
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
                    //todo reward
                }
            });
            sdkbox.PluginAdMob.init();
        }
    },

    cache: function(name) {
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.cache(name);
        }
    },

    show: function(name, cb) {
        console.log("show admob "+name);
        this.cb = cb;
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.show(name);
        }
    },
};
bb.Admob = Admob;
