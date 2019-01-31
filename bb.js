var bb = {
    init: function(){
        this.Console.init();
    },
    log: function(str){
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
    }
};
module.exports = bb;