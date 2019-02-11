var bb = require("bb");
bb.Http = {
    host: null,
    authorization: null,
    init: function(host){
        this.host = host;
    },
    get: function(api, callback){
        if(!this.host){
            bb.log("host not init");
            return;
        }
        bb.log("Http get", api);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.host + api, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response =  JSON.parse(xhr.responseText);
                bb.log(response);
                if(callback){
                    callback(response, xhr);
                }
            }
        };
        xhr.send();
        return xhr;
    },
    post: function(api, data, callback){
        if(!this.host){
            bb.log("host not init");
            return;
        }
        bb.log("Http post:", api);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.host + api, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", this.authorization || '');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                bb.log(response);
                if(callback){
                    callback(response, xhr);
                }
            } else {
                bb.log("Network error", xhr.readyState, xhr.status);
            }
        };
        xhr.send(JSON.stringify(data));
        return xhr;
    }
};