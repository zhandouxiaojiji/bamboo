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
    getInfo(field){
        if(!cc.sys.isMobile){
            return;
        }
        return sdkbox.PluginSdkboxPlay.getPlayerAccountField(field);
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
                bb.log("name", bb.SdkboxPlay.getInfo("name"));
                bb.log("display_name", bb.SdkboxPlay.getInfo("display_name"));
                bb.log("player_id", bb.SdkboxPlay.getInfo("player_id"));
                bb.GlobalEvent.dispatch(bb.SdkboxPlay.event.CON_STATUS, status);
            }
        })
    },
    isSignin(){
        if(!cc.sys.isMobile){
            return false;
        }
        return sdkbox.PluginSdkboxPlay.isSignin();
    }
};