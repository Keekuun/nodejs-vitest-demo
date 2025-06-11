// monitor-cross-platform.js
import { exec } from 'node:child_process';
import https from 'node:https';
import url from 'node:url';
import os from 'node:os';

// ======================= 配置区 START =======================

const CONFIG = {
    // 钉钉机器人的 Webhook 地址 (必填)
    DINGTALK_WEBHOOK_URL: 'https://oapi.dingtalk.com/robot/send?access_token=YOUR_ACCESS_TOKEN_HERE',

    // 检查的磁盘/驱动器。
    // !!! 重要: 请根据你的操作系统填写 !!!
    // - 在 Linux/macOS 上, 填写挂载点, 例如: '/'
    // - 在 Windows 上, 填写驱动器号, 例如: 'C:'
    DISK_PATH_TO_CHECK: '/',

    // 磁盘使用率预警阈值 (百分比, 例如 80 表示超过80%就预警)
    DISK_THRESHOLD_PERCENT: 80,

    // 内存使用率预警阈值 (百分比)
    MEMORY_THRESHOLD_PERCENT: 85,

    // 检查间隔 (秒)
    CHECK_INTERVAL_SECONDS: 300, // 5分钟检查一次

    // 是否在每次检查时都打印正常状态日志
    LOG_NORMAL_STATUS: true,
};

// ======================= 配置区 END =======================

const IS_WINDOWS = os.platform() === 'win32';

