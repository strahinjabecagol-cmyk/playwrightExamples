import { test } from '../base.test'

test('should fill in the verification code by entering numbers', async ({ verifyAccountPage }) => {
    await verifyAccountPage.goto();
    await verifyAccountPage.fillTheCodebyTypingNumbers();
    await verifyAccountPage.checkIfSuccessfull();

});

test('should fill in the verification code by pushing arrow keys', async ({ verifyAccountPage }) => {
    await verifyAccountPage.goto();
    await verifyAccountPage.fillByUsingArows();
    await verifyAccountPage.checkIfSuccessfull();

});
