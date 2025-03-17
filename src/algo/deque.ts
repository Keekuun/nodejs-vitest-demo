// 双端队列
class ListNode {
    constructor(public value: number, public next: ListNode | null = null, public prev: ListNode | null = null) {
    }
}

class Deque {
    // front rear size isEmpty pushFront pushRear popFront popRear peekFront peekRear isEmpty toArray

    private head: ListNode | null;
    private tail: ListNode | null;
    private size: number;
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    pushFront(val: number) {
        const node = new ListNode(val);
        if (this.head === null) {
            this.head = node;
            this.tail = node;
        } else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
        this.size++;
    }

    pushRear(val: number) {
        const node = new ListNode(val);
        if (this.tail === null) {
            this.head = node;
            this.tail = node;
        } else {
            node.prev = this.tail;
            this.tail.next = node;
            this.tail = node;
        }
        this.size++;
    }

    popFront() {
        if (this.head === null) {
            return null;
        }
        const val = this.head.value;
        this.head = this.head.next;
        if (this.head !== null) {
            this.head.prev = null;
        } else {
            this.tail = null;
        }
        this.size--;
        return val;
    }

    popRear() {
        if (this.tail === null) {
            return null;
        }
        const val = this.tail.value;
        this.tail = this.tail.prev;
        if (this.tail !== null) {
            this.tail.next = null;
        } else {
            this.head = null;
        }
        this.size--;
        return val;
    }

    peekFront() {
        if (this.head === null) {
            return null;
        }
        return this.head.value;
    }

    peekRear() {
        if (this.tail === null) {
            return null;
        }
        return this.tail.value;
    }

    isEmpty() {
        return this.size === 0;
    }

    getSize() {
        return this.size;
    }

    toArray() {
        const arr: number[] = [];
        let cur = this.head;
        while (cur !== null) {
            arr.push(cur.value);
            cur = cur.next;
        }
        return arr;
    }
}