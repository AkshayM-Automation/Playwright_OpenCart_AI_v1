import { test as base, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { ProductPage } from '../pages/ProductPage';
import * as dotenv from 'dotenv';

dotenv.config();

type PageFixtures = {
    homePage: HomePage;
    registerPage: RegisterPage;
    loginPage: LoginPage;
    myAccountPage: MyAccountPage;
    productPage: ProductPage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await use(homePage);
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    myAccountPage: async ({ page }, use) => {
        await use(new MyAccountPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
});

export { expect };
