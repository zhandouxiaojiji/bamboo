import Network from "../Service/Network";
import User from "./User";

export interface RankItemModel {
  k: string;
  v: any;
  // {
  //   rank: number;
  //   nickName: string;
  //   avatarUrl: string;
  //   score: number;
  // }
}

class Rank {
  rankData: { [key: string]: RankItemModel[] } = {};
  myData: { [key: string]: RankItemModel } = {};
  async fetch(rankname: string, appname?: string) {
    if (!this.rankData[rankname]) {
      const resp = await Network.asyncHttpPost({
        url: "/center/rank/request",
        data: {
          appname,
          rankname,
        }
      });
      this.rankData[rankname] = resp.list;
      if (this.rankData[rankname][0]) {
        this.rankData[rankname].forEach((item, index) => {
          item.v.rank = index + 1;
          if (item.k == Network.account) {
            this.myData[rankname] = item;
          }
        });
      }
      if (!this.myData[rankname]) {
        let userInfo = Network.userInfo;
        let score = await User.getScore(rankname);
        if (userInfo && score) {
          this.myData[rankname] = {
            k: Network.account,
            v: {
              rank: 0,
              nickName: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl,
              score
            }
          }
        }
      }
    }
    return {
      list: this.rankData[rankname],
      mine: this.myData[rankname]
    }
  }

  async submitScore(appname: string, rankname: string, item: any) {
    this.clear(rankname);
    return Network.asyncHttpPost({
      url: "/center/rank/submit",
      data: {
        appname,
        rankname,
        item,
      }
    })
  }

  clear(rankname: string) {
    this.rankData[rankname] = undefined;
    this.myData[rankname] = undefined;
  }
}

export default new Rank();