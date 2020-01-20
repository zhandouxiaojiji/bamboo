//生成从minNum到maxNum的随机数
export function randomNum(minNum: number, maxNum?: number) {
  if (maxNum !== undefined) {
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  } else {
    Math.floor(Math.random() * (minNum + 1));
  }
} 