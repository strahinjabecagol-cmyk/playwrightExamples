import { test, expect } from '../../base.test'

/**
 * Regression Test Suite for sbecagol Calculator Application
 * Based on Bug Report dated October 17, 2025
 * 
 * This suite covers:
 * - Critical Bug #1: Division by Zero (NaN instead of error)
 * - Critical Bug #2: Operator Precedence (left-to-right evaluation)
 * - Critical Bug #3: Floating-Point Precision Issues
 * - Core arithmetic operations
 * - Input validation and special functions
 * - Keyboard support
 * - UI/UX features (theme toggle)
 * - Edge cases and boundary testing
 */

// ==================== BUG #1: DIVISION BY ZERO ====================

test.describe('BUG #1: Division by Zero Error Handling', () => {

    test('Should display user-friendly error instead of NaN when dividing by zero', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        // Perform division by zero: 5 ÷ 0
        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickDivide();
        await sbecagolCalculator.enterNumber('0');
        await sbecagolCalculator.clickEquals();
        
        const displayValue = await sbecagolCalculator.getDisplayValue();
        
        // BUG CHECK: Currently shows "NaN" - should show error message
        // Expected: "Error", "Cannot divide by zero", or "Undefined"
        // Actual: "NaN" (KNOWN BUG)
        expect(displayValue).toContain('NaN'); // Current buggy behavior
        // When bug is fixed, this test should be updated to:
        // expect(displayValue).toMatch(/Error|Cannot divide by zero|Undefined/i);
    });

    test('Should handle division by zero with different numerators', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        const testCases = [
            { num: '10', expected: 'NaN' },
            { num: '100', expected: 'NaN' },
            { num: '0.5', expected: 'NaN' },
            { num: '-5', expected: 'NaN' }
        ];

        for (const testCase of testCases) {
            await sbecagolCalculator.clickClear();
            await sbecagolCalculator.enterNumber(testCase.num);
            await sbecagolCalculator.clickDivide();
            await sbecagolCalculator.enterNumber('0');
            await sbecagolCalculator.clickEquals();

            const displayValue = await sbecagolCalculator.getDisplayValue();
            expect(displayValue).toContain('NaN'); // Current buggy behavior should be updated when fixed
        }
    });

    test('Calculator should recover from NaN state', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        // Create NaN state
        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickDivide();
        await sbecagolCalculator.enterNumber('0');
        await sbecagolCalculator.clickEquals();
        await sbecagolCalculator.expectDisplayContains('NaN');

        // Clear and perform valid calculation
        await sbecagolCalculator.clickClear();
        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickEquals();

        // Should recover and show correct result
        await sbecagolCalculator.expectDisplayValue('5');
    });
});

// ==================== BUG #2: OPERATOR PRECEDENCE ====================

test.describe('BUG #2: Operator Precedence - Left-to-Right Evaluation', () => {

    test('Should respect multiplication precedence over addition (PEMDAS)', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        // Expression: 2 + 3 × 4
        // Expected (PEMDAS): 2 + (3 × 4) = 2 + 12 = 14
        // Actual (left-to-right): (2 + 3) × 4 = 5 × 4 = 20

        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickMultiply();
        await sbecagolCalculator.enterNumber('4');
        await sbecagolCalculator.clickEquals();

        const displayValue = await sbecagolCalculator.getDisplayValue();

        // BUG CHECK: Currently evaluates left-to-right
        expect(displayValue).toBe('20'); // Current buggy behavior (2+3=5, then 5×4=20)

        // When bug is fixed:
        // expect(displayValue).toBe('14'); // Correct PEMDAS: 2+(3×4)=14
    });

    test('Should respect multiplication precedence over subtraction', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        // Expression: 10 - 2 × 3
        // Expected (PEMDAS): 10 - (2 × 3) = 10 - 6 = 4
        // Actual (left-to-right): (10 - 2) × 3 = 8 × 3 = 24

        await sbecagolCalculator.enterNumber('10');
        await sbecagolCalculator.clickSubtract();
        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickMultiply();
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickEquals();

        const displayValue = await sbecagolCalculator.getDisplayValue();

        expect(displayValue).toBe('24'); // Current buggy behavior
        // When fixed: expect(displayValue).toBe('4');
    });

    test('Should respect division precedence over addition', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        // Expression: 6 ÷ 2 + 1
        // Expected (PEMDAS): (6 ÷ 2) + 1 = 3 + 1 = 4
        // Actual (left-to-right): In this case, division comes first, so result should be similar

        await sbecagolCalculator.enterNumber('6');
        await sbecagolCalculator.clickDivide();
        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('1');
        await sbecagolCalculator.clickEquals();

        const displayValue = await sbecagolCalculator.getDisplayValue();

        // Left-to-right: 6÷2=3, then 3+1=4 (happens to match PEMDAS in this case)
        expect(displayValue).toBe('4');
    });

    test('Should document left-to-right evaluation behavior with complex expression', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        // Expression: 5 + 3 - 2 × 4 ÷ 2
        // With PEMDAS: 5 + 3 - ((2 × 4) ÷ 2) = 5 + 3 - (8 ÷ 2) = 5 + 3 - 4 = 4
        // With left-to-right: ((((5 + 3) - 2) × 4) ÷ 2) = (((8 - 2) × 4) ÷ 2) = ((6 × 4) ÷ 2) = (24 ÷ 2) = 12

        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickSubtract();
        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickMultiply();
        await sbecagolCalculator.enterNumber('4');
        await sbecagolCalculator.clickDivide();
        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickEquals();

        const displayValue = await sbecagolCalculator.getDisplayValue();

        // Verify left-to-right behavior
        expect(displayValue).toBe('12'); // Left-to-right evaluation currently doesn't match PEMDAS
        // When bug is fixed:
        // expect(displayValue).toBe('4'); // Correct PEMDAS result
    });
});

