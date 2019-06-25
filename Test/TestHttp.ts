import Console from "../Console/ConsoleService";
import Version from "../Network/Version";
import Http from "../Network/Http";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TestHttp extends cc.Component {
    testPing() {
        Console.addCustom("测试Http", () => {
            bb.log("test http");
            Http.post("/user/ping", {}, () => {
                bb.log("callback!!");
            });
        });
    };

    testSignIn() {
        Console.addCustom("测试登陆", () => {
            bb.log("test signin")
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
            bb.log(`version num ${num}`);
            var str = Version.tostring(num);
            bb.log(`version str ${str}`);
            bb.log(`check version ${Version.isLegal("1.1.0", "1.1.1")}`);
            bb.log(`check version ${Version.isLegal("1.1.0", "1.2.0")}`);
        });
    };

    start() {
        this.testPing();
        this.testSignIn();
        this.testVersion();
    };
};
