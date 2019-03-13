var bb = require("bb");
bb.Http = {
    host: null,
    authorization: "",
    init(host) {
        var localHost = bb.getData("host");
        if (localHost) {
            this.host = localHost;
        } else {
            this.host = host;
        }
    },
    setHost(host) {
        this.host = host;
        bb.setData("host", host);
        bb.log("Http setHost:", host);
    },
    get(api, cb, err_cb) {
        if (!this.host) {
            bb.log("host not init");
            return;
        }
        bb.log("Http get", api);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.host + api, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                bb.log(response);
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
    },
    post(api, data, cb, err_cb) {
        if (!this.host) {
            bb.log("host not init");
            return;
        }
        bb.log("Http post:", api);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.host + api, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", this.authorization);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                bb.log("Response", response);
                if (cb) {
                    cb(response, xhr);
                }
            } else if (xhr.status < 200 || xhr.status >= 400) {
                bb.log("Network error", xhr.readyState, xhr.status);
                if (err_cb) {
                    err_cb(xhr);
                }
            }
        };
        xhr.send(JSON.stringify(data));
        return xhr;
    }
};