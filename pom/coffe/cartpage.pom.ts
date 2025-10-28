import { Page, Locator, expect as PlaywrightExpect } from '@playwright/test';
import { BasePom } from '../base.pom';

export class CartPage extends BasePom {
    private snackbarSelector: string;
    private orderListElement: Locator;
    private checkoutButtonElement: Locator;
    private checkoutNameElement: Locator;
    private checkoutEmailElement: Locator;
    private checkoutSubmitButtonElement: Locator;
    private snackbarElement: Locator;

    constructor(page: Page, expect: typeof PlaywrightExpect) {
        super(page, expect);
        this.url = 'https://coffee-cart.app/cart';
        this.snackbarSelector = '.snackbar';

        this.orderListElement = this.page.locator('#app > div.list > div > ul');
        this.checkoutButtonElement = this.page.locator('.pay');
        this.checkoutNameElement = this.page.getByRole('textbox', { name: 'Name' });
        this.checkoutEmailElement = this.page.getByRole('textbox', { name: 'Email' });
        this.checkoutSubmitButtonElement = this.page.getByRole('button', { name: 'Submit' });
        this.snackbarElement = this.page.locator(this.snackbarSelector);
    }

    async checkIfItsTheRightCoffee(text: string |RegExp ): Promise<void> {
        await this.expect(this.orderListElement).toContainText(text);
    }

    async clickCheckoutButton(): Promise<void> {
        await this.checkoutButtonElement.click();
    }

    async fillCheckoutOptionName(name: string): Promise<void> {
        await this.checkoutNameElement.fill(name);
    }

    async fillCheckoutOptionEmail(email: string): Promise<void> {
        await this.checkoutEmailElement.fill(email);
    }

    async submitCheckoutOptions(): Promise<void> {
        await this.checkoutSubmitButtonElement.click();
    }

    async checkIfSnackbarIsVisible(): Promise<void> {
        await this.expect(this.snackbarElement).toBeVisible();
    }
}
