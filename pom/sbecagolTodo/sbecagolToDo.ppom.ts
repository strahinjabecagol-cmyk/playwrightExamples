import { Expect, Locator, Page } from "@playwright/test";
import { BasePom } from "../base.pom.js";

export class SbecagolToDo extends BasePom {
    readonly theBodyElement: Locator;

    constructor(page: Page, expect: Expect) {
        super(page, expect);
        this.url = 'https://sbecagol.com/test-apps/todo-list/';
        //selectors
        this.theBodyElement = this.page.locator('body');
        //elements

    }

    async changeToLightMode() {
        this.page.getByRole('button', { name: 'Toggle dark/light mode' }).click();
    }

    async changeToDarkMode() {
        this.page.getByRole('button', { name: 'Toggle dark/light mode' }).click();
    }

    async getTheBodyElement() {
        return this.theBodyElement;

    }

    async fillToDoTextBox(text: string) {
        await this.page.getByRole('textbox', { name: 'New todo' }).fill(text);
    }

    async cliclAddButton() {
        await this.page.getByRole('button', { name: 'Add' }).click();
    }

    async dleteNthItemFromTheList(n: number) {
        await this.page.getByTitle('Delete').nth(n).click();
    }

    async markNthItenAsComplete(n: number) {
        await this.page.getByLabel('Toggle completion').nth(n).click();
    }

    async getAllCompletedItems() {
        return this.page.locator('.completed');
    }

    async getAllToDoItems() {
        return this.page.locator('.todo');
    }

    async getAllListItems() {
        return this.page.getByRole('listitem');
    }

    async clickActiveFilter() {
        await this.page.getByRole('button', { name: 'Active' }).click();
    }

    async clickCompletedFilter() {
        await this.page.getByRole('button', { name: 'Completed', exact: true }).click();
    }

    async clickClearCompleted() {
        await this.page.getByRole('button', { name: 'Clear completed' }).click();

    }
}


