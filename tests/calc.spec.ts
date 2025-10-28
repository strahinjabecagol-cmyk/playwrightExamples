import { test, expect } from '../base.test';
import build from '../data/calcData/testData.json';
import testData from '../data/calcData/allTestData.json';

build.forEach((build) => {
    test('add 5 and 5 on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.basicOperations.addition.num1);
        await calculatorPage.fillNumber2Field(testData.basicOperations.addition.num2);
        await calculatorPage.selectAdd();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.basicOperations.addition.expected);

    });
    test('substract 4 from 8 on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.basicOperations.substraction.num1);
        await calculatorPage.fillNumber2Field(testData.basicOperations.substraction.num2);
        await calculatorPage.selectSubstract();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.basicOperations.substraction.expected);

    });

    test('multiply 8 with 4 on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.basicOperations.multiply.num1);
        await calculatorPage.fillNumber2Field(testData.basicOperations.multiply.num2);
        await calculatorPage.selectMultiply();
        await calculatorPage.clickCalculateBtn()
        await calculatorPage.checkResultAgainstValue(testData.basicOperations.multiply.expected);

    });

    test('divide 10 by 2 on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.basicOperations.division.num1);
        await calculatorPage.fillNumber2Field(testData.basicOperations.division.num2);
        await calculatorPage.selectDivide();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.basicOperations.division.expected);

    });

    test('concatinate 10 and 2 on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.basicOperations.concatination.num1);
        await calculatorPage.fillNumber2Field(testData.basicOperations.concatination.num2);
        await calculatorPage.selectConcatinate();
        await calculatorPage.clickCalculateBtn()
        await calculatorPage.checkResultAgainstValue(testData.basicOperations.concatination.expected);

    });

    // Negative Testing - Invalid Inputs
    test('should show error for non-numeric input in first field on build ' + build.value, async ({ calculatorPage, page }) => {
        // Mark as expected to fail on Build 1+ (known bugs)
        test.fail(build.value !== '0', `Build ${build.value} has known issues with error validation`);
        
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.negativeTests.nonNumericFirst.num1);
        await calculatorPage.fillNumber2Field(testData.negativeTests.nonNumericFirst.num2);
        await calculatorPage.selectAdd();
        await calculatorPage.clickCalculateBtn();
        
        // Check for error message
        const errorMessage = page.locator('h3');
        await expect(errorMessage).toContainText(testData.negativeTests.nonNumericFirst.expectedError);
    });

    test('should show error for non-numeric input in second field on build ' + build.value, async ({ calculatorPage, page }) => {
        // Mark as expected to fail on Build 1+ (known bugs)
        test.fail(build.value !== '0', `Build ${build.value} has known issues with error validation`);
        
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.negativeTests.nonNumericSecond.num1);
        await calculatorPage.fillNumber2Field(testData.negativeTests.nonNumericSecond.num2);
        await calculatorPage.selectAdd();
        await calculatorPage.clickCalculateBtn();
        
        const errorMessage = page.locator('h3');
        await expect(errorMessage).toContainText(testData.negativeTests.nonNumericSecond.expectedError);
    });

    test('should show error for division by zero on build ' + build.value, async ({ calculatorPage, page }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.negativeTests.divisionByZero.num1);
        await calculatorPage.fillNumber2Field(testData.negativeTests.divisionByZero.num2);
        await calculatorPage.selectDivide();
        await calculatorPage.clickCalculateBtn();
        
        const errorMessage = page.locator('h3');
        if (build.value === '0') {
            await expect(errorMessage).toContainText(testData.negativeTests.divisionByZero.expectedError);
        } else {
            // Known bug: error validation doesn't work in builds 1+
            await expect.soft(errorMessage).toContainText(testData.negativeTests.divisionByZero.expectedError);
        }
    });

    // Edge Cases - Zero Values
    test('add zero to zero on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.edgeCases.zeroValues.addZeros.num1);
        await calculatorPage.fillNumber2Field(testData.edgeCases.zeroValues.addZeros.num2);
        await calculatorPage.selectAdd();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.edgeCases.zeroValues.addZeros.expected);
    });

    test('multiply by zero on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.edgeCases.zeroValues.multiplyByZero.num1);
        await calculatorPage.fillNumber2Field(testData.edgeCases.zeroValues.multiplyByZero.num2);
        await calculatorPage.selectMultiply();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.edgeCases.zeroValues.multiplyByZero.expected);
    });

    test('divide zero by a number on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.edgeCases.zeroValues.divideZero.num1);
        await calculatorPage.fillNumber2Field(testData.edgeCases.zeroValues.divideZero.num2);
        await calculatorPage.selectDivide();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.edgeCases.zeroValues.divideZero.expected);
    });

    // Edge Cases - Negative Numbers
    test('add negative numbers on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.edgeCases.negativeNumbers.addNegative.num1);
        await calculatorPage.fillNumber2Field(testData.edgeCases.negativeNumbers.addNegative.num2);
        await calculatorPage.selectAdd();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.edgeCases.negativeNumbers.addNegative.expected);
    });

    test('multiply negative numbers on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.edgeCases.negativeNumbers.multiplyNegatives.num1);
        await calculatorPage.fillNumber2Field(testData.edgeCases.negativeNumbers.multiplyNegatives.num2);
        await calculatorPage.selectMultiply();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.edgeCases.negativeNumbers.multiplyNegatives.expected);
    });

    test('divide negative number by positive on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.edgeCases.negativeNumbers.divideNegative.num1);
        await calculatorPage.fillNumber2Field(testData.edgeCases.negativeNumbers.divideNegative.num2);
        await calculatorPage.selectDivide();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.edgeCases.negativeNumbers.divideNegative.expected);
    });

    // Edge Cases - Decimal Numbers
    test('add decimal numbers on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.edgeCases.decimalNumbers.addDecimals.num1);
        await calculatorPage.fillNumber2Field(testData.edgeCases.decimalNumbers.addDecimals.num2);
        await calculatorPage.selectAdd();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.edgeCases.decimalNumbers.addDecimals.expected);
    });

    test('divide with decimal result on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.edgeCases.decimalNumbers.divideWithDecimalResult.num1);
        await calculatorPage.fillNumber2Field(testData.edgeCases.decimalNumbers.divideWithDecimalResult.num2);
        await calculatorPage.selectDivide();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(new RegExp(testData.edgeCases.decimalNumbers.divideWithDecimalResult.expectedPattern));
    });

    // Integers Only Checkbox Tests
    test('divide with integers only checked on build ' + build.value, async ({ calculatorPage, page }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.integersOnlyTests.divideWithIntegersChecked.num1);
        await calculatorPage.fillNumber2Field(testData.integersOnlyTests.divideWithIntegersChecked.num2);
        await calculatorPage.selectDivide();
        
        // Check the Integers Only checkbox
        const integersCheckbox = page.getByTestId('integerSelect');
        await integersCheckbox.check();
        
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.integersOnlyTests.divideWithIntegersChecked.expected);
    });

    test('divide with integers only unchecked on build ' + build.value, async ({ calculatorPage, page }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.integersOnlyTests.divideWithIntegersUnchecked.num1);
        await calculatorPage.fillNumber2Field(testData.integersOnlyTests.divideWithIntegersUnchecked.num2);
        await calculatorPage.selectDivide();
        
        // Ensure the Integers Only checkbox is unchecked
        const integersCheckbox = page.getByTestId('integerSelect');
        await integersCheckbox.uncheck();
        
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(new RegExp(testData.integersOnlyTests.divideWithIntegersUnchecked.expectedPattern));
    });

    // Clear Button Test
    test('clear button should clear result field on build ' + build.value, async ({ calculatorPage, page }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.clearButtonTest.num1);
        await calculatorPage.fillNumber2Field(testData.clearButtonTest.num2);
        await calculatorPage.selectAdd();
        await calculatorPage.clickCalculateBtn();
        
        // Verify we have a result first
        await calculatorPage.checkResultAgainstValue(testData.clearButtonTest.expected);
        
        // Click clear button
        const clearButton = page.getByTestId('clearButton');
        await clearButton.click();
        
        // Clear button only clears the result field, NOT the input fields
        // This is the actual behavior of the calculator
        await expect(calculatorPage.resultFieldElement).toHaveValue('');
        
        // Input fields should still have values
        await expect(calculatorPage.numField1Element).toHaveValue(testData.clearButtonTest.num1);
        await expect(calculatorPage.numField2Element).toHaveValue(testData.clearButtonTest.num2);
    });

    // Edge Cases - Large Numbers
    test('multiply large numbers on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.edgeCases.largeNumbers.multiplyLarge.num1);
        await calculatorPage.fillNumber2Field(testData.edgeCases.largeNumbers.multiplyLarge.num2);
        await calculatorPage.selectMultiply();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.edgeCases.largeNumbers.multiplyLarge.expected);
    });

    // Concatenation Special Cases
    test('concatenate negative numbers on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.edgeCases.negativeNumbers.concatenateNegatives.num1);
        await calculatorPage.fillNumber2Field(testData.edgeCases.negativeNumbers.concatenateNegatives.num2);
        await calculatorPage.selectConcatinate();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.edgeCases.negativeNumbers.concatenateNegatives.expected);
    });

    test('concatenate decimal numbers on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.edgeCases.decimalNumbers.concatenateDecimals.num1);
        await calculatorPage.fillNumber2Field(testData.edgeCases.decimalNumbers.concatenateDecimals.num2);
        await calculatorPage.selectConcatinate();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.edgeCases.decimalNumbers.concatenateDecimals.expected);
    });

    // Operation Switching Test
    test('calculate then switch operation and recalculate on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.operationSwitchTest.num1);
        await calculatorPage.fillNumber2Field(testData.operationSwitchTest.num2);
        await calculatorPage.selectAdd();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.operationSwitchTest.addExpected);
        
        // Switch to multiply
        await calculatorPage.selectMultiply();
        await calculatorPage.clickCalculateBtn();
        await calculatorPage.checkResultAgainstValue(testData.operationSwitchTest.multiplyExpected);
    });

    // Empty Fields Test - Calculator treats empty fields as 0
    test('should handle empty first field as zero on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.emptyFieldTests.emptyFirst.num1);
        await calculatorPage.fillNumber2Field(testData.emptyFieldTests.emptyFirst.num2);
        await calculatorPage.selectAdd();
        await calculatorPage.clickCalculateBtn();
        
        // Empty field is treated as 0, so 0 + 5 = 5
        await calculatorPage.checkResultAgainstValue(testData.emptyFieldTests.emptyFirst.expected);
    });

    test('should handle empty second field as zero on build ' + build.value, async ({ calculatorPage }) => {
        await calculatorPage.goto();
        await calculatorPage.selectBuild(build.value);
        await calculatorPage.fillNumber1Field(testData.emptyFieldTests.emptySecond.num1);
        await calculatorPage.fillNumber2Field(testData.emptyFieldTests.emptySecond.num2);
        await calculatorPage.selectAdd();
        await calculatorPage.clickCalculateBtn();
        
        // Empty field is treated as 0, so 5 + 0 = 5
        await calculatorPage.checkResultAgainstValue(testData.emptyFieldTests.emptySecond.expected);
    });

});