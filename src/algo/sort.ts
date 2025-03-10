// 堆排序、归并排序、快速排序、选择排序、冒泡排序、插入排序、希尔排序、基数排序、计数排序、桶排序

// 选择排序
function selectionSort(arr: number[]): number[] {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}

// 冒泡排序
function bubbleSort(arr: number[]): number[] {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }
  return arr;
}

// 插入排序
function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > temp) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = temp;
  }
  return arr;
}

// 希尔排序
function shellSort(arr: number[]): number[] {
  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)){
    for (let i = gap; i < arr.length; i++) {
      let temp = arr[i];
      let j = i - gap;
      while (j >= 0 && arr[j] > temp) {
        arr[j + gap] = arr[j];
        j -= gap;
      }
      arr[j + gap] = temp;
    }
  }
  return arr;
}

// 快速排序
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }
  const pivot = arr[0];
  const left: number[] = [];
  const right: number[] = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 原地快速排序
function quickSortInPlace(arr: number[], left: number = 0, right: number = arr.length - 1): number[] {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSortInPlace(arr, left, pivotIndex - 1);
    quickSortInPlace(arr, pivotIndex + 1, right);
  }
  return arr;
}
function partition(arr: number[], left: number, right: number): number {
  const pivot = arr[right];
  // 循环不变量：[left, i] <= pivot, [i + 1, j) > pivot]
  let i = left - 1;
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

// 归并排序
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i=0, j=0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

// 基数排序
function radixSort(arr: number[]): number[] {}

// 计数排序
function countingSort(arr: number[]): number[] {}

// 桶排序
function bucketSort(arr: number[]): number[] {}

// 堆排序
function heapSort(arr: number[]): number[] {
  function heapify(arr: number[], n: number, i: number): void {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) {
      largest = l;
    }
    if (r < n && arr[r] > arr[largest]) {
      largest = r;
    }
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  }

  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heapify(arr, arr.length, i);
  }
  for (let i = arr.length - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

export {
  selectionSort,
  bubbleSort,
  insertionSort,
  shellSort,
  quickSort,
  mergeSort,
  radixSort,
  countingSort,
  bucketSort,
}