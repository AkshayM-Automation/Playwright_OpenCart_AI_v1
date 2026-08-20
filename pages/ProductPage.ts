import { Locator, Page } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;
    private readonly productHeading: Locator;
    private readonly priceLabel: Locator;
    private readonly addToCartButton: Locator;
    private readonly successAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productHeading = page.locator('h1');
        this.priceLabel = page.locator('li h2').first();
        this.addToCartButton = page.locator('#button-cart');
        this.successAlert = page.getByText(/Success: You have added/i).first();
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
        await this.page.waitForTimeout(2000);
    }

    async getProductName(): Promise<string> {
        return (await this.productHeading.textContent())?.trim() || '';
    }

    async getProductPrice(): Promise<string> {
        return (await this.priceLabel.textContent())?.trim() || '';
    }

    async isCartUpdatedFrom(initialCartText: string | null): Promise<boolean> {
        try {
            const cartButton = this.page.locator('button').filter({ hasText: /item\(s\)/i }).first();
            const currentText = await cartButton.textContent();
            return Boolean(currentText && currentText !== initialCartText);
        } catch (error) {
            console.log(`Cart state did not update: ${error}`);
            return false;
        }
    }
}
