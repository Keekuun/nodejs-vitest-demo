// 计数排序
/**
 * 计数排序是一种非比较排序算法，适用于一定范围内的整数排序。以下是实现计数排序的步骤和示例代码。
 *
 * ✅ 实现步骤
 *
 * 1. **找出数组中的最大值和最小值**，以确定计数数组的大小。
 * 2. **创建计数数组**，用于统计每个元素出现的次数。
 * 3. **对计数数组进行累加**，以确定每个元素在排序后数组中的位置。
 * 4. **从后往前遍历原数组**，将元素放入排序后数组中的正确位置。
 * */

function countingSort(arr: number[]): number[] {
    if (arr.length === 0) return arr;

    // 找出数组中的最大值和最小值
    const max = Math.max(...arr);
    const min = Math.min(...arr);

    // 创建计数数组
    const countArray: number[] = new Array(max - min + 1).fill(0);

    // 统计每个元素出现的次数
    for (let i = 0; i < arr.length; i++) {
        countArray[arr[i] - min]++;
    }

    // 对计数数组进行累加
    for (let i = 1; i < countArray.length; i++) {
        countArray[i] += countArray[i - 1];
    }

    // 创建排序后数组
    const sortedArray: number[] = new Array(arr.length).fill(0);

    // 从后往前遍历原数组，将元素放入排序后数组中的正确位置
    for (let i = arr.length - 1; i >= 0; i--) {
        sortedArray[countArray[arr[i] - min] - 1] = arr[i];
        countArray[arr[i] - min]--;
    }

    return sortedArray;
}

const unsortedArray: number[] = [4, 2, 2, 8, 3, 3, 1];
const sortedArray: number[] = countingSort(unsortedArray);
console.log(sortedArray); // 输出 [1, 2, 2, 3, 3, 4, 8]
