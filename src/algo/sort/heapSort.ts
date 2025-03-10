// heap sort
// Time complexity: O(n log n)
/**
 * 堆排序算法实现
 * @param arr 待排序的数组
 * @returns 排序后的数组
 */
function heapSort(arr: number[]): number[] {
    /**
     * 堆化函数
     * 参数： arr：待排序的数组，n：数组的长度，i：当前节点的索引
     */
    function heapify(arr: number[], n: number, i: number): void {
        let largest = i; // 初始化最大值索引为当前节点
        let l = 2 * i + 1; // 左子节点索引
        let r = 2 * i + 2; // 右子节点索引

        // 如果左子节点存在且大于当前最大值，则更新最大值索引
        if (l < n && arr[l] > arr[largest]) {
            largest = l;
        }

        // 如果右子节点存在且大于当前最大值，则更新最大值索引
        if (r < n && arr[r] > arr[largest]) {
            largest = r;
        }

        // 如果最大值索引不是当前节点索引，则交换两者值，并递归调用 heapify
        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(arr, n, largest);
        }
    }

    // 从最后一个非叶子节点开始，对每个节点调用 heapify 函数进行堆化
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
        heapify(arr, arr.length, i);
    }

    // 从数组末尾开始，依次将第一个元素（最大值）与当前元素交换位置，然后对第一个元素进行堆化
    for (let i = arr.length - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }

    // 返回排序后的数组
    return arr;
}

// 测试用例
const arr = [12, 11, 13, 5, 6, 7];
console.log(heapSort(arr));