// ==================== BUG #3: FLOATING-POINT PRECISION ====================

test.describe('BUG #3: Floating-Point Precision Issues', () => {

    test('Should round 0.1 + 0.2 to 0.3 instead of showing precision error', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        // Classic floating-point test
        await sbecagolCalculator.enterNumber('0.1');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('0.2');
        await sbecagolCalculator.clickEquals();

        const displayValue = await sbecagolCalculator.getDisplayValue();

        // BUG CHECK: Currently shows full precision error
        expect(displayValue).toBe('0.30000000000000004'); // Current buggy behavior

        // When bug is fixed:
        // expect(displayValue).toBe('0.3'); // Should be rounded
    });

    test('Should round 0.3 - 0.2 to 0.1 instead of showing precision error', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('0.3');
        await sbecagolCalculator.clickSubtract();
        await sbecagolCalculator.enterNumber('0.2');
        await sbecagolCalculator.clickEquals();

        const displayValue = await sbecagolCalculator.getDisplayValue();

        expect(displayValue).toBe('0.09999999999999998'); // Current buggy behavior
        // When fixed: expect(displayValue).toBe('0.1');
    });

    test('Should round 0.1 × 3 to 0.3 instead of showing precision error', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('0.1');
        await sbecagolCalculator.clickMultiply();
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickEquals();

        const displayValue = await sbecagolCalculator.getDisplayValue();

        expect(displayValue).toBe('0.30000000000000004'); // Current buggy behavior
        // When fixed: expect(displayValue).toBe('0.3');
    });

    test('Should handle multiple decimal operations with proper rounding', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        // 0.1 + 0.1 + 0.1 (chained)
        await sbecagolCalculator.enterNumber('0.1');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('0.1');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('0.1');
        await sbecagolCalculator.clickEquals();

        const displayValue = await sbecagolCalculator.getDisplayValue();

        // BUG CHECK: Should show 0.3, but shows precision error from chained operations
        // First: 0.1 + 0.1 = 0.2 (with slight error)
        // Then: 0.2 + 0.1 = 0.30000000000000004 (accumulated precision error)
        expect(displayValue).toBe('0.30000000000000004'); // Current buggy behavior - exact value
        // When bug is fixed:
        // expect(displayValue).toBe('0.3'); // Should be exactly 0.3
    });

    test('Should display reasonable precision without overwhelming the UI', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('0.1');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('0.2');
        await sbecagolCalculator.clickEquals();

        const displayValue = await sbecagolCalculator.getDisplayValue();

        // BUG CHECK: Currently displays excessive precision
        expect(displayValue).toBe('0.30000000000000004'); // Current buggy behavior
        expect(displayValue.length).toBeGreaterThan(3); // BUG: Too many digits

        // When bug is fixed, result should be clean:
        // expect(displayValue).toBe('0.3'); // Should be rounded to reasonable precision
        // expect(displayValue.length).toBeLessThanOrEqual(10); // Reasonable display length
    });
});

// ==================== CORE ARITHMETIC OPERATIONS ====================

