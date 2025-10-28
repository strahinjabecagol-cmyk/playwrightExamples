import { expect, test } from '../base.test'
import fs from 'fs';


test('go to PDF download page and download and verify tehe contents', async ({ pdfDownloadExamplePage, utilPdfHandler }) => {

  await pdfDownloadExamplePage.goto();
  let PDFtext = await pdfDownloadExamplePage.downloadInvoicePdf(utilPdfHandler);
  expect.soft(PDFtext).toContain('Denny Gunawan 221 Queen St Melbourne VIC 3000');
  expect.soft(PDFtext).toContain('123 Somewhere St, Melbourne VIC 3000');
  expect.soft(PDFtext).toContain('(03) 1234 5678');
  expect.soft(PDFtext).toContain('$39.60');
  expect.soft(PDFtext).toContain('Invoice Number: #20130304');
  expect.soft(PDFtext).toContain('Organic Items Price/kg Quantity(kg) Subtotal');
  expect.soft(PDFtext).toContain('Apple $5.00 1 $5.00');
  expect.soft(PDFtext).toContain('Orange $1.99 2 $3.98');
  expect.soft(PDFtext).toContain('W atermelon $1.69 3 $5.07');
  expect.soft(PDFtext).toContain('Mango $9.56 2 $19.12');
  expect.soft(PDFtext).toContain('Peach $2.99 1 $2.99');
  expect.soft(PDFtext).toContain('Subtotal $36.00');
  expect.soft(PDFtext).toContain('GST (10%) $3.60');
  expect.soft(PDFtext).toContain('* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales dapibus fermentum. Nunc adipiscing, magna sed scelerisque cursus, erat lectus dapibus urna, sed facilisis leo dui et ipsum. ');
  expect.soft(PDFtext).toContain('Total $39.60');

});
test('go to PDF download page and download plain invoice and verify the contents', async ({ pdfDownloadExamplePage, utilPdfHandler }) => {
  await pdfDownloadExamplePage.goto();
  let PDFtext = await pdfDownloadExamplePage.downloadPlainInvoicePdf(utilPdfHandler);
  expect.soft(PDFtext).toContain('Invoice');
  expect.soft(PDFtext).toContain('YesLogic Pty. Ltd. 7 / 39 Bouverie St Carlton VIC 3053 Australia www.yeslogic.com ABN 32 101 193 560');
  expect.soft(PDFtext).toContain('Customer Name Street Postcode City Country');
  expect.soft(PDFtext).toContain('Invoice date: Nov 26, 2016');
  expect.soft(PDFtext).toContain('Invoice number: 161126');
  expect.soft(PDFtext).toContain('Payment due: 30 days after invoice date');
  expect.soft(PDFtext).toContain('Description From Until Amount');
  expect.soft(PDFtext).toContain('Prince Upgrades & Support Nov 26, 2016 Nov 26, 2017 USD  $ 950.00');
  expect.soft(PDFtext).toContain('Total USD  $ 950.00');
  expect.soft(PDFtext).toContain('Please transfer amount to:');
  expect.soft(PDFtext).toContain('Bank account name: Yes Logic Pty Ltd');
  expect.soft(PDFtext).toContain('Name of Bank: Commonwealth Bank of Australia (CBA)');
  expect.soft(PDFtext).toContain('Bank State Branch (BSB): 063010');
  expect.soft(PDFtext).toContain('Bank State Branch (BSB): 063019');
  expect.soft(PDFtext).toContain('Bank account number: 13201652');
  expect.soft(PDFtext).toContain('Bank SWIFT code: CTBAAU2S');
  expect.soft(PDFtext).toContain('Bank address: 231 Swanston St, Melbourne, VIC 3000, Australia');
  expect.soft(PDFtext).toContain('The BSB number identifies a branch of a financial institution in Australia. When transferring money to Australia, the BSB number is used together with the bank account number and the SWIFT code. Australian banks do not use IBAN numbers.');

});

test('go to PDF download page and download blue sky and verify the contents', async ({ pdfDownloadExamplePage, utilPdfHandler }) => {
  await pdfDownloadExamplePage.goto();
  let PDFtext = await pdfDownloadExamplePage.downloadBlueSkyPdf(utilPdfHandler);
  expect.soft(PDFtext).toContain('Blue-sky printing');
  expect.soft(PDFtext).toContain('one: Ja v aScript');
  expect.soft(PDFtext).toContain('two: Mor e Ja v aScript');
  expect.soft(PDFtext).toContain('thr ee: CS S3 c olumns');
  expect.soft(PDFtext).toContain('4: Styling pag es');
  expect.soft(PDFtext).toContain('5: CS S3 tr ansf orms');
  expect.soft(PDFtext).toContain('6: Back gr ound imag es');
  expect.soft(PDFtext).toContain('7: CS S3 selectors');
  expect.soft(PDFtext).toContain('8: Mor e tr ansf orms');
  expect.soft(PDFtext).toContain('Prince');

});


