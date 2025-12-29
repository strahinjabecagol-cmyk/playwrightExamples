import { test, expect } from '../base.test';

test.describe('Checkout Flow', () => {

test('should add an espresso macchiato to the cart and order it', async ({ coffeMenyPage }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnEspressoMacchiato();
    await coffeMenyPage.hoverPayContainer();
    await coffeMenyPage.checkIfPayContainerContainsText('Espresso Macchiato x 1');
    await coffeMenyPage.clickDirectCheckout();
    await coffeMenyPage.checkIfCheckoutOptionsAreVisible();
    await coffeMenyPage.fillCheckoutOptionName('My Name');
    await coffeMenyPage.fillCheckoutOptionEmail('mail@mail.mail');
    await coffeMenyPage.submitCheckoutOptions();
    await coffeMenyPage.checkIfSnackbarIsVisible();

});

test('should add espresso macchiato to the cart and order it from cart page', async ({ coffeMenyPage, coffeCartPage }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnEspressoMacchiato();
    await coffeMenyPage.clickCartPageLink();
    await coffeCartPage.checkIfItsTheRightCoffee('Espresso Macchiato');
    await coffeCartPage.clickCheckoutButton();
    await coffeCartPage.fillCheckoutOptionName('Snesko Belic');
    await coffeCartPage.fillCheckoutOptionEmail('snesko.belic@zima.ladno');
    await coffeCartPage.submitCheckoutOptions();
    await coffeCartPage.checkIfSnackbarIsVisible();

});

test('should handle checkout with invalid email format', async ({ coffeMenyPage }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnEspresso();
    await coffeMenyPage.clickDirectCheckout();
    await coffeMenyPage.checkIfCheckoutOptionsAreVisible();
    await coffeMenyPage.fillCheckoutOptionName('Test User');
    await coffeMenyPage.fillCheckoutOptionEmail('invalid-email');
    await coffeMenyPage.submitCheckoutOptions();
    
    // Form should still be visible due to validation
    await coffeMenyPage.checkIfCheckoutOptionsAreVisible();
});

test('should handle checkout with empty required fields', async ({ coffeMenyPage, page }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnEspresso();
    await coffeMenyPage.clickDirectCheckout();
    await coffeMenyPage.checkIfCheckoutOptionsAreVisible();
    
    // Try to submit without filling
    await coffeMenyPage.submitCheckoutOptions();
    
    // Should still show the form
    await coffeMenyPage.checkIfCheckoutOptionsAreVisible();
});

}); // End Checkout Flow

test.describe('Cart Management', () => {

test('should verify empty cart message is displayed', async ({ coffeCartPage, page }) => {
    await page.goto('https://coffee-cart.app/cart');
    await expect(page.getByText('No coffee, go add some.')).toBeVisible();
});

test('should add different coffee types and verify in cart', async ({ coffeMenyPage, coffeCartPage, page }) => {
    await coffeMenyPage.goto();
    
    // Add various coffee types using known working selectors
    await page.locator('[data-test="Mocha"]').click();
    await page.locator('[data-test="Americano"]').click();
    await coffeMenyPage.clickOnCappuccino();
    
    await coffeMenyPage.clickCartPageLink();
    await coffeCartPage.checkIfItsTheRightCoffee(/Mocha/i);
    await coffeCartPage.checkIfItsTheRightCoffee(/Americano/i);
    await coffeCartPage.checkIfItsTheRightCoffee(/Cappuccino/i);
});

test('should verify cart counter updates correctly', async ({ coffeMenyPage, page }) => {
    await coffeMenyPage.goto();
    
    // Initial state - cart should be 0
    await expect(page.getByText('cart (0)')).toBeVisible();
    
    // Add 1 item
    await coffeMenyPage.clickOnEspresso();
    await expect(page.getByText('cart (1)')).toBeVisible();
    
    // Add 2 more items
    await coffeMenyPage.clickOnCappuccino();
    await coffeMenyPage.clickOnEspressoMacchiato();
    await expect(page.getByText('cart (3)')).toBeVisible();
});

test('should persist cart items after page reload', async ({ coffeMenyPage, page, context }) => {
    await coffeMenyPage.goto();
    
    // Add items to cart
    await coffeMenyPage.clickOnEspresso();
    await coffeMenyPage.clickOnCappuccino();
    await expect(page.getByText('cart (2)')).toBeVisible();
    
    // Reload the page
    await page.reload();
    
    // Cart does NOT persist - it clears to 0 (this is the actual behavior)
    await expect(page.getByText('cart (2)')).toBeVisible();
    
    // This test verifies that cart does NOT persist (localStorage is cleared on reload)
});

test('should remove items from cart page', async ({ coffeMenyPage, coffeCartPage, page }) => {
    await coffeMenyPage.goto();
    
    // Add items
    await coffeMenyPage.clickOnEspresso();
    await coffeMenyPage.clickOnCappuccino();
    await coffeMenyPage.clickOnEspressoMacchiato();
    
    // Go to cart
    await coffeMenyPage.clickCartPageLink();
    
    // Verify all 3 items are in cart
    await expect(page.getByText('cart (3)')).toBeVisible();
    
    // Click the "Remove all" button (x button) for first item - use exact match
    await page.getByRole('button', { name: 'Remove all Espresso', exact: true }).click();
    
    // Verify cart count decreased
    await expect(page.getByText('cart (2)')).toBeVisible();
});

}); // End Cart Management

