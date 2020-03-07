// 版本号格式 xxx.xxx.xxx
const OFFSET = 1000;
class Version {
    tonumber(str: string) {
        var arr = str.split('.');
        var num = 0;
        for (var i = 0; i < arr.length; i++) {
            num = num + Math.pow(OFFSET, arr.length - i - 1) * parseInt(arr[i]);
        }
        return num;
    };
    tostring(num: number) {
        var a = Math.floor(num / (OFFSET * OFFSET));
        var b = Math.floor(num % (OFFSET * OFFSET) / OFFSET);
        var c = num % OFFSET;
        return `${a}.${b}.${c}`;
    };
    isLegal(v1: string, v2: string) {
        var num1 = this.tonumber(v1);
        var num2 = this.tonumber(v2);
        return Math.floor(num1 / OFFSET) == Math.floor(num2 / OFFSET);
    };
};

export default new Version;