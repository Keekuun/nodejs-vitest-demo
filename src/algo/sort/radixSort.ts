// 基数排序
// 基数排序
export function radixSort(arr: number[]): number[] {
    if (arr.length < 2) return arr;

    // 获取数组中最大数的位数
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    let maxDigit = 0;
    while (max !== 0) {
        max = Math.floor(max / 10);
        maxDigit++;
    }

    // 创建10个桶
    const bucket = Array.from({ length: 10 }, (): number[] => []);

    const temp = Array.from({ length: arr.length }, (): number => 0);

    // 逐位处理数字
    for (let i = 0; i < maxDigit; i++) {
        // 将数组中的数分配到桶中
        for (let j = 0; j < arr.length; j++) {
            const digit = Math.floor((arr[j] / Math.pow(10, i)) % 10);
            bucket[digit].push(arr[j]);
            console.log(`分配到桶${digit}中：${bucket[digit]}`);
        }

        // 将桶中的数重新组合到数组中
        let index = 0;
        for (let k = 0; k < bucket.length; k++) {
            while (bucket[k].length > 0) {
                temp[index++] = bucket[k].shift() as number;
            }
        }

        console.log(`当前temp：${temp}`)

        // 清空桶，准备下一次处理
        for (let k = 0; k < bucket.length; k++) {
            bucket[k] = [];
        }
    }

    for (let i = 0; i < arr.length; i++) {
        arr[i] = temp[i];
    }

    return arr;
}

// 测试
const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.log(radixSort(arr)); // 输出: [2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50]