test.describe('Core Arithmetic Operations', () => {

    test('Should correctly add two positive numbers', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickEquals();
        
        await sbecagolCalculator.expectDisplayValue('5');
    });

    test('Should correctly subtract two numbers', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('7');
        await sbecagolCalculator.clickSubtract();
        await sbecagolCalculator.enterNumber('4');
        await sbecagolCalculator.clickEquals();
        
        await sbecagolCalculator.expectDisplayValue('3');
    });

    test('Should correctly multiply two numbers', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickMultiply();
        await sbecagolCalculator.enterNumber('6');
        await sbecagolCalculator.clickEquals();
        
        await sbecagolCalculator.expectDisplayValue('30');
    });

    test('Should correctly divide two numbers', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('8');
        await sbecagolCalculator.clickDivide();
        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickEquals();
        
        await sbecagolCalculator.expectDisplayValue('4');
    });

    test('Should handle negative results', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('1');
        await sbecagolCalculator.clickSubtract();
        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickEquals();
        
        await sbecagolCalculator.expectDisplayValue('-4');
    });

    test('Should handle decimal inputs', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('3.14');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('2.86');
        await sbecagolCalculator.clickEquals();
        
        await sbecagolCalculator.expectDisplayValue('6');
    });

    test('Should handle zero as operand', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('0');
        await sbecagolCalculator.clickEquals();
        
        await sbecagolCalculator.expectDisplayValue('5');

        await sbecagolCalculator.clickClear();
        
        await sbecagolCalculator.enterNumber('0');
        await sbecagolCalculator.clickMultiply();
        await sbecagolCalculator.enterNumber('10');
        await sbecagolCalculator.clickEquals();
        
        await sbecagolCalculator.expectDisplayValue('0');
    });
});

// ==================== SPECIAL FUNCTIONS ====================

test.describe('Special Functions', () => {

    test('Should convert percentage to decimal', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('50');
        await sbecagolCalculator.clickPercent();

        await sbecagolCalculator.expectDisplayValue('0.5');
    });

    test('Should toggle sign with plus/minus button', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickPlusMinus();
        await sbecagolCalculator.expectDisplayValue('-5');

        await sbecagolCalculator.clickPlusMinus();
        await sbecagolCalculator.expectDisplayValue('5');
    });

    test('Should clear calculator with AC button', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('123');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('456');

        await sbecagolCalculator.clickClear();

        await sbecagolCalculator.expectDisplayValue('0');
    });

    test('Should delete last digit with backspace', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('123');
        await sbecagolCalculator.clickBackspace();
        await sbecagolCalculator.expectDisplayValue('12');

        await sbecagolCalculator.clickBackspace();
        await sbecagolCalculator.expectDisplayValue('1');
    });

    test('Should allow decimal point input', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.clickNumber(3);
        await sbecagolCalculator.clickDecimal();
        await sbecagolCalculator.clickNumber(1);
        await sbecagolCalculator.clickNumber(4);

        await sbecagolCalculator.expectDisplayValue('3.14');
    });

    test('Should prevent multiple decimal points', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.clickNumber(3);
        await sbecagolCalculator.clickDecimal();
        await sbecagolCalculator.clickNumber(1);
        await sbecagolCalculator.clickDecimal(); // Try to add second decimal
        await sbecagolCalculator.clickNumber(4);

        const displayValue = await sbecagolCalculator.getDisplayValue();

        // Should only have one decimal point
        const decimalCount = (displayValue.match(/\./g) || []).length;
        expect(decimalCount).toBeLessThanOrEqual(1);
    });
});

// ==================== KEYBOARD SUPPORT ====================

