// 双向链表
class ListNode {
    constructor(public value: number, public next: ListNode | null = null, public prev: ListNode | null = null) {
    }
}

class DoubleLinkedList {
    private head: ListNode | null = null;
    private tail: ListNode | null = null;
    private size: number = 0;

    constructor() {
        this.head = null;
        this.tail = null;
    }
    push(value: number) {
        const node = new ListNode(value);
        if (this.head === null) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail!.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
        this.size++;
    }

    insert(value: number, index: number) {
        if (index < 0 || index > this.size) {
            throw new Error('Index out of bounds');
        }
        if (index === 0) {
            const node = new ListNode(value);
            if (this.head === null) {
                this.head = node;
                this.tail = node;
            } else {
                node.next = this.head;
                this.head.prev = node;
                this.head = node;
            }
        } else {
            let current = this.head;
            let i = 0;
            while (current !== null && i < index) {
               current = current.next;
               i++;
            }
        }
        this.size++;
    }

    remove(index: number) {
        if (index < 0 || index >= this.size) {
            throw new Error('Index out of bounds');
        }

        if (index === 0) {
            return this.removeHead()
        }

        if (index === this.size - 1) {
            return this.removeTail()
        }

        if (index > 0 && index < this.size - 1) {
            let current = this.head;
            let i = 0;
            while (current !== null && i < index) {
                current = current.next;
                i++;
            }
            current!.prev!.next = current!.next;
            current!.next!.prev = current!.prev;

            return current?.value;
        }
    }

    removeHead() {
        if (this.head === null) {
            throw new Error('List is empty');
        }
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = this.head.next;
            this.head!.prev = null;
        }
        this.size--;
        return this.head?.value;
    }

    removeTail() {
        if (this.tail === null) {
            throw new Error('List is empty');
        }
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = this.tail.prev;
            this.tail!.next = null;
        }
        this.size--;
        return this.tail?.value;
    }

    get(index: number) {
        if (index < 0 || index >= this.size) {
            throw new Error('Index out of bounds');
        }

        if (index === 0) {
            return this.head?.value;
        } else if (index === this.size - 1) {
            return this.tail?.value;
        } else {
            let current = this.head;
            let i = 0;
            while (current !== null && i < index) {
                current = current.next;
                i++;
            }
            return current?.value;
        }
    }

    find(value: number) {
        let current = this.head;
        while (current !== null) {
            if (current.value === value) {
                return current.value;
            }
            current = current.next;
        }
        return null;
    }

    print() {
        let current = this.head;
        while (current !== null) {
            console.log(current.value);
            current = current.next;
        }
    }

    reverse() {
        let current = this.head;
        while (current !== null) {
            const temp = current.prev;
            current.prev = current.next;
            current.next = temp;
            current = current.prev;
        }
    }

    getSize() {
        return this.size;
    }

    isEmpty() {
        return this.size === 0;
    }
}