import Console from "../Console/ConsoleService";
import Version from "../Network/Version";
import Http from "../Network/Http";
import bb from "../bb";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TestHttp extends cc.Component {
    testPing() {
        Console.addCustom("测试Http", () => {
            cc.log("test http");
            Http.post("/user/ping", {}, () => {
                cc.log("callback!!");
            });
        });
    };

    testSignIn() {
        Console.addCustom("测试登陆", () => {
            cc.log("test signin")
            Http.init("https://coding1024.com");
            Http.post("/user/sign_in", {
                acc: "test"
            }, (data: any) => {
                Http.authorization = data.authorization;
            })
        })
    };

    testVersion() {
        Console.addCustom("测试版本号", () => {
            var num = Version.tonumber("99.88.77");
            cc.log(`version num ${num}`);
            var str = Version.tostring(num);
            cc.log(`version str ${str}`);
            cc.log(`check version ${Version.isLegal("1.1.0", "1.1.1")}`);
            cc.log(`check version ${Version.isLegal("1.1.0", "1.2.0")}`);
        });
    };

    start() {
        this.testPing();
        this.testSignIn();
        this.testVersion();
    };
};
