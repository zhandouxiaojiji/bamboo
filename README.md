# CocosCreator小游戏框架
此项目是我使用CCC开发小游戏的一些总结，主要是一些可以复用的模块，特别是处理一些跨平台的问题，让开发者尽量少关心游戏业务逻辑以外的事。脚本使用Typescript，欢迎各路大侠补充pr。

# 基本功能
+ 全局事件机制
+ Http协议
+ 多语言支持
+ 微信小游戏
+ SdkboxPlay(Android+iOS)
+ 广告展示(微信+Admob)
+ GM控制台
+ 排行榜
+ 新手指引
+ 一些常用的组件

## 使用示例
+ 客户端 https://github.com/zhandouxiaojiji/bamboo-sample
+ 服务端 https://github.com/zhandouxiaojiji/bewater-sample
+ 完整项目示例 https://github.com/zhandouxiaojiji/mini-sample

## rpc请求
为了代码有更高的可读性，本项目尽量少用回调函数，改为同步调用，就是es6中的Promise，有点类似rpc服务。您会在示例里发现大量像这样的代码:
```typescript
(async () => {
    var resp = await Http.asyncPost({url: "test.com/api/aaa"});
    if(resp.ok) {
        resp = await Http.asyncPost({url: "test.com/api/bbb"});  
    } else {
        resp = await Http.asyncPost({url: "test.com/api/ccc"});  
    }
    console.log(`call result: ${resp}`);
})();
```

## 全局事件机制
ccc自带的事件机制似乎太依赖组件，不太适合一些单类的使用。我另写了一套很简单的事件机制，更适合做数据模型和界面逻辑的分离。
```typescript
// 在界面上侦听全局事件
bb.on(Language.EventType.CHANGE_LANGUAGE, (code: number) => {
    // TODO change code
});

// 在服务的单类里派发事件与参数
bb.dispatch(Language.EventType.CHANGE_LANGUAGE, code);
```

## 网络模块
Service/Network模块已经集成SdkboxPlay(谷歌游戏服务和苹果GameCenter)，微信小程序等几种sdk的登录，与开发者的第三方服务器间的通讯。
```typescript
(async () => {
    Network.init(def.HttpHost.RELEASE);
    if (cc.sys.isBrowser) {
        await Network.login(def.APPNAME, def.TestAccount);
    } else {
        await Network.login(def.APPNAME);
    }
    if(Network.authorization) {
        bb.notify(`登录凭证:${Network.authorization}`)
    }
})();
```

## 广告模块
目前已接入微信MP广告和Google的Admob，其中Admob需要sdkbox_config.json里定义配置,微信广告定义WechatAdConf即可
```typescript
Ad.init(conf);
Ad.showBanner("bottom"); // 横幅广告
Ad.showInterstitial("gameover"); // 插页广告
(async () => {
    let ret = Ad.showRewarded("retry"); // 视频激励
    if(ret) {
        // TODO 发奖励
    } else {
        // TODO 视频没看完
    }
})();
```

## 多语言支持
本项目未使用i18插件，而是另外实现了一套非常简单的方案。Service/Lanugage是单例，由导出的配置文件初始化，由它来统一管理所有多语言的字符串。给需要支持多语言的cc.Label和cc.Sprite添加bbLanugage组件，并在属性面板填写strId即可。
```typescript
Language.init(languageProp);
let str = Language.getStr("Hello");
```

## GM控制台
为了方便游戏的测试，我添加了一个简单的GM控制台界面(ConsoleView.prefab)，可以很方便的添加GM指令和测试按钮
```typescript
ConsoleService.addCustom("测试按钮", () => {
    console.log("this is a test button");
});
ConsoleService.addCmd("gmtest", (arg1, arg2) => {
    console.log("this is a test gm", arg1, arg2)
})
```

## 常用组件
+ bbDialog 对话框
+ bbLanguage 多语言组件
+ bbNotify 提示飘字
+ bbResLoader 资源加载进度条

## 优化与改进计划
+ 目前Network只支持Http协议，后续会添加Websocket和原生socket。其中登录的一些流程和API被我写死，这部分会考虑做的更通用些
+ 接入其它小游戏平台
+ 远程资源加载
+ 支持protobuf
+ 类似mock的本地模拟
+ 行为树框架

# CocosCreator Minigame Framework
You know baby, This bamboo is longer, more flexible, and very much alive -- Bruce Lee
