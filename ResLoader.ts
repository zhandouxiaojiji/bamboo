import bb from "./bb";

export interface ResItem {
    name: string;
    path: string;
    desc: string;
    res?: any;
}

export const EventType = {
    UPDATE_PROCESS: "UPDATE_PROCESS",
}

class ResLoader {
    path2Item: {[key: string]: ResItem};
    name2Item: {[key: string]: ResItem};

    loadSpriteFrames(arr: ResItem[], cb: Function) {
        const list = [];
        arr.forEach((item) => {
            list.push(item.path);
        })
        cc.loader.loadResArray(list, cc.SpriteFrame, (completedCount: number, totalCount: number, item: any)=>{
            const resItem = arr[completedCount - 1];
            bb.dispatch(EventType.UPDATE_PROCESS, completedCount, totalCount, resItem.desc);
        }, (err, sprites) => {
            sprites.forEach((e, i) => {
                const resItem = arr[i];
                resItem.res = e;
                this.name2Item[resItem.name] = resItem;
                this.path2Item[resItem.path] = resItem;
            })
        })
    }
    getItemByName(name: string) {
        return this.name2Item[name];
    }
}

const resLoader = new ResLoader;


export default new ResLoader();