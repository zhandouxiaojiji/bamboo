import bb from "../bb";
import Language from "../Service/Language";

class ConsoleService {
    EventType = {
        UPDATE_CUSTOM: "UPDATE_CUSTOM"
    };
    customs: any = [];
    cmds = {};

    init() {
        this.addCustom("切换中文", () => {
            Language.setLanguage(cc.sys.LANGUAGE_CHINESE);
        });
        this.addCustom("切换英文", () => {
            Language.setLanguage(cc.sys.LANGUAGE_ENGLISH);
        })
        this.addCmd("ls", () => {
            var arr = [];
            for(let cmd in this.cmds) {
                arr.push(cmd);
            }
            arr.sort();
            var str = arr.join("\n");
            bb.notify(`指令列表:${str}`);
            console.log(`指令列表:${str}`);
        });
        this.addCmd("account", (acc) => {
            bb.setData("testAccount", acc);
        })
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
};

export default new ConsoleService;