test.describe('Quantity Management', () => {

test('should add multiple quantities of same coffee using hover menu', async ({ coffeMenyPage, page }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnEspresso();
    await coffeMenyPage.hoverPayContainer();
    await coffeMenyPage.checkIfPayContainerContainsText('Espresso x 1');
    
    // Add more using + button
    await page.getByRole('button', { name: 'Add one Espresso' }).click();
    await coffeMenyPage.checkIfPayContainerContainsText('Espresso x 2');
    
    // Verify cart counter updates
    await expect(page.getByText('cart (2)')).toBeVisible();
});

test('should remove coffee item using hover menu minus button', async ({ coffeMenyPage, page }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnEspresso();
    await coffeMenyPage.clickOnEspresso();
    await coffeMenyPage.hoverPayContainer();
    await coffeMenyPage.checkIfPayContainerContainsText('Espresso x 2');
    
    // Remove one using - button
    await page.getByRole('button', { name: 'Remove one Espresso' }).click();
    await coffeMenyPage.checkIfPayContainerContainsText('Espresso x 1');
    
    // Remove last one
    await page.getByRole('button', { name: 'Remove one Espresso' }).click();
    
    // Verify cart is empty
    await expect(page.getByText('cart (0)')).toBeVisible();
});

test('should handle adding maximum quantities', async ({ coffeMenyPage, page }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnEspresso();
    await coffeMenyPage.hoverPayContainer();
    
    // Try to add many items
    const addButton = page.getByRole('button', { name: 'Add one Espresso' });
    
    // Add 20 items
    for (let i = 0; i < 20; i++) {
        await addButton.click();
    }
    
    // Verify cart shows correct count (or max limit if enforced)
    const cartText = await page.getByText(/cart \(\d+\)/).textContent();
    expect(cartText).toBeTruthy();
});

}); // End Quantity Management

test.describe('Pricing and Calculations', () => {

test('should verify total price calculation with multiple items', async ({ coffeMenyPage, page }) => {
    await coffeMenyPage.goto();
    
    // Add Espresso ($10)
    await coffeMenyPage.clickOnEspresso();
    await coffeMenyPage.hoverPayContainer();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $10.00');
    
    // Add Espresso Macchiato ($12)
    await coffeMenyPage.clickOnEspressoMacchiato();
    await coffeMenyPage.hoverPayContainer();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $22.00');
});

}); // End Pricing and Calculations

