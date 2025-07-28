// https://leetcode.cn/problems/longest-substring-with-at-least-k-repeating-characters/description/
/* * @lc app=leetcode.cn id=395 lang=typescript
* 395. 至少有 K 个重复字符的最长子串
已解答
中等
相关标签
premium lock icon
相关企业
给你一个字符串 s 和一个整数 k ，请你找出 s 中的最长子串， 要求该子串中的每一字符出现次数都不少于 k 。返回这一子串的长度。

如果不存在这样的子字符串，则返回 0。



示例 1：

输入：s = "aaabb", k = 3
输出：3
解释：最长子串为 "aaa" ，其中 'a' 重复了 3 次。
示例 2：

输入：s = "ababbc", k = 2
输出：5
解释：最长子串为 "ababb" ，其中 'a' 重复了 2 次， 'b' 重复了 3 次。


提示：

1 <= s.length <= 104
s 仅由小写英文字母组成
1 <= k <= 105
* */
function longestSubstring1(s: string, k: number): number {
  // 使用分治法I
  // 分治法的核心思想是将问题分解为更小的子问题，直到子问题足够简单可以直接解决
  // 然后将子问题的解合并起来得到原问题的解
  // 时间复杂度为 O(n log n)，其中 n 是字符串 s 的长度

  // 统计每个字符出现的次数
  const countChars = (str: string): Map<string, number> => {
    const countMap = new Map<string, number>();
    for (const char of str) {
      countMap.set(char, (countMap.get(char) || 0) + 1);
    }
    return countMap;
  };
  // 分治法递归函数
  const divideAndConquer = (str: string): number => {
    const countMap = countChars(str);
    for (const [char, count] of countMap) {
      if (count < k) {
        // 分割字符串
        return Math.max(...str.split(char).map(divideAndConquer));
      }
    }
    return str.length; // 如果所有字符都满足条件，返回当前字符串长度
  }
  return divideAndConquer(s);
}


function longestSubstring2(s: string, k: number): number {
  // 使用分治法II
  // 从最大长度开始
  // 递归地检查每个子串
  // 时间复杂度为 O(n^2)，其中 n 是字符串 s 的长度
  function help(s:string, k:number, left: number, right: number):number {
    // 如果左指针大于右指针，或者当前子串长度小于 k，则返回 0
    // 这是递归的终止条件
    if(left > right || right - left + 1 < k) return 0

    // 统计当前子串中每个字符的出现次数
    let m = new Map<string, number>()
    for(let i=left; i<=right; i++) {
      m.set(s[i], (m.get(s[i]) || 0) + 1)
    }
    // 从左边和右边开始收缩窗口
    while(right - left + 1 >= k && m.get(s[left])! < k) {
      left++
    }
    while(right - left + 1 >= k && m.get(s[right])! < k) {
      right--
    }
    // 剪枝：如果字符串的长度小于 k，则返回 0
    if(right - left + 1 < k) return 0

    // 判断 中间字符数量是否满足k
    for(let i=left+1; i<right; i++) {
      // 如果当前字符的出现次数小于 k，则将其作为分割点
      // 分割字符串为两部分，递归求解
      if(m.get(s[i])! < k) {
        return Math.max(help(s, k, left, i-1), help(s, k, i+1, right))
      }
      // 如果当前字符的出现次数大于等于 k，则继续向右移动,直到最后
    }
    // 此时所有字符的出现次数都大于等于 k
    // 返回当前字符串的长度
    return right - left + 1
  }
  return help(s, k, 0, s.length - 1)
}

// 滑动窗口方法
function longestSubstring(s: string, k: number): number {
  // 使用滑动窗口方法
  // 时间复杂度为 O(n)，其中 n 是字符串 s 的长度
  const n = s.length;
  let maxLength = 0;
  // 遍历所有可能的唯一字符数量
  // 从 1 到 26，因为小写字母的数量是 26
  // 对于每个唯一字符数量，使用滑动窗口方法找到满足条件的
  for (let uniqueChars = 1; uniqueChars <= 26; uniqueChars++) {
    // 使用 Map 来统计字符出现的次数
    const charCount = new Map<string, number>();
    // 初始化滑动窗口的左右指针
    let left = 0;
    let right = 0;
    // 当前唯一字符的数量
    let currentUniqueChars = 0;
    // 当前满足条件的字符数量
    let validChars = 0;

    // 滑动窗口的右指针向右移动
    while (right < n) {
      // 将右指针指向的字符加入到 Map 中
      // 如果字符不存在于 Map 中，则初始化为 0
      const rightChar = s[right];
      if (!charCount.has(rightChar)) {
        charCount.set(rightChar, 0);
      }
      charCount.set(rightChar, charCount.get(rightChar)! + 1);

      // 如果当前字符的出现次数为 1，则增加当前唯一字符数量
      if (charCount.get(rightChar) === 1) {
        currentUniqueChars++;
      }
      // 如果当前字符的出现次数等于 k，则增加满足条件的字符数量
      if (charCount.get(rightChar) === k) {
        validChars++;
      }

      // 当当前唯一字符数量超过所需的唯一字符数量时，移动左指针
      while (currentUniqueChars > uniqueChars) {
        // 将左指针指向的字符从 Map 中移除
        // 如果字符的出现次数减为 0，则减少当前唯一字符数量
        // 如果字符的出现次数等于 k - 1，则减少满足条件的字符
        const leftChar = s[left];
        charCount.set(leftChar, charCount.get(leftChar)! - 1);
        if (charCount.get(leftChar) === 0) {
          currentUniqueChars--;
          charCount.delete(leftChar);
        }
        if (charCount.get(leftChar) === k - 1) {
          validChars--;
        }
        left++;
      }

      // 如果当前唯一字符数量等于所需的唯一字符数量
      // 且满足条件的字符数量等于所需的唯一字符数量
      // 则更新最大长度
      if (currentUniqueChars === uniqueChars && validChars === uniqueChars) {
        maxLength = Math.max(maxLength, right - left + 1);
      }
      // 移动右指针
      right++;
    }
  }
  return maxLength;
}

// 测试用例
console.log(longestSubstring("aaabb", 3)); // 输出: 3
console.log(longestSubstring("ababbc", 2)); // 输出: 5
console.log(longestSubstring("a", 1)); // 输出: 1
