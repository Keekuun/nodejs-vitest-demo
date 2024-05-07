"use strict";
class DoubleLinkNode {
    key;
    val;
    next;
    prev;
    constructor(key, val) {
        this.key = key;
        this.val = val;
        this.next = null;
        this.prev = null;
    }
}
class LRUCache {
    capacity;
    cache;
    dummy;
    constructor(capacity) {
        // 容量
        this.capacity = capacity;
        // 缓存 key, node
        this.cache = new Map();
        // 哨兵节点
        this.dummy = new DoubleLinkNode(-1, -1);
        this.dummy.next = this.dummy;
        this.dummy.prev = this.dummy;
    }
    get(key) {
        const node = this.getNode(key);
        return node ? node.val : -1;
    }
    put(key, value) {
        // 存在就更新
        let node = this.getNode(key);
        if (node) {
            node.val = value;
            return;
        }
        // 不存在
        node = new DoubleLinkNode(key, value);
        // 缓存一下
        this.cache.set(key, node);
        // 放到头部
        this.pushFront(node);
        // 判断容量
        if (this.cache.size > this.capacity) {
            // 删除尾部
            this.deleteTail();
        }
    }
    getNode(key) {
        // 不存在
        if (!this.cache.has(key)) {
            return null;
        }
        // 存在
        const node = this.cache.get(key);
        // 删除
        this.delete(node);
        // 放到头部
        this.pushFront(node);
        return node;
    }
    delete(node) {
        const prev = node.prev;
        const next = node.next;
        prev.next = next;
        next.prev = prev;
    }
    // dummy --> head
    // head <--- dummy
    // 将node插入到dummy后面
    pushFront(node) {
        const head = this.dummy.next;
        node.prev = this.dummy;
        node.next = head;
        head.prev = node;
        this.dummy.next = node;
    }
    deleteTail() {
        const tail = this.dummy.prev;
        this.delete(tail);
        this.cache.delete(tail.key);
    }
}
