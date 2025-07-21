// 快速排序
// 额外数组
import {randomIndex, swap} from "@/utils.ts";

function quickSort(arr: number[]): number[] {
    if (arr.length < 2) return arr

    let pivot: number = arr.pop()!

    let left: number[] = []
    let right: number[] = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)]
}

// 原地快速排序
function quickSort1(arr: number[]): number[] {
    const n = arr.length
    if (n < 2) return arr

    /**
     * Lomuto 分区方案的实现
     * 将数组按照基准值划分，所有小于基准值的元素移动到基准值的左边，所有大于基准值的元素移动到基准值的右边
     * 选择最后一个元素作为基准值，此实现方式下，如果选择第一个元素作为基准值，需要在开始时将其与最后一个元素交换位置
     * 此函数的核心是选择基准值并围绕它进行分区，基准值的选择和分区过程决定了快速排序的性能
     * 时间复杂度最差情况下为O(n^2)，例如当数组已经排序时
     * Lomuto 分区返回的是基准值的最终位置 i，这个位置是数组中基准值应该放置的位置。
     * 递归调用时，对分区后的两个子数组进行排序：
     * 左子数组：low 到 pivot_index - 1
     * 右子数组：pivot_index + 1 到 high
     * @param arr 待划分的数组
     * @param left 数组的起始索引
     * @param right 数组的结束索引
     * @returns 基准值的最终索引
     */
    function partition(arr: number[], left: number, right: number): number {
        // 选择 最后一个元素作为基准
        // 如果选择 第一个元素作为基准， 怎么改？
        // 记住总是 选择最后一个元素作为基准
        // 如果不是的话，先把基准放到最后，即将基准和最后一个元素交换位置，这样基准就是最后一个元素了
        const pivot = arr[right] // 最差时间复杂度 O(n^2)
        let i = left
        for (let j = left; j < right; j++) {
            if (arr[j] < pivot) {
                [arr[i], arr[j]] = [arr[j], arr[i]]
                i++
            }
        }
        [arr[i], arr[right]] = [arr[right], arr[i]]

        console.log("###")
        console.log(arr)
        console.log(i)
        return i
    }

    // 选择 left 作为基准
    function partition1(arr: number[], left: number, right: number): number {
        const pivotIndex = left;
        const pivot = arr[pivotIndex]; // 最差时间复杂度 O(n^2)
        [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]]; // 将基准值放到最后

        let i = left
        for (let j = left; j < right; j++) {
            if (arr[j] < pivot) {
                [arr[i], arr[j]] = [arr[j], arr[i]]
                i++
            }
        }
        [arr[i], arr[right]] = [arr[right], arr[i]]

        return i
    }

    // 选择中间元素作为基准
    function partition2(arr: number[], left: number, right: number): number {
        // const pivotIndex = Math.floor((left + right) / 2); // 最差时间复杂度 O(nlogn)
        const pivotIndex = randomIndex(left, right); // 最差时间复杂度 O(nlogn)
        const pivot = arr[pivotIndex];
        swap(arr, pivotIndex, right); // 将基准值放到最后

        let i = left;
        for (let j = left; j < right; j++) {
            if (arr[j] < pivot) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
            }
        }
        [arr[i], arr[right]] = [arr[right], arr[i]];
        return i;
    }

    // 上述均为 Lomuto 分区方案的实现
    // 特点是先把基准放到一边（比如队尾），然后单向扫描。

    /**
     * Hoare 分区方案的实现
     * Hoare 分区返回的是指针 j，表示分区完成的位置。这个位置并不一定是基准值的位置，而是左右两部分的交界点。
     * 递归调用时，对分区后的两个子数组进行排序：
     * 左子数组：low 到 pivot_index
     * 右子数组：pivot_index + 1 到 high
     * @param arr 数组
     * @param left 左边界
     * @param right 右边界
     * @returns 分割点的索引，
     */
    function partitionHoare(arr: number[], left: number, right: number): number {
        // 1. 随机选择一个基准，并且它就待在原地
        const pivotIndex = randomIndex(left, right);
        const pivot = arr[pivotIndex];
        // 2. 初始化双指针
        let i = left;  // 左指针
        let j = right; // 右指针
        // 3. 开始双向扫描，直到指针相遇或交错
        while (i <= j) {
            // 从左向右找，找到第一个不小于基准的元素
            // 注意：这里用 < 而不是 <=，是为了处理 pivot 自身
            while (arr[i] < pivot) {
                i++;
            }
            // 从右向左找，找到第一个不大于基准的元素
            while (arr[j] > pivot) {
                j--;
            }
            // 如果 i 和 j 还没有交错
            if (i <= j) {
                // 交换这两个“站错位置”的元素
                swap(arr, i, j);
                // 交换后，两个指针继续前进，以防因 arr[i] === arr[j] === pivot 而陷入死循环
                i++;
                j--;
            }
        }
        // 循环结束后，j 在左边，i 在右边
        // j 就是左侧分区的终点，i 就是右侧分区的起点
        // 我们返回 j 作为这次分区的分割点（也可以返回 i，看递归怎么写）
        return i; // 返回左侧子数组的最后一个索引
    }

    function quickSortRecursive(arr: number[], left: number, right: number) {
        if (left < right) {
            // Lomuto 分区方案: 注意递归的索引
            // const pivotIndex = partition1(arr, left, right)
            // quickSortRecursive(arr, left, pivotIndex - 1)
            // Hoare 分区方案: 注意递归的索引
            const pivotIndex = partitionHoare(arr, left, right)
            quickSortRecursive(arr, left, pivotIndex)
            quickSortRecursive(arr, pivotIndex + 1, right)
        }
    }

    quickSortRecursive(arr, 0, n - 1)
    return arr
}

