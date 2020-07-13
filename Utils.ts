//生成从minNum到maxNum的随机数
export function randomNum(minNum: number, maxNum?: number) {
  if (maxNum !== undefined) {
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  } else {
    Math.floor(Math.random() * (minNum + 1));
  }
}

export function cloneObject(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

// 判断是否为头条小游戏(区分微信)
export function isTTGame() {
  return window.tt != undefined
}

export async function loadProtoDefineAsync(definePath: string, protoTs: any) {
  return new Promise((resolve, reject) => {
    cc.loader.loadRes(definePath, (err, obj) => {
      if (err) {
        return reject(err);
      }
      const idToProto = {}
      const protoToId = {}
      for (let name in obj.json) {
        let id = obj.json[name];
        let arr = name.split('.');
        let packageName = arr[0];
        let simpleName = arr[1];
        let proto = protoTs[packageName][simpleName];
        idToProto[id] = proto;
        protoToId[proto] = id;
      }
      resolve({
        idToProto,
        protoToId
      })
    })
  })

}