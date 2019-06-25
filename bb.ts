import Console from "./Console/ConsoleService";
import GlobalEvent from "./GlobalEvent";

const EventType = {
    NOTIFY: "NOTIFY",
    DIALOG: "DIALOG",
};

function log(...args: any) {
    cc.log.apply(cc, ...args);
    let s = "";
    for (let i = 0; i < args.length; i++) {
        if (args[i]) {
            s = s + args[i].toString() + "\t";
        } else {
            s = s + "undefined" + "\t";
        }
    }
    Console.addLog(s);
}

function on(...args) {
    GlobalEvent.on.apply(GlobalEvent, ...args);
}
function off(...args) {
    GlobalEvent.off.apply(GlobalEvent, ...args);
}
function dispatch(...args) {
    GlobalEvent.dispatch.apply(GlobalEvent, ...args);
}

function getData(k: string, defaultValue: string) {
    var v = cc.sys.localStorage.getItem(k);
    if (!v || typeof (v) == "undefined" || v == "undefined") {
        cc.sys.localStorage.setItem(k, defaultValue);
        return defaultValue;
    }
    return v;
}
function setData(k: string, v: string) {
    cc.sys.localStorage.setItem(k, v);
}

function open(viewPrefab: cc.Prefab) {
    cc.instantiate(viewPrefab).parent = cc.find("Canvas");
}
function notify(msg: string) {
    this.dispatch(this.EventType.NOTIFY, msg);
}
function dialog(title: string, content: string, ok: () => void, cancel: () => void) {
    this.dispatch(title, content, ok, cancel);
}
