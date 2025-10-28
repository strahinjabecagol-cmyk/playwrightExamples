import { Expect, Locator, Page } from "@playwright/test";
import { BasePom } from "../base.pom.js";

export class QrCodePage extends BasePom {


    constructor(page: Page, expect: Expect) {
        super(page, expect);
        this.url = 'https://qaplayground.dev/apps/qr-code-generator/';

        //selectors

    }


    async fillStringToField(text: string) {
        await this.page.getByRole('textbox', { name: 'Enter text or URL' }).fill(text);

    }

    async clickGenerateButton() {
        await this.page.getByRole('button', { name: 'Generate QR Code' }).click();

    }


}


