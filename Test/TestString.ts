import Console from "../Console/ConsoleService";
import bb from "../bb";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TestString extends cc.Component {
    start() {
        Console.addCustom("测试字符串", () => {
            cc.log("test string");
            var str = "aa bb cc";
            cc.log(str.split(" "));
        });
    };
};
