import { Expect, Locator, Page } from "@playwright/test";
import { BasePom } from "../base.pom.js";

export class ShadowDomPage extends BasePom {
    readonly boostButtonSelector: string;
    readonly progressBarSelector: string;
    readonly boostButtonElement: Locator;
    readonly progressBarElement: Locator;

    constructor(page: Page, expect: Expect) {
        super(page, expect);
        this.url = 'https://qaplayground.dev/apps/shadow-dom/';
        //selectors
        this.boostButtonSelector = '.btn-green-outline';
        this.progressBarSelector = '.fill';
        //elements
        this.boostButtonElement = this.page.locator(this.boostButtonSelector);
        this.progressBarElement = this.page.locator(this.progressBarSelector);
    }

    async clickBoostButton() {
        await this.boostButtonElement.click();

    }

    async checkIfTheValueMatches(value: string) {
        this.expect(await this.progressBarElement.getAttribute('style')).toContain(value);

    }
}


