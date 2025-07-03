// 完全二叉堆
// 大顶堆、小顶堆
// 优先队列、堆排序、获取最大的K个数、获取最小的K个数

class Heap {
    // push pop peek size isEmpty
    readonly #maxHeap: number[]

    constructor(arr: number[]) {
        this.#maxHeap = [...arr];

        for (let i = this.#parent(this.#maxHeap.length - 1); i >= 0; i--) {
            this.#siftDown(i);
        }
    }

    // 获取父节点
    #parent(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    // 获取左子节点
    #left(i: number): number {
        return i * 2 + 1;
    }

    // 获取右子节点
    #right(i: number): number {
        return i * 2 + 2;
    }

    #siftDown(i: number) {
        const n = this.#maxHeap.length;
        while (true) {
            let maxIndex = i;
            if (this.#left(i) < n && this.#maxHeap[this.#left(i)] > this.#maxHeap[maxIndex]) {
                maxIndex = this.#left(i);
            }
            if (this.#right(i) < n && this.#maxHeap[this.#right(i)] > this.#maxHeap[maxIndex]) {
                maxIndex = this.#right(i);
            }

            if (maxIndex === i) break;

            [this.#maxHeap[i], this.#maxHeap[maxIndex]] = [this.#maxHeap[maxIndex], this.#maxHeap[i]];
            i = maxIndex;
        }
    }

    #siftUp(i: number) {
        while (i > 0 && this.#maxHeap[this.#parent(i)] < this.#maxHeap[i]) {
            [this.#maxHeap[i], this.#maxHeap[this.#parent(i)]] = [this.#maxHeap[this.#parent(i)], this.#maxHeap[i]];
            i = this.#parent(i);
        }
    }

    push(val: number) {
        this.#maxHeap.push(val);
        this.#siftUp(this.#maxHeap.length - 1);
    }

    pop(): number {
        if (this.#maxHeap.length === 0) {
            throw new Error('heap underflow');
        }

        [this.#maxHeap[0], this.#maxHeap[this.#maxHeap.length - 1]] = [this.#maxHeap[this.#maxHeap.length - 1], this.#maxHeap[0]];
        const max = this.#maxHeap.pop()!;
        this.#siftDown(0);

        return max;
    }

    peek(): number {
        if (this.#maxHeap.length === 0) {
            throw new Error('heap underflow');
        }

        return this.#maxHeap[0];
    }

    size(): number {
        return this.#maxHeap.length;
    }

    isEmpty(): boolean {
        return this.#maxHeap.length === 0;
    }

    toArray(): number[] {
        return [...this.#maxHeap];
    }

    toString(): string {
        return this.#maxHeap.toString();
    }

    clear() {
        this.#maxHeap.length = 0;
    }
}

function heapSort(arr: number[]): number[] {
    const heap = new Heap(arr);

    const sorted: number[] = [];
    while (!heap.isEmpty()) {
        sorted.push(heap.pop());
    }
    return sorted.reverse(); // 因为 pop 是从大到小，所以需要反转
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const heap = new Heap(arr);
console.log(heap.toArray())
heap.pop()
console.log(heap.toArray())
console.log(heapSort(arr));
