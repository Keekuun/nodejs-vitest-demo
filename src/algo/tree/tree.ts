class TreeNode {
    val: number
    left: TreeNode | null
    right: TreeNode | null

    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.left = (left === undefined ? null : left)
        this.right = (right === undefined ? null : right)
    }
}

// 求二叉树的宽度 宽度就是每一层最右边的节点和最左边的节点的距离
function maxWidth(root: TreeNode | null): number {
    if (!root) return 0
    let queue: TreeNode[] = [root]
    let maxWidth = 0
    while (queue.length) {
        let len = queue.length
        maxWidth = Math.max(maxWidth, len)
        for (let i = 0; i < len; i++) {
            let node = queue.shift()
            if (node?.left) queue.push(node.left)
            if (node?.right) queue.push(node.right)
        }
    }
    return maxWidth
}

// 求二叉树的最大深度
function maxDepth(root: TreeNode | null): number {
    if (!root) return 0
    let left = maxDepth(root.left)
    let right = maxDepth(root.right)
    return Math.max(left, right) + 1
}

// 判断是否是二叉搜索树
// 关键点：中序遍历二叉树，判断是否是升序
function isValidBST(root: TreeNode | null): boolean {
    let stack: TreeNode[] = []
    let pre: TreeNode | null = null
    if (!root) return true

    while (root || stack.length) {
        while (root) {
            stack.push(root)
            root = root.left
        }
        root = stack.pop()!
        if (pre && root.val <= pre.val) return false
        pre = root
        root = root.right
    }
    return true
}

function isValidBST2(root: TreeNode | null): boolean {
    function validate(node: TreeNode | null, min: number | null, max: number | null): boolean {
        if (!node) return true;

        // 检查当前节点是否在有效范围内
        if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) {
            return false;
        }

        // 递归检查左子树和右子树
        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }

    return validate(root, null, null);
}


// 判断完全二叉树
// 关键点：完全二叉树除了最后一层外，其他层都是满的，并且最后一层的节点从左到右依次排列。
// 层序遍历 BFS
function isCompleteTree(root: TreeNode | null): boolean {
    if (!root) return true;

    let queue: (TreeNode | null)[] = [root];
    // 标记当前层是否已经遇到叶子节点
    let leafEnd = false;
    let left: TreeNode | null = null
    let right: TreeNode | null = null
    while (queue.length) {
        let node = queue.shift()!;
        left = node?.left
        right = node?.right

        if (!left && right) return false
        if (leafEnd && (left || right)) return false

        if (!left) {
            queue.push(left)
        }
        if (!right) {
            queue.push(right)
        }
        if (!left || !right) {
            leafEnd = true
        }
    }

    return true;
}

// 判断是否是满二叉树
// 关键点：节点数 = 2^h - 1，其中 h 为高度。
function isFullBinaryTree(root: TreeNode | null): boolean {
    function isFull(node: TreeNode | null): { isFull: boolean, height: number } {
        if (!node) return {isFull: true, height: 0};

        const left = isFull(node.left);
        const right = isFull(node.right);

        // 当前节点的子树是满二叉树的条件：
        // 1. 左子树和右子树都是满二叉树
        // 2. 左子树和右子树的高度相同
        const isFullTree = left.isFull && right.isFull && left.height === right.height;
        const height = isFullTree ? left.height + 1 : 0;

        return {isFull: isFullTree, height: height};
    }

    return isFull(root).isFull;
}

// 判断是否是平衡二叉树
// 关键点：左右子树的高度差不超过1
function isBalanced(root: TreeNode | null): boolean {
    function getHeight(node: TreeNode | null): number {
        if (!node) return 0;

        let leftHeight = getHeight(node.left);
        if (leftHeight === -1) return -1; // 左子树不是平衡二叉树

        let rightHeight = getHeight(node.right);
        if (rightHeight === -1) return -1; // 右子树不是平衡二叉树

        if (Math.abs(leftHeight - rightHeight) > 1) return -1; // 当前节点不平衡

        return Math.max(leftHeight, rightHeight) + 1; // 返回当前节点的高度
    }

    return getHeight(root) !== -1;
}

function isBalanced2(root: TreeNode | null): boolean {
    function process(node: TreeNode | null): { isBalanced: boolean, height: number } {
        if (!node) return {
            isBalanced: true,
            height: 0
        }

        let leftData = process(node.left);
        let rightData = process(node.right);

        // 当前节点是否是平衡二叉树: 左子树和右子树都是平衡二叉树，并且高度差不超过1
        const isBalanced = leftData.isBalanced && rightData.isBalanced && Math.abs(leftData.height - rightData.height) <= 1

        return {
            isBalanced,
            height: Math.max(leftData.height, rightData.height) + 1
        }
    }

    return process(root).isBalanced;
}

// 二叉树两个节点的最低公共祖先
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    if (!root || root === p || root === q) {
        return root;
    }

    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);

    if (left && right) {
        return root;
    }

    return left || right;
}

// 折纸问题
// 折痕： 折痕向上为凸， 折痕向下为凹
// 从上到下打印对折n次后的结果
/**
 * 向上折
 * 第一次：                凹（1）
 * 第二次：       凹（2）           凸（2）
 * 第三次：  凹（3）    凸（3）  凹（3）   凸（3）
 * 打印结果：凹（3） 凹（2） 凸（3） 凹（1） 凹（2） 凸（3） 凸（3）
 * */
function printAllFolds(n: number) {
    // i 表示第几层
    // n 表示总共需要折几层
    // down: true 凹折痕
    function printProcess(i: number, n: number, down: boolean) {
        if (i > n) {
            return
        }
        // 相当于二叉树的 中序遍历
        printProcess(i + 1, n, true)
        if (down) {
            console.log('凹')
        } else {
            console.log('凸')
        }
        printProcess(i + 1, n, false)
    }

    printProcess(1, n, true)
}

printAllFolds(3)