import { BasePom } from "../base.pom";
import { Page, Expect, Locator } from "@playwright/test";

export class OnboardingModalPage extends BasePom {
    protected page: Page;
    protected expect: Expect;
    protected url: string;
    readonly welcomeMessageElement: Locator;
    readonly menyButtonElement: Locator;
    readonly welcomeOnBoardMessageElement: Locator;
    constructor(page: Page, expect: Expect) {
        super(page, expect);
        this.page = page;
        this.expect = expect;
        this.url = 'https://qaplayground.dev/apps/onboarding-modal/';
        //selectors

        //elements
        this.welcomeMessageElement = this.page.locator('.content .title');
        this.menyButtonElement = this.page.locator('.menu-btn');
        this.welcomeOnBoardMessageElement = this.page.locator('.wrapper ul li a');
    }

    async checkIfTheWelcomeMessageIsVisible() {
        await this.expect(this.welcomeMessageElement).toBeVisible();
    }

    async clickMenuButton() {
        await this.menyButtonElement.click();

    }

    async checkIfTheWelcomeOnBoardMessageIsVisible() {
        await this.expect(this.welcomeOnBoardMessageElement).toBeVisible();
    }

    async hoverWelcomeOnBoardMessage() {
        await this.welcomeOnBoardMessageElement.hover();
    }
}