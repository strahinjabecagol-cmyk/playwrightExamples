// calculator.pom.ts
import { BasePom } from "../base.pom";
import type { Page, Locator } from "@playwright/test";

// Type for Playwright's expect function
type PlaywrightExpect = typeof import("@playwright/test").expect;

export class CalculatorPom extends BasePom {
    // URL
    readonly url: string;

    // selectors
    readonly numberField1Selector: string;
    readonly numberField2Selector: string;
    readonly calculateBtnSelector: string;
    readonly numberAnswerFieldSelector: string;
    readonly selectOperationFieldSelector: string;
    readonly selectAddOption: string;
    readonly selectSubstractOption: string; // keeping your original naming
    readonly selectMultplyOption: string;   // keeping your original naming
    readonly selectDivideOption: string;
    readonly selectConcatinateOption: string; // keeping your original naming
    readonly buildSelectionFieldSelector: string;

    // elements
    readonly numField1Element: Locator;
    readonly numField2Element: Locator;
    readonly calculateButton: Locator;
    readonly resultFieldElement: Locator;
    readonly operationSelectionFieldElement: Locator;
    readonly buildSelectionFieldElement: Locator;

    constructor(page: Page, expect: PlaywrightExpect) {
        super(page, expect);
        this.url = "https://testsheepnz.github.io/BasicCalculator.html";

        // selectors
        this.numberField1Selector = "number1Field";
        this.numberField2Selector = "number2Field";
        this.calculateBtnSelector = "calculateButton";
        this.numberAnswerFieldSelector = "numberAnswerField";
        this.selectOperationFieldSelector = "selectOperationDropdown";
        this.selectAddOption = "0";
        this.selectSubstractOption = "1";
        this.selectMultplyOption = "2";
        this.selectDivideOption = "3";
        this.selectConcatinateOption = "4";
        this.buildSelectionFieldSelector = "selectBuild";

        // elements
        this.numField1Element = this.page.getByTestId(this.numberField1Selector);
        this.numField2Element = this.page.getByTestId(this.numberField2Selector);
        this.calculateButton = this.page.getByTestId(this.calculateBtnSelector);
        this.resultFieldElement = this.page.getByTestId(this.numberAnswerFieldSelector);
        this.operationSelectionFieldElement = this.page.getByTestId(this.selectOperationFieldSelector);
        this.buildSelectionFieldElement = this.page.getByTestId(this.buildSelectionFieldSelector);
    }

    async fillNumber1Field(value: string): Promise<void> {
        await this.numField1Element.fill(value);
    }

    async fillNumber2Field(value: string): Promise<void> {
        await this.numField2Element.fill(value);
    }

    async clickCalculateBtn(): Promise<void> {
        await this.calculateButton.click();
    }

    async checkResultAgainstValue(value: string | RegExp): Promise<void> {
        await this.expect(this.resultFieldElement).toHaveValue(value);
    }

    async selectAdd(): Promise<void> {
        await this.operationSelectionFieldElement.selectOption(this.selectAddOption);
    }

    async selectSubstract(): Promise<void> {
        await this.operationSelectionFieldElement.selectOption(this.selectSubstractOption);
    }

    async selectMultiply(): Promise<void> {
        await this.operationSelectionFieldElement.selectOption(this.selectMultplyOption);
    }

    async selectDivide(): Promise<void> {
        await this.operationSelectionFieldElement.selectOption(this.selectDivideOption);
    }

    async selectConcatinate(): Promise<void> {
        await this.operationSelectionFieldElement.selectOption(this.selectConcatinateOption);
    }

    async selectBuild(value: string): Promise<void> {
        await this.buildSelectionFieldElement.selectOption(value);
    }
}
