import bb from "../bb";

export interface HttpRequest {
  url: string;
  authorization?: string;
  data?: any;
  success?: (response: any, xhr?: XMLHttpRequest) => void;
  fail?: (xhr?: XMLHttpRequest) => void;
  defaultRes?: any; // 当请求失败时返回的默认值
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
    if (req.authorization) {
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

  async asyncGet(req: HttpRequest): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get({
        url: req.url,
        authorization: req.authorization,
        data: req.data,
        success: (res) => {
          resolve(res);
        },
        fail: () => {
          console.log("http get error, response default value");
          resolve(req.defaultRes);
        }
      })
    });
  }

  async asyncPost(req: HttpRequest): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.post({
        url: req.url,
        authorization: req.authorization,
        data: req.data,
        success: (res) => {
          resolve(res);
        },
        fail: () => {
          console.log("http post error, response default value");
          resolve(req.defaultRes);
        }
      })
    });
  }
};

export default new Http();