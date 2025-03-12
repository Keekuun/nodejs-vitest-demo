// 归并排序
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    return [...result, ...left.slice(i), ...right.slice(j)]
  }

  return merge(left, right);
}

// 原地归并排序
function mergeSort2(arr: number[]): number[] {
    if (arr.length < 2) return arr;

    function mergeSortRecursive(arr: number[], left: number, right: number): void {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            mergeSortRecursive(arr, left, mid);
            mergeSortRecursive(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    function merge(arr: number[], left: number, mid: number, right: number): void {
        const temp: number[] = [];
        let i = left, j = mid + 1, k = 0;

        while (i <= mid && j <= right) {
            if (arr[i] <= arr[j]) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
            }
        }

        while (i <= mid) {
            temp[k++] = arr[i++];
        }

        while (j <= right) {
            temp[k++] = arr[j++];
        }

        for (let p = 0; p < temp.length; p++) {
            arr[left + p] = temp[p];
        }
    }

    mergeSortRecursive(arr, 0, arr.length - 1);
    return arr;
}

const arr = [8, 3, 1, 7, 0, 10, 2];
console.log(mergeSort(arr)); // 输出: [0, 1, 2, 3, 7, 8, 10]

