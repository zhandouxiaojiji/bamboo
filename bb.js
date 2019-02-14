module.exports = {
    log(str){
        console.log.apply(console, arguments);
        var str = "";
        for(var i = 0; i < arguments.length; i++){
            if(arguments[i]){
                str = str + arguments[i].toString() + "\t";
            }else{
                str = str + "undefined" + "\t";
            }
        }
        this.Console.addLog(str);
    },
    on(){
        this.GlobalEvent.on.apply(this.GlobalEvent, arguments);
    },
    off(){
        this.GlobalEvent.off.apply(this.GlobalEvent, arguments);
    },
    dispatch(){
        this.GlobalEvent.dispatch.apply(this.GlobalEvent, arguments);
    }
};