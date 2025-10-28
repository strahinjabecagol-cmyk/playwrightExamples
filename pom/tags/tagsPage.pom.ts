import { Expect, Locator, Page } from "@playwright/test";
import { BasePom } from "../base.pom";

export class TagsPage extends BasePom {
    readonly ContentInput: string;
    readonly removeTagsButton: Locator;
    readonly list: Locator;
    readonly listItems: Locator;
    readonly contentInputField: Locator;

    constructor(page: Page, expect: Expect) {
        super(page, expect);
        this.url = 'https://qaplayground.dev/apps/tags-input-box/';
        //selectors
        this.ContentInput = '.content input';
        //elements
        this.removeTagsButton = this.page.getByRole('button', { name: 'Remove All' });
        this.list = this.page.locator('ul');
        this.listItems = this.list.locator('li');
        this.contentInputField = this.page.locator(this.ContentInput);

    }


    async removeExistingTags() {
        await this.removeTagsButton.click();
    }

    async checkIfThereAreNoTags() {
        const listItemCount = await this.listItems.count();
        await this.expect(listItemCount).toBe(0);

    }

    async addNewTag(tagText: string) {
        await this.contentInputField.type(tagText);
        await this.pressEnter()

    }

    async checkIfTagExists(tagText: string) {
        await this.expect(this.list).toContainText(tagText);
    }


}


