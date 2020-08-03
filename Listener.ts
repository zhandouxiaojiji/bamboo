import bb from "./bb";

class Listener {
    handles = {};
    //发送事件
    dispatch(name: any, ...args: any) {
        if (!this.handles[name]) {
            return;
        }
        for (var i = 0; i < this.handles[name].length; i++) {
            var handler = this.handles[name][i]
            handler.callback.apply(handler.target, args);
        }
    };

    //添加普通事件
    on(eventNames: any, callback: () => void, target: any) {
        if (Array.isArray(eventNames) == false) {
            eventNames = [eventNames];
        }
        for (var i = 0, len = eventNames.length; i < len; i++) {
            // cc.log('收到事件', eventName);
            var name = eventNames[i];
            this.handles[name] = this.handles[name] || [];

            this.handles[name].push({
                callback: callback,
                target: target
            });
        }
    };

    //通过事件名和target移除一个监听器
    off(eventNames: any, callback: () => void, target: any) {
        if (target == undefined) {
            target = callback;
            callback = undefined;
        }
        if (Array.isArray(eventNames) == false) {
            eventNames = [eventNames];
        }
        for (var idx in eventNames) {
            var eventName = eventNames[idx];
            for (var i = 0; i < this.handles[eventName].length; i++) {
                var handler = this.handles[eventName][i];
                if (target == handler.target &&
                    (callback.toString() == handler.callback.toString() || callback == undefined)) {
                    this.handles[eventName].splice(i, 1);
                }
            }
        }
    };
};

export default Listener;