function quickSort2(arr: number[]): number[] {
    if (arr.length < 2) return arr

    // [小于基准的] [等于基准的] [大于基准的]
    // 找出 [等于基准的]的区间索引 （lessIndex, moreIndex） = （等于基准的）， 对两边的 [小于基准的] [大于基准的] 进行递归
    function partitions(arr: number[], left: number, right: number): number[] {
        // [...,..., right]
        // [小] [等] [大] [right]
        // 随机基准
        const pivotIndex = randomIndex(left, right)
        // 将这个基准放到最后
        swap(arr, pivotIndex, right)
        // 每次取right作为基准
        let pivot = arr[right]
        let less = left - 1
        let more = right + 1

        let i = left
        while (i < more) {
            if (arr[i] < pivot) {
                swap(arr, i++, ++less)
            } else if (arr[i] > pivot) {
                swap(arr, i, --more)
            } else {
                i++
            }
        }
        return [less + 1, more - 1]
    }

    function quickSortRecursive(arr: number[], left: number, right: number) {
        if (left < right) {
            const [less, more] = partitions(arr, left, right)
            quickSortRecursive(arr, left, less - 1)
            quickSortRecursive(arr, more + 1, right)
        }
    }

    quickSortRecursive(arr, 0, arr.length - 1)
    return arr
}

const arr = [8, 5, 3, 1, 5, 5, 7, 0, 5, 6, 10, 5]
// console.log(quickSort(arr))
console.log(quickSort1(arr))
// console.log(quickSort2(arr))

// 荷兰旗问题
// 数组划分问题： arr 和 num, num 在 arr 中划分出 小于 num 的 [left, less] 大于 num 的 [more, right] 等于 num 的 [less, more]
function partition(arr: number[], left: number, right: number, num: number): number[] {
    let less = left - 1
    let more = right + 1
    let i = left
    while (i < more) {
        if (arr[i] < num) {
            swap(arr, i++, ++less)
        } else if (arr[i] > num) {
            swap(arr, i, --more)
        } else {
            i++
        }
    }
    return [less + 1, more - 1]
}

// 测试
const nums = [8, 5, 3, 1, 5, 5, 7, 0, 5, 6, 10, 5], num = 5

console.log(partition(nums, 0, nums.length - 1, num), nums)

// 改进思想
// 打印样本使用快排调度
// L < R - 60 小样本使用插入排序

// 在使用封装sort， 如果是 基本数据 使用快排， 如果是引用数据，使用归并排，为了保证稳定性
