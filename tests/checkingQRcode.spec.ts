import { expect, test } from '../base.test'

test('check if the qrcode matches', async ({ page, qrCodePage }) => {
    await qrCodePage.goto();
    await qrCodePage.fillStringToField('1234567890');
    await qrCodePage.clickGenerateButton();
    await expect(page.locator('body')).toHaveScreenshot('./data/screens/1234567890_QRcode.png');


});

test('check if this pages url is converted to proper qr code', async ({ page, qrCodePage }) => {
    await qrCodePage.goto();
    await qrCodePage.fillStringToField('https://qaplayground.dev/apps/qr-code-generator/');
    await qrCodePage.clickGenerateButton();
    await expect(page.locator('body')).toHaveScreenshot('./data/screens/thisPage_QRcode.png');

});

test('get qrcode and reed the text of the qr code using jsQr and Jimp', async ({ page, qrCodePage, utilQrCode }) => {
    await qrCodePage.goto();
    await qrCodePage.fillStringToField('https://qaplayground.dev/apps/qr-code-generator/');
    await qrCodePage.clickGenerateButton();
    let decodedQrCode = utilQrCode.getQRcodeText(page.getByAltText('qr-code'));
    expect(await decodedQrCode).toBe('https://qaplayground.dev/apps/qr-code-generator/');
});

// ========== NEW TESTS FOR IDENTIFIED GAPS ==========

test('verify QR code is generated for simple text', async ({ page, qrCodePage }) => {
    await qrCodePage.goto();
    await qrCodePage.fillStringToField('Hello World');
    await qrCodePage.clickGenerateButton();
    await expect(page.getByAltText('qr-code')).toBeVisible();
});

test('verify QR code is generated with special characters', async ({ page, qrCodePage, utilQrCode }) => {
    await qrCodePage.goto();
    const specialText = 'Test!@';
    await qrCodePage.fillStringToField(specialText);
    await qrCodePage.clickGenerateButton();
    await expect(page.getByAltText('qr-code')).toBeVisible();
    let decodedQrCode = utilQrCode.getQRcodeText(page.getByAltText('qr-code'));
    expect(await decodedQrCode).toBe(specialText);
});

test('verify QR code is generated with very long text', async ({ page, qrCodePage }) => {
    await qrCodePage.goto();
    const longText = 'A'.repeat(500);
    await qrCodePage.fillStringToField(longText);
    await qrCodePage.clickGenerateButton();
    await expect(page.getByAltText('qr-code')).toBeVisible();
});

test('verify QR code handles empty input', async ({ page, qrCodePage }) => {
    await qrCodePage.goto();
    await qrCodePage.fillStringToField('');
    await qrCodePage.clickGenerateButton();
    // QR code should still be present (empty QR code)
    await expect(page.getByAltText('qr-code')).toBeVisible();
});

test('verify QR code regeneration with different values', async ({ page, qrCodePage, utilQrCode }) => {
    await qrCodePage.goto();
    
    // Generate first QR code
    await qrCodePage.fillStringToField('FirstValue');
    await qrCodePage.clickGenerateButton();
    let firstQrCode = utilQrCode.getQRcodeText(page.getByAltText('qr-code'));
    expect(await firstQrCode).toBe('FirstValue');
    
    // Clear and generate second QR code with different value
    await page.getByRole('textbox', { name: 'Enter text or URL' }).clear();
    await qrCodePage.fillStringToField('SecondValue');
    await qrCodePage.clickGenerateButton();
    // Wait a bit for the QR code to update
    await page.waitForTimeout(500);
    let secondQrCode = utilQrCode.getQRcodeText(page.getByAltText('qr-code'));
    expect(await secondQrCode).toBe('SecondValue');
});

test('verify QR code with whitespace only', async ({ page, qrCodePage }) => {
    await qrCodePage.goto();
    await qrCodePage.fillStringToField('   ');
    await qrCodePage.clickGenerateButton();
    await expect(page.getByAltText('qr-code')).toBeVisible();
});

test('verify QR code with email address', async ({ page, qrCodePage, utilQrCode }) => {
    await qrCodePage.goto();
    const email = 'test.user@example.com';
    await qrCodePage.fillStringToField(email);
    await qrCodePage.clickGenerateButton();
    await expect(page.getByAltText('qr-code')).toBeVisible();
    let decodedQrCode = utilQrCode.getQRcodeText(page.getByAltText('qr-code'));
    expect(await decodedQrCode).toBe(email);
});

test('verify QR code with unicode characters', async ({ page, qrCodePage, utilQrCode }) => {
    await qrCodePage.goto();
    const unicodeText = 'Hello 世界 🌍';
    await qrCodePage.fillStringToField(unicodeText);
    await qrCodePage.clickGenerateButton();
    await expect(page.getByAltText('qr-code')).toBeVisible();
    let decodedQrCode = utilQrCode.getQRcodeText(page.getByAltText('qr-code'));
    expect(await decodedQrCode).toBe(unicodeText);
});

test('verify QR code with phone number format', async ({ page, qrCodePage, utilQrCode }) => {
    await qrCodePage.goto();
    const phoneNumber = '1-555-123-4567';
    await qrCodePage.fillStringToField(phoneNumber);
    await qrCodePage.clickGenerateButton();
    await expect(page.getByAltText('qr-code')).toBeVisible();
    let decodedQrCode = utilQrCode.getQRcodeText(page.getByAltText('qr-code'));
    expect(await decodedQrCode).toBe(phoneNumber);
});
