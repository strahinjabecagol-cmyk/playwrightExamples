// sbecagolCalculator.pom.ts
import { BasePom } from "../base.pom";
import type { Page, Locator } from "@playwright/test";

// Type for Playwright's expect function
type PlaywrightExpect = typeof import("@playwright/test").expect;

/**
 * Page Object Model for sbecagol.com Calculator Application
 * A modern calculator with button-based interface, keyboard support, and theme toggle
 */
export class SbecagolCalculatorPom extends BasePom {
    // URL
    readonly url: string;

    // Display Elements
    readonly displayElement: Locator;
    readonly expressionDisplay: Locator;

    // Number Buttons (0-9)
    readonly button0: Locator;
    readonly button1: Locator;
    readonly button2: Locator;
    readonly button3: Locator;
    readonly button4: Locator;
    readonly button5: Locator;
    readonly button6: Locator;
    readonly button7: Locator;
    readonly button8: Locator;
    readonly button9: Locator;

    // Operator Buttons
    readonly buttonAdd: Locator;
    readonly buttonSubtract: Locator;
    readonly buttonMultiply: Locator;
    readonly buttonDivide: Locator;
    readonly buttonEquals: Locator;

    // Special Function Buttons
    readonly buttonDecimal: Locator;
    readonly buttonClear: Locator;
    readonly buttonBackspace: Locator;
    readonly buttonPercent: Locator;
    readonly buttonPlusMinus: Locator;

    // Theme Toggle
    readonly themeToggleButton: Locator;

    // Calculator application container
    readonly calculatorApp: Locator;

    constructor(page: Page, expect: PlaywrightExpect) {
        super(page, expect);
        this.url = "https://sbecagol.com/test-apps/calculator/";

        // Display elements - using more specific selectors
        // The calculator has a wrapper div containing two display divs
        this.calculatorApp = this.page.getByRole('application', { name: 'Calculator' });
        const calculatorApp = this.calculatorApp;
        this.displayElement = calculatorApp.locator('> div:first-child > div:nth-child(2)');
        this.expressionDisplay = calculatorApp.locator('> div:first-child > div:first-child');

        // Number buttons - using text content to find buttons
        this.button0 = this.page.getByRole('button', { name: '0', exact: true });
        this.button1 = this.page.getByRole('button', { name: '1', exact: true });
        this.button2 = this.page.getByRole('button', { name: '2', exact: true });
        this.button3 = this.page.getByRole('button', { name: '3', exact: true });
        this.button4 = this.page.getByRole('button', { name: '4', exact: true });
        this.button5 = this.page.getByRole('button', { name: '5', exact: true });
        this.button6 = this.page.getByRole('button', { name: '6', exact: true });
        this.button7 = this.page.getByRole('button', { name: '7', exact: true });
        this.button8 = this.page.getByRole('button', { name: '8', exact: true });
        this.button9 = this.page.getByRole('button', { name: '9', exact: true });

        // Operator buttons
        this.buttonAdd = this.page.getByRole('button', { name: '+', exact: true });
        this.buttonSubtract = this.page.getByRole('button', { name: '−', exact: true });
        this.buttonMultiply = this.page.getByRole('button', { name: '×', exact: true });
        this.buttonDivide = this.page.getByRole('button', { name: '÷', exact: true });
        this.buttonEquals = this.page.getByRole('button', { name: '=', exact: true });

        // Special function buttons
        this.buttonDecimal = this.page.getByRole('button', { name: '.', exact: true });
        this.buttonClear = this.page.getByRole('button', { name: 'AC', exact: true });
        this.buttonBackspace = this.page.getByRole('button', { name: '⌫', exact: true });
        this.buttonPercent = this.page.getByRole('button', { name: '%', exact: true });
        this.buttonPlusMinus = this.page.getByRole('button', { name: '±', exact: true });

        // Theme toggle
        this.themeToggleButton = this.page.getByRole('button', { name: 'Toggle dark/light mode' });
    }

