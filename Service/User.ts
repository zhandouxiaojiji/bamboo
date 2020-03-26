import Network from "../../bamboo/Service/Network";

class User {
  scores: {[key: string]: number} = {}
  appname: string;
  init(appname: string){
    this.appname = appname;
  }

  async getScore(key: string) {
    if (this.scores[key] == undefined) {
      const value = await Network.getKV(key, this.appname);
      this.scores[key] = parseInt(value || "0");
    }
    return this.scores[key];
  }

  setScore(key: string, value: number) {
    Network.setKV(key, String(value), this.appname);
    this.scores[key] = value;
  }
}

export default new User();