import Network from "../Service/Network";

export interface RankItemModel {
  rank: number;
  nickName: string;
  avatarUrl: string;
  value: number;
}

class Rank {
  rankData: { [key: string]: RankItemModel[] } = {};
  myData: { [key: string]: RankItemModel } = {};
  async fetch(appname: string, rankname: string) {
    if (!this.rankData[rankname]) {
      const resp = await Network.asyncHttpPost({
        url: "/center/rank/request",
        data: {
          appname,
          rankname,
        }
      });
      this.rankData[rankname] = resp.list;
      this.myData[rankname] = resp.mine;
    }
    return {
      list: this.rankData[rankname],
      mine: this.myData[rankname]
    }
  }

  async submitScore(appname: string, rankname: string, score: number) {
    return Network.asyncHttpPost({
        url: "/center/rank/submit",
        data: {
          appname,
          rankname,
          score,
        }
    })
}

  clear(rankname: string) {
    this.rankData[rankname] = undefined;
  }
}

export default new Rank();