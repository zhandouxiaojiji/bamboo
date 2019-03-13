// 版本号格式 xxx.xxx.xxx
var bb = require("bb");
const OFFSET = 1000;
bb.Version = {
    tonumber(str){
        var arr = str.split('.');
        var num = 0;
        for(var i = 0; i < arr.length; i ++){
            bb.log(Math.pow(OFFSET, arr.length - i));
            num = num + Math.pow(OFFSET, arr.length - i - 1) * arr[i];
        }
        return num;
    },
    tostring(num){
        var a = Math.floor(num/(OFFSET*OFFSET));
        var b = Math.floor(num%(OFFSET*OFFSET)/OFFSET);
        var c = num%OFFSET;
        return  `${a}.${b}.${c}`;
    }
};