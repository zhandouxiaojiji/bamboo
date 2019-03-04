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
    },

    getData(k, defaultValue){
        var v = cc.sys.localStorage.getItem(k);
        if(!v){
            cc.sys.localStorage.setItem(k, defaultValue);
            return defaultValue;
        }
        return v;
    },
    setData(k, v){
        cc.sys.localStorage.setItem(k, v);
    },

    open(viewPrefab){
        cc.instantiate(viewPrefab).parent = cc.director.getScene();
    },
};