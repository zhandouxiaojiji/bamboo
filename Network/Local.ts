class Local {
    EventType = {
        LOCAL_SEND: "LOCAL_SEND",
        LOCAL_RECV: "LOCAL_RECV"
    };
    callbacks: {};
    call(op: number, data: any, callback: () => void) {
        this.callbacks[op + 1] = callback;
        this.send(op, data);
    };
    send(op: number, data: any) {
        bb.dispatch(this.EventType.LOCAL_SEND, op, data);
    };
    recv(op: number, data: any) {
        bb.dispatch(op, data);
        if (this.callbacks[op]) {
            this.callbacks[op](data);
            this.callbacks[op] = null;
        }
    };
};

export default new Local;