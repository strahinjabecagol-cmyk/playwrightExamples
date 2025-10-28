import { test } from '../base.test'

test('Onbordingmodal test', async ({ onboardingModalPage }) => {
    await onboardingModalPage.goto();
    await onboardingModalPage.checkIfTheWelcomeMessageIsVisible();
    await onboardingModalPage.clickMenuButton();
    await onboardingModalPage.checkIfTheWelcomeOnBoardMessageIsVisible();

});
