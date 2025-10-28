enum Color { RED, BLACK }

class RBNode {
  value: number;
  color: Color;
  left: RBNode | null;
  right: RBNode | null;
  parent: RBNode | null;

  constructor(value: number) {
    this.value = value;
    this.color = Color.RED; // 新节点默认为红色
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree {
  root: RBNode | null;

  constructor() {
    this.root = null;
  }

  insert(value: number): void {
    const newNode = new RBNode(value);
    if (!this.root) {
      this.root = newNode;
      this.root.color = Color.BLACK; // 根节点必须为黑色
      return;
    }
    this.insertNode(this.root, newNode);
    this.fixInsert(newNode);
  }

  private insertNode(root: RBNode, newNode: RBNode): void {
    if (newNode.value < root.value) {
      if (!root.left) {
        root.left = newNode;
        newNode.parent = root;
      } else {
        this.insertNode(root.left, newNode);
      }
    } else {
      if (!root.right) {
        root.right = newNode;
        newNode.parent = root;
      } else {
        this.insertNode(root.right, newNode);
      }
    }
  }

  private fixInsert(node: RBNode): void {
    while (node.parent && node.parent.color === Color.RED) {
      const parent = node.parent;
      const grandParent = parent.parent!;
      const uncle = grandParent.left === parent ? grandParent.right : grandParent.left;

      if (uncle && uncle.color === Color.RED) {
        // Case 2: 叔叔是红色
        parent.color = Color.BLACK;
        uncle.color = Color.BLACK;
        grandParent.color = Color.RED;
        node = grandParent;
      } else {
        // Case 3/4: 叔叔是黑色或NIL
        if (parent === grandParent.left && node === parent.right) {
          // Case 3: 左旋
          this.rotateLeft(parent);
          node = parent;
        } else if (parent === grandParent.right && node === parent.left) {
          // Case 3: 右旋
          this.rotateRight(parent);
          node = parent;
        }
        // Case 4: 重新着色并旋转
        parent.color = Color.BLACK;
        grandParent.color = Color.RED;
        if (parent === grandParent.left) {
          this.rotateRight(grandParent);
        } else {
          this.rotateLeft(grandParent);
        }
      }
    }
    this.root!.color = Color.BLACK; // 根节点必须为黑色
  }

  private rotateLeft(node: RBNode): void {
    const rightChild = node.right!;
    node.right = rightChild.left;
    if (rightChild.left) {
      rightChild.left.parent = node;
    }
    rightChild.parent = node.parent;
    if (!node.parent) {
      this.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }
    rightChild.left = node;
    node.parent = rightChild;
  }

  private rotateRight(node: RBNode): void {
    const leftChild = node.left!;
    node.left = leftChild.right;
    if (leftChild.right) {
      leftChild.right.parent = node;
    }
    leftChild.parent = node.parent;
    if (!node.parent) {
      this.root = leftChild;
    } else if (node === node.parent.left) {
      node.parent.left = leftChild;
    } else {
      node.parent.right = leftChild;
    }
    leftChild.right = node;
    node.parent = leftChild;
  }
}
