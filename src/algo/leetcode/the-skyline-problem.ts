// https://leetcode.cn/problems/the-skyline-problem/description/
// 天际线问题
/**
 * 城市的 天际线 是从远处观看该城市中所有建筑物形成的轮廓的外部轮廓。给你所有建筑物的位置和高度，请返回 由这些建筑物形成的 天际线 。
 *
 * 每个建筑物的几何信息由数组 buildings 表示，其中三元组 buildings[i] = [lefti, righti, heighti] 表示：
 *
 * lefti 是第 i 座建筑物左边缘的 x 坐标。
 * righti 是第 i 座建筑物右边缘的 x 坐标。
 * heighti 是第 i 座建筑物的高度。
 * 你可以假设所有的建筑都是完美的长方形，在高度为 0 的绝对平坦的表面上。
 *
 * 天际线 应该表示为由 “关键点” 组成的列表，格式 [[x1,y1],[x2,y2],...] ，并按 x 坐标 进行 排序 。关键点是水平线段的左端点。列表中最后一个点是最右侧建筑物的终点，y 坐标始终为 0 ，仅用于标记天际线的终点。此外，任何两个相邻建筑物之间的地面都应被视为天际线轮廓的一部分。
 *
 * 注意：输出天际线中不得有连续的相同高度的水平线。例如 [...[2 3], [4 5], [7 5], [11 5], [12 7]...] 是不正确的答案；三条高度为 5 的线应该在最终输出中合并为一个：[...[2 3], [4 5], [12 7], ...]
 * */

// 输入：buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
// 输出：[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]

// 超时了吗
function getSkyline1(buildings: number[][]): number[][] {
    // 时间复杂度分析：
    // 1. 构建事件数组：O(n)，n为建筑物数量
    // 2. 排序事件：O(n log n)，最耗时的部分
    // 3. 处理每个事件：O(n)，但计算最大高度使用了O(n)操作（Math.max(...heights.keys())）
    // 因此总时间复杂度为 O(n log n + n^2) = O(n^2)

    // 空间复杂度分析：
    // 1. events数组：O(n)
    // 2. heights映射：O(n)（最坏情况每个建筑高度都不同）
    // 3. result结果数组：O(n)
    // 总空间复杂度为 O(n)

    const events: number[][] = [];
    for (const [left, right, height] of buildings) {
        events.push([left, -height]); // 左边界，负高度表示开始
        events.push([right, height]); // 右边界，正高度表示结束
    }

    // 按照位置排序，位置相同的情况下，先处理左边界（负高度）
    events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    const result: number[][] = [];
    const heights: Map<number, number> = new Map(); // 高度 -> 计数
    let prevHeight = 0;

    for (const [pos, height] of events) {
        if (height < 0) { // 左边界
            heights.set(-height, (heights.get(-height) || 0) + 1);
        } else { // 右边界
            const count = heights.get(height);
            if (count !== undefined) {
                if (count === 1) {
                    heights.delete(height);
                } else {
                    heights.set(height, count - 1);
                }
            }
        }

        // 优化点：这里每次都要遍历所有键找最大值，效率低
        // 优化点：使用最大堆（优先队列）来维护当前最大高度，避免每次遍历所有键
        const currentHeight = heights.size > 0 ? Math.max(...heights.keys()) : 0;

        if (currentHeight !== prevHeight) {
            result.push([pos, currentHeight]);
            prevHeight = currentHeight;
        }
    }

    return result;
}

// 大根堆实现
class MaxHeap<T> {

    constructor(private readonly data: T[], private readonly compareFn?: (a: T, b: T) => number) {
        if (data.length > 0) {
            // 堆化
            for (let i = this.parent(this.size - 1); i >= 0; i--) {
                this.siftDown(i);
            }
        }
    }

