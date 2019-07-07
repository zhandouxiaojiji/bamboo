import Console from "./Console/ConsoleService";
import GlobalEvent from "./GlobalEvent";

export default {
    EventType: {
        NOTIFY: "NOTIFY",
        DIALOG: "DIALOG",
        SCHEDULE: "SCHEDULE",
        UNSCHEDULE: "UNSCHEDULE",
    },

    log(...args: any) {
        let s = "";
        for (let i = 0; i < args.length; i++) {
            if (args[i]) {
                s = s + args[i].toString() + "\t";
            } else {
                s = s + "undefined" + "\t";
            }
        }
        Console.addLog(s);
    },

    on(eventNames: any, callback: (...args: any) => void, target?: any) {
        GlobalEvent.on(eventNames, callback, target);
    },
    off(eventNames: any, callback: (...args: any) => void, target?: any) {
        GlobalEvent.off(eventNames, callback, target);
    },
    dispatch(eventNames: any, ...args: any) {
        GlobalEvent.dispatch(eventNames, ...args);
    },

    getData(k: string, defaultValue?: string) {
        var v = cc.sys.localStorage.getItem(k);
        if (!v || typeof (v) == "undefined" || v == "undefined") {
            cc.sys.localStorage.setItem(k, defaultValue);
            return defaultValue;
        }
        return v;
    },
    setData(k: string, v: string) {
        cc.sys.localStorage.setItem(k, v);
    },

    open(viewPrefab: cc.Prefab) {
        cc.instantiate(viewPrefab).parent = cc.find("Canvas");
    },
    notify(msg: string) {
        this.dispatch(this.EventType.NOTIFY, msg);
    },
    dialog(title: string, content: string, ok: () => void, cancel: () => void) {
        this.dispatch(this.EventType.DIALOG, title, content, ok, cancel);
    },

    schedule(callback: Function, interval?: number, repeat?: number, delay?: number){
        this.dispatch(this.EventType.SCHEDULE, callback, interval, repeat, delay);
    },

    unschedule(callback: Function) {
        this.dispatch(this.EventType.UNSCHEDULE, callback);
    }
};
