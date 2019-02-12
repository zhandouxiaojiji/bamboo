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
                bb.log("server_auth_code", bb.SdkboxPlay.getInfo("server_auth_code"));
                var data = sdkbox.PluginSdkboxPlay.loadAllGameData()
                for(var k in data){
                    bb.log("k", k, "v", data[k]);
                }
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