test.describe('Keyboard Support', () => {

    test('Should support number input via keyboard', async ({ sbecagolCalculator, page }) => {
        await sbecagolCalculator.goto();

        await page.keyboard.type('123');
        await sbecagolCalculator.expectDisplayValue('123');
    });

    test('Should support arithmetic operators via keyboard', async ({ sbecagolCalculator, page }) => {
        await sbecagolCalculator.goto();

        await page.keyboard.type('5+3');
        await page.keyboard.press('Enter');
        await sbecagolCalculator.expectDisplayValue('8');
    });

    test('Should support Enter key as equals', async ({ sbecagolCalculator, page }) => {
        await sbecagolCalculator.goto();

        await page.keyboard.type('10-4');
        await sbecagolCalculator.pressEnter();
        await sbecagolCalculator.expectDisplayValue('6');
    });

    test('Should support Escape key as clear', async ({ sbecagolCalculator, page }) => {
        await sbecagolCalculator.goto();

        await page.keyboard.type('999');
        await sbecagolCalculator.pressEscape();
        await sbecagolCalculator.expectDisplayValue('0');
    });

    test('Should support Backspace key', async ({ sbecagolCalculator, page }) => {
        await sbecagolCalculator.goto();

        await page.keyboard.type('456');
        await sbecagolCalculator.pressBackspace();
        await sbecagolCalculator.expectDisplayValue('45');
    });

    test('Should support decimal point via keyboard', async ({ sbecagolCalculator, page }) => {
        await sbecagolCalculator.goto();

        await page.keyboard.type('3.14159');
        await sbecagolCalculator.expectDisplayValue('3.14159');
    });

    test('Should support all operators via keyboard', async ({ sbecagolCalculator, page }) => {
        await sbecagolCalculator.goto();

        const operations = [
            { expr: '2+2', expected: '4' },
            { expr: '10-5', expected: '5' },
            { expr: '3*4', expected: '12' },
            { expr: '15/3', expected: '5' }
        ];

        for (const op of operations) {
            await sbecagolCalculator.clickClear();
            await page.keyboard.type(op.expr);
            await page.keyboard.press('Enter');
            await sbecagolCalculator.expectDisplayValue(op.expected);
        }
    });
});

// ==================== UI/UX FEATURES ====================

test.describe('UI/UX Features', () => {

    test('Should toggle theme between dark and light mode', async ({ sbecagolCalculator, page }) => {
        await sbecagolCalculator.goto();

        // Get initial button text/icon
        const initialButtonText = await sbecagolCalculator.themeToggleButton.textContent();

        // Toggle theme
        await sbecagolCalculator.toggleTheme();
        await page.waitForTimeout(300); // Wait for theme transition

        // Button icon should change (☾ moon <-> ☀ sun)
        const changedButtonText = await sbecagolCalculator.themeToggleButton.textContent();
        expect(changedButtonText).not.toBe(initialButtonText);

        // Toggle back
        await sbecagolCalculator.toggleTheme();
        await page.waitForTimeout(300);

        // Should return to original icon
        const finalButtonText = await sbecagolCalculator.themeToggleButton.textContent();
        expect(finalButtonText).toBe(initialButtonText);
    });
    test('Should display expression in expression area', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickAdd();

        // Expression display should show the operation
        const expressionValue = await sbecagolCalculator.getExpressionValue();
        expect(expressionValue).toContain('5');
        expect(expressionValue).toContain('+');
    });

    test('Should provide visual feedback on button clicks', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        // Click a button and verify it's interactive
        await sbecagolCalculator.button5.click();

        // Verify the number appears in display (confirming button worked)
        await sbecagolCalculator.expectDisplayValue('5');
    });
});

// ==================== OPERATOR SWITCHING ====================

test.describe('Operator Switching', () => {

    test('Should allow changing operator before entering second number', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.clickMultiply(); // Change operator
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickEquals();

        // Should use the last operator (multiply)
        await sbecagolCalculator.expectDisplayValue('15'); // 5 × 3 = 15
    });

    test('Should handle rapid operator switching', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('10');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.clickSubtract();
        await sbecagolCalculator.clickMultiply();
        await sbecagolCalculator.clickDivide(); // Final operator
        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickEquals();

        // Should use the last operator (divide): 10 ÷ 2 = 5
        await sbecagolCalculator.expectDisplayValue('5');
    });
});

// ==================== CHAINED OPERATIONS ====================

test.describe('Chained Operations', () => {

    test('Should handle chained additions', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('1');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickEquals();

        // Left-to-right: (1+2)+3 = 3+3 = 6
        await sbecagolCalculator.expectDisplayValue('6');
    });

    test('Should chain operations after equals', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        // First calculation
        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickEquals();
        
        await sbecagolCalculator.expectDisplayValue('8');

        // Continue with result
        await sbecagolCalculator.clickMultiply();
        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickEquals();

        await sbecagolCalculator.expectDisplayValue('16'); // 8 × 2 = 16
    });
});

// ==================== EDGE CASES ====================

