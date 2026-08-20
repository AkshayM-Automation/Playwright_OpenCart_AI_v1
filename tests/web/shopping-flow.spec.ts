import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

const PRODUCT_NAME = 'MacBook';

test.setTimeout(60 * 1000);

function getRandomCustomer() {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}+${Date.now()}@example.com`;
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = 'Test@1234';
    return { firstName, lastName, email, telephone, password };
}

test('End-to-End Shopping Flow @master @e2e @web', async ({ homePage, registerPage, loginPage, myAccountPage, productPage, page }) => {
    const customer = getRandomCustomer();

    await test.step('1) Open the application', async () => {
        await homePage.goto();
        await expect(page).toHaveTitle(/Your Store/i);
    });

    await test.step('2) Register a new customer using dynamically generated unique data', async () => {
        await homePage.openMyAccount();
        await homePage.goToRegister();
        await registerPage.registerCustomer(
            customer.firstName,
            customer.lastName,
            customer.email,
            customer.telephone,
            customer.password
        );
    });

    await test.step('3) Verify successful registration', async () => {
        const registrationSuccess = await registerPage.isRegistrationSuccessVisible();
        expect(registrationSuccess).toBeTruthy();
    });

    await test.step('4) Log out', async () => {
        await page.goto(`${process.env.WEB_APP_URL || 'https://tutorialsninja.com/demo/'}index.php?route=account/account`);
        await myAccountPage.logout();
        await expect(page).toHaveURL(/account\/logout|account\/login/i);
    });

    await test.step('5) Log in again using the newly created credentials', async () => {
        await loginPage.goto();
        await loginPage.login(customer.email, customer.password);
    });

    await test.step('6) Verify successful authentication', async () => {
        const authenticated = await myAccountPage.isMyAccountPageVisible();
        expect(authenticated).toBeTruthy();
    });

    await test.step('7) Search for a known product', async () => {
        await homePage.searchProduct(PRODUCT_NAME);
        await expect(page).toHaveURL(/search/i);
    });

    await test.step('8) Open the product details page', async () => {
        await homePage.openProductByName(PRODUCT_NAME);
        await expect(page).toHaveURL(/product/i);
    });

    await test.step('9) Add the product to the cart', async () => {
        await productPage.addToCart();

        const cartButtonText = await page.locator('button').filter({ hasText: /item\(s\)/i }).first().textContent();
        expect(cartButtonText).toMatch(/1 item\(s\) - \$602\.00/);
    });

    await test.step('10) Open the shopping cart', async () => {
        await homePage.openCart();
        await expect(page).toHaveURL(/checkout\/cart|cart/i);
    });

    await test.step('11-14) Verify product name, quantity, price, and cart total', async () => {
        const cartText = await page.locator('body').innerText();
        expect(cartText).toContain(PRODUCT_NAME);
        expect(cartText).toContain('1');
        expect(cartText).toContain('$602.00');
        expect(cartText).toContain('$602.00');
    });

    await test.step('15) Verify that the journey finishes without errors', async () => {
        await expect(page.locator('body')).toContainText(PRODUCT_NAME);
        await expect(page.locator('body')).toContainText('1');
        await expect(page.locator('body')).toContainText('$602.00');
        console.log('✅ End-to-End shopping flow completed successfully.');
    });
});
