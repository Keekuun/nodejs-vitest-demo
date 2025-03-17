// 在 [left, right] 中随机选择一个数作为基准
export function randomIndex(left: number, right: number): number {
    // 【0， 1）* (right - left + 1) = [0, right - left + 1)
    // Math.floor([0, right - left + 1)) = [0, right - left]
    // [0, right - left] + left = [left, right]
    return Math.floor(Math.random() * (right - left + 1)) + left;
}

export function swap(arr: number[], i: number, j: number): void {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}