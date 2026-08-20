import { Locator, Page } from '@playwright/test';

export class HomePage {
    private readonly page: Page;
    private readonly myAccountLink: Locator;
    private readonly registerLink: Locator;
    private readonly loginLink: Locator;
    private readonly searchInput: Locator;
    private readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.myAccountLink = page.getByRole('link', { name: 'My Account' }).first();
        this.registerLink = page.getByRole('link', { name: 'Register' }).first();
        this.loginLink = page.getByRole('link', { name: 'Login' }).first();
        this.searchInput = page.locator('input[name="search"]');
        this.cartLink = page.getByRole('button', { name: /item\(s\)|Shopping Cart/i }).first();
    }

    async goto(): Promise<void> {
        await this.page.goto(process.env.WEB_APP_URL || 'https://tutorialsninja.com/demo/');
    }

    async openMyAccount(): Promise<void> {
        await this.myAccountLink.click();
    }

    async goToRegister(): Promise<void> {
        await this.page.goto(`${process.env.WEB_APP_URL || 'https://tutorialsninja.com/demo/'}index.php?route=account/register`);
    }

    async goToLogin(): Promise<void> {
        await this.page.goto(`${process.env.WEB_APP_URL || 'https://tutorialsninja.com/demo/'}index.php?route=account/login`);
    }

    async searchProduct(productName: string): Promise<void> {
        await this.searchInput.fill(productName);
        await this.searchInput.press('Enter');
    }

    async openProductByName(productName: string): Promise<void> {
        await this.page.locator('a').filter({ hasText: productName }).first().click();
    }

    async openCart(): Promise<void> {
        await this.page.goto(
            `${process.env.WEB_APP_URL || 'https://tutorialsninja.com/demo/'}index.php?route=checkout/cart`,
            { waitUntil: 'domcontentloaded' }
        );
    }
}