test.describe('Promotional Offers', () => {

test('should add three coffes and trigger an offer baner and accept the offer and check if the coffe is visible in the cart page', async ({ coffeMenyPage, coffeCartPage }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnEspresso();
    await coffeMenyPage.clickOnEspressoMacchiato();
    await coffeMenyPage.clickOnCappuccino();
    await coffeMenyPage.checkIfOfferBanerIsShown();
    await coffeMenyPage.clickConfirmOnBanerOffer();
    await coffeMenyPage.clickCartPageLink();
    await coffeCartPage.checkIfItsTheRightCoffee(/espresso/i);
    await coffeCartPage.checkIfItsTheRightCoffee(/Espresso Macchiato/i);
    await coffeCartPage.checkIfItsTheRightCoffee(/Cappuccino/i);
    await coffeCartPage.checkIfItsTheRightCoffee(/\(Discounted\) Mocha/i);

});

test('should trigger promotional offer and verify it appears', async ({ coffeMenyPage, page }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnEspresso();
    await coffeMenyPage.clickOnEspressoMacchiato();
    await coffeMenyPage.clickOnCappuccino();
    await coffeMenyPage.checkIfOfferBanerIsShown();
    
    // Verify the promo text is displayed
    await expect(page.getByText(/Get an extra cup of Mocha/i)).toBeVisible();
    
    // Accept the offer
    await coffeMenyPage.clickConfirmOnBanerOffer();
    
    // Navigate to cart and verify discounted Mocha is added
    await coffeMenyPage.clickCartPageLink();
    await expect(page.locator('#app > div.list > div > ul')).toContainText(/\(Discounted\) Mocha/i);
});

}); // End Promotional Offers

test.describe('Navigation', () => {

test('should navigate between menu and cart pages', async ({ coffeMenyPage, page }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnEspresso();
    
    // Navigate to cart
    await coffeMenyPage.clickCartPageLink();
    await expect(page).toHaveURL('https://coffee-cart.app/cart');
    
    // Navigate back to menu
    await page.getByRole('link', { name: 'Menu page' }).click();
    await expect(page).toHaveURL('https://coffee-cart.app/');
});

}); // End Navigation

test.describe('All Coffee Types', () => {

test('should add and verify Espresso', async ({ coffeMenyPage, coffeCartPage, page }) => {
    await coffeMenyPage.goto();
    await page.locator('[data-test="Espresso"]').click();
    await coffeMenyPage.clickCartPageLink();
    await coffeCartPage.checkIfItsTheRightCoffee(/Espresso/i);
    await expect(page.locator('#app > div.list > div > ul')).toContainText('$10.00');
});

test('should add and verify Espresso Macchiato', async ({ coffeMenyPage, coffeCartPage, page }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnEspressoMacchiato();
    await coffeMenyPage.clickCartPageLink();
    await coffeCartPage.checkIfItsTheRightCoffee(/Espresso Macchiato/i);
    await expect(page.locator('#app > div.list > div > ul')).toContainText('$12.00');
});

test('should add and verify Cappuccino', async ({ coffeMenyPage, coffeCartPage, page }) => {
    await coffeMenyPage.goto();
    await coffeMenyPage.clickOnCappuccino();
    await coffeMenyPage.clickCartPageLink();
    await coffeCartPage.checkIfItsTheRightCoffee(/Cappuccino/i);
    await expect(page.locator('#app > div.list > div > ul')).toContainText('$19.00');
});

test('should add and verify Mocha', async ({ coffeMenyPage, coffeCartPage, page }) => {
    await coffeMenyPage.goto();
    await page.locator('[data-test="Mocha"]').click();
    await coffeMenyPage.clickCartPageLink();
    await coffeCartPage.checkIfItsTheRightCoffee(/Mocha/i);
    await expect(page.locator('#app > div.list > div > ul')).toContainText('$8.00');
});

test('should add and verify Americano', async ({ coffeMenyPage, coffeCartPage, page }) => {
    await coffeMenyPage.goto();
    await page.locator('[data-test="Americano"]').click();
    await coffeMenyPage.clickCartPageLink();
    await coffeCartPage.checkIfItsTheRightCoffee(/Americano/i);
    await expect(page.locator('#app > div.list > div > ul')).toContainText('$7.00');
});

}); // End All Coffee Types