var bb = require("bb");
var Console = {
    event: {
        UPDATE_LOG: "UPDATE_LOG"
    },
    log: "",
    addLog: function(str){
        this.log = this.log + str + "\n";
        bb.GlobalEvent.dispatch(this.event.UPDATE_LOG, this.log);
    },
    clearLog: function(){
        log = "";
        bb.GlobalEvent.dispatch(this.event.UPDATE_LOG, this.log);
    }
};
bb.Console = Console;
