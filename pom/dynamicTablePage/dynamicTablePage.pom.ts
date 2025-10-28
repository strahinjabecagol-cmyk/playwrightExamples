import { Expect, Locator, Page } from "@playwright/test";
import { BasePom } from "../base.pom"
import { realpathSync } from "fs";

export class DynamicTablePage extends BasePom {
    readonly spidermanSelectorName: string;
    readonly ironmanSelectorname: string;
    readonly hulkSelectorName: string;
    readonly spidermanCellElement: Locator;
    readonly ironManCellElement: Locator;
    readonly hulkCellElement: Locator;
    readonly table: Locator;
    readonly tableHeader: Locator;
    readonly tableBody: Locator;

    constructor(page: Page, expect: Expect) {
        super(page, expect);
        this.url = 'https://qaplayground.dev/apps/dynamic-table/';
        //selectors
        this.spidermanSelectorName = 'Spider-Man spider-man@';
        this.ironmanSelectorname = 'Iron Man iron-man@avengers.com';
        this.hulkSelectorName = 'Hulk hulk@avengers.com';
        //elements
        this.spidermanCellElement = this.page.getByRole('cell', { name: this.spidermanSelectorName });
        this.ironManCellElement = this.page.getByRole('cell', { name: this.ironmanSelectorname });
        this.hulkCellElement = this.page.getByRole('cell', { name: this.hulkSelectorName });
        
        // Table elements
        this.table = this.page.locator('table');
        this.tableHeader = this.table.locator('thead');
        this.tableBody = this.table.locator('tbody');

    }



    async checkIfSpidermanIsVisibleInTheTable() {
        await this.expect(this.spidermanCellElement).toBeVisible();

    }


    async checkIfIronManIsVisibleInTheTable() {
        await this.expect(this.ironManCellElement).toBeVisible();

    }

    async checkIfHulkIsVisibleInTheTable() {
        await this.expect(this.hulkCellElement).toBeVisible();

    }

    async getSpidermanCellElement() {
        return this.spidermanCellElement;

    }

    async getHulkCellElement() {
        return this.hulkCellElement;

    }

    async getIronManCellElement() {
        return this.ironManCellElement;

    }

    // Table Structure Methods
    async verifyTableHeaders(expectedHeaders: string[]) {
        const headers = this.tableHeader.locator('th');
        await this.expect(headers).toHaveCount(expectedHeaders.length);
        
        for (let i = 0; i < expectedHeaders.length; i++) {
            await this.expect(headers.nth(i)).toContainText(expectedHeaders[i]);
        }
    }

    async verifyTableRowCount(expectedCount: number) {
        const rows = this.tableBody.locator('tr');
        await this.expect(rows).toHaveCount(expectedCount);
    }

    async verifyTableIsVisible() {
        await this.expect(this.table).toBeVisible();
        await this.expect(this.tableHeader).toBeVisible();
        await this.expect(this.tableBody).toBeVisible();
    }

    // Hero Data Validation Methods
    async verifyHeroExists(heroName: string, email: string) {
        const heroCell = this.page.getByRole('cell', { name: new RegExp(heroName) });
        await this.expect(heroCell).toBeVisible();
        await this.expect(heroCell).toContainText(email);
    }

    async verifyHeroData(heroName: string, email: string, status: string, realName: string) {
        // Find the row containing the hero
        const row = this.page.locator('tr', { has: this.page.locator(`text=${heroName}`) });
        await this.expect(row).toBeVisible();
        
        // Verify all data in the row
        await this.expect(row).toContainText(heroName);
        await this.expect(row).toContainText(email);
        await this.expect(row).toContainText(status);
        await this.expect(row).toContainText(realName);
    }

    async getHeroRow(heroName: string) {
        return this.page.locator('tr', { has: this.page.locator(`text=${heroName}`) });
    }


}