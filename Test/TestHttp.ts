import Console from "../Console/ConsoleService";
import Version from "../Service/Version";
import Network from "../Service/Network";
import bb from "../bb";
import Http from "../Network/Http";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TestHttp extends cc.Component {
    testSignIn() {
        Console.addCustom("测试登陆", () => {
            cc.log("test signin")
            Network.init("https://coding1024.com");
            Network.httpPost({
                url: "/user/sign_in",
                data: {
                    acc: "test"
                },
                success: (data: any) => {
                    Network.authorization = data.authorization;
                }
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

    testRpc() {
        Console.addCustom("Test Rpc", () => {
            (async () => {
                var resp = await Http.asyncPost({
                    url: "https://mini.coding1024.com/center/user/token",
                    data: {
                        acc: "test"
                    },
                });
                console.log("rpc resp", resp);
            })();
        })
    }

    start() {
        this.testSignIn();
        this.testVersion();
        this.testRpc();
    };
};
