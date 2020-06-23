export function Uint32toBinary(num, littleEndian = false) {
  let retArr = new ArrayBuffer(4);
  let dv = new DataView(retArr);
  dv.setUint32(0, num, littleEndian);
  return new Uint8Array(retArr)
}

export function stringToUint8Array(str: string){
  var arr = [];
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  } 
  return new Uint8Array(arr);
}

export function BinaryToUint32(binary: ArrayBuffer , littleEndian = false){
  let dv = new DataView(binary)
  return dv.getUint32(4, littleEndian)
},