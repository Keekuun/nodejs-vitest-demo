// https://leetcode.cn/problems/top-k-frequent-elements/description/
// 前k个高频元素
// 输入: nums = [1,1,1,2,2,3], k = 2
// 输出: [1,2]

// 暴力法
function topKFrequent1(nums: number[], k: number): number[] {
  // 1.统计元素个数
  const m = new Map<number, number>()
  for(let d of nums) {
    m.set(d, (m.get(d) || 0) + 1)
  }
  // 2.取出并记录个数 [值，数量]
  const arr: number[][] = []
  for(let d of m.entries()) {
    arr.push(d)
  }

  // 3.排序
  return arr.sort((a, b) => b[1] - a[1]).slice(0, k).map(d => d[0])
}

// 大根堆
function topKFrequent2(nums: number[], k: number): number[] {
  // 0.统计数量
  const m = new Map<number, number>()
  for(let d of nums) m.set(d, (m.get(d) || 0) + 1)
  const arr:number[][] = []
  for(let dd of m.entries()) {
    arr.push(dd)
  }
  // 1.维护k个大小的小根堆，优先级就是元素出现的个数
  const mp = new MaxHeap<number[]>(arr.slice(0, k), (a, b) => b[1] - a[1])
  // 2.取前K个数放到堆中
  // for(let i=0; i<k; i++) {
  //   mp.push(arr[i])
  // }
  // 3.将剩余的数依次和堆顶元素放到堆中，并保持堆的大小为k
  for(let i=k; i<arr.length; i++) {
    mp.push(arr[i])
    mp.pop()
  }

  // 取出
  const ans: number[] = []
  while(mp.size > 0) {
    ans.push(mp.pop()[0])
  }

  return ans
}

class MaxHeap<T> {
  private readonly data:T[]
  private readonly compareFn?: (a: T, b: T) => number
  constructor(nums?: T[], compareFn?: (a: T, b: T) => number) {
    this.data = nums ?? []
    this.compareFn = compareFn

    if(nums) {
      // 堆化
      for(let i=this.parent(nums.length - 1); i>=0; i--) {
        this.siftDown(i)
      }
    }
  }

  private compare(a: T, b: T): number {
    if (this.compareFn) {
      return this.compareFn(a, b)
    } else if (typeof a === 'number' && typeof b === 'number') {
      return a - b
    } else {
      throw new Error('请传入 compareFn 或 number数组');
    }
  }

  public push(v: T) {
    this.data.push(v)
    this.siftUp(this.size - 1)
  }

  public pop(): T {
    if(this.size === 0) {
      throw new RangeError('There is no data')
    }
    this.swap(0, this.size - 1)
    const v = this.data.pop()!
    this.siftDown(0)
    return v
  }

  private siftUp(i: number) {
    while(i > 0 && this.compare(this.data[this.parent(i)], this.data[i]) < 0) {
      this.swap(i, this.parent(i))
      i = this.parent(i)
    }
  }

  private siftDown(i: number) {
    while(true) {
      let ma = i
      let li = this.left(i)
      let ri = this.right(i)

      if(li < this.size && this.compare(this.data[li], this.data[ma]) > 0) {
        ma = li
      }
      if(ri < this.size && this.compare(this.data[ri], this.data[ma]) > 0) {
        ma = ri
      }
      if(ma === i) break

      this.swap(ma, i)
      i = ma
    }
  }

  private swap(i: number, j: number) {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]]
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
  public get size(): number {
    return this.data.length
  }
  public get peek(): T {
    return this.data[0]
  }
}

// 快速选择
function topKFrequent3(nums: number[], k: number): number[] {
  const m = new Map<number, number>()
  for(let d of nums) {
    m.set(d, (m.get(d) || 0) + 1)
  }

  const arr = Array.from(m.entries())

  quickSelect(arr, 0, arr.length - 1, k - 1)
  return arr.slice(0, k).map(d => d[0])
}

function swap(nums: number[][], i: number, j: number) {
  [nums[i], nums[j]] = [nums[j], nums[i]]
}

function quickSelect(nums: number[][], left: number, right: number, k: number) {
  if(left >= right) return
  let i = left
  for(let j=left; j<right; j++) {
    if(nums[j][1] >= nums[right][1]) {
      swap(nums, i, j)
      i++
    }
  }
  swap(nums, i, right)

  // 此时：[left, i]大于等于基准 [i+1, right] 小于基准
  if(i === k) {
    return
  }
  if(i > k) {
    quickSelect(nums, left, i - 1, k)
  } else {
    quickSelect(nums, i+1, right, k)
  }
}

// 桶排序
function topKFrequent4(nums: number[], k: number): number[] {
  const m = new Map<number, number>()
  let maxFre = 1
  for(let d of nums) {
    m.set(d, (m.get(d) || 0) + 1)
    maxFre = maxFre < m.get(d)! ? m.get(d)! : maxFre
  }

  const buckets: number[][] =  new Array(maxFre + 1).fill(null).map(() => [])
  Array.from(m.entries()).forEach(d => {
    buckets[d[1]].push(d[0])
  })

  const ans: number[] = []
  for(let i=maxFre; i>=0; i--) {
    if(ans.length >= k) break
    if(buckets[i].length) {
      ans.push(...buckets[i])
    }
  }

  return ans
}
