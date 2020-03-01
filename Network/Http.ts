import bb from "../bb";

class Http {
    host: string;
    authorization: string = "";
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
    get(api: string, cb?: (response: string, xhr: XMLHttpRequest) => void, err_cb?: (xhr: XMLHttpRequest) => void) {
        if (!this.host) {
            cc.log("host not init");
            return;
        }
        cc.log("Http get", api);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.host + api, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                cc.log(response);
                if (cb) {
                    cb(response, xhr);
                }
            } else if (xhr.status < 200 || xhr.status >= 400) {
                if (err_cb) {
                    err_cb(xhr);
                }
            }
        };
        xhr.send();
        return xhr;
    };
    post(api: string, data: any, cb?: (response: any, xhr: XMLHttpRequest) => void, err_cb?: (xhr: XMLHttpRequest) => void) {
        if (!this.host) {
            cc.log("host not init");
            return;
        }
        cc.log("Http post:", api);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.host + api, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", this.authorization);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                cc.log("Response", response);
                if (cb) {
                    cb(response, xhr);
                }
            } else if (xhr.status < 200 || xhr.status >= 400) {
                cc.log("Network error", xhr.readyState, xhr.status);
                if (err_cb) {
                    err_cb(xhr);
                }
            }
        };
        xhr.send(JSON.stringify(data));
        return xhr;
    }
};

export default new Http;