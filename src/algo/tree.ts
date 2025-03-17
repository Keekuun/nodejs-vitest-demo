// 二叉树、堆、AVL树、红黑树、B 树、B+ 树
// 完美二叉树、完全二叉树、满二叉树
// 二叉搜索树、二叉排序树、二叉平衡树、二叉查找树
// 层序遍历、前序遍历、中序遍历、后序遍历
// 构建树：从前序遍历和中序遍历构建二叉树、后序遍历和中序遍历构建二叉树、前序遍历和后序遍历构建二叉树、层序遍历构建二叉树

class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(val: number) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

// 二叉树的遍历
export enum TraverseType {
    PRE_ORDER = 'preOrder', // 先序遍历
    IN_ORDER = 'inOrder', // 中序遍历
    POST_ORDER = 'postOrder', // 后序遍历
    LEVEL_ORDER = 'levelOrder', // 层序遍历
}

// 先序遍历： 根节点 -> 左子树 -> 右子树
function preOrder(root: TreeNode | null, callback?: (val: number) => void) {
    if (!root) return;
    callback?.(root.val);
    preOrder(root.left, callback);
    preOrder(root.right, callback);
}

// 中序遍历： 左子树 -> 根节点 -> 右子树
function inOrder(root: TreeNode | null, callback?: (val: number) => void) {
    if (!root) return;
    inOrder(root.left, callback);
    callback?.(root.val);
    inOrder(root.right, callback);
}

// 后序遍历： 左子树 -> 右子树 -> 根节点
function postOrder(root: TreeNode | null, callback?: (val: number) => void) {
    if (!root) return;
    postOrder(root.left, callback);
    postOrder(root.right, callback);
    callback?.(root.val);
}

// 层序遍历： 从上到下，从左到右
function levelOrder(root: TreeNode | null, callback?: (val: number) => void) {
    if (!root) return;
    const queue: TreeNode[] = [root];
    while (queue.length) {
        const node = queue.shift();
        callback?.(node!.val);
        if (node?.left) queue.push(node.left);
        if (node?.right) queue.push(node.right);
    }
}

// 构建二叉树
//  preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
// 从前序遍历和中序遍历构建二叉树
function buildTree1(preorder: number[], inorder: number[]): TreeNode | null {
    function help(preorder: number[], inorder: number[], preStart: number, preEnd: number, inStart: number, inEnd: number) {
        if(preStart > preEnd || inStart > inEnd) return null;

        // root node
        const rootVal = preorder[preStart]
        const root = new TreeNode(rootVal)
        if(inStart === inEnd) return root;
        const rootIndex = inorder.indexOf(rootVal)

        root.left = help(preorder, inorder, preStart + 1, preStart + 1 + (rootIndex - 1 - inStart), inStart, rootIndex - 1)
        root.right = help(preorder, inorder, preEnd - (inEnd - (rootIndex + 1)), preEnd, rootIndex + 1, inEnd)

        return root
    }

    return help(preorder, inorder, 0, preorder.length - 1, 0, inorder.length - 1)
}

// 从后序遍历和中序遍历构建二叉树
function buildTree2(postorder: number[], inorder: number[]): TreeNode | null {

    function help(postorder: number[], inorder: number[], postStart: number, postEnd: number, inStart: number, inEnd: number) {
        if(postStart > postEnd || inStart > inEnd) return null

        const rootVal = postorder[postEnd]
        const rootIndex = inorder.indexOf(rootVal)
        const root = new TreeNode(rootVal)
        if(inStart === inEnd) return root

        root.left = help(postorder, inorder, postStart, postStart + (rootIndex - 1 - inStart), inStart, rootIndex - 1)
        root.right = help(postorder, inorder, postEnd - 1 - (inEnd - (rootIndex + 1)), postEnd - 1, rootIndex + 1, inEnd)

        return root
    }

    return help(postorder, inorder, 0, postorder.length - 1, 0, inorder.length - 1)
}

// 从前序遍历和后序遍历构建二叉树
// preorder: [1,2,4,5,3,6,7]
// postorder: [4,5,2,6,7,3,1]
function buildTree3(preorder: number[], postorder: number[]): TreeNode | null {
    // todo
    function help(preorder: number[], postorder: number[], preStart: number, preEnd: number, postStart: number, postEnd: number): TreeNode | null {
        if(preStart > preEnd || postStart > postEnd) return null

        const rootVal = preorder[preStart]
        const root = new TreeNode(rootVal)
        if(preStart === preEnd) return root

        const leftRootVal = preorder[preStart + 1]
        const leftRootIndex = postorder.indexOf(leftRootVal)

        root.left = help(preorder, postorder, preStart + 1, preStart + 1 + (leftRootIndex - postStart), postStart, leftRootIndex)
        root.right = help(preorder, postorder, preEnd - (postEnd - 1 - (leftRootIndex + 1)), preEnd, leftRootIndex + 1, postEnd - 1)
        return root
    }

    return help(preorder, postorder, 0, preorder.length - 1, 0, postorder.length - 1)
}