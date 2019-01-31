var bb = require("bb");
var Console = {
    event: {
        UPDATE_LOG: "UPDATE_LOG",
        UPDATE_CUSTOM: "UPDATE_CUSTOM"
    },
    log: "",
    customs: [],

    init: function(){

    },

    addLog: function(str){
        this.log = this.log + str + "\n";
        bb.GlobalEvent.dispatch(this.event.UPDATE_LOG, this.log);
    },
    clearLog: function(){
        log = "";
        bb.GlobalEvent.dispatch(this.event.UPDATE_LOG, this.log);
    },
    addCustom(name, callback){
        this.customs.push({
            name: name,
            callback: callback
        })
    },
    doCustom(name){
        for (const i in this.customs) {
            if (this.customs.hasOwnProperty(i)) {
                const element = this.customs[i];
                element.callback.call(element.callback);
            }
        }
        var callback = this.customs[name];
        if(!callback){
            bb.log("custom not exist:", name);
        }
        callback.call(callback);
    }
};
bb.Console = Console;