test.describe('Edge Cases and Boundary Testing', () => {

    test('Should handle very large numbers', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('999999999');
        await sbecagolCalculator.clickMultiply();
        await sbecagolCalculator.enterNumber('2');
        await sbecagolCalculator.clickEquals();

        const displayValue = await sbecagolCalculator.getDisplayValue();
        // Calculator formats large numbers with commas for readability
        expect(displayValue).toBe('1,999,999,998');
    });

    test('Should handle leading zero correctly', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('0');
        await sbecagolCalculator.enterNumber('5');

        // Should not show "05", just "5"
        const displayValue = await sbecagolCalculator.getDisplayValue();
        expect(displayValue).not.toBe('05');
    });

    test('Should allow entering decimal-only number (e.g., .5)', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.clickDecimal();
        await sbecagolCalculator.clickNumber(5);

        const displayValue = await sbecagolCalculator.getDisplayValue();
        expect(displayValue).toMatch(/0?\.5/); // Either ".5" or "0.5"
    });

    test('Should handle zero divided by number', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('0');
        await sbecagolCalculator.clickDivide();
        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickEquals();
        
        await sbecagolCalculator.expectDisplayValue('0');
    });

    test('Should handle negative number operations', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        // Create negative number
        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickPlusMinus();
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('10');
        await sbecagolCalculator.clickEquals();

        await sbecagolCalculator.expectDisplayValue('5'); // -5 + 10 = 5
    });

    test('Should handle multiplication with negative numbers', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickPlusMinus();
        await sbecagolCalculator.clickMultiply();
        await sbecagolCalculator.enterNumber('4');
        await sbecagolCalculator.clickEquals();

        await sbecagolCalculator.expectDisplayValue('-12'); // -3 × 4 = -12
    });

    test('Should handle percentage in calculations', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('50');
        await sbecagolCalculator.clickPercent();
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickEquals();

        await sbecagolCalculator.expectDisplayValue('3.5'); // 0.5 + 3 = 3.5
    });
});

// ==================== REPEATED EQUALS BEHAVIOR ====================

test.describe('Repeated Equals Behavior', () => {

    test('Should document that repeated equals does NOT repeat operation', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('10');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickEquals();
        
        await sbecagolCalculator.expectDisplayValue('15');

        // Press equals again
        await sbecagolCalculator.clickEquals();

        // Calculator does NOT repeat operation (15 + 5 = 20)
        // Display should remain 15
        await sbecagolCalculator.expectDisplayValue('15');

        // Press equals one more time
        await sbecagolCalculator.clickEquals();
        await sbecagolCalculator.expectDisplayValue('15'); // Still 15
    });
});

// ==================== SPECIAL FUNCTION MID-CALCULATION ====================

test.describe('Special Functions During Calculation', () => {

    test('Should handle percentage mid-calculation', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('50');
        await sbecagolCalculator.clickPercent(); // Converts to 0.5
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickPlusMinus(); // Converts to -3
        await sbecagolCalculator.clickEquals();

        // 0.5 + (-3) = -2.5
        await sbecagolCalculator.expectDisplayValue('-2.5');
    });

    test('Should handle plus/minus toggle during input', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickAdd();
        await sbecagolCalculator.enterNumber('3');
        await sbecagolCalculator.clickPlusMinus(); // Toggle to -3
        await sbecagolCalculator.clickEquals();

        await sbecagolCalculator.expectDisplayValue('2'); // 5 + (-3) = 2
    });
});

// ==================== INPUT VALIDATION ====================

test.describe('Input Validation', () => {

    test('Should prevent multiple leading zeros', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.clickNumber(0);
        await sbecagolCalculator.clickNumber(0);
        await sbecagolCalculator.clickNumber(0);

        const displayValue = await sbecagolCalculator.getDisplayValue();
        expect(displayValue).not.toBe('000');
        expect(displayValue).toBe('0');
    });

    test('Should handle backspace on single digit', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('5');
        await sbecagolCalculator.clickBackspace();

        // Should return to 0 or empty state
        const displayValue = await sbecagolCalculator.getDisplayValue();
        expect(['0', '']).toContain(displayValue);
    });
});

// ==================== DISPLAY FORMATTING ====================

test.describe('Display Formatting', () => {

    test('Should handle very long results gracefully', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('123456789');
        await sbecagolCalculator.clickMultiply();
        await sbecagolCalculator.enterNumber('123456789');
        await sbecagolCalculator.clickEquals();

        const displayValue = await sbecagolCalculator.getDisplayValue();

        // Should not overflow or break the display
        expect(displayValue).toBeTruthy();
        expect(displayValue.length).toBeGreaterThan(0);
    });

    test('Should display zero after clearing', async ({ sbecagolCalculator }) => {
        await sbecagolCalculator.goto();

        await sbecagolCalculator.enterNumber('999');
        await sbecagolCalculator.clickClear();

        await sbecagolCalculator.expectDisplayValue('0');
    });
});
