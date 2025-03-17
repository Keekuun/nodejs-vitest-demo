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
            // arr[i] <= arr[j] 此处比较为什么取等 ？
            /*
            稳定性：归并排序是稳定的排序算法。
            <= 的作用：在 merge 函数中，if (arr[i] <= arr[j]) 中的 <= 确保了相等元素的相对顺序保持不变。
            重要性：在某些应用场景中，保持相等元素的相对顺序是非常重要的。
            * */
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

// 应用

// 求小和
/**
 * 求小和
 题目：
 每一个数左边比当前数小的数累加起来， 叫做这个数组的小和。
 * */
function smallSum(arr: number[]): number {
    if(arr.length < 2) return 0

    function _merge(arr: number[], left: number, mid: number, right: number): number {
        let temp: number[] = []
        let i = left, j = mid + 1, k = 0, res = 0

        while(i <= mid && j <= right) {
            // 左侧 < 右侧 --> 产生小和
            if(arr[i] < arr[j]) { // 注意：此处和归并排序不同
                res += (right - j + 1) * arr[i]
                temp[k++] = arr[i++]
            } else {
                temp[k++] = arr[j++]
            }
        }
        while(i <= mid) {
            temp[k++] = arr[i++]
        }
        while(j <= right) {
            temp[k++] = arr[j++]
        }
        for(let p = 0; p < temp.length; p++) {
            arr[left + p] = temp[p]
        }
        return res
    }

    function _smallSum(arr: number[], left: number, right: number): number {
        if(left === right) return 0

        let mid = left + ((right - left) >> 1)

        // 左侧排序求小和数量 + 右侧排序求小和数量 + 合并左侧和右侧产生的小和数量
        return _smallSum(arr, left, mid) + _smallSum(arr, mid + 1, right) + _merge(arr, left, mid, right)
    }

    return _smallSum(arr, 0, arr.length - 1)
}

console.log(smallSum([1, 3, 4, 2, 5])) // 1 + 3+1 + 1 + 2+4+3+1 = 16

// 求逆序对
/*
对于一个数组，假如 arr[i] > arr[j] ，其中 i < j, 那么这个就叫做这个数列的一个逆序对。
*/
function reversePairs(arr: number[]): number {
    if(arr.length < 2) return 0

    function _merge(arr: number[], left: number, mid: number, right: number): number {
        let temp: number[] = []
        let i = left, j = mid + 1, k = 0, res = 0

        while(i <= mid && j <= right) {
            if (arr[i] <= arr[j]) { //此处和归并排序相同
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
                res += (mid - i + 1); // 统计逆序对
            }
        }
        while(i <= mid) {
            temp[k++] = arr[i++]
        }
        while(j <= right) {
            temp[k++] = arr[j++]
        }
        for(let p = 0; p < temp.length; p++) {
            arr[left + p] = temp[p]
        }
        return res
    }

    function _reversePairs(arr: number[], left: number, right: number): number {
        if(left === right) return 0

        let mid = left + ((right - left) >> 1)

        // 左侧排序求小和数量 + 右侧排序求小和数量 + 合并左侧和右侧产生的小和数量
        return _reversePairs(arr, left, mid) + _reversePairs(arr, mid + 1, right) + _merge(arr, left, mid, right)
    }

    return _reversePairs(arr, 0, arr.length - 1)
}

// 测试用例
console.log(reversePairs([3, 1, 2])); // 输出: 2
console.log(reversePairs([8, 3, 1, 7, 0, 10, 2])); // 输出: 12
console.log(reversePairs([5, 4, 3, 2, 1])); // 输出: 10
console.log(reversePairs([1, 2, 3, 4, 5])); // 输出: 0