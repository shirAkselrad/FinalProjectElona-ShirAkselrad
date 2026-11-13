const puppeteer = require("puppeteer");

async function generatePDF(html) {
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();

    await page.setContent(html);

    await page.evaluate(() => document.fonts.ready);

    const pdf = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      displayHeaderFooter: true,

      headerTemplate: "<div></div>",

      footerTemplate: `
        <div style="
          width: 100%;
          padding: 0 10mm;
          font-size: 9px;
          color: #997783;
          text-align: center;
        ">
          ELONA | Page
          <span class="pageNumber"></span>
          of
          <span class="totalPages"></span>
        </div>
      `,

      margin: {
        top: "15mm",
        bottom: "20mm",
        left: "10mm",
        right: "10mm",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

module.exports = generatePDF;
