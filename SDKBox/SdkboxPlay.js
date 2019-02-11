var bb = require("bb");
bb.SdkboxPlay = {
    init(){
        if(!cc.sys.isMobile){
            bb.log("not mobile platform");
            return;
        }
        sdkbox.PluginSdkboxPlay.init();
    }
};