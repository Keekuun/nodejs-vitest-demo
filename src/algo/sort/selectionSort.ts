// 选择排序
// i:0 -> n-1
// j:i+1 -> n
// 每一轮选择最小的元素，放到当前位置
// Time: O(n^2)
// Space: O(1)
function selectionSort(arr: number[]): number[] {
    const n = arr.length

    let minIndex: number;
    for (let i = 0; i < n - 1; i++) {
        minIndex = i

        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }

        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }

    return arr
}

function selectionSort2(arr: number[]): number[] {
    const n = arr.length

    let minIndex: number;
    for (let i = 0; i < n - 1; i++) {
        minIndex = i

        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }

        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
        }
    }

    return arr
}

function selectionSort3(arr: number[]): number[] {
    const n = arr.length

    let left = 0, right = n - 1

    let minIndex: number;
    while (left < right) {
        minIndex = left
        for (let i = left + 1; i <= right; i++) {
            if (arr[i] < arr[minIndex]) {
                minIndex = i
            }
        }
        if (minIndex !== left) {
            [arr[left], arr[minIndex]] = [arr[minIndex], arr[left]]
        }
    }
    return arr
}

function selectionSort4(arr: number[]): number[] {
    const n = arr.length

    let left = 0, right = n - 1

    let minIndex: number
    let maxIndex: number
    while (left < right) {
        minIndex = left
        maxIndex = right
        for (let i = left; i <= right; i++) {
            if (arr[i] < arr[minIndex]) {
                minIndex = i
            }
            if (arr[i] > arr[maxIndex]) {
                maxIndex = i
            }
        }

        if (minIndex !== left) {
            [arr[left], arr[minIndex]] = [arr[minIndex], arr[left]]
        }
        if (maxIndex !== right) {
            [arr[right], arr[maxIndex]] = [arr[maxIndex], arr[right]]
        }
    }
    return arr
}