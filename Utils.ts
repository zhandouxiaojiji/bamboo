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

export function isTTGame() {
  return cc.sys.platform == cc.sys.BYTEDANCE_GAME
}

export function isWXGame() {
  return cc.sys.platform == cc.sys.WECHAT_GAME
}

export function makeProtoDefine(name2id: any, protoTs: any) {
  const idToProto = {};
  const nameToId = {};
  const idToName = {};
  for (let name in name2id) {
    let id = name2id[name];
    let arr = name.split('.');
    let packageName = arr[0];
    let simpleName = arr[1];
    let proto = protoTs[packageName][simpleName];
    idToProto[id] = proto;
    idToName[id] = name;
    nameToId[name] = id;
  }
  return {
    idToProto,
    idToName,
    nameToId,
  }
}