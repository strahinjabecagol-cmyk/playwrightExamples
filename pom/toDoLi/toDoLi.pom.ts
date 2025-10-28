import { UtilPlaywright } from "../../utilities/utilPlaywright"
import { Page, Expect, Locator } from '@playwright/test';

export class ToDoLiBasePage extends UtilPlaywright {
    protected page: Page;
    protected expect: Expect;
    protected url: string;
    readonly inputField: Locator;

    constructor(page: Page, expect: Expect) {
        super(page);
        this.page = page;
        this.expect = expect;
        this.url = 'https://todolist.james.am/#/';

        //elements
        this.inputField = this.page.getByRole('textbox', { name: 'What need\'s to be done?' })


    }

    async goto() {
        await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });

    }

    async waitForPageToLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async addAnItem(itemName: string) {
        await this.inputField.click();
        await this.inputField.fill(itemName);
        await this.inputField.press('Enter');

    }

    async checkItemAsDone(itemText: string) {
        await this.page.getByRole('listitem').filter({ hasText: itemText }).getByRole('checkbox').check();

    }

    async clickActiveLink() {
        await this.page.getByRole('link', { name: 'active' }).click();

    }

    async clickCompletedLink() {
        await this.page.getByRole('link', { name: 'Completed' }).click();

    }
    async clickClear() {
        await this.page.getByRole('button', { name: 'Clear' }).click();

    }

    async clickAll() {
        await this.page.getByRole('link', { name: 'All' }).click();

    }

    async clickX() {
        await this.page.getByRole('button', { name: '×' }).click();

    }

    async clickCheckbox() {
        await this.page.locator('div').getByRole('checkbox').first().check();

    }

}