
import { Expect, Locator, Page } from "@playwright/test";
import { BasePom } from "../base.pom";
export class VerifyAccountPage extends BasePom {
    readonly input1: Locator;
    readonly input2: Locator;
    readonly input3: Locator;
    readonly input4: Locator;
    readonly input5: Locator;
    readonly input6: Locator;
    readonly numInputs: Locator[];
    constructor(page: Page, expect: Expect) {
        super(page, expect);
        this.url = 'https://qaplayground.dev/apps/verify-account/';
        //elements
        this.input1 = this.page.locator('.code-container input:nth-child(1)');
        this.input2 = this.page.locator('.code-container input:nth-child(2)');
        this.input3 = this.page.locator('.code-container input:nth-child(3)');
        this.input4 = this.page.locator('.code-container input:nth-child(4)');
        this.input5 = this.page.locator('.code-container input:nth-child(5)');
        this.input6 = this.page.locator('.code-container input:nth-child(6)');

        this.numInputs = [
            this.input1,
            this.input2,
            this.input3,
            this.input4,
            this.input5,
            this.input6,
        ]
    }


    async fillTheCodebyTypingNumbers() {
        for (let i = 0; i <= 5; i++) {
            await this.numInputs[i].type('9');
        }


    }

    async fillByUsingArows() {
        for (let a = 0; a <= 5; a++) {
            await this.numInputs[a].click();
            for (let i = 0; i <= 8; i++) {
                await this.pressArrowUp();

            }
            await this.expect(this.numInputs[a]).toHaveValue(/9/);

        }
    }

    async checkIfSuccessfull() {
        await this.expect(this.page.locator('small')).toHaveText('Success');

    }
}