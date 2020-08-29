import Http, { HttpRequest } from "../Network/Http";
import Wechat from "../Wechat/Wechat";
import SdkboxPlay from "../SDKBox/SdkboxPlay";
import { WebSock, WebSockConf } from "../Network/WebSock";
import { isTTGame } from "../Utils";
import bb from "../bb";
import Listener from "../Listener";

export interface UserInfo {
	avatarUrl?: string;
	nickName: string;
}

class Network {
	private ws: WebSock;
	private httpUrl: string;
	private wsConf: WebSockConf;
	private wsPingTimer: NodeJS.Timeout;
	private listner: Listener = new Listener();

	account: string;
	authorization: string;
	userInfo: UserInfo;
	appname: string;
	isGuest: boolean; // 游客模式
	isLocal: boolean; // 单机模式

	EventType = {
		LOGIN_SUCESS: "LOGIN_SUCESS",
		LOGIN_FAIL: "LOGIN_FAIL",
		WS_RECV: "WS_RECV",
	}

	init(httpUrl: string, wsConf?: WebSockConf) {
		this.httpUrl = httpUrl;
		this.wsConf = wsConf;

		console.log("Network init:", this.httpUrl, wsConf);
		if (cc.sys.isNative) {
			SdkboxPlay.init();
		}

		if (wsConf) {
			this.ws = new WebSock(wsConf);
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

	async getGuestAccount() {
		var account = cc.sys.localStorage.getItem("GuestAccount");
		if (account) {
			return account;
		}
		const res = await this.asyncHttpPost({
			url: '/center/user/guest',
			defaultRes: '游客' + Math.random().toString(36).slice(-8),
		});
		account = res.acc;
		cc.sys.localStorage.setItem("GuestAccount", account);
		return account;
	}

	async login(appname?: string, account?: string) {
		this.appname = appname;
		return new Promise<any>((resolve, reject) => {
			const reqAuth = async () => {
				if (!this.account) {
					this.isGuest = true;
					this.account = await this.getGuestAccount();
				}
				var res = await this.asyncHttpPost({
					url: '/center/user/authorization',
					data: {
						acc: this.account
					},
				});
				if (!res) {
					console.log(`login fail, acc:${this.account}`);
					this.isLocal = true;
					resolve();
					bb.dispatch(this.EventType.LOGIN_FAIL);
				}
				this.authorization = res.authorization;
				resolve(this.authorization);
				bb.dispatch(this.EventType.LOGIN_SUCESS);
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
							console.log('登录错误！' + res.errMsg)
							reqAuth();
						}
					},
					fail: (res) => {
						console.log('登录失败！' + res.errMsg)
						reqAuth();
					}
				})
			} else if (cc.sys.isNative) {
				(async () => {
					this.account = await SdkboxPlay.signin();
					reqAuth();
				})();
			} else {
				this.account = account || 'test';
				reqAuth();
			}
		});
	}


	logout() {
		if (this.ws) {
			this.ws.close();
			this.ws = new WebSock(this.wsConf);
			if (this.wsPingTimer) {
				clearInterval(this.wsPingTimer);
			}
		}
		this.authorization = null;
		this.isGuest = false;
		this.isLocal = false;
		this.userInfo = null;
		this.account = null;
	}

	async asyncHttpGet(req: HttpRequest) {
		console.log("Http async get", req);
		if (this.isLocal) {
			return req.defaultRes;
		}
		var res;
		const newReq = this.urlWithHost(req);
		if (cc.sys.platform == cc.sys.WECHAT_GAME) {
			res = await Wechat.asyncHttpGet(newReq);
		} else {
			res = await Http.asyncGet(newReq);
		}
		if (res.err == 4) {
			let authorization = await this.login();
			if (authorization) {
				return this.asyncHttpGet(req);
			} else {
				throw new Error("login fail");
			}
		}
		return res;
	}
	async asyncHttpPost(req: HttpRequest) {
		console.log("Http async post", req);
		if (this.isLocal) {
			return req.defaultRes;
		}
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
		if (this.isLocal) {
			return req.success(req.defaultRes);
		}
		const newReq = this.urlWithHost(req);
		if (cc.sys.platform == cc.sys.WECHAT_GAME) {
			Wechat.httpGet(newReq);
			return;
		}
		Http.get(req);
	}
	httpPost(req: HttpRequest) {
		console.log("Http post");
		if (this.isLocal) {
			return req.success(req.defaultRes);
		}
		const newReq = this.urlWithHost(req);
		if (cc.sys.platform == cc.sys.WECHAT_GAME) {
			Wechat.httpPost(newReq);
			return;
		}
		Http.post(req);
	}

	async getUserInfo(askPrefab?: cc.Prefab) {
		if (!this.userInfo) {
			if (this.isGuest) {
				this.userInfo = {
					nickName: this.account,
				}
			} else if (cc.sys.platform == cc.sys.WECHAT_GAME) {
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

	async getKV(key: string) {
		try {
			const res = await this.asyncHttpPost({
				url: "/center/user/get_value",
				data: {
					appname: this.appname,
					key
				}
			});
			cc.sys.localStorage.setItem(key, res.value);
			return res.value;
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
				appname: this.appname,
				key,
				value,
			}
		});
	}

	wsOpen() {
		if (this.ws) {
			this.ws.open();
			if (this.wsConf.pingName) {
				this.wsPingTimer = setInterval(() => {
					if (!this.ws.isOpen()) {
						return;
					}
					this.wsCall(this.wsConf.pingName);
				}, this.wsConf.pingInter ? this.wsConf.pingInter * 1000 : 20000);
			}
		}
	}

	wsClose() {
		if (this.ws) {
			this.ws.close();
			if (this.wsPingTimer) {
				clearInterval(this.wsPingTimer);
			}
		}
	}

	async wsCall<T>(name: string, data?: T, defaultRes?: any) {
		if (!this.ws) {
			return defaultRes;
		}
		return this.ws.call(name, data, defaultRes);
	}

	wsSend<T>(name: string, data?: T) {
		if(this.ws) {
			this.ws.send(name, data);
		}
	}

	on(name: any, callback: (...args: any) => void, target?: any) {
		this.listner.on(name, callback, target);
	}
	off(name: any, callback: (...args: any) => void, target?: any) {
		this.listner.off(name, callback, target);
	}
	dispatch(name: any, ...args: any) {
		this.listner.dispatch(name, ...args);
	}
};

export default new Network();