import Http, { HttpRequest } from "../Network/Http";
import Wechat from "../Wechat/Wechat";
import SdkboxPlay from "../SDKBox/SdkboxPlay";
import { WebSock, WsRequest } from "../Network/WebSock";
import { isTTGame } from "../Utils";

export interface UserInfo {
    avatarUrl?: string;
    nickName: string;
}

class Network {
    private ws: WebSock;
    httpUrl: string;
    wsUrl: string;
    account: string;
    authorization: string;
    userInfo: UserInfo;
    appname: string;

    init(httpUrl: string, wsUrl?: string) {
        this.httpUrl = httpUrl;
        this.wsUrl = wsUrl;
        console.log("Network init:", this.httpUrl, this.wsUrl);
        if (cc.sys.isNative) {
            SdkboxPlay.init();
        }
        if (this.wsUrl) {
            this.ws = new WebSock(this.wsUrl);
        }
    }

    setHttpHost(host: string) {
        this.httpUrl = host;
    }

    getHttpHost() {
        return this.httpUrl;
    }

    private urlWithHost(req: HttpRequest) {
        const newReq: HttpRequest = {
            url: this.httpUrl + req.url,
            data: req.data,
            authorization: this.authorization,
        }
        return newReq;
    }

    async login(appname?: string, account?: string) {
        if (appname) {
            this.appname = appname;
        }
        return new Promise<any>((resolve, reject) => {
            const reqAuth = async () => {
                var res = await this.asyncHttpPost({
                    url: '/center/user/authorization',
                    data: {
                        acc: this.account
                    }
                });
                if(!res) {
                    console.log(`login fail, acc:${this.account}`);
                    resolve();
                }
                this.authorization = res.authorization;
                resolve(this.authorization);
                console.log(`login success, acc:${this.account}, authorization:${this.authorization}`);

            }
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                wx.login({
                    success: (res) => {
                        if (res.code) {
                            (async () => {
                                var resp = await this.asyncHttpPost({
                                    url: '/center/wechat/openid',
                                    data: {
                                        jscode: res.code,
                                        appname: this.appname,
                                        tt: isTTGame(),
                                    }
                                });
                                this.account = resp.openid;
                                reqAuth();
                            })()
                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }
                    }
                })
            } else if (cc.sys.isNative) {
                (async () => {
                    this.account = await SdkboxPlay.signin();
                    if(this.account) {
                        reqAuth();
                    }
                })();
            } else {
                this.account = account || 'test';
                reqAuth();
            }
        });
    }

    async asyncHttpGet(req: HttpRequest) {
        console.log("Http async get", req);
        var resp;
        const newReq = this.urlWithHost(req);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            resp = await Wechat.asyncHttpGet(newReq);
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
        var res;
        const newReq = this.urlWithHost(req);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            res = await Wechat.asyncHttpPost(newReq);
        } else {
            res = await Http.asyncPost(newReq);
        }
        if (res && res.err == 4) {
            let authorization = await this.login();
            if (authorization) {
                return this.asyncHttpPost(req);
            } else {
                throw new Error("login fail");
            }
        }
        return res;
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

    async getUserInfo(askPrefab?: cc.Prefab) {
        if (!this.userInfo) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                const wxInfo = await Wechat.getUserInfo(askPrefab);
                if (wxInfo) {
                    this.userInfo = {
                        avatarUrl: wxInfo.avatarUrl,
                        nickName: wxInfo.nickName
                    }
                }
            } else if (cc.sys.isNative) {
                // TODO
            } else {
                this.userInfo = {
                    nickName: this.account
                }
            }
        }
        return this.userInfo;
    }

    async getKV(key: string, appname?: string) {
        try {
            const resp = await this.asyncHttpPost({
                url: "/center/user/get_value",
                data: {
                    appname: this.appname,
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
    async setKV(key: string, value?: string, appname?: string) {
        cc.sys.localStorage.setItem(key, value);
        return this.asyncHttpPost({
            url: "/center/user/set_value",
            data: {
                appname: this.appname,
                key,
                value,
            }
        });
    }

    wsOpen() {
        if(this.ws) {
            this.ws.open();
        }
    }

    async wsCall(req: WsRequest) {
        if(!this.ws) {
            return req.defaultRes;
        }
        return this.ws.call(req);
    }

};

export default new Network();