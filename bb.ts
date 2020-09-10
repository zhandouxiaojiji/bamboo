import Console from "./Console/ConsoleService";
import Listener from "./Listener";

const globalEvent = new Listener()

const EventType = {
    NOTIFY: "NOTIFY",
    DIALOG: "DIALOG",
    SCHEDULE: "SCHEDULE",
    UNSCHEDULE: "UNSCHEDULE",
}

class bb {
    EventType = EventType;

    on(eventNames: any, callback: (...args: any) => void, target?: any) {
        globalEvent.on(eventNames, callback, target);
    }
    off(eventNames: any, callback: (...args: any) => void, target?: any) {
        globalEvent.off(eventNames, callback, target);
    }
    dispatch(eventNames: any, ...args: any) {
        globalEvent.dispatch(eventNames, ...args);
    }

    getData(k: string, defaultValue?: string) {
        var v = cc.sys.localStorage.getItem(k);
        if (!v || typeof (v) == "undefined" || v == "undefined") {
            cc.sys.localStorage.setItem(k, defaultValue);
            return defaultValue;
        }
        return v;
    }
    setData(k: string, v: string) {
        cc.sys.localStorage.setItem(k, v);
    }

    open(viewPrefabs: cc.Prefab | cc.Prefab[]) {
        const instantiate = (prefab: cc.Prefab) => {
            const node = cc.instantiate(prefab);
            node.parent = cc.find("Canvas");
            return node;
        }
        if(viewPrefabs instanceof cc.Prefab) {
            instantiate(viewPrefabs);
        }else{
            const nodes: cc.Node[] = [];
            viewPrefabs.forEach(prefab => {
                nodes.push(instantiate(prefab));
            })
            return nodes;
        }
    }

    loadAndOpen(path: string, callback?: Function) {
        cc.resources.load<cc.Prefab>(path, (err, prefab) => {
            if (prefab) {
                const node = this.open(prefab);
                if (callback) {
                    callback(node);
                }
            } else {
                console.log(err);
            }
        });
    }

    notify(msg: string) {
        this.dispatch(this.EventType.NOTIFY, msg);
    }
    dialog(title: string, content: string, ok: () => void, cancel: () => void) {
        this.dispatch(this.EventType.DIALOG, title, content, ok, cancel);
    }

    schedule(callback: Function, interval?: number, repeat?: number, delay?: number) {
        this.dispatch(this.EventType.SCHEDULE, callback, interval, repeat, delay);
    }

    unschedule(callback: Function) {
        this.dispatch(this.EventType.UNSCHEDULE, callback);
    }

    playSound(url: string, loop?: boolean, volume?: number) {
        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            cc.audioEngine.play(clip, loop || false, volume || 1);
        });
    }

};

export default new bb();