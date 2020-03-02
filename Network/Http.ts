import bb from "../bb";

class Http {
    host: string;
    acc: string;
    authorization: string;
    init(host: string) {
        this.host = bb.getData("host", host);
        cc.log("init host:", this.host);
    };
    setHost(host) {
        this.host = host;
        bb.setData("host", host);
        cc.log("Http setHost:", host);
    };
    getHost() {
        return this.host;
    }
    login(account?: string) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.login({
                success: (res) => {
                    if (res.code) {
                        //发起网络请求
                        this.post('/center/wechat/openid', {
                            platform: "WECHAT_GAME",
                            jscode: res.code
                        }, ({ data, statusCode }) => {
                            console.log("login success", data);
                            this.acc = data.openid;

                        }, (failRes) => {
                            bb.notify("登录失败");
                            console.log("login fail", failRes)
                        })
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
        } else if (cc.sys.isNative) {
            // TODO sdkbox login
        } else {
            this.acc = bb.getData("testAccount", account || "test");
            this.post("/center/user/token", {acc: this.acc}, (res) => {
                console.log("login res", res)
                this.authorization = res.authorization;
            })
        }
    }

    get(api: string, success?: (response: string, xhr: XMLHttpRequest) => void, fail?: (xhr: XMLHttpRequest) => void) {
        if (!this.host) {
            cc.log("host not init");
            return;
        }
        console.log("Http get", api);
        const url = this.host + api
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.request({
                method: "POST",
                header: { Authorization: this.authorization },
                url,
                success,
                fail
            })
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.host + api, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                cc.log(response);
                if (success) {
                    success(response, xhr);
                }
            } else if (xhr.status < 200 || xhr.status >= 400) {
                if (fail) {
                    fail(xhr);
                }
            }
        };
        xhr.send();
        return xhr;
    };
    post(api: string, data: any, success?: (response: any, xhr: XMLHttpRequest) => void, fail?: (xhr: XMLHttpRequest) => void) {
        const url = this.host + api
        if (!this.host) {
            cc.log("host not init");
            return;
        }
        console.log("Http post:", api);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.request({
                method: "POST",
                header: { Authorization: this.authorization },
                url,
                data,
                success,
                fail
            })
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        if(this.authorization) {
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Authorization", this.authorization);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                cc.log("Response", response);
                if (success) {
                    success(response, xhr);
                }
            } else if (xhr.status < 200 || xhr.status >= 400) {
                cc.log("Network error", xhr.readyState, xhr.status);
                if (fail) {
                    fail(xhr);
                }
            }
        };
        xhr.send(JSON.stringify(data));
        return xhr;
    }
};

export default new Http;