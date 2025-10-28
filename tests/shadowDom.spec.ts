import { test } from '../base.test'
const expectedValue ='width: 95%;';

test('shadowDomTest', async ({ shadowDomPage }) => {
    await shadowDomPage.goto();
    await shadowDomPage.clickBoostButton();
    await shadowDomPage.checkIfTheValueMatches(expectedValue);

});
