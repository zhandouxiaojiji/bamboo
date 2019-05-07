var bb = require("bb");
bb.Guide = {
    EventType: {

    },
    guides: {},
    init(prop) {
        this.prop = prop;
        this.guides = {};
        for(let k in prop){
            let v = prop[k];
            let guide = this.guides[v.TYPE] || [];
            guide.push(v);
            this.guides[v.TYPE] = guide;
        }
        for(let k in this.guides){
            let v = this.guides[k];
            v.sort((a, b) => {
                return a.ID - b.ID
            })
        }
    },
};