/**
 * 执行 shell 命令并返回一个 Promise
 * @param {string} command 要执行的命令
 * @returns {Promise<string>} 命令的标准输出
 */
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行命令出错: ${command}`, error);
                return reject(error);
            }
            // 对于 wmic, 有时信息在 stderr, 但不是错误
            if (stderr && !IS_WINDOWS) {
                // 在非Windows系统上，stderr通常表示问题
                console.warn(`命令 ${command} 的标准错误输出: ${stderr}`);
            }
            resolve(stdout.trim());
        });
    });
}

/**
 * 获取内存使用率
 * @returns {Promise<number>} 内存使用率 (0-100)
 */
async function getMemoryUsage() {
    if (IS_WINDOWS) {
        // Windows: 使用 wmic 获取总内存和可用内存 (单位: KB)
        // `wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /value` 输出类似:
        // FreePhysicalMemory=...
        // TotalVisibleMemorySize=...
        const output = await executeCommand('wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /value');
        const freeMatch = output.match(/FreePhysicalMemory=(\d+)/);
        const totalMatch = output.match(/TotalVisibleMemorySize=(\d+)/);

        if (!freeMatch || !totalMatch) {
            throw new Error('无法从 wmic 解析内存数据');
        }
        const freeMemory = parseInt(freeMatch[1], 10);
        const totalMemory = parseInt(totalMatch[1], 10);
        const usedMemory = totalMemory - freeMemory;

        if (isNaN(totalMemory) || totalMemory === 0) {
            throw new Error('解析到的总内存为0或无效');
        }

        const usagePercent = (usedMemory / totalMemory) * 100;
        return parseFloat(usagePercent.toFixed(2));
    } else {
        // Linux/macOS: 使用 free -m
        const output = await executeCommand('free -m');
        const lines = output.split('\n');
        const memLine = lines[1];
        const stats = memLine.split(/\s+/);

        const totalMemory = parseInt(stats[1], 10);
        const usedMemory = parseInt(stats[2], 10);

        if (isNaN(totalMemory) || isNaN(usedMemory) || totalMemory === 0) {
            throw new Error('无法从 "free -m" 解析内存数据');
        }

        const usagePercent = (usedMemory / totalMemory) * 100;
        return parseFloat(usagePercent.toFixed(2));
    }
}

/**
 * 获取指定路径的磁盘使用率
 * @param {string} path 要检查的磁盘路径/驱动器
 * @returns {Promise<number>} 磁盘使用率 (0-100)
 */
async function getDiskUsage(path) {
    if (IS_WINDOWS) {
        // Windows: 使用 wmic 获取特定驱动器的信息 (单位: Byte)
        // `wmic logicaldisk where "Caption='C:'" get Size,FreeSpace /value` 输出类似:
        // FreeSpace=...
        // Size=...
        const driveLetter = path.toUpperCase();
        const command = `wmic logicaldisk where "Caption='${driveLetter}'" get Size,FreeSpace /value`;
        const output = await executeCommand(command);

        const freeMatch = output.match(/FreeSpace=(\d+)/);
        const sizeMatch = output.match(/Size=(\d+)/);

        if (!freeMatch || !sizeMatch) {
            throw new Error(`无法从 wmic 获取驱动器 ${driveLetter} 的数据`);
        }

        const freeSpace = BigInt(freeMatch[1]);
        const totalSize = BigInt(sizeMatch[1]);

        if (totalSize === 0n) {
            throw new Error(`解析到的驱动器 ${driveLetter} 总大小为0`);
        }

        // 使用 BigInt 进行计算以避免精度问题
        const usagePercent = Number((totalSize - freeSpace) * 100n / totalSize);
        return usagePercent;

    } else {
        // Linux/macOS: 使用 df -P
        const output = await executeCommand(`df -P ${path}`);
        const lines = output.split('\n');
        const diskLine = lines[1];
        const stats = diskLine.split(/\s+/);
        const usageString = stats[4];

        if (!usageString || !usageString.includes('%')) {
            throw new Error(`无法从 "df -P" 解析路径 ${path} 的数据`);
        }

        return parseInt(usageString.replace('%', ''), 10);
    }
}

// ... sendDingTalkAlert 函数和主检查逻辑 checkSystemUsage 保持不变 ...
// (为了简洁，这里省略了和上个版本完全相同的代码)

/**
 * 发送钉钉通知
 * @param {string} title 标题
 * @param {string} message markdown格式的消息内容
 */
function sendDingTalkAlert(title, message) {
    const webhookUrl = CONFIG.DINGTALK_WEBHOOK_URL;
    if (!webhookUrl.includes('https://oapi.dingtalk.com')) {
        console.error('无效的钉钉 Webhook 地址，请检查配置。');
        return;
    }

    const postData = JSON.stringify({
        msgtype: 'markdown',
        markdown: {
            title: title,
            text: message,
        },
    });

    const options = {
        ...url.parse(webhookUrl),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    const req = https.request(options, (res) => {
        let responseBody = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => { console.log('钉钉通知发送成功:', responseBody); });
    });

    req.on('error', (e) => { console.error(`发送钉钉通知失败: ${e.message}`); });

    req.write(postData);
    req.end();
}

/**
 * 主检查函数
 */
async function checkSystemUsage() {
    const now = new Date().toLocaleString();
    console.log(`[${now}] 开始检查系统状态... (平台: ${os.platform()})`);

    try {
        const [memoryUsage, diskUsage] = await Promise.all([
            getMemoryUsage(),
            getDiskUsage(CONFIG.DISK_PATH_TO_CHECK),
        ]);

        const isMemoryAlert = memoryUsage > CONFIG.MEMORY_THRESHOLD_PERCENT;
        const isDiskAlert = diskUsage > CONFIG.DISK_THRESHOLD_PERCENT;

        if (isMemoryAlert || isDiskAlert) {
            const title = '🚨 服务器资源预警';
            // os.hostname() 是 Node.js 内置的获取主机名的方法，更可靠
            let message = `### ${title}\n\n`;
            message += `> **主机名:** ${os.hostname()}\n`;
            message += `> **检查时间:** ${now}\n\n`;

            if (isDiskAlert) {
                message += `**🔴 磁盘使用率过高!**\n`;
                message += `- **路径/驱动器:** \`${CONFIG.DISK_PATH_TO_CHECK}\`\n`;
                message += `- **当前使用率:** \`${diskUsage}%\`\n`;
                message += `- **阈值:** \`${CONFIG.DISK_THRESHOLD_PERCENT}%\`\n\n`;
            }

            if (isMemoryAlert) {
                message += `**🟠 内存使用率过高!**\n`;
                message += `- **当前使用率:** \`${memoryUsage}%\`\n`;
                message += `- **阈值:** \`${CONFIG.MEMORY_THRESHOLD_PERCENT}%\`\n\n`;
            }

            console.log(message);
            console.warn('检测到资源超标，准备发送通知...');
            sendDingTalkAlert(title, message);

        } else {
            if(CONFIG.LOG_NORMAL_STATUS) {
                console.log(`[状态正常] 内存: ${memoryUsage}%, 磁盘: ${diskUsage}%`);
            }
        }
    } catch (error) {
        console.error('检查过程中发生严重错误:', error);
        sendDingTalkAlert(
            '🚨 监控脚本错误',
            `### 监控脚本执行失败 (${os.hostname()})\n\n**错误信息:**\n\`\`\`\n${error.stack}\n\`\`\``
        );
    }
}

// --- 脚本启动 ---
console.log('启动跨平台系统资源监控脚本...');
if (IS_WINDOWS) {
    console.log(`当前系统为 Windows, 请确保 DISK_PATH_TO_CHECK 设置为驱动器号 (如 'C:')`);
    CONFIG.DISK_PATH_TO_CHECK = 'C:'; // 默认设置为 C: 驱动器
} else {
    console.log(`当前系统为 ${os.platform()}, 请确保 DISK_PATH_TO_CHECK 设置为挂载点 (如 '/')`);
}
console.log(`检查间隔: ${CONFIG.CHECK_INTERVAL_SECONDS} 秒`);

checkSystemUsage();
setInterval(checkSystemUsage, CONFIG.CHECK_INTERVAL_SECONDS * 1000);
