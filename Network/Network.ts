import bb from "../bb";
import Http, { HttpRequest } from "./Http";
import Wechat from "../Wechat/Wechat";

class Network {
    host: string;
    acc: string;
    authorization: string;
    init(host: string) {
        this.host = bb.getData("host", host);
        cc.log("init host:", this.host);
    }

    setHost(host) {
        this.host = host;
        bb.setData("host", host);
        cc.log("Http setHost:", host);
    }

    getHost() {
        return this.host;
    }

    private urlWithHost(req: HttpRequest) {
        const newReq: HttpRequest = {
            url: this.host + req.url,
            data: req.data,
            authorization: this.authorization,
        }
        return newReq;
    }

    login(account?: string) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.login({
                success: (res) => {
                    if (res.code) {
                        (async () => {
                            var resp = await this.asyncHttpPost({
                                url: '/center/wechat/openid',
                                data: {
                                    platform: "WECHAT_GAME",
                                    jscode: res.code
                                }
                            });
                            this.acc = resp.openid;
                            var resp = await this.asyncHttpPost({
                                url: '/center/user/authorization',
                                data: {
                                    acc: this.acc
                                }
                            });
                            this.authorization = resp.authorization;
                            console.log(`login success, acc:${this.acc}, authorization:${this.authorization}`);
                        })()
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
        } else if (cc.sys.isNative) {
            // TODO sdkbox login
        } else {
            this.acc = bb.getData("testAccount", account || "test");
            (async () => {
                var resp = await this.asyncHttpPost({
                    url: '/center/user/authorization',
                    data: {
                        acc: this.acc
                    }
                });
                this.authorization = resp.authorization;
                console.log(`login success, acc:${this.acc}, authorization:${this.authorization}`);
            })()
        }
    }

    async asyncHttpGet(req: HttpRequest) {
        console.log("Http async get", req);
        const newReq = this.urlWithHost(req);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            return Wechat.asyncHttpGet(this.urlWithHost(newReq));
        }
        return Http.asyncGet(newReq);
    }
    async asyncHttpPost(req: HttpRequest) {
        console.log("Http async post", req);
        const newReq = this.urlWithHost(req);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            return Wechat.asyncHttpPost(newReq);
        }
        return Http.asyncPost(newReq);
    }

    httpGet(req: HttpRequest) {
        console.log("Http get");
        const newReq = this.urlWithHost(req);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            Wechat.httpGet(newReq);
            return;
        }
        Http.get(req);
    }
    httpPost(req: HttpRequest) {
        console.log("Http post");
        const newReq = this.urlWithHost(req);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            Wechat.httpPost(newReq);
            return;
        }
        Http.post(req);
    }

    async getKV(key: string) {
        return this.asyncHttpPost({
            url: "/center/user/get_value",
            data: {
                key
            }
        });
    }
    async setKV(key: string, value?: string) {
        return this.asyncHttpPost({
            url: "/center/user/set_value",
            data: {
                key,
                value,
            }
        });
    }

};

export default new Network();