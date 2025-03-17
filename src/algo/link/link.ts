class LinkNode {
  val: number;
  next: LinkNode | null;
  prev?: LinkNode | null;
  constructor(val?: number, next?: LinkNode, prev?: LinkNode) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
    this.prev = prev === undefined ? null : prev;
  }
}

// 单链表逆序
function reverseLinkedList(head: LinkNode | null): LinkNode | null {
  let pre: LinkNode | null = null;
  let cur: LinkNode | null = head;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

// 双链表逆序
function reverseDoubleLinkedList(head: LinkNode | null): LinkNode | null {
  let pre: LinkNode | null = null;
  let cur: LinkNode | null = head;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    cur.prev = next;
    pre = cur;
    cur = next;
  }
  return pre;
}

// 打印两个有序链表的公共部分
function printCommonPart(
  head1: LinkNode | null,
  head2: LinkNode | null
): void {
  let p1 = head1, p2 = head2;
  while (p1 && p2) {
    if (p1.val < p2.val) {
      p1 = p1.next;
    } else if (p1.val > p2.val) {
      p2 = p2.next;
    } else {
      console.log(p1.val);
    }
  }
}

// 判断回文链表 - 快慢指针 + 反转
function isPalindrome(head: LinkNode | null): boolean {
  if (!head || !head.next) return true;
  let fast: LinkNode | null = head, slow: LinkNode | null = head;
  while (fast.next && fast.next.next) {
    fast = fast.next.next;
    slow = slow!.next;
  }
  let p1: LinkNode | null = head, p2 = reverseLinkedList(slow!.next);
  while (p1 && p2) {
    if (p1.val !== p2.val) return false;
    p1 = p1.next;
    p2 = p2.next;
  }
  return true;
}

// 单链表划分1: 给定一个链表和一个值x，将链表划分成两个部分，一部分小于x，另一部分大于等于x
// 单链表划分2: 给定一个链表和一个值x，将链表划分成三个部分， 一部分小于x，另一部分等于x，另一部分大于x
// 思路： 递归 sh, st, eh,et, bh, bt
function partition(head: LinkNode | null, x: number) {
  if (!head || !head.next) return head;


  function help() {

  }


}

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
