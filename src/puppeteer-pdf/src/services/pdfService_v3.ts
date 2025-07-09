// src/services/pdfService.ts

import puppeteer, { Browser } from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';
import invoiceTemplateSource from '@/templates/invoice_v2.hbs?raw';
import {ReportData} from "@/services/pdfService_v2";

// 接口和 Base64 助手函数保持不变
// ...
// interface ReportItem { ... }
// interface ReportData { ... }
// const getImageAsBase64 = async (...) => { ... };

// ✨ 第一处核心改变：创建一个只负责生成 HTML 的新函数
/**
 * 根据数据和模板生成最终的 HTML 字符串。
 * 这个函数是纯粹的，只关心数据和模板的结合。
 * @param data - 报告所需的数据
 * @returns {Promise<string>} 渲染完成的 HTML 字符串
 */
export const generateHtmlFromData = async (data: ReportData): Promise<string> => {
  // 1. 编译 Handlebars 模板
  const template = handlebars.compile(invoiceTemplateSource);

  // 2. 准备所有模板需要的数据，包括 Base64 编码的图片
  const logoPath = path.join(process.cwd(), 'src/assets/images/logo.png');
  const logoImageBase64 = await getImageAsBase64(logoPath);

  const contentImgPath = path.join(process.cwd(), 'src/assets/images/test.png');
  const contentImageBase64 = await getImageAsBase64(contentImgPath);

  // Combine report data with assets and other dynamic info
  const templateData = {
    ...data,
    logoImage: logoImageBase64,
    contentImage: contentImageBase64,
    year: new Date().getFullYear(),
  };

  // 3. 渲染并返回 HTML 字符串
  return template(templateData);
};


// ✨ 第二处核心改变：重构原有的 PDF 生成函数，让它调用新的 HTML 生成函数
/**
 * 接收报告数据，生成 PDF 文件并返回 Buffer。
 * 它现在专注于 Puppeteer 的操作。
 * @param data - 报告所需的数据
 * @returns PDF Buffer 和文件路径
 */
export const generatePdfFromData = async (
  data: ReportData
): Promise<{ buffer: Buffer; filePath: string }> => {

  // 1. 调用新函数来获取 HTML 内容
  const finalHtml = await generateHtmlFromData(data);

  // ✨ 诊断步骤 1: 打印最终的 HTML 到控制台
  console.log('--- HTML content fed to Puppeteer ---');
  // console.log(finalHtml);
  console.log('------------------------------------');

  // 2. 剩下的部分专注于 Puppeteer 的工作
  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch({
      // headless: true,
      // args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // ✨ 诊断步骤 3: 关闭无头模式来进行可视化调试
      headless: false,
      // 增加一个延迟，让你有时间看清楚窗口里的内容
      slowMo: 250,
    });

    const page = await browser.newPage();

    // 增加监听，捕获页面内的任何错误
    page.on('pageerror', error => {
      console.error('Puppeteer page error:', error.message);
    }).on('requestfailed', request => {
      console.error(`Puppeteer request failed: ${request.url()} (${request.failure()?.errorText})`);
    });

    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });

    // ✨ 诊断步骤 2: 检查 Buffer 大小
    console.log(`Generated PDF Buffer Size: ${pdfBuffer.length} bytes`);
    // 添加一个显式的错误检查
    if (!pdfBuffer || pdfBuffer.length < 100) { // 小于100字节的PDF基本都是无效的
      throw new Error('PDF generation resulted in an empty or invalid buffer.');
    }

    // 文件保存逻辑不变
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    const fileName = `report-${data.orderId}-${Date.now()}.pdf`;
    const filePath = path.join(tempDir, fileName);
    await fs.writeFile(filePath, pdfBuffer);
    console.log(`PDF successfully saved to: ${filePath}`);

    return { buffer: pdfBuffer, filePath: filePath };

  } catch (error) {
    console.error('PDF generation or saving failed:', error);
    throw new Error('Could not generate or save PDF.');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// getImageAsBase64 函数定义...
const getImageAsBase64 = async (imagePath: string): Promise<string> => {
  // ... (此函数代码不变)
  try {
    const ext = path.extname(imagePath).toLowerCase();
    let mimeType;
    switch (ext) {
      case '.png': mimeType = 'image/png'; break;
      case '.jpg': case '.jpeg': mimeType = 'image/jpeg'; break;
      case '.svg': mimeType = 'image/svg+xml'; break;
      default: throw new Error(`Unsupported image type: ${ext}`);
    }
    const fileBuffer = await fs.readFile(imagePath);
    const base64String = fileBuffer.toString('base64');
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error(`Error reading image file at ${imagePath}:`, error);
    return '';
  }
};
