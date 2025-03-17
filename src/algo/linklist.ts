class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null) {
        this.val = val === undefined ? 0 : val
        this.next = next === undefined ? null : next
    }
}

const arr = [1, 2, 3, 4, 5]

const head = new ListNode(0)
for (const number of arr) {
    head.next = new ListNode(number)
}

class LinkedList {
    head: ListNode | null

    constructor() {
        this.head = null
    }

    add(val: number) {
        if (this.head === null) {
            this.head = new ListNode(val)
        } else {
            let cur = this.head
            while (cur.next !== null) {
                cur = cur.next
            }
            cur.next = new ListNode(val)
        }
    }

    insert(val: number, index: number) {
        if (index === 0 || this.head === null) {
            this.head = new ListNode(val, this.head)
            return
        }

        let cur: ListNode | null = this.head
        while (index > 0 && cur !== null) {
            index--
            if (index === 0) {
                const next = cur.next
                cur.next = new ListNode(val, next)
                break
            }
            cur = cur.next
        }
        if (cur === null) {
            console.log('index out of range')
            // 插入尾部
            this.add(val)
        }
    }

    remove(index: number) {
        if (index === 0) {
            this.removeHead()
            return
        }
        let cur: ListNode | null = this.head
        while (index > 0 && cur !== null) {
            index--
            if (index === 0) {
                cur.next = cur.next?.next || null
                break
            }
            cur = cur.next
        }
        console.log('remove', cur, index)
        if (cur === null) {
            // 删除尾部
            this.removeTail()
        }
    }

    removeHead() {
        this.head = this.head?.next || null
    }
    removeTail() {
        let cur: ListNode | null = this.head
        while (cur !== null) {
            if (cur.next?.next === null) {
                cur.next = null
                break
            }
        }
    }

    get(index: number) {
        let cur = this.head
        while (index > 0 && cur !== null) {
            index--
            cur = cur.next
        }
        return cur
    }

    find(val: number) {
        let cur = this.head
        let index = 0
        while (cur !== null) {
            if (cur.val === val) {
                return index
            }
            cur = cur.next
            index++
        }
        return -1
    }

    print() {
        let cur = this.head
        while (cur !== null) {
            console.log(cur.val)
            cur = cur.next
        }
    }

    reverse() {
        let cur: ListNode | null = this.head
        let prev: ListNode | null = null
        while (cur !== null) {
            const next = cur.next
            cur.next = prev
            prev = cur
            cur = next
        }
        this.head = prev
    }
}

const linkedList = new LinkedList()
linkedList.add(1)
linkedList.add(2)
linkedList.add(3)
linkedList.add(4)
linkedList.add(5)

linkedList.print()

console.log('###########reverse############')
linkedList.reverse()
linkedList.print()

console.log('###########insert############')

linkedList.insert(6, 2)
linkedList.print()

console.log('###########remove############')
linkedList.remove(8)
linkedList.print()

