import bb from "../bb";
import Http, { HttpRequest } from "../Network/Http";
import Wechat from "../Wechat/Wechat";
import def from "../../script/Def/def";

export interface UserInfo {
    avatar?: string;
    nickname: string;
}

class Network {
    host: string;
    acc: string;
    authorization: string;
    userInfo: UserInfo;

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

    async login(account?: string) {
        return new Promise<any>((resolve, reject) => {
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
                                resolve(this.authorization);
                                console.log(`login success, acc:${this.acc}, authorization:${this.authorization}`);
                            })()
                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }
                    }
                })
            } else if (cc.sys.isNative) {
                // TODO sdkbox login
                resolve(this.authorization);
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
                    resolve(this.authorization);
                    console.log(`login success, acc:${this.acc}, authorization:${this.authorization}`);
                })();
            }
        });
    }

    async asyncHttpGet(req: HttpRequest) {
        console.log("Http async get", req);
        var resp;
        const newReq = this.urlWithHost(req);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            resp = await Wechat.asyncHttpGet(this.urlWithHost(newReq));
        } else {
            resp = await Http.asyncGet(newReq);
        }
        if (resp.err == 4) {
            let authorization = await this.login();
            if (authorization) {
                return this.asyncHttpGet(req);
            } else {
                throw new Error("login fail");
            }
        }
        return resp;
    }
    async asyncHttpPost(req: HttpRequest) {
        console.log("Http async post", req);
        var resp;
        const newReq = this.urlWithHost(req);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            resp = await Wechat.asyncHttpPost(this.urlWithHost(newReq));
        } else {
            resp = await Http.asyncPost(newReq);
        }
        if (resp.err == 4) {
            let authorization = await this.login();
            if (authorization) {
                return this.asyncHttpPost(req);
            } else {
                throw new Error("login fail");
            }
        }
        return resp;
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

    async getUserInfo() {
        if (!this.userInfo) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                const wxInfo = await Wechat.getUserInfo();
                this.userInfo = {
                    avatar: wxInfo.avatar,
                    nickname: wxInfo.nickname
                }
            } else if (cc.sys.isNative) {
                // TODO
            } else {
                this.userInfo = {
                    nickname: this.acc
                }
            }
        }
        return this.userInfo;
    }

    async getKV(key: string) {
        try {
            const resp = await this.asyncHttpPost({
                url: "/center/user/get_value",
                data: {
                    app: def.APPNAME,
                    key
                }
            });
            cc.sys.localStorage.setItem(key, resp.value);
            return resp.value;
        } catch (error) {
            console.log("网络异常，取本地数据");
            return cc.sys.localStorage.getItem(key);
        }
    }
    async setKV(key: string, value?: string) {
        cc.sys.localStorage.setItem(key, value);
        return this.asyncHttpPost({
            url: "/center/user/set_value",
            data: {
                app: def.APPNAME,
                key,
                value,
            }
        });
    }

};

export default new Network();