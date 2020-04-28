import bb from "../bb";
import Network from "../Service/Network";

export interface WsRequest {
  name: string;
  data?: any;
  defaultRes?: any;
}

export class WebSock {
  sock: WebSocket;
  url: string;
  session: number = 0;
  callbacks: any;

  constructor(url: string) {
    this.url = url;
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

  onMessage(event: any) {
    const res = JSON.parse(event.data);
    console.log("onMessage", res);
    const func = this.callbacks[res.session];
    if (func) {
      func(res.data);
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

  async call(req: WsRequest) {
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
      const session = this.session;
      console.log("send ping");
      this.sock.send(JSON.stringify({
        name: req.name,
        session: session,
        data: req.data,
      }));
      this.callbacks[session] = (res) => {
        resolve(res);
      }
    });
  }
}
