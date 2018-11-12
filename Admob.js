cc.Class({
    extends: cc.Component,
    
    onLoad: function () {
        this.admobInit();
    },

    admobInit: function() {
        if(cc.sys.isMobile) {
            var self = this
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

    show: function(name) {
        console.log("show admob "+name);
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.show(name);
        }
    },
});
