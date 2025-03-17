// 插入排序
// i: 1 -> n
// j: i -> 0
// key: arr[j] < arr[j - 1]
// 相当于 gap = 1 的希尔排序
function insertionSort(arr: number[]): number[] {
    let n = arr.length;

    if (n < 2) return arr

    for (let i = 1; i < n; i++) {
        for (let j = i; j > 0; j--) {
            if (arr[j] < arr[j - 1]) {
                [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
            }
        }
    }
   return arr;
}

// 希尔排序: 插入排序的改进版
// i: gap -> n
// j: i -> gap - 1
function shellSort(arr: number[]): number[] {
    let n = arr.length;

    if (n < 2) return arr

    for (let gap = n >> 1; gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            for (let j = i; j > gap - 1; j -= gap) {
                if (arr[j] < arr[j - gap]) {
                    [arr[j], arr[j - gap]] = [arr[j - gap], arr[j]]
                }
            }
        }
    }
    return arr;
}