var bb = require("bb");
var Admob = {
    init: function() {
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.setListener({
                adViewDidReceiveAd: function(name) {
                    console.log('adViewDidReceiveAd name=' + name);
                    if(this.cb){
                        this.cb(true);
                    }
                },
                adViewDidFailToReceiveAdWithError: function(name, msg) {
                    console.log('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
                    if(this.cb){
                        this.cb(false);
                    }
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
