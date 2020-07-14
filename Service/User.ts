import Network from "../../bamboo/Service/Network";
import SdkboxPlay from "../SDKBox/SdkboxPlay";

class User {
  scores: {[key: string]: number} = {}
  appname: string;
  init(appname: string){
    this.appname = appname;
  }

  async getScore(key: string) {
    if (this.scores[key] == undefined) {
      let value;
      if(cc.sys.isNative) {
        value = SdkboxPlay.getMyScore(key);
      } else {
        value = await Network.getKV(key);
      }
      this.scores[key] = parseInt(value || "0");
    }
    return this.scores[key];
  }

  setScore(key: string, value: number) {
    this.scores[key] = value;
    if(cc.sys.isNative) {
      SdkboxPlay.submitScore(key, value);
      return;
    }
    Network.setKV(key, String(value));
  }
}

export default new User();