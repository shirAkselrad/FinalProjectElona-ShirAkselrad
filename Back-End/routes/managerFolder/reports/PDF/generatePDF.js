const puppeteer = require("puppeteer");

async function generatePDF(html) {
  const browser = await puppeteer.launch();

  try {
    //opening the browser 
    const page = await browser.newPage();
    //setting the html content to the page 
    await page.setContent(html);

    //waiting for all the info to be ready 
    await page.evaluate(() => document.fonts.ready);

    //creating the pdf 
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
