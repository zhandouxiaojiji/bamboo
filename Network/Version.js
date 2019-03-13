// 版本号格式 xxx.xxx.xxx
var bb = require("bb");
const OFFSET = 1000;
bb.Version = {
    tonumber(str){
        var arr = str.split('.');
        var num = 0;
        for(var i = 0; i < arr.length; i ++){
            num = num + Math.pow(OFFSET, arr.length - i - 1) * arr[i];
        }
        return num;
    },
    tostring(num){
        var a = Math.floor(num/(OFFSET*OFFSET));
        var b = Math.floor(num%(OFFSET*OFFSET)/OFFSET);
        var c = num%OFFSET;
        return  `${a}.${b}.${c}`;
    },
    isCompatible(v1, v2){
        var num1 = this.tonumber(v1);
        var num2 = this.tonumber(v2);
        return Math.floor(num1/OFFSET) == Math.floor(num2/OFFSET);
    },
};