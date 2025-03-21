// 0-1 背包
// 问题描述： 给定一个数组，数组中的元素代表物品的重量，再给定一个数组，数组中的元素代表物品的价值，再给定一个整数，表示背包的容量，问如何选择物品，使得价值最大，并且总重量不超过背包的容量。
// 例如： 给定一个数组[2, 3, 4, 5]，再给定一个数组[3, 4, 5, 6]，再给定一个整数10，问如何选择物品，使得价值最大，并且总重量不超过背包的容量。

function dp(weights: number[], values: number[], capacity: number): number {
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < weights.length; i++) {
    for (let j = capacity; j >= weights[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
    }
  }

  return dp[capacity];
}

// 测试
console.log(dp([2, 3, 4, 5], [3, 4, 5, 6], 10)); // 输出：13
