import { Uint32toBinary } from "./Packet";
import bb from "../bb";
import Network from "../Service/Network";

export enum WsPackType {
  JSON,
  PROTOBUF,
}

export interface WsJsonRequest {
  name: string;
  data?: any;
  defaultRes?: any;
}

export interface WsProtoRequest {
  proto: any;
  data?: any;
  defaultRes?: any;
}

export interface ProtobufConf {
  idToProto: any;
  protoToId: any;
}

export interface WebSockConf {
  url: string;
  packType: WsPackType;
  protobufConf?: ProtobufConf;
  pingReq?: WsProtoRequest | WsJsonRequest; // 心跳请求
  pingInter?: number; // 心跳间隔s
}

export class WebSock {
  private sock: WebSocket;
  private packType: WsPackType;
  private url: string;
  private session: number = 0;
  private callbacks: any;
  private idToProto: any;
  private protoToId: any;

  constructor(conf: WebSockConf) {
    this.url = conf.url;
    this.packType = conf.packType || WsPackType.JSON;
    if (conf.protobufConf) {
      this.idToProto = conf.protobufConf.idToProto;
      this.protoToId = conf.protobufConf.protoToId;
    }
  }

  open() {
    console.log("open ws", this.url);
    this.sock = new WebSocket(this.url);
    this.sock.onmessage = this.onMessage.bind(this);
    this.callbacks = {};
  }

  close() {
    this.sock.close();
    this.callbacks = {};
  }

  onResponse(res: any) {
    // console.log("onResponse", res);
    const func = this.callbacks[res.session];
    if (func) {
      func(res.data);
    }
  }

  onMessage(event: any) {
    if (this.packType == WsPackType.JSON) {
      const res = JSON.parse(event.data);
      this.onResponse(res);
      bb.dispatch(Network.EventType.WS_RECV, res);
      Network.dispatch(res.name, res.data);
    } else if (this.packType == WsPackType.PROTOBUF) {
      let reader = new FileReader();
      reader.onload = (obj) => {
        let buff: any = obj.target.result;
        let idx = 0;
        let dv = new DataView(buff);
        const session = dv.getUint32(idx);
        idx += 4;
        const protoId = dv.getUint32(idx);
        idx += 4;
        const protoBuff = new Uint8Array(buff.slice(idx + 4));
        const proto = this.idToProto[protoId];
        // console.log(proto.name, protoBuff);
        const data = proto.decode(protoBuff);
        const res = {
          session,
          proto,
          data,
        }
        bb.dispatch(Network.EventType.WS_RECV, res);
        Network.dispatch(res.proto, res.data);
        this.onResponse(res);

      }
      reader.readAsArrayBuffer(event.data);
    }
  }

  async waitWsConnecting(timeout: number) {
    return new Promise<any>((resolve) => {
      var t = 0;
      let interval = 100;
      const wait = () => {
        t += interval;
        // console.log("check", this.sock.readyState);
        if (t > timeout || this.sock.readyState != WebSocket.CONNECTING) {
          resolve(this.sock.readyState);
        } else {
          setTimeout(wait, interval)
        }
      }
      wait();
    });
  }

  isOpen() {
    return this.sock.readyState == WebSocket.OPEN
  }

  async call(req: WsJsonRequest | WsProtoRequest | any) {
    if (!this.sock) {
      try {
        this.open();
      } catch (error) {
        console.log("ws open error", error);
      }
    }
    if (this.sock.readyState == WebSocket.CONNECTING) {
      console.log("connecting");
      await this.waitWsConnecting(5000);
    }
    if (this.sock.readyState != WebSocket.OPEN) {
      return req.defaultRes;
    }

    return new Promise<any>((resolve, reject) => {
      this.session++;
      const session = this.session;

      if (this.packType == WsPackType.JSON) {
        this.sock.send(JSON.stringify({
          name: req.name,
          session: session,
          data: req.data,
        }));
      } else if (this.packType == WsPackType.PROTOBUF) {
        const proto = req.proto;
        if (!proto) {
          return reject("proto is undefined!");
        }

        const protoId = this.protoToId[proto];
        const protoBuff = proto.encode(req.data||{}).finish();
        const buffer = new Uint8Array(protoBuff.length + 12);
        var idx = 0;
        buffer.set(Uint32toBinary(session), 0);
        idx += 4;
        buffer.set(Uint32toBinary(protoId), idx);
        idx += 4;
        buffer.set(Uint32toBinary(protoBuff.length), idx);
        idx += 4;
        buffer.set(protoBuff, idx);
        // console.log("protoid", protoId);
        // console.log("protobuf", protoBuff);
        // console.log("buffer", buffer);
        this.sock.send(buffer);
      }

      this.callbacks[session] = (res) => {
        resolve(res);
      }
    });
  }
}
