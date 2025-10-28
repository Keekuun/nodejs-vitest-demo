// 节点类定义
class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
  height: number;

  constructor(value: T) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1; // 新节点初始高度为1
  }
}

// 平衡二叉搜索树(AVL树)实现
class BalancedBST<T> {
  root: TreeNode<T> | null;

  constructor() {
    this.root = null;
  }

  // 获取节点高度
  private getHeight(node: TreeNode<T> | null): number {
    return node ? node.height : 0;
  }

  // 更新节点高度
  private updateHeight(node: TreeNode<T>): void {
    node.height = 1 + Math.max(
      this.getHeight(node.left),
      this.getHeight(node.right)
    );
  }

  // 获取平衡因子（左子树高度 - 右子树高度）
  private getBalanceFactor(node: TreeNode<T> | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  // 右旋转操作
  private rightRotate(y: TreeNode<T>): TreeNode<T> {
    const x = y.left!;
    const T2 = x.right;

    // 执行旋转
    x.right! = y;
    y.left = T2;

    // 更新高度
    this.updateHeight(y);
    this.updateHeight(x);

    // 返回新的根节点
    return x;
  }

  // 左旋转操作
  private leftRotate(x: TreeNode<T>): TreeNode<T> {
    const y = x.right!;
    const T2 = y.left;

    // 执行旋转
    y.left = x;
    x.right = T2;

    // 更新高度
    this.updateHeight(x);
    this.updateHeight(y);

    // 返回新的根节点
    return y;
  }

  // 插入节点（递归实现）
  insert(value: T): void {
    this.root = this.insertNode(this.root, value);
  }

  private insertNode(node: TreeNode<T> | null, value: T): TreeNode<T> {
    // 1. 执行普通BST插入
    if (!node) {
      return new TreeNode(value);
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    } else {
      // 相等的值不插入（假设不允许重复值）
      return node;
    }

    // 2. 更新当前节点高度
    this.updateHeight(node);

    // 3. 获取平衡因子，检查是否失衡
    const balance = this.getBalanceFactor(node);

    // 4. 处理失衡情况

    // 左左情况：右旋
    if (balance > 1 && value < node.left!.value) {
      return this.rightRotate(node);
    }

    // 右右情况：左旋
    if (balance < -1 && value > node.right!.value) {
      return this.leftRotate(node);
    }

    // 左右情况：先左旋左子树，再右旋当前节点
    if (balance > 1 && value > node.left!.value) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }

    // 右左情况：先右旋右子树，再左旋当前节点
    if (balance < -1 && value < node.right!.value) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    // 如果平衡，直接返回当前节点
    return node;
  }

  // 将普通二叉搜索树转换为平衡二叉树
  static fromBST<T>(bstRoot: TreeNode<T> | null): BalancedBST<T> {
    // 1. 中序遍历获取有序数组
    const values: T[] = [];
    BalancedBST.inOrderTraversal(bstRoot, values);

    // 2. 从有序数组构建平衡二叉树
    const balancedBST = new BalancedBST<T>();
    balancedBST.root = BalancedBST.buildBalancedBST(values, 0, values.length - 1);

    return balancedBST;
  }

  // 中序遍历收集节点值
  private static inOrderTraversal<T>(node: TreeNode<T> | null, result: T[]): void {
    if (!node) return;
    BalancedBST.inOrderTraversal(node.left, result);
    result.push(node.value);
    BalancedBST.inOrderTraversal(node.right, result);
  }

  // 从有序数组构建平衡二叉树
  private static buildBalancedBST<T>(
    values: T[],
    start: number,
    end: number
  ): TreeNode<T> | null {
    if (start > end) return null;

    // 选择中间元素作为根节点，保证平衡性
    const mid = Math.floor((start + end) / 2);
    const node = new TreeNode(values[mid]);

    // 递归构建左右子树
    node.left = BalancedBST.buildBalancedBST(values, start, mid - 1);
    node.right = BalancedBST.buildBalancedBST(values, mid + 1, end);

    // 更新节点高度
    node.height = 1 + Math.max(
      node.left ? node.left.height : 0,
      node.right ? node.right.height : 0
    );

    return node;
  }

  // 前序遍历（用于测试和验证）
  preOrderTraversal(): T[] {
    const result: T[] = [];
    this.preOrder(this.root, result);
    return result;
  }

  private preOrder(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      result.push(node.value);
      this.preOrder(node.left, result);
      this.preOrder(node.right, result);
    }
  }

  // 查找节点
  search(value: T): boolean {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: TreeNode<T> | null, value: T): boolean {
    if (!node) return false;
    if (value === node.value) return true;
    return value < node.value
      ? this.searchNode(node.left, value)
      : this.searchNode(node.right, value);
  }
}

// 使用示例
function demo() {
  // 创建平衡二叉树并插入元素
  const balancedBST = new BalancedBST<number>();
  [10, 20, 30, 40, 50, 25].forEach(val => balancedBST.insert(val));

  console.log("平衡二叉树前序遍历:", balancedBST.preOrderTraversal());

  // 模拟一个普通二叉搜索树（可能不平衡）
  const unbalancedRoot = new TreeNode(10);
  unbalancedRoot.right = new TreeNode(20);
  unbalancedRoot.right.right = new TreeNode(30);
  unbalancedRoot.right.right.right = new TreeNode(40);
  unbalancedRoot.right.right.right.right = new TreeNode(50);

  // 将普通二叉搜索树转换为平衡二叉树
  const convertedBST = BalancedBST.fromBST(unbalancedRoot);
  console.log("转换后的平衡二叉树前序遍历:", convertedBST.preOrderTraversal());

  // 测试查找功能
  console.log("查找30:", convertedBST.search(30)); // true
  console.log("查找15:", convertedBST.search(15)); // false
}

// 运行示例
demo();
