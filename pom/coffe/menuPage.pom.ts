import { BasePom } from "../base.pom";
import type { Page, Locator } from "@playwright/test";
type PlaywrightExpect = typeof import("@playwright/test").expect;

export class MenuPage extends BasePom {
    readonly espressoMacchiatoSelector: string;
    readonly espressoSelector: string;
    readonly payContainerSelector: string;
    readonly directCheckoutSelector: string;
    readonly snackbarSelector: string;
    readonly confirmBanerOferChoiceSelector: string;
    readonly espressoMacchiatoElement: Locator;
    readonly espressElement: Locator;
    readonly cappuccionElement: Locator;
    readonly payContainer: Locator;
    readonly directCheckoutElement: Locator;
    readonly paymendTetailesElement: Locator;
    readonly checkoutOptionNameElement: Locator;
    readonly checkoutOptionEmailElement: Locator;
    readonly submitCheckoutButtonElement: Locator;
    readonly snackBarElement: Locator;
    readonly cartPageLinkElement: Locator;
    readonly promoBanerElement: Locator;
    readonly confirmBanerOferChoiceElement: Locator;


    constructor(page: Page, expect: PlaywrightExpect) {
        super(page, expect);
        this.url = 'https://coffee-cart.app/';
        //selectors
        this.espressoMacchiatoSelector = 'li:nth-child(2) .cup-body';
        this.espressoSelector = '[data-test="Espresso"]';
        this.payContainerSelector = '.pay-container';
        this.directCheckoutSelector = '[data-test="checkout"]';
        this.snackbarSelector = '.snackbar';
        this.confirmBanerOferChoiceSelector = '.buttons .yes';
        //elements
        this.espressoMacchiatoElement = this.page.locator(this.espressoMacchiatoSelector);
        this.espressElement = this.page.locator('[data-test="Espresso"]');
        this.cappuccionElement = this.page.locator('[data-test="Cappuccino"]');
        this.payContainer = this.page.locator(this.payContainerSelector);
        this.directCheckoutElement = this.page.locator(this.directCheckoutSelector);
        this.paymendTetailesElement = this.page.getByText('Payment details×We will send');
        this.checkoutOptionNameElement = this.page.getByRole('textbox', { name: 'Name' });
        this.checkoutOptionEmailElement = this.page.getByRole('textbox', { name: 'Email' });
        this.submitCheckoutButtonElement = this.page.getByRole('button', { name: 'Submit' })
        this.snackBarElement = this.page.locator(this.snackbarSelector);
        this.cartPageLinkElement = this.page.getByRole('link', { name: 'Cart page' });
        this.promoBanerElement = this.page.getByText('It\'s your lucky day! Get an extra cup of Mocha for $4.espressochocolate');
        this.confirmBanerOferChoiceElement = this.page.locator(this.confirmBanerOferChoiceSelector);

    }


    async clickOnEspressoMacchiato() {
        await this.espressoMacchiatoElement.click();
    }
    async clickOnEspresso() {
        await this.espressElement.click();
    }
    async clickOnCappuccino() {
        await this.cappuccionElement.click();
    }

    async hoverPayContainer() {
        await this.payContainer.hover();
    }

    async checkIfPayContainerContainsText(text:string) {
        await this.expect(this.payContainer).toContainText(text);

    }

    async clickDirectCheckout() {
        await this.directCheckoutElement.click();

    }

    async checkIfCheckoutOptionsAreVisible() {
        await this.expect(this.paymendTetailesElement).toBeVisible();

    }

    async fillCheckoutOptionName(name:string) {
        await this.checkoutOptionNameElement.fill(name);

    }

    async fillCheckoutOptionEmail(email:string) {
        await this.checkoutOptionEmailElement.fill(email);

    }

    async submitCheckoutOptions() {
        await this.submitCheckoutButtonElement.click();
    }

    async checkIfSnackbarIsVisible() {
        await this.expect(this.snackBarElement).toBeVisible();

    }

    async clickCartPageLink() {
        await this.cartPageLinkElement.click()

    }

    async checkIfOfferBanerIsShown() {
        await this.expect(this.promoBanerElement).toBeVisible()
    }

    async clickConfirmOnBanerOffer() {
        await this.confirmBanerOferChoiceElement.click();

    }

}