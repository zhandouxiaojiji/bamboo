cc.Class({
    extends: cc.Component,
    
    onLoad: function () {
        //Add this line to onLoad
        this.admobInit();
    },

    admobInit: function() {
        //finish it after import admob, let it empty for now
        sdkbox.PluginAdMob.init();
    },

    cacheInterstitial: function() {
        //finish it after import admob, let it empty for now
    },

    showInterstitial: function() {
        //finish it after import admob, let it empty for now
    },
});
