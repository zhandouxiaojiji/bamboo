var bb = require("bb");
bb.SdkboxPlay = {
    event: {
        CON_STATUS: "CON_STATUS"
    },
    init(){
        if(!cc.sys.isMobile){
            return;
        }
        sdkbox.PluginSdkboxPlay.init();
    },
    signin(){
        if(!cc.sys.isMobile){
            bb.log("not mobile platform");
            return;
        }
        sdkbox.PluginSdkboxPlay.signin(true);
        sdkbox.PluginSdkboxPlay.setListener({
            onConnectionStatusChanged: function(status){
                bb.log("onConnectionStatusChanged", status);
                bb.log("isSignin", sdkbox.PluginSdkboxPlay.isSignedIn());
                bb.log("name", this.getInfo("name"));
                bb.GlobalEvent.dispatch(this.event.CON_STATUS, status);
            }
        })
    },
    getInfo(field){
        if(!cc.sys.isMobile){
            return;
        }
        return sdkbox.PluginSdkboxPlay.getPlayerAccountField(field);
    },
    isSignin(){
        if(!cc.sys.isMobile){
            return false;
        }
        return sdkbox.PluginSdkboxPlay.isSignin();
    }
};