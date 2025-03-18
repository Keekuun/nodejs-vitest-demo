// kmp.ts

/**
 * 构建部分匹配表（前缀函数）：最大相同前后缀长度表
 * @param pattern 模式串
 * @returns 部分匹配表
 */
function buildPartialMatchTable(pattern: string): number[] {
    const table = new Array(pattern.length).fill(0);
    // 变量j用于记录当前最长相同前后缀的长度。初始值为0，表示当前没有匹配的前后缀。
    let j = 0; // length of previous longest prefix suffix

    // 第一个字符的最长相同前后缀长度必为0
    for (let i = 1; i < pattern.length; i++) {
        // 不匹配 --> 回退到上一个最长相同前后缀的位置
        while (j > 0 && pattern[i] !== pattern[j]) {
            j = table[j - 1];
        }
        // 匹配 --> 更新最长相同前后缀长度
        if (pattern[i] === pattern[j]) {
            j++;
        }
        // 更新部分匹配表
        table[i] = j;
    }

    return table;
}

/**
 * KMP字符串匹配算法
 * @param text 文本串
 * @param pattern 模式串
 * @returns 如果找到模式串，返回其在文本串中的起始索引；否则返回-1
 */
function kmpSearch(text: string, pattern: string): number {
    const partialMatchTable = buildPartialMatchTable(pattern);
    let j = 0; // index for pattern

    for (let i = 0; i < text.length; i++) {
        while (j > 0 && text[i] !== pattern[j]) {
            j = partialMatchTable[j - 1];
        }
        if (text[i] === pattern[j]) {
            j++;
        }
        if (j === pattern.length) {
            return i - j + 1; // match found
        }
    }

    return -1; // no match found
}

// 示例用法
const text = "ABABDABACDABABCABAB";
const pattern = "ABABCABAB";
const partialMatchTable = buildPartialMatchTable(pattern);

console.log(`Text: ${text}`)
console.log(`Pattern: ${pattern}`)
console.log(`Partial Match Table: ${partialMatchTable}`)

const result = kmpSearch(text, pattern);
console.log(`Pattern found at index: ${result}`);

console.log(`Match ${text.indexOf(pattern) === result ? 'successfully' : 'failed'}`)


console.log(`Pattern: ABACABC`)
console.log(`Partial Match Table: ${buildPartialMatchTable('ABACABC')}`)


function match(pattern: string, text: string) {
    let m = pattern.length;
    let n = text.length;
    let i = 0, j = 0;

    // 暴力 匹配
    while (i < n && j < m) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
        } else {
            // 同时回退j位
            i = i - j + 1;
            // j = j - j
            j = 0;
        }
    }
    if (j === m) {
        return i - j;
    } else {
        return -1;
    }
}


/**
 *
 * 'helo', 'chelxheloo'
 详细步骤
 初始状态:
 i = 0, j = 0
 text[0] = 'c', pattern[0] = 'h'，不匹配。
 i = i - j + 1 = 0 - 0 + 1 = 1
 j = 0
 继续匹配:
 i = 1, j = 0
 text[1] = 'h', pattern[0] = 'h'，匹配。
 i = 2, j = 1
 继续匹配:
 i = 2, j = 1
 text[2] = 'e', pattern[1] = 'e'，匹配。
 i = 3, j = 2
 继续匹配:
 i = 3, j = 2
 text[3] = 'l', pattern[2] = 'l'，匹配。
 i = 4, j = 3
 不匹配:
 i = 4, j = 3
 text[4] = 'x', pattern[3] = 'o'，不匹配。
 i = i - j + 1 = 4 - 3 + 1 = 2
 j = 0
 继续匹配:
 i = 2, j = 0
 text[2] = 'e', pattern[0] = 'h'，不匹配。
 i = i - j + 1 = 2 - 0 + 1 = 3
 j = 0
 继续匹配:
 i = 3, j = 0
 text[3] = 'l', pattern[0] = 'h'，不匹配。
 i = i - j + 1 = 3 - 0 + 1 = 4
 j = 0
 继续匹配:
 i = 4, j = 0
 text[4] = 'x', pattern[0] = 'h'，不匹配。
 i = i - j + 1 = 4 - 0 + 1 = 5
 j = 0
 继续匹配:
 i = 5, j = 0
 text[5] = 'h', pattern[0] = 'h'，匹配。
 i = 6, j = 1
 继续匹配:
 i = 6, j = 1
 text[6] = 'e', pattern[1] = 'e'，匹配。
 i = 7, j = 2
 继续匹配:
 i = 7, j = 2
 text[7] = 'l', pattern[2] = 'l'，匹配。
 i = 8, j = 3
 继续匹配:
 i = 8, j = 3
 text[8] = 'o', pattern[3] = 'o'，匹配。
 i = 9, j = 4
 匹配成功:
 j = m，匹配成功。
 返回 i - j = 9 - 4 = 5。
 总结
 i 和 j 的变化展示了暴力匹配算法如何逐个字符地比较文本串和模式串。
 当遇到不匹配的情况时，i 通过 i = i - j + 1 重置到下一个可能的起始位置，j 重置为 0。
 这种机制确保了暴力匹配算法能够正确地遍历文本串，找到所有可能的匹配位置。
 * */
console.log(match('helo', 'chelxheloo'))