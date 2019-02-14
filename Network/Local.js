var bb = require("bb");
bb.Local = {
    EventType: {
        LOCAL_SEND: "LOCAL_SEND",
        LOCAL_RECV: "LOCAL_RECV"
    },
    callbacks: {},
    call(op, data, callback){
        this.callbacks[op+1] = callback;
        this.send(op, data);
    },
    send(op, data){
        bb.dispatch(bb.Local.EventType.LOCAL_SEND, op, data);
    },
    recv(op, data){
        bb.dispatch(bb.Local.EventType.LOCAL_RECV, op, data);
        if(this.callbacks[op]){
            this.callbacks[op](data);
            this.callbacks[op] = null;
        }
    }
};