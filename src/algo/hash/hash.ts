// 哈希函数
// 特征：离散性、均匀性
// 碰撞：两个不同的字符串可能产生相同的哈希值
export const hash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 10) - hash);
  }
  return hash;
};

console.log(hash('1'))
console.log(hash('10'))
console.log(hash('20'))

// 设计 RandomPool 类，实现如下功能：
// 1. 添加一个元素到 RandomPool 中，保证每个元素的值不重复。
// 2. 从 RandomPool 中删除一个元素。
// 3. 从 RandomPool 中随机返回一个元素。
// leetcode 381

class RandomPool {
  private map: Map<string, number> = new Map(); // 存储元素和索引
  private arr: string[] = []; // 存储元素

  insert(str: string) {
    if (this.map.has(str)) return;
    this.map.set(str, this.arr.length);
    this.arr.push(str);
  }

  delete(str: string) {
    if (!this.map.has(str)) return;
    const index = this.map.get(str)!;

    // 将尾部元素放到 index 位置
    const last = this.arr[this.arr.length - 1];
    this.map.set(last, index);
    this.arr[index] = last;

    // 删除尾部元素
    this.arr.pop();
  }

  getRandom() {
    const index = Math.floor(Math.random() * this.arr.length);
    return this.arr[index];
  }

  getAll() {
    return this.arr;
  }
}

const pool = new RandomPool();
pool.insert('1')
pool.insert('2')
pool.insert('3')

console.log(pool.getRandom())
console.log(pool.getAll())
pool.delete('2')
console.log(pool.getAll())


// 一致性哈希算法

