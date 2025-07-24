// https://leetcode.cn/problems/wiggle-sort-ii
/**
 * 给你一个整数数组 nums，将它重新排列成 nums[0] < nums[1] > nums[2] < nums[3]... 的顺序。
 *
 * 你可以假设所有输入数组都可以得到满足题目要求的结果。
 *
 *
 *
 * 示例 1：
 *
 * 输入：nums = [1,5,1,1,6,4]
 * 输出：[1,6,1,5,1,4]
 * 解释：[1,4,1,5,1,6] 同样是符合题目要求的结果，可以被判题程序接受。
 * 示例 2：
 *
 * 输入：nums = [1,3,2,2,3,1]
 * 输出：[2,3,1,3,1,2]
 * */
/**
 Do not return anything, modify nums in-place instead.
 */
function wiggleSort1(nums: number[]): void {
  // 排序 + 交叉放置
  // 时间复杂度 O(nlogn)，空间复杂度 O(n)
  const clone = [...nums].sort((a, b) => a - b);
  const n = nums.length;

  // 奇数索引放大数
  let j = nums.length - 1
  for (let i = 1; i < n; i += 2) {
    nums[i] = clone[j--];
  }
  // 偶数索引放小数
  for (let i = 0; i < n; i += 2) {
    nums[i] = clone[j--];
  }
}

function wiggleSort2(nums: number[]): void {
  // 桶排序
  // 时间复杂度 O(n)，空间复杂度 O(n)
  const n = nums.length;
  const max = Math.max(...nums);
  const buckets = new Array(max + 1).fill(0);

  for (const num of nums) {
    buckets[num]++;
  }

  let j = buckets.length - 1;
  for (let i = 1; i < n; i += 2) {
    while (buckets[j] === 0) {
      j--;
    }
    nums[i] = j;
    buckets[j]--;
  }

  for (let i = 0; i < n; i += 2) {
    while (buckets[j] === 0) {
      j--;
    }
    nums[i] = j;
    buckets[j]--;
  }
}
// [1,2,3,3,3,4,5,6] -> [1,2,3,3][3,4,5,6] -> [3,6,3,5,2,4,1] midIndex = ~~(length - 1) / 2 = 3
// [1,2,3,4,5] -> [1,2,3][4,5] -> [3,5,2,4,1] midIndex = ~~(length - 1) / 2 = 2
// 找到第midIndex + 1小的数 target
// 然后将数组分成两部分，左边小于target，中间等于target,右边大于target
// 然后 将 midIndex -> 0 放到偶数位置，length - 1 -> midIndex 放到奇数位置
// 代码实现
function wiggleSort(nums: number[]): void {
  // 快速选择 + 双指针
  const n = nums.length;
  if (n < 2) return;
  const midIndex = Math.floor((n - 1) / 2);
  // 找到 第 midIndex + 1 小的数
  // 时间复杂度 O(n)，空间复杂度 O(1)
  const midNum = quickSelect(nums, midIndex);
  // 将数组分成三部分
  // 左边小于 midNum，中间等于 midNum，右边大于 midNum
  // 时间复杂度 O(n)，空间复杂度 O(1)
  partitionThree(nums, midNum);
  // 将 midIndex -> 0 放到偶数位置，length - 1 -> midIndex 放到奇数位置
  // 时间复杂度 O(n)，空间复杂度 O(n)
  putToWiggleOrder(nums, midIndex);

  function putToWiggleOrder(arr: number[], midIndex: number): void {
    const n = arr.length;
    const result = new Array(n);
    let small = midIndex;
    let big = n - 1;

    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) {
        result[i] = arr[small--];
      } else {
        result[i] = arr[big--];
      }
    }
    for (let i = 0; i < n; i++) {
      arr[i] = result[i];
    }
  }

  function partitionThree(arr: number[], target: number): void {
    let left = 0;
    let right = arr.length - 1;
    let i = 0;

    while (i <= right) {
      if (arr[i] < target) {
        swap(arr, left++, i++);
      } else if (arr[i] > target) {
        swap(arr, i, right--);
      } else {
        i++;
      }
    }
  }

  function quickSelect(arr: number[], k: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
      const pivotIndex = partition(arr, left, right);
      if (pivotIndex === k) {
        return arr[pivotIndex];
      } else if (pivotIndex < k) {
        left = pivotIndex + 1;
      } else {
        right = pivotIndex - 1;
      }
    }
    return arr[left];
  }

  function partition(arr: number[], left: number, right: number): number {
    const pivotIndex = randomIndex(left, right);
    swap(arr, pivotIndex, right);
    const pivot = arr[right];

    let i = left;
    for (let j = left; j < right; j++) {
      if (arr[j] < pivot) {
        swap(arr, i, j);
        i++;
      }
    }
    swap(arr, i, right);
    return i;
  }

  function swap(arr: number[], i: number, j: number): void {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  function randomIndex(left: number, right: number): number {
    return Math.floor(Math.random() * (right - left + 1)) + left;
  }
}
