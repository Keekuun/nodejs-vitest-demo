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
verify(testLeftBoundCases, leftBoundBinarySearch);
verify(testLeftBoundCases, leftBoundBinarySearch2);
verify(testRightBoundCases, rightBoundBinarySearch);
verify(testRightBoundCases, rightBoundBinarySearch2);