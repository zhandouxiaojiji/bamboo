var bb = require("bb");
var Http = {
    host: "127.0.0.1",
    init: function(host){
        this.host = host;
    },
    get: function(api, callback){
        bb.log("Http get", api);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.host + api, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                bb.log(response);
                callback(response, xhr);
            }
        };
        xhr.send();
        return xhr;
    },
    post: function(api, data, callback){
        bb.log("Http post:", api);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.host + api, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", "aaa");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                bb.log(response);
                callback(response, xhr);
            }
        };
        xhr.send(data);
        return xhr;
    }
};
bb.Http = Http;