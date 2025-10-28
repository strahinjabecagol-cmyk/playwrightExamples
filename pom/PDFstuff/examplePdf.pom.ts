import { Expect, Locator, Page } from "@playwright/test";
import { BasePom } from "../base.pom.js";
import { UtiPDFhandler } from "../../utilities/utilPdfHandler.js";

export class PdfDownloadExamplePage extends BasePom {


    constructor(page: Page, expect: Expect) {
        super(page, expect);
        this.url = 'https://www.princexml.com/samples/';

        //selectors

    }
    async clickInvoicePdf() {
        await this.page.getByRole('link', { name: 'PDF' }).nth(1).click();
    }
    async clickPlainInvoicePdf() {
        await this.page.getByRole('link', { name: 'PDF' }).nth(2).click();
    }
    async clickBlueSkyPdf() {
        await this.page.getByRole('link', { name: 'PDF' }).nth(6).click();
    }

    async getDownloadPromise() {
        return await this.page.waitForEvent('download');
    }


    async downloadBlueSkyPdf(utilPdfHandler: UtiPDFhandler) {
        const downloadPromise = this.getDownloadPromise();
        await this.clickBlueSkyPdf();
        const download = await downloadPromise;
        const downloadPath = `./downloads/${download.suggestedFilename()}`;
        await download.saveAs(downloadPath);
        let result = await utilPdfHandler.getPDFtextContent(downloadPath);
        return result;
    }
    async downloadPlainInvoicePdf(utilPdfHandler: UtiPDFhandler) {
        const downloadPromise = this.getDownloadPromise();
        await this.clickPlainInvoicePdf();
        const download = await downloadPromise;
        const downloadPath = `./downloads/${download.suggestedFilename()}`;
        await download.saveAs(downloadPath);
        let result = await utilPdfHandler.getPDFtextContent(downloadPath);
        return result;
    }
    async downloadInvoicePdf(utilPdfHandler: UtiPDFhandler) {
        const downloadPromise = this.getDownloadPromise();
        await this.clickInvoicePdf();
        const download = await downloadPromise;
        const downloadPath = `./downloads/${download.suggestedFilename()}`;
        await download.saveAs(downloadPath);
        let result = await utilPdfHandler.getPDFtextContent(downloadPath);
        return result;
    }

}


