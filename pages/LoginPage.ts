import { Locator, Page } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('#input-email');
        this.passwordInput = page.locator('#input-password');
        this.loginButton = page.locator('input[value="Login"]');
        this.logoutLink = page.getByRole('link', { name: 'Logout' }).first();
    }

    async goto(): Promise<void> {
        await this.page.goto(`${process.env.WEB_APP_URL || 'https://tutorialsninja.com/demo/'}index.php?route=account/login`);
    }

    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async logout(): Promise<void> {
        await this.logoutLink.click();
    }

    async isLoggedOut(): Promise<boolean> {
        return await this.page.getByRole('heading', { name: 'Account Login' }).isVisible();
    }
}
