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

    function quickSortRecursive(arr: number[], left: number, right: number) {
        if (left < right) {
            const pivotIndex = partition1(arr, left, right)
            quickSortRecursive(arr, left, pivotIndex - 1)
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
// console.log(quickSort1(arr))
console.log(quickSort2(arr))

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