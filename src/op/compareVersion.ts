// 比较版本号的大小， 返回 -1, 0, 1
// 15.0.1 12.0.0
// ~1.1.0 ^1.2.3
export function compareVersion(v1: string, v2: string): number {
  const v1Arr = v1.match(/(\d+)/g)?.map(Number) ?? [];
  const v2Arr = v2.match(/(\d+)/g)?.map(Number) ?? [];

  // 判断 v1Arr.length 和 v2Arr.length 是否相等，如果不相等，则将数组长度补齐
  while (v1Arr.length < v2Arr.length) {
    v1Arr.push(0);
  }
  while (v2Arr.length < v1Arr.length) {
    v2Arr.push(0);
  }

  for (let i = 0; i < v1Arr.length; i++) {
    if (v1Arr[i] > v2Arr[i]) {
      return 1;
    } else if (v1Arr[i] < v2Arr[i]) {
      return -1;
    }
  }
  return 0;
}

console.log(compareVersion('1.2', '1.2.2')); // -1（正确）
console.log(compareVersion('1.2.3', '1.2')); // 1（正确）
console.log(compareVersion('1.2.0', '1.2')); // 0（正确）
console.log(compareVersion('1.2', '1.2.0')); // 0（正确）
console.log(compareVersion('1.2', '1.2.1')); // 0（正确）
console.log(compareVersion('v1.2.1', 'v1.2.2')); // 0（正确）
console.log(compareVersion('1.0.1', '1')); // 1（正确）
console.log(compareVersion('1.9', '1.11')); // -1（正确）
console.log(compareVersion('9.11', '9.9')); // 1（正确）
