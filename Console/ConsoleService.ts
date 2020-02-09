import Http from "../Network/Http";
import bb from "../bb";
import Language from "../Language";

class ConsoleService {
    EventType = {
        UPDATE_LOG: "UPDATE_LOG",
        UPDATE_CUSTOM: "UPDATE_CUSTOM"
    };
    log: string;
    customs: any = [];
    cmds = {};
    serverConf = {};

    init() {
        this.addCustom("测试日志", () => {
            cc.log("this is a test log");
        });
        this.addCustom("切换中文", () => {
            Language.setCode("zh");
        });
        this.addCustom("切换英文", () => {
            Language.setCode("en");
        })
        this.addCmd("testcmd", () => {
            cc.log("this is a test cmd");
        });
    };

    addLog(str: string) {
        this.log = this.log + str + "\n";
        bb.dispatch(this.EventType.UPDATE_LOG, this.log);
    };
    clearLog() {
        this.log = "";
        bb.dispatch(this.EventType.UPDATE_LOG, this.log);
    };

    addCustom(name: string, callback: () => void) {
        // cc.log("addCustom", name, callback);
        this.customs.push({
            name: name,
            callback: callback
        })
        bb.dispatch(this.EventType.UPDATE_CUSTOM, this.customs);
    };
    doCustom(name: string) {
        for (const i in this.customs) {
            if (this.customs.hasOwnProperty(i)) {
                const element = this.customs[i];
                element.callback.call(element.callback);
            }
        }
        var callback = this.customs[name];
        if (!callback) {
            cc.log("custom not exist:", name);
        }
        callback.call(callback);
    };

    addCmd(name: string, callback: (...args: any) => void) {
        this.cmds[name] = callback;
    };
    runCmd(str: string) {
        var args = str.split(" ");
        var callback = this.cmds[args[0]];
        if (callback) {
            args.shift();
            callback.apply(callback, args);
        } else {
            cc.log("todo send cmd to server");
        }
    };
    setServerConf(conf) {
        this.serverConf = conf;
    };
};

export default new ConsoleService;
