import bb from "../bb";

export interface HttpRequest {
  url: string;
  authorization?: string;
  data?: any;
  success?: (response: any, xhr: XMLHttpRequest) => void;
  fail?: (xhr: XMLHttpRequest) => void;
}

class Http {
    get(req: HttpRequest) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", req.url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                cc.log(response);
                if (req.success) {
                    req.success(response, xhr);
                }
            } else if (xhr.status < 200 || xhr.status >= 400) {
                if (req.fail) {
                    req.fail(xhr);
                }
            }
        };
        xhr.send();
        return xhr;
    };
    post(req: HttpRequest) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", req.url, true);
        if(req.authorization) {
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Authorization", req.authorization);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                cc.log("Response", response);
                if (req.success) {
                    req.success(response, xhr);
                }
            } else if (xhr.status < 200 || xhr.status >= 400) {
                cc.log("Network error", xhr.readyState, xhr.status);
                if (req.fail) {
                    req.fail(xhr);
                }
            }
        };
        xhr.send(JSON.stringify(req.data || {}));
        return xhr;
    }
};

export default new Http();