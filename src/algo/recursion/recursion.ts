// 递归 和 回溯
// Recursion and Backtracking
// DFS BFS

// 汉诺塔问题 LeetCode 188
function hanoi(n: number, from: string, to: string, temp: string): void {
  if (n === 1) {
    console.log(`Move disk 1 from ${from} to ${to}`);
    return;
  }

  hanoi(n - 1, from, temp, to);
  console.log(`Move disk ${n} from ${from} to ${to}`);
  hanoi(n - 1, temp, to, from);
}

hanoi(3, 'A', 'B', 'C')


// 子序列：求字符串的所有 子序列
function subSequences(str: string): string[] {
  if (str.length === 0) {
    return [''];
  }

  const firstChar = str[0];
  const restChars = str.slice(1);

  const subSequencesRest = subSequences(restChars);
  const subSequencesWithFirstChar = subSequencesRest.map(sequence => firstChar + sequence);

  return [...subSequencesRest, ...subSequencesWithFirstChar];
}

console.log(subSequences('abc'))

function subSequences2(str: string): string[] {
  if(str.length === 0) return ['']


  const result: string[] = [''];
  for (const char of str) {
    const newSubsequences = result.map(seq => seq + char);
    result.push(...newSubsequences);
  }
  return result;
}

console.log(subSequences2('abc'))

function subSequences3(str: string): string[] {
  const n = str.length
  const ans: string[] = []

  dfs(0, '')

  function dfs(i: number, s: string){
    if(i === n) {
      ans.push(s)
      return
    }
    // 不选
    dfs(i+1, s)
    // 选
    dfs(i+1, s+str[i])
  }

  return ans
}


console.log(subSequences3('abc'))

// 全排列：求字符串的全部排列
function permutations(str: string): string[] {
    const result: string[] = []

    if (str.length === 0) {
        return ['']
    }

    for (let i = 0; i < str.length; i++) {
        const firstChar = str[i]
        const restChars = str.slice(0, i) + str.slice(i + 1)

        const permutationsRest = permutations(restChars)

        for (const permutation of permutationsRest) {
            result.push(firstChar + permutation)
        }
    }

    return result
}

console.log(permutations('甲乙丙'))

// 求子集 LeetCode 78
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(subset: number[], start: number): void {
    result.push([...subset]);

    for (let i = start; i < nums.length; i++) {
      subset.push(nums[i]);
      backtrack(subset, i + 1);
      subset.pop();
    }
  }

  backtrack([], 0);

  return result;
}

console.log(subsets([1,2,3]))

// 预测赢家 LeetCode 486
function PredictTheWinner(nums: number[]): boolean {
    return true
}

// 逆序栈 LeetCode 946
// 要求使用递归： 利用系统递归栈、栈中栈


// N皇后问题 LeetCode 51
// 递归回溯 --> 使用位运算 --> 优化

// 岛屿个数 LeetCode 200
/**
 * 0 代表水，1 代表陆地
 0 0 0 0 0
 0 0 0 1 1
 0 1 1 0 0
 0 1 0 0 0
 0 0 0 0 0
 *
 * */
// 染色、感染、标记
function numIslands(grid: string[][]): number {
  let count = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(grid, i, j);
      }
    }
  }

  function dfs(grid: string[][], i: number, j: number): void {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] !== '1') {
      return;
    }

    grid[i][j] = '2';

    dfs(grid, i - 1, j);
    dfs(grid, i + 1, j);
    dfs(grid, i, j - 1);
    dfs(grid, i, j + 1);
  }

  return count;
}

// KMP算法 LeetCode 28
// 匹配字符串 LeetCode 459
