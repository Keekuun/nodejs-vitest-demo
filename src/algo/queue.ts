class ListNode {
    constructor(public val: number, public next: ListNode | null = null) {
    }
}

class Queue {
    #head: ListNode | null = null;
    #tail: ListNode | null = null;
    #size: number = 0;

    get size() {
        return this.#size;
    }

    get head() {
        return this.#head?.val ?? null;
    }

    get tail() {
        return this.#tail?.val ?? null;
    }

    enqueue(val: number) {
        const node = new ListNode(val);
        if (this.#size === 0) {
            this.#head = node;
            this.#tail = node;
        } else {
            this.#tail!.next = node;
            this.#tail = node;
        }
        this.#size++;
    }

    dequeue(): number | null {
        if (this.#size === 0) {
            return null;
        }
        const val = this.#head!.val;
        this.#head = this.#head!.next;
        this.#size--;
        return val;
    }

    toArray(): number[] {
        const arr: number[] = [];
        let curr = this.#head;
        while (curr) {
            arr.push(curr.val);
            curr = curr.next;
        }
        return arr;
    }

    isEmpty(): boolean {
        return this.#size === 0;
    }
}

const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.enqueue(4);
queue.enqueue(5);

console.log(queue.toArray())
console.log(queue.head)
console.log(queue.tail)
console.log(queue.size)

console.log(queue.dequeue())
console.log(queue.toArray())