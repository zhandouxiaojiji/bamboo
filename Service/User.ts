import Network from "../../bamboo/Service/Network";
import def from "../../script/Def/def";

class User {
  scores: {[key: string]: number} = {}

  async getScore(key: string) {
    if (this.scores[key] == undefined) {
      const value = await Network.getKV(key, def.APPNAME);
      this.scores[key] = parseInt(value);
    }
    return this.scores[key];
  }

  setScore(key: string, value: number) {
    Network.setKV(key, String(value), def.APPNAME);
    this.scores[key] = value;
  }
}

export default new User();