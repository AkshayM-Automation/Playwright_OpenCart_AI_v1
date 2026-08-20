import { Locator, Page } from '@playwright/test';

export class RegisterPage {
    private readonly page: Page;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly telephoneInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmInput: Locator;
    private readonly agreeCheckbox: Locator;
    private readonly continueButton: Locator;
    private readonly successHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('#input-firstname');
        this.lastNameInput = page.locator('#input-lastname');
        this.emailInput = page.locator('#input-email');
        this.telephoneInput = page.locator('#input-telephone');
        this.passwordInput = page.locator('#input-password');
        this.confirmInput = page.locator('#input-confirm');
        this.agreeCheckbox = page.locator('input[name="agree"]');
        this.continueButton = page.locator('input[value="Continue"]');
        this.successHeading = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
    }

    async goto(): Promise<void> {
        await this.page.goto(`${process.env.WEB_APP_URL || 'https://tutorialsninja.com/demo/'}index.php?route=account/register`);
    }

    async registerCustomer(firstName: string, lastName: string, email: string, telephone: string, password: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.telephoneInput.fill(telephone);
        await this.passwordInput.fill(password);
        await this.confirmInput.fill(password);
        await this.agreeCheckbox.check();
        await this.continueButton.click();
    }

    async isRegistrationSuccessVisible(): Promise<boolean> {
        return await this.successHeading.isVisible();
    }
}
