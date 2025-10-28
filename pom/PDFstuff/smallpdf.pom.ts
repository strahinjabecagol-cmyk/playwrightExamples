import { Expect, Locator, Page } from "@playwright/test";
import { BasePom } from "../base.pom.js";
import { UtiPDFhandler } from "../../utilities/utilPdfHandler.js";

export class Smallpdf extends BasePom {


    constructor(page: Page, expect: Expect) {
        super(page, expect);
        this.url = 'https://smallpdf.com/blog/sample-pdf';

        //selectors

    }
    async clickDownloadBtn() {
        await this.page.getByRole('link', { name: 'Download Sample PDF' }).click();

    }

    async clickAddNewPdfPage() {
        await this.page.getByRole('button', { name: 'Add PDF, image, Word, Excel,' }).click();

    }

}
