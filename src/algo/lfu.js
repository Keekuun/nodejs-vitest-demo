"use strict";
class DoubleLinkedNode {
    key;
    val;
    frq;
    next;
    prev;
    constructor(key, val) {
        this.key = key;
        this.val = val;
        this.frq = 1; // 使用频率
        this.next = null;
        this.prev = null;
    }
}
class LFUCache {
    capacity;
    cache;
    counter;
    minFrq;
    constructor(capacity) {
        // 容量
        this.capacity = capacity;
        // 缓存
        this.cache = new Map();
        // 使用频率缓存 key: 频率 value: DoubleLinkedList
        this.counter = new Map();
        // 使用最少的频率
        this.minFrq = 0;
    }
    get(key) {
        const node = this.getNode(key);
        return node ? node.val : -1;
    }
    put(key, value) {
        let node = this.getNode(key);
        if (node) {
            // 存在
            node.val = value;
            return;
        }
        // 判断容量
        if (this.cache.size === this.capacity) {
            // 删除
            this.deleteMinFrq();
        }
        // 创建
        node = new DoubleLinkedNode(key, value);
        this.minFrq = 1;
        // 插入缓存
        this.insert(node);
        this.cache.set(key, node);
    }
    getNode(key) {
        if (!this.cache.has(key)) {
            return null;
        }
        const node = this.cache.get(key);
        const frq = node.frq;
        // 删除
        this.delete(node);
        const dummy = this.counter.get(frq);
        // 维护min
        if (dummy.prev === dummy) {
            // 移除空链表
            this.counter.delete(frq);
            if (this.minFrq === frq) {
                this.minFrq++;
            }
        }
        // 更新frq并插入
        node.frq++;
        this.insert(node);
        return node;
    }
    delete(node) {
        const prev = node.prev;
        const next = node.next;
        prev.next = next;
        next.prev = prev;
        node.next = null;
        node.prev = null;
    }
    newList() {
        const dummy = new DoubleLinkedNode(-1, -1);
        dummy.next = dummy;
        dummy.prev = dummy;
        return dummy;
    }
    // 插入到头部
    // 1: dummy --> a --> b
    // 2: dummy --> c --> d
    insert(node) {
        const frq = node.frq;
        let dummy = this.counter.get(frq);
        if (!dummy) {
            dummy = this.newList();
            this.counter.set(frq, dummy);
        }
        const head = dummy.next;
        node.prev = dummy;
        node.next = head;
        head.prev = node;
        dummy.next = node;
    }
    deleteMinFrq() {
        const dummy = this.counter.get(this.minFrq);
        const tail = dummy.prev;
        this.delete(tail);
        this.cache.delete(tail.key);
        // 移除空链表
        if (dummy.prev === dummy) {
            this.counter.delete(this.minFrq);
        }
    }
}
/**
 * Your LFUCache object will be instantiated and called as such:
 * var obj = new LFUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */ 