    private compare(a: T, b: T): number {
        if (this.compareFn) {
            return this.compareFn(a, b);
        }
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        }
        throw Error('params should be number data or need compareFn');
    }

    private parent(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    private left(i: number): number {
        return i * 2 + 1;
    }

    private right(i: number): number {
        return i * 2 + 2;
    }

    private swap(i: number, j: number) {
        [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }

    private siftUp(i: number) {
        while (i > 0) {
            const pi = this.parent(i);
            if (pi < 0 || this.compare(this.data[i], this.data[pi]) <= 0) {
                break;
            }
            this.swap(pi, i);
            i = pi;
        }
    }

    private siftDown(i: number) {
        while (true) {
            let ma = i;
            const li = this.left(i);
            const ri = this.right(i);

            if (li < this.size && this.compare(this.data[li], this.data[ma]) > 0) ma = li;
            if (ri < this.size && this.compare(this.data[ri], this.data[ma]) > 0) ma = ri;
            if (ma === i) break;

            this.swap(ma, i);
            i = ma;
        }
    }

    get size(): number {
        return this.data.length;
    }

    get peek(): T {
        if (this.size === 0) {
            throw new RangeError('Heap is empty');
        }
        return this.data[0];
    }

    public push(v: T) {
        this.data.push(v);
        this.siftUp(this.size - 1);
    }

    public pop(): T {
        if (this.size === 0) {
            throw new RangeError('Heap is empty');
        }
        this.swap(0, this.size - 1);
        const max = this.data.pop()!;
        this.siftDown(0);
        return max;
    }
    /**
     * 从堆中移除指定的值
     * @param value 要移除的值
     * @returns 如果成功移除返回 true，否则返回 false
     */
    public remove(value: T): boolean {
        // 利用 compare 来查找值
        const index = this.data.findIndex((v) => this.compare(v, value) === 0);
        if (index === -1) return false;

        this.swap(index, this.size - 1);
        this.data.pop();

        if (index === this.size) return true;

        this.siftDown(index);
        this.siftUp(index);
        return true;
    }
}

// 排序 + 最大堆实现
function getSkyline2(buildings: number[][]): number[][] {
    // 使用优先队列（最大堆）来优化高度的获取
    // 时间复杂度分析：
    // 1. 构建事件数组：O(n)，n为建筑物数量
    // 2. 排序事件：O(n log n)，最耗时的部分
    // 3. 处理每个事件：O(n log n)，每次获取最大高度和插入/删除堆的操作
    // 因此总时间复杂度为 O(n log n)

    const events: number[][] = [];
    for (const [left, right, height] of buildings) {
        events.push([left, -height]); // 左边界，负高度表示开始
        events.push([right, height]); // 右边界，正高度表示结束
    }

    // 按照位置排序，位置相同的情况下，先处理左边界（负高度）
    events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    const result: number[][] = [];
    const mh = new MaxHeap<number>([], (a: number, b: number) => a - b); // 最大堆

    let prevHeight = 0;
    for (const [pos, height] of events) {
        if (height < 0) { // 左边界
            mh.push(-height); // 将负高度转为正高度存入堆
        } else { // 右边界
            mh.remove(height); // 从堆中移除对应的高度
        }

        const currentHeight = mh.size > 0 ? mh.peek : 0; // 获取当前最大高度

        if (currentHeight !== prevHeight) {
            result.push([pos, currentHeight]);
            prevHeight = currentHeight;
        }
    }
    return result;
}


// 使用归并排序的方式来处理天际线问题
function getSkyline3(buildings: number[][]): [number, number][] {
    // 时间复杂度分析：
    // 1. 分治合并：O(n log n)
    // 2. 合并过程中处理高度：O(n)
    // 总时间复杂度为 O(n log n)

    // 空间复杂度分析：
    // 1. 分治过程中需要额外的空间来存储结果：O(n)
    // 2. 合并过程中使用的临时数组：O(n)
    // 总空间复杂度为 O(n)
    /**
     * 合并两个天际线。
     * @param skyline1 第一个天际线
     * @param skyline2 第二个天际线
     * @returns 合并后的天际线
     */
    const merge = (skyline1: [number, number][], skyline2: [number, number][]) => {
        let h1 = 0, h2 = 0;
        let i = 0, j = 0;

        const res: [number, number][] = [];

        // while (i < skyline1.length || j < skyline2.length) {
        //     let x = 0, h = 0;
        //
        //     if (i >= skyline1.length || j < skyline2.length && skyline2[j][0] < skyline1[i][0]) {
        //         x = skyline2[j][0]; h2 = skyline2[j][1]; j++;
        //     } else if (j >= skyline2.length || i< skyline1.length && skyline1[i][0] < skyline2[j][0]) {
        //         x = skyline1[i][0]; h1 = skyline1[i][1]; i++;
        //     } else {
        //         x = skyline1[i][0]; h1 = skyline1[i][1]; h2 = skyline2[j][1]; i++; j++;
        //     }
        //
        //     h = Math.max(h1, h2);
        //     if (res.length === 0 || res[res.length - 1][1] !== h) {
        //         res.push([x, h]);
        //     }
        //
        // }

        while(i < skyline1.length && j < skyline2.length) {
            let x, h;
            // 如果skyline1的x小于skyline2的x,取skyline1的x和高度
            if (skyline1[i][0] < skyline2[j][0]) {
                x = skyline1[i][0];
                h1 = skyline1[i][1];
                i++;
            } else if (skyline1[i][0] > skyline2[j][0]) {
                // 如果skyline1的x大于skyline2的x,取skyline2的x和高度
                x = skyline2[j][0];
                h2 = skyline2[j][1];
                j++;
            } else {
                // 如果skyline1的x等于skyline2的x,取两个高度的最大值
                x = skyline1[i][0];
                h1 = skyline1[i][1];
                h2 = skyline2[j][1];
                i++;
                j++;
            }

            h = Math.max(h1, h2);
            // 如果结果数组为空或者最后一个高度不等于当前高度，则添加当前点
            if (res.length === 0 || res[res.length - 1][1] !== h) {
                res.push([x, h]);
            }
        }

        // 处理剩余的天际线
        while (i < skyline1.length) {
            const x = skyline1[i][0];
            const h = skyline1[i][1];
            if (res.length === 0 || res[res.length - 1][1] !== h) {
                res.push([x, h]);
            }
            i++;
        }
        while (j < skyline2.length) {
            const x = skyline2[j][0];
            const h = skyline2[j][1];
            if (res.length === 0 || res[res.length - 1][1] !== h) {
                res.push([x, h]);
            }
            j++;
        }

        return res;
    };

    /**
     * 递归地分割建筑列表并合并天际线。
     */
    const getSkylineRecursive = (buildings: number[][], left: number, right: number): [number, number][] => {
        if (left > right) return [];
        if (left === right) return [[buildings[left][0], buildings[left][2]], [buildings[left][1], 0]];
        const mid = Math.floor((left + right) / 2);
        const lSkyline = getSkylineRecursive(buildings, left, mid);
        const rSkyline = getSkylineRecursive(buildings, mid + 1, right);
        return merge(lSkyline, rSkyline);
    };

    return getSkylineRecursive(buildings, 0, buildings.length - 1);
}

// 测试用例
const buildings1 = [[2, 9, 10], [3, 7, 15], [5, 12, 12], [15, 20, 10], [19, 24, 8]]; // [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
const buildings2 = [[1,2,1],[1,2,2],[1,2,3]] // [[1,3],[2,0]]
console.log(getSkyline1(buildings1));
console.log(getSkyline2(buildings1));
console.log(getSkyline3(buildings1));
