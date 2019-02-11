var bb = require("bb");
bb.Console = {
    event: {
        UPDATE_LOG: "UPDATE_LOG",
        UPDATE_CUSTOM: "UPDATE_CUSTOM"
    },
    log: "",
    customs: [],
    cmds: {},

    init: function(){
        this.addCustom("测试日志", function(){
            bb.log("this is a test log");
        });
        this.addCmd("testcmd", function(){
            bb.log("this is a test cmd");
        })
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
        // bb.log("addCustom", name, callback);
        this.customs.push({
            name: name,
            callback: callback
        })
        bb.GlobalEvent.dispatch(this.event.UPDATE_CUSTOM, this.customs);
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
    },

    addCmd(name, callback){
        this.cmds[name] = callback;
    },
    runCmd(str){
        console.assert(str);
        var args = str.split(" ");
        var callback = this.cmds[args[0]];
        if(callback){
            args.shift();
            callback.apply(callback, args);
        }else{
            bb.log("todo send cmd to server");
        }
    }
};
