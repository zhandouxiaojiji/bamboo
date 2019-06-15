var bb = require("bb");
bb.Guide = {
    EventType: {
        SHOW: "SHOW",
    },
    guides: {},
    init(data) {
        for (let type in data) {
            this.guides[type] = data[type];
        }
    },

    show(type) {
        if (this.guides[type]) {
            return;
        }
        bb.dispatch(this.EventType.SHOW, type);
    },

    fini(type) {
        this.guides[type] = true
    },
};