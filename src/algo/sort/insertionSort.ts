// 插入排序
// key: i: 1->n j: i -> 0  arr[j] < arr[j - 1]
function insertionSort(arr: number[]): number[] {
  const n = arr.length

  if(n < 2) return arr

  // 第一个数是有序的 [0, i-1]是有序的
  for (let i = 1; i < n; i++) {
    // 从第二个数开始，在[0， i]中寻找插入位置
    for (let j = i; j > 0; j--) {
      if (arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
      } else {
        break
      }
    }
  }

  return arr
}

