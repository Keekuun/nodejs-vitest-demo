// https://leetcode.cn/problems/sliding-window-maximum/description/
// 滑动窗口最大值
// 输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
// 输出：[3,3,5,5,6,7]
function maxSlidingWindow(nums: number[], k: number): number[] {
  return []
}

// 单调队列
function maxSlidingWindow1(nums: number[], k: number): number[] {
  const n = nums.length
  const ans: number[] = []
  // 队列记录的是下标, 并且队首记录的是当前队列最大值对应的索引，后续递减
  const queue: number[] = []
  // 前k个
  for(let i=0; i<k; i++) {
    // 如果新来的数更大，就把之前的删除，保持单调性
    while(queue.length > 0 && nums[i] >= nums[queue[queue.length - 1]]) {
      queue.pop()
    }
    queue.push(i)
  }
  ans.push(nums[queue[0]])
  // 继续滑动
  for(let i=k; i<n; i++) {
    while(queue.length > 0 && nums[i] >= nums[queue[queue.length - 1]]) {
      queue.pop()
    }
    queue.push(i)
    // 判断队首是否越界
    while(i - queue[0] + 1 > k) {
      queue.shift()
    }
    ans.push(nums[queue[0]])
  }
  return ans
}

// 大根堆
function maxSlidingWindow2(nums: number[], k: number): number[] {
  const ans: number[] = []

  // 前k个数建立大根堆
  type HeapItem = {value: number, index: number}
  const mp = new MaxHeap<HeapItem>({data: nums.slice(0, k).map((value, index) => ({value, index})), compareFn: (a: HeapItem, b: HeapItem) => a.value - b.value})
  ans.push(mp.peek.value)

  for(let i= k; i<nums.length; i++) {
    mp.push({value: nums[i], index: i})

    // 把超出k范围的数删除
    while(i - mp.peek.index + 1 > k) {
      mp.pop()
    }

    ans.push(mp.peek.value)
  }

  return ans
}

class MaxHeap<T> {
  private readonly data: T[]
  private readonly compareFn?:(a: T, b: T) => number
  constructor(params: { data?: T[], compareFn?: (a: T, b: T) => number}) {
    this.data = params.data ?? []
    this.compareFn = params.compareFn

    for(let i= this.parent(this.size - 1); i>=0; i--) {
      this.siftDown(i)
    }
  }

  private compare(a: T, b: T) {
    if(this.compareFn) {
      return this.compareFn(a, b)
    }
    if(typeof a === 'number' && typeof b === 'number') {
      return a - b
    }
    throw Error('params should be number data or need compareFn')
  }

  private parent(i: number): number {
    return Math.floor((i - 1) / 2)
  }

  private left(i: number): number {
    return i * 2 + 1
  }

  private right(i: number): number {
    return i * 2 + 2
  }

  private swap(i: number, j: number) {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]]
  }

  private siftUp(i: number) {
    while(i > 0) {
      let pi = this.parent(i)
      if(pi < 0 || this.compare(this.data[i], this.data[pi]) <= 0) {
       break
      }
      this.swap(pi, i)
      i = pi
    }
  }

  private siftDown(i: number) {
    while(true) {
      let ma = i
      let li = this.left(i)
      let ri = this.right(i)

      if(li < this.size && this.compare(this.data[li], this.data[ma]) > 0) ma = li
      if(ri < this.size && this.compare(this.data[ri], this.data[ma]) > 0) ma = ri

      if(ma === i) break

      this.swap(ma, i)
      i = ma
    }
  }

  public push(value: T) {
    this.data.push(value)
    this.siftUp(this.size - 1)
  }

  public pop(): T {
    if(this.size === 0) {
      throw new Error('data is empty')
    }
    this.swap(0, this.size - 1)
    const m = this.data.pop()!
    this.siftDown(0)
    return m
  }

  get peek(): T {
    return this.data[0]
  }

  get size(): number {
     return this.data.length
  }
}

console.log(maxSlidingWindow1([1,3,-1,-3,5,3,6,7], 3))
console.log(maxSlidingWindow2([1,3,-1,-3,5,3,6,7], 3))

