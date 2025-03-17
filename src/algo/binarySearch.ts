// 二分查找
// 左边界，右边界
// 1. 递归实现
// 2. 迭代实现

function binarySearch(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1

    while (left <= right) {
        let mid = Math.floor((left + right) / 2)

        if (arr[mid] === target) return mid

        if (arr[mid] < target) {
            left = mid + 1
        }

        if (arr[mid] > target) {
            right = mid - 1
        }
    }

    return -1
}

// [left, mid - 1] [mid] [mid + 1, right]
function leftBoundBinarySearch(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1
    while (left <= right) {
        let mid = Math.floor((left + right) / 2)

        if (arr[mid] === target) {
            right = mid - 1
        } else if (arr[mid] < target) {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }

    if (left >= arr.length || arr[left] !== target) return -1

    return left
}

// [left, mid - 1] [mid] [mid + 1, right]
function rightBoundBinarySearch(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1
    while (left <= right) {
        let mid = Math.floor((left + right) / 2)

        if (arr[mid] === target) {
            left = mid + 1
        } else if (arr[mid] < target) {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }

    if (right < 0 || arr[right] !== target) return -1

    return right
}


// [left, mid - 1] [mid] [mid + 1, right)
function leftBoundBinarySearch2(arr: number[], target: number): number {
    let left = 0, right = arr.length
    while (left < right) {
        let mid = Math.floor((left + right) / 2)

        if (arr[mid] === target) {
            right = mid
        } else if (arr[mid] < target) {
            left = mid + 1
        } else {
            right = mid
        }
    }

    if (arr[left] !== target) return -1

    return left
}

// [left, mid - 1] [mid] [mid + 1, right)
function rightBoundBinarySearch2(arr: number[], target: number): number {
    let left = 0, right = arr.length

    while (left < right) {
        let mid = Math.floor((left + right) / 2)

        if (arr[mid] === target) {
            left = mid + 1
        } else if (arr[mid] < target) {
            left = mid + 1
        } else {
            right = mid
        }
    }

    if (arr[right - 1] !== target) return -1

    return right - 1
}

// 测试用例
const testLeftBoundCases = [
    {arr: [1, 2, 2, 2, 4], target: 2, expected: 1},
    {arr: [1, 2, 3, 4, 5], target: 3, expected: 2},
    {arr: [1, 2, 3, 4, 5], target: 6, expected: -1},
    {arr: [1, 1, 1, 1, 1], target: 1, expected: 0},
    {arr: [1, 2, 3, 4, 5], target: 0, expected: -1}
];
const testRightBoundCases = [
    {arr: [1, 2, 2, 2, 4], target: 2, expected: 3},
    {arr: [1, 2, 3, 4, 5], target: 3, expected: 2},
    {arr: [1, 2, 3, 4, 5], target: 6, expected: -1},
    {arr: [1, 1, 1, 1, 1], target: 1, expected: 4},
    {arr: [1, 2, 3, 4, 5], target: 0, expected: -1}
];

// 验证函数
function verify(testCases, func) {
    for (let i = 0; i < testCases.length; i++) {
        const {arr, target, expected} = testCases[i];
        const result = func(arr, target);
        if (result !== expected) {
            console.log(`Test case ${i + 1} failed: Expected ${expected}, got ${result}`);
            return false;
        }
    }
    console.log("All test cases passed!");
    return true;
}

// 验证
// verify(testLeftBoundCases, leftBoundBinarySearch);
// verify(testLeftBoundCases, leftBoundBinarySearch2);
// verify(testRightBoundCases, rightBoundBinarySearch);
// verify(testRightBoundCases, rightBoundBinarySearch2);

/*
* 局部最小值
数组中的局部最小值是指数组中某个元素，它小于或等于其相邻的元素。具体来说，对于一个数组 arr，如果存在一个索引 i 满足以下条件之一，则 arr[i] 是一个局部最小值：
i = 0 且 arr[0] <= arr[1]
i = n - 1 且 arr[n - 1] <= arr[n - 2]
0 < i < n - 1 且 arr[i] <= arr[i - 1] 且 arr[i] <= arr[i + 1]
* */

// 暴力法
function findLocalMin(arr: number[]): number {
    let n = arr.length
    if (n === 0) return -1
    if (n === 1) return 0

    for (let i = 0; i < n; i++) {
        if (i === 0 && arr[i] <= arr[i + 1]) {
            return i
        }
        if (i === n - 1 && arr[i] <= arr[i - 1]) {
            return i
        }
        if (arr[i] <= arr[i - 1] && arr[i] <= arr[i + 1]) {
            return i
        }
    }
    return -1
}

// 二分查找
function findLocalMin2(arr: number[]): number {
    let n = arr.length
    if (n === 0) return -1
    if (n === 1) return 0

    if (arr[0] <= arr[1]) {
        return 0
    }

    if (arr[n - 1] <= arr[n - 2]) {
        return n - 1
    }

    let left = 1, right = n - 2
    while (left < right) {
        let mid = left + ((right - left) >> 1)
        if (arr[mid] > arr[mid - 1]) {
            right = mid - 1;
        } else if (arr[mid] > arr[mid + 1]) {
            left = mid + 1
        } else {
            return mid
        }
    }

    return -1
}

// 测试用例
const testLocalMinCases = [
    {arr: [3, 2, 1, 4, 5], expected: 2},
    {arr: [5, 4, 3, 2, 1], expected: 4},
    {arr: [1, 2, 3, 4, 5], expected: 0},
    {arr: [10, 20, 30, 40, 50], expected: 0},
    {arr: [50, 40, 30, 20, 10], expected: 4},
    {arr: [1, 3, 2, 4, 5], expected: 0},
    {arr: [1], expected: 0},
    {arr: [], expected: -1}
];

// 验证函数
function verifyLocalMinBinary(testCases) {
    for (let i = 0; i < testCases.length; i++) {
        const {arr, expected} = testCases[i];
        const result = findLocalMin2(arr);
        if (result !== expected) {
            console.log(`Test case ${i + 1} failed: Expected ${expected}, got ${result}`);
            return false;
        }
    }
    console.log("All test cases passed!");
    return true;
}

// 验证
verifyLocalMinBinary(testLocalMinCases);