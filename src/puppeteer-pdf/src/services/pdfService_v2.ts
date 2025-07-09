// src/services/pdfService.ts

import puppeteer, { Browser } from 'puppeteer';
import fs from 'fs/promises'; // We need the file system module
import path from 'path';
import handlebars from 'handlebars';
import invoiceTemplateSource from '@/templates/invoice_v2.hbs?raw';

// ✨ New Helper Function: Reads an image and converts it to a Base64 Data URI
const getImageAsBase64 = async (imagePath: string): Promise<string> => {
  try {
    // Determine the MIME type from the file extension
    const ext = path.extname(imagePath).toLowerCase();
    let mimeType;
    switch (ext) {
      case '.png':
        mimeType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg';
        break;
      case '.svg':
        mimeType = 'image/svg+xml';
        break;
      default:
        throw new Error(`Unsupported image type: ${ext}`);
    }

    const fileBuffer = await fs.readFile(imagePath);
    const base64String = fileBuffer.toString('base64');
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error(`Error reading image file at ${imagePath}:`, error);
    // Return a placeholder or throw, depending on desired behavior
    return ''; // Return empty string if image is not critical
  }
};


// Define a more detailed data structure that matches our new template
export interface ReportItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
  total: number;
}
export interface ReportData {
  reportTitle: string;
  orderId: string;
  companyName: string;
  customer: {
    name: string;
    address: string;
  };
  items: ReportItem[];
  grandTotal: number;
}


export const generatePdfFromData = async (
  data: ReportData
): Promise<{ buffer: Buffer; filePath: string }> => {

  // 1. Compile the template (no change here)
  const template = handlebars.compile(invoiceTemplateSource);

  // 2. ✨ Prepare ALL data for the template, including the embedded image
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

  // 3. Render the final HTML string (no change here)
  const finalHtml = template(templateData);

  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // 4. Set the content and wait until everything is loaded
    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

    // 5. ✨ Generate the PDF with print options
    const pdfBuffer = await page.pdf({
      format: 'A4',         // Standard page format
      printBackground: true,  // VERY IMPORTANT! This ensures your CSS background colors and styles are rendered.
      margin: {             // We let CSS control margins, so set puppeteer margins to 0
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    });

    // Saving file logic remains the same
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
