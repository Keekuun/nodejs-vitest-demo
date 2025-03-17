class ListNode {
    constructor(public value: number, public next: ListNode | null = null) {
    }
}

class LinkedListStack {
    private _peek: ListNode | null = null
    private _size: number = 0

    get peek(): number | null {
        return this._peek?.value || null
    }

    get size(): number {
        return this._size
    }

    isEmpty(): boolean {
        return this.size === 0
    }

    // 入栈
    push(val: number) {
        const node = new ListNode(val)
        node.next = this._peek
        this._peek = node
        this._size++
    }

    // 出栈
    pop(): number | null {
        if(this.size === 0) {
            return null
        }

        const peekNode = this._peek
        this._peek = this._peek?.next || null
        this._size--
        return peekNode?.value || null
    }

    // 转为数组
    toArray(): number[] {
        const arr: number[] = new Array<number>(this.size)
        let cur = this._peek
        let index = this.size - 1
        while(cur) {
            arr[index] = cur.value
            cur = cur.next
            index--
        }
        return arr
    }

    print() {
        console.log(this.toArray())
    }
}

const stack = new LinkedListStack()
stack.push(1)
stack.push(2)
stack.push(3)
stack.push(4)
stack.print()

console.log(stack.pop())
stack.print()

console.log(stack.peek)

stack.push(5)
stack.print()

console.log(stack.peek)