    /**
     * Get the current display value
     */
    async getDisplayValue(): Promise<string> {
        const value = await this.displayElement.textContent() || '';
        return value.trim(); // Trim whitespace from display
    }

    /**
     * Get the expression display value
     */
    async getExpressionValue(): Promise<string> {
        const value = await this.expressionDisplay.textContent() || '';
        return value.trim(); // Trim whitespace from expression
    }

    /**
     * Click a number button by digit
     */
    async clickNumber(digit: number): Promise<void> {
        const buttons = [
            this.button0, this.button1, this.button2, this.button3, this.button4,
            this.button5, this.button6, this.button7, this.button8, this.button9
        ];
        await buttons[digit].click();
    }

    /**
     * Enter a multi-digit number by clicking buttons
     */
    async enterNumber(value: string): Promise<void> {
        for (const char of value) {
            if (char >= '0' && char <= '9') {
                await this.clickNumber(parseInt(char));
            } else if (char === '.') {
                await this.buttonDecimal.click();
            } else if (char === '-') {
                await this.buttonPlusMinus.click();
            }
        }
    }

    /**
     * Click addition operator
     */
    async clickAdd(): Promise<void> {
        await this.buttonAdd.click();
    }

    /**
     * Click subtraction operator
     */
    async clickSubtract(): Promise<void> {
        await this.buttonSubtract.click();
    }

    /**
     * Click multiplication operator
     */
    async clickMultiply(): Promise<void> {
        await this.buttonMultiply.click();
    }

    /**
     * Click division operator
     */
    async clickDivide(): Promise<void> {
        await this.buttonDivide.click();
    }

    /**
     * Click equals to calculate result
     */
    async clickEquals(): Promise<void> {
        await this.buttonEquals.click();
    }

    /**
     * Click clear (AC) button
     */
    async clickClear(): Promise<void> {
        await this.buttonClear.click();
    }

    /**
     * Click backspace button
     */
    async clickBackspace(): Promise<void> {
        await this.buttonBackspace.click();
    }

    /**
     * Click percent button
     */
    async clickPercent(): Promise<void> {
        await this.buttonPercent.click();
    }

    /**
     * Click plus/minus toggle button
     */
    async clickPlusMinus(): Promise<void> {
        await this.buttonPlusMinus.click();
    }

    /**
     * Click decimal point button
     */
    async clickDecimal(): Promise<void> {
        await this.buttonDecimal.click();
    }

    /**
     * Toggle theme (dark/light mode)
     */
    async toggleTheme(): Promise<void> {
        await this.themeToggleButton.click();
    }

    /**
     * Use keyboard to enter expression
     */
    async typeExpression(expression: string): Promise<void> {
        // Ensure focus is on the calculator to receive keyboard input
        await this.displayElement.click();
        await this.page.keyboard.type(expression);
    }

    /**
     * Press Enter key (equivalent to equals)
     */
    async pressEnter(): Promise<void> {
        // Ensure focus is on the calculator
        await this.displayElement.click();
        await this.page.keyboard.press('Enter');
    }

    /**
     * Press Escape key (equivalent to clear)
     */
    async pressEscape(): Promise<void> {
        // Ensure focus is on the calculator
        await this.displayElement.click();
        await this.page.keyboard.press('Escape');
    }

    /**
     * Press Backspace key
     * Note: Uses button click because keyboard Backspace triggers browser back navigation
     * The calculator app doesn't call preventDefault() on Backspace keydown events
     */
    async pressBackspace(): Promise<void> {
        await this.buttonBackspace.click();
    }

    /**
     * Assert display shows expected value
     */
    async expectDisplayValue(expected: string | RegExp): Promise<void> {
        await this.expect(this.displayElement).toHaveText(expected);
    }

    /**
     * Assert expression display shows expected value
     */
    async expectExpressionValue(expected: string | RegExp): Promise<void> {
        await this.expect(this.expressionDisplay).toHaveText(expected);
    }

    /**
     * Check if display contains text (useful for error messages)
     */
    async expectDisplayContains(text: string): Promise<void> {
        await this.expect(this.displayElement).toContainText(text);
    }
}
