import Console from "../Console/ConsoleService";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TestString extends cc.Component {
    start() {
        Console.addCustom("测试字符串", () => {
            bb.log("test string");
            var str = "aa bb cc";
            bb.log(str.split(" "));
        });
    };
};
