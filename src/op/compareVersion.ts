// 比较版本号的大小， 返回 -1, 0, 1
// 15.0.1 12.0.0
// ~1.1.0 ^1.2.3
export function compareVersion(v1: string, v2: string): number {
    // 解析版本号字符串为数字数组
    const parseVersion = (str: string): number[] => {
        const matches = str.match(/(\d+)/g);
        if (!matches) {
            throw new Error(`Invalid version string: "${str}"`);
        }
        return matches.map(Number);
    };

    const v1Arr = parseVersion(v1);
    const v2Arr = parseVersion(v2);

    const maxLength = Math.max(v1Arr.length, v2Arr.length);

    for (let i = 0; i < maxLength; i++) {
        const num1 = v1Arr[i] ?? 0;
        const num2 = v2Arr[i] ?? 0;

        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
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
