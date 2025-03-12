// 快速排序
// 额外数组
function quickSort(arr: number[]): number[] {
    if(arr.length < 2) return arr

    let pivot: number = arr.pop()!

    let left: number[] = []
    let right: number[] = []
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] < pivot) {
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
    if(n < 2) return arr

    function partition(arr: number[], left: number, right: number): number {
        // 选择 最后一个元素作为基准
        // 如果选择 第一个元素作为基准， 怎么改？
        // 记住总是 选择最后一个元素作为基准
        // 如果不是的话，先把基准放到最后，即将基准和最后一个元素交换位置，这样基准就是最后一个元素了
        const pivot = arr[right]
        let i = left
        for(let j = left; j < right; j++) {
            if(arr[j] < pivot) {
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
        const pivot = arr[pivotIndex];
        [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]]; // 将基准值放到最后

        let i = left
        for(let j = left; j < right; j++) {
            if(arr[j] < pivot) {
                [arr[i], arr[j]] = [arr[j], arr[i]]
                i++
            }
        }
        [arr[i], arr[right]] = [arr[right], arr[i]]

        return i
    }

    // 选择中间元素作为基准
    function partition2(arr: number[], left: number, right: number): number {
        const pivotIndex = Math.floor((left + right) / 2);
        const pivot = arr[pivotIndex];
        [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]]; // 将基准值放到最后

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
        if(left < right) {
            const pivotIndex = partition1(arr, left, right)
            quickSortRecursive(arr, left, pivotIndex - 1)
            quickSortRecursive(arr, pivotIndex + 1, right)
        }
    }
    quickSortRecursive(arr, 0, n - 1)
    return arr
}

const arr = [8, 3, 1, 7, 0, 10, 2]
console.log(quickSort(arr))
