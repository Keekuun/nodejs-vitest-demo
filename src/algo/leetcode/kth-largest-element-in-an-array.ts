// https://leetcode.cn/problems/kth-largest-element-in-an-array/description/
// TopK问题

// 暴力法：排序返回第 k-1个数
function findKthLargest1(nums: number[], k:number):number {
  return nums.sort((a: number, b: number) => a - b)[k-1]
}

// 快速选择
function findKthLargest2(nums: number[], k:number):number {
  let n = nums.length
  return quickSelect(nums, 0, n - 1, n - k)

  function quickSelect(nums: number[], left: number, right: number, k:number): number {
    if(left >= right) {
      return nums[left]
    }

    let pi = left
    let i = left - 1, j = right + 1

    while(i < j) {
      do i++; while (nums[i] < nums[pi]);
      do j--; while (nums[j] > nums[pi]);

      if(i < j) {
        swap(nums, i, j)
      }
    }

    if(k <= j) return quickSelect(nums, left, j, k)
    return quickSelect(nums, j+1, right, k)
  }

  function  swap(nums: number[], i:number, j:number) {
    [nums[i], nums[j]] = [nums[j], nums[i]]
  }

  function random(start: number, end: number):number {
    return Math.floor(Math.random() * (end - start + 1)) + start
  }
}

// 大根堆
function findKthLargest3(nums: number[], k:number):number {
  let mp = new MaxHeap(nums)
  let ans = mp.peek
  for(let i=0; i<k; i++) {
    ans = mp.pop()!
  }
  return ans
}

class MaxHeap {
  private readonly data:number[] = []

  constructor(nums?: number[]) {
    this.data = nums ?? []

    // 将所有的非叶子节点堆化
    for(let i=this.parent(this.size - 1); i>=0; i++) {
      this.siftDown(i)
    }
  }

  // 获取数组下标为 i父节点的左子节点下标
  private left(i: number): number {
    return i * 2 + 1
  }

  // 获取下标为i父节点的右子节点下标
  private right(i: number): number {
    return i * 2 + 2
  }

  // 获取下标为i子节点的父节点下标
  private parent(i: number): number {
    return Math.floor((i - 1) / 2)
  }

  // 从父节点i向下开始堆化
  siftDown(i: number) {
    while(true) {
      // 记录最大值下标
      // 因为是大根堆，那么父节点的值应该是最大的，开始维护
      let ma = i
      // 左子节点, 注意 索引变大了，可能越界
      let li = this.left(i)
      // 右子节点, 注意 索引变大了，可能越界
      let ri = this.right(i)
      // 判断最大节点, 左右子节点是否更大，更大的话需要交换最大索引
      if(li < this.size && this.data[ma] < this.data[li]) ma = li
      if(ri < this.size && this.data[ma] < this.data[ri]) ma = ri
      // 当前父节点就是最大的节点
      if(ma === i) break
      // 不是，那么就互换，然后继续往下
      this.swap(ma, i)
      // 继续
      i = ma
    }
  }

  // 从子节点i向上堆化
  private siftUp(i: number) {
    while(i > 0) {
      let pi = this.parent(i)
      let mi = i
      if(pi >= 0 && this.data[mi] > this.data[pi]) mi = pi

      if(mi === i) break

      this.swap(i, mi)
      i = mi
    }
  }

  private swap(i: number, j: number) {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]]
  }

  // 向堆中添加数据
  public push(val: number) {
    // 直接添加在最后面
    this.data.push(val)
    // 然后向上维护大根堆
    this.siftUp(this.size - 1)
  }
  // 取出堆中最大值
  public pop(): number | undefined {
    // 先将最大值（也就是根节点, 数组中第一个数），放到数组最后面
    this.swap(0, this.size - 1)
    // 弹出
    const val = this.data.pop()
    // 继续维护大根堆
    this.siftDown(0)
    return val
  }
  public get size(): number {
    return this.data.length
  }

  public get peek(): number {
    return this.data[0]
  }
}

function quickSort(nums: number[]): number[] {
  let n = nums.length
  if(n < 2) return nums

  function partition(nums: number[], left: number, right: number): number {
    // 取最右为基准
    const pi = right
    const pv = nums[right]
    // i 记录比基准小的边界，就是最终基准的位置
    let i=left
    for(let j=left; j<right; j++) {
      if(nums[j] < pv) {
        [nums[i], nums[j]] = [nums[j], nums[i]]
        i++
      }
    }

    // 此时，所有比基准小的数都在i的左边,交换位置
    [nums[i], nums[pi]] = [nums[pi], nums[i]]
    return i
  }

  function recursion(nums: number[], left: number, right: number) {
    if(left < right) {
      let pi = partition(nums, left, right)
      recursion(nums, left, pi-1)
      recursion(nums, pi+1, right)
    }
  }

  recursion(nums, 0, n - 1)

  return nums
}

// test quickSort
console.log(quickSort([10, 8, 9, 4, 1, 3, 6,5,7,2]))
