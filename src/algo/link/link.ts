class LinkNode {
  val: number;
  next: LinkNode | null;
  prev?: LinkNode | null;
  constructor(val?: number, next?: LinkNode | null, prev?: LinkNode | null) {
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
function partition(head: LinkNode | null, x: number): LinkNode | null {
  if (!head || !head.next) return head;
  // 创建两个虚拟头节点
  const smallHead = new LinkNode(0);
  const largeHead = new LinkNode(0);
  let small = smallHead;
  let large = largeHead;
  let current: LinkNode | null = head;
  while (current) {
    if (current.val < x) {
      small.next = current;
      small = small.next;
    } else {
      large.next = current;
      large = large.next;
    }
    current = current.next;
  }
  // 合并两个链表
  small.next = largeHead.next;
  large.next = null; // 防止链表成环
  return smallHead.next;
}

function partitionThreeParts(head: LinkNode | null, x: number): LinkNode | null {
  if (!head || !head.next) return head;

  // 创建三个虚拟头节点
  const smallHead = new LinkNode(0);
  const equalHead = new LinkNode(0);
  const largeHead = new LinkNode(0);
  let small = smallHead;
  let equal = equalHead;
  let large = largeHead;
  let current: LinkNode | null = head;

  while (current) {
    if (current.val < x) {
      small.next = current;
      small = small.next;
    } else if (current.val === x) {
      equal.next = current;
      equal = equal.next;
    } else {
      large.next = current;
      large = large.next;
    }
    current = current.next;
  }

  // 合并三个链表
  small.next = equalHead.next || largeHead.next;
  equal.next = largeHead.next;
  large.next = null; // 防止链表成环

  return smallHead.next;
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

// 方法 1：哈希表法
function copyRandomList1(head: Node | null): Node | null {
  if (!head) return null;
  const map = new Map<Node, Node>();
  let current: Node | null = head;
  // 第一次遍历：创建新节点并建立映射关系
  while (current) {
    map.set(current, new Node(current.val));
    current = current.next;
  }
  // 第二次遍历：设置新节点的 next 和 random 指针
  current = head;
  while (current) {
    const newNode = map.get(current)!;
    newNode.next = current.next ? map.get(current.next)! : null;
    newNode.random = current.random ? map.get(current.random)! : null;
    current = current.next;
  }
  return map.get(head)!;
}

// 方法 2：节点间复制法
function copyRandomList2(head: Node | null): Node | null {
  if (!head) return null;
  // 第一步：在每个原节点后插入一个复制节点
  let current: Node | null = head;
  while (current) {
    const newNode = new Node(current.val);
    newNode.next = current.next;
    current.next = newNode;
    current = newNode.next;
  }
  // 第二步：设置复制节点的 random 指针
  current = head;
  while (current) {
    if (current.random) {
      current.next!.random = current.random.next;
    }
    current = current.next!.next;
  }
  // 第三步：拆分链表，分离原链表和复制链表
  const dummy = new Node(0);
  let copyCurrent = dummy;
  current = head;
  while (current) {
    copyCurrent.next = current.next!;
    copyCurrent = copyCurrent.next;
    current.next = copyCurrent.next;
    current = current.next;
  }
  return dummy.next;
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

// 两两交换链表中的节点
function swapPairs(head: LinkNode | null): LinkNode | null {
  const dummy = new LinkNode(0, head); // 虚拟头节点
  let prev = dummy; // 前驱节点
  while (prev.next && prev.next.next) {
    const node1 = prev.next;      // 第一个节点
    const node2 = prev.next.next; // 第二个节点
    // 交换 node1 和 node2
    prev.next = node2;
    node1.next = node2.next;
    node2.next = node1;
    // 更新 prev 到下一对的前驱节点
    prev = node1;
  }
  return dummy.next;
}

function swapPairsRecursive(head: LinkNode | null): LinkNode | null {
  // 终止条件：链表为空或只有一个节点
  if (!head || !head.next) return head;
  const node1 = head;
  const node2 = head.next;
  // 交换 node1 和 node2
  node1.next = swapPairsRecursive(node2.next);
  node2.next = node1;
  return node2; // 返回新的头节点
}

// k 个一组翻转链表
function reverseKGroup(head: LinkNode | null, k: number): LinkNode | null {
  const dummy = new LinkNode(0, head); // 虚拟头节点
  let prev = dummy; // 前驱节点

  while (head) {
    let start = head; // 当前组的起始节点
    let end = head;   // 当前组的结束节点

    // 找到当前组的结束节点
    for (let i = 1; i < k && end; i++) {
      end = end.next;
    }

    // 如果当前组不足 k 个节点，直接退出
    if (!end) break;

    const next = end.next; // 下一组的起始节点
    end.next = null;        // 断开当前组与下一组的连接

    // 翻转当前组
    prev.next = reverseList(start); // 连接翻转后的子链表
    start.next = next;              // 连接下一组

    // 更新指针
    prev = start;
    head = next;
  }

  return dummy.next;
}