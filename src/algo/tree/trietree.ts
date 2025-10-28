// 前缀树
class TrieNode {
  // 子节点映射表（字符 -> TrieNode）
  children: Map<string, TrieNode>;
  // 标记当前节点是否为某个单词的结尾
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /**
   * 插入一个单词到前缀树中
   * @param word 要插入的单词
   */
  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true; // 标记单词结束
  }

  /**
   * 检查前缀树中是否存在某个单词
   * @param word 要检查的单词
   * @returns 是否存在
   */
  search(word: string): boolean {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }
    return node.isEndOfWord; // 必须是一个完整单词
  }

  /**
   * 检查前缀树中是否存在以某个前缀开头的单词
   * @param prefix 要检查的前缀
   * @returns 是否存在
   */
  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }
    return true; // 不需要是完整单词
  }

  /**
   * 删除一个单词（可选实现）
   * @param word 要删除的单词
   */
  delete(word: string): void {
    this._delete(this.root, word, 0);
  }

  private _delete(node: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      if (!node.isEndOfWord) return false; // 单词不存在
      node.isEndOfWord = false; // 取消标记
      return node.children.size === 0; // 如果没有子节点，可以删除
    }

    const char = word[index];
    if (!node.children.has(char)) return false; // 单词不存在

    const shouldDeleteChild = this._delete(node.children.get(char)!, word, index + 1);
    if (shouldDeleteChild) {
      node.children.delete(char); // 删除子节点
      return node.children.size === 0 && !node.isEndOfWord; // 如果没有其他子节点且不是单词结尾，可以删除
    }
    return false;
  }
}

