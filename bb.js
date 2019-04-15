module.exports = {
    EventType: {
        NOTIFY: "NOTIFY",
    },

    log() {
        cc.log.apply(cc, arguments);
        var s = "";
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i]) {
                s = s + arguments[i].toString() + "\t";
            } else {
                s = s + "undefined" + "\t";
            }
        }
        this.Console.addLog(s);
    },

    on() {
        this.GlobalEvent.on.apply(this.GlobalEvent, arguments);
    },
    off() {
        this.GlobalEvent.off.apply(this.GlobalEvent, arguments);
    },
    dispatch() {
        this.GlobalEvent.dispatch.apply(this.GlobalEvent, arguments);
    },

    getData(k, defaultValue) {
        var v = cc.sys.localStorage.getItem(k);
        if (!v || typeof (v) == "undefined" || v == "undefined") {
            cc.sys.localStorage.setItem(k, defaultValue);
            return defaultValue;
        }
        return v;
    },
    setData(k, v) {
        cc.sys.localStorage.setItem(k, v);
    },

    open(viewPrefab) {
        cc.instantiate(viewPrefab).parent = cc.find("Canvas");
    },

    notify(msg) {
        this.dispatch(this.EventType.NOTIFY, msg);
    }
};