// 单链表逆序

// 双链表逆序

// 打印两个有序链表的公共部分

// 判断回文链表 - 快慢指针 + 反转

// 单链表划分1: 给定一个链表和一个值x，将链表划分成两个部分，一部分小于x，另一部分大于等于x
// 单链表划分2: 给定一个链表和一个值x，将链表划分成三个部分， 一部分小于x，另一部分等于x，另一部分大于x
// 思路： sh, st, eh,et, bh, bt

// 复制含有随机指针的链表： 1.哈希表 2. 节点间复制关系
class Node {
  val: number;
  next: Node | null;
  random: Node | null;
  constructor(val?: number, next?: Node, random?: Node) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
    this.random = random === undefined ? null : random;
  }
}

// 求入环节点
// 思路：快慢指针 + 快指针追上慢指针
function detectCycle(head: Node | null): Node | null {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      let ptr = head;
      while (ptr !== slow) {
        ptr = ptr!.next;
        slow = slow!.next;
      }
      return ptr;
    }
  }
  return null;
}

// 两个链表相交的节点： 有环 无环 怎么找？
// 都无环、都有环：有可能相交
// 一个有环一个无环： 不可能相交
function getIntersectionNode(headA: Node | null, headB: Node | null): Node | null {
  let p1 = headA, p2 = headB;
  while (p1 !== p2) {
    p1 = p1 ? p1.next : headB;
    p2 = p2 ? p2.next : headA;
  }
  return p1;
}
