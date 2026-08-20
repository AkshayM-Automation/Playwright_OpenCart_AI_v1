import { Locator, Page } from '@playwright/test';

export class MyAccountPage {
    private readonly page: Page;
    private readonly logoutLink: Locator;
    private readonly accountHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logoutLink = page.getByRole('link', { name: 'Logout' }).first();
        this.accountHeading = page.locator('#content').getByRole('heading', { name: 'My Account' }).first();
    }

    async logout(): Promise<void> {
        await this.logoutLink.click();
    }

    async isMyAccountPageVisible(): Promise<boolean> {
        return await this.accountHeading.isVisible();
    }
}
