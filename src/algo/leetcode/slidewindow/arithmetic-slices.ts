/**
 * 413. 等差数列划分
 * 中等
 * 相关标签
 * premium lock icon
 * 相关企业
 * 如果一个数列 至少有三个元素 ，并且任意两个相邻元素之差相同，则称该数列为等差数列。
 *
 * 例如，[1,3,5,7,9]、[7,7,7,7] 和 [3,-1,-5,-9] 都是等差数列。
 * 给你一个整数数组 nums ，返回数组 nums 中所有为等差数组的 子数组 个数。
 *
 * 子数组 是数组中的一个连续序列。
 *
 *
 *
 * 示例 1：
 *
 * 输入：nums = [1,2,3,4]
 * 输出：3
 * 解释：nums 中有三个子等差数组：[1, 2, 3]、[2, 3, 4] 和 [1,2,3,4] 自身。
 * 示例 2：
 *
 * 输入：nums = [1]
 * 输出：0
 * */
function numberOfArithmeticSlices1(nums: number[]): number {
  // 滑动窗口
  let ans = 0
  let left=0, right=2
  for(; right<nums.length; right++) {
    const diff1 = nums[right-1] - nums[right-2]
    const diff2 = nums[right] - nums[right-1]
    // [1,2,3] 1
    // [1,2,3,5]
    // [1,2,3,4] 3
    // [1,2,3,4,5] 6 [0,4]
    // 此处也可能一直无法进入循环，则无法统计
    if(diff1 !== diff2) {
      // [left, right] 不是等差数列
      // 衍生问题1：统计连续子数组个数 长度 > 0 len*(len+1) / 2
      // 衍生问题2：统计长度> k的连续子数组个数
      // [left, right-1] 为等差数列，统计 > k的子数组个数： (len - k) * (len-k+1) / 2
      if(right - left >= 3) { // k=2
        const len = right - left + 1
        ans += (len - 2)*(len - 2 + 1)/2
      }
      left = right - 1
    }
  }

  // 防止漏掉
  if(right - left >= 3 && nums[left+1] - nums[left] === nums[right-1] - nums[right-2]) {
    ans += (right - left - 1)*(right - left - 2)/2
  }

  return ans
}

function numberOfArithmeticSlices2(nums: number[]): number {
  // 动态规划
  let res = 0,
    count = 0
  for (let i = 2; i < nums.length; i++) {
    if (nums[i] - nums[i - 1] === nums[i - 1] - nums[i - 2]) {
      count++
      res += count
    } else {
      count = 0
    }
  }
  return res
};

console.log(numberOfArithmeticSlices([1,2,3,4]))
console.log(numberOfArithmeticSlices([1,2,3,4,5]))
console.log(numberOfArithmeticSlices([1,2,3, 6]))