import bb from "../bb";

export interface ResItem {
    name: string;
    path: string;
    res?: any;
}

export const EventType = {
    UPDATE_PROCESS: "UPDATE_PROCESS",
}

class ResLoader {
    path2Item: {[key: string]: ResItem};
    name2Item: {[key: string]: ResItem};

    loadSpriteFrames(arr: ResItem[], cb?: Function) {
        this.name2Item = this.name2Item || {};
        this.path2Item = this.path2Item || {};

        const list = [];
        arr.forEach((item) => {
            list.push(item.path);
            this.name2Item[item.name] = item;
            this.path2Item[item.path] = item;
        });
        cc.loader.loadResArray(list, cc.SpriteFrame, (completedCount: number, totalCount: number, item: any)=>{
            bb.dispatch(EventType.UPDATE_PROCESS, completedCount, totalCount);
        }, (err, sprites) => {
            sprites.forEach((e, i) => {
                const resItem = arr[i];
                resItem.res = e;
            });
            if(cb) {
                cb();
            }
        })
    }
    getItemByName(name: string) {
        return this.name2Item[name].res;
    }
}

export default new ResLoader();