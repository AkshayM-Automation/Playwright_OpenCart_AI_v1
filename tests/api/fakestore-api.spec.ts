import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import path from 'path';
import dotenv from 'dotenv';

import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;

const buildUrl = (route: string, replacements: Record<string, string | number> = {}): string => {
    let url = route;
    for (const [key, value] of Object.entries(replacements)) {
        url = url.replace(`{${key}}`, String(value));
    }
    return `${API_BASE_URL}${url}`;
};

test.describe('FakeStore API tests @master @api', () => {
    test('Successful login returns a token @sanity', async ({ request }) => {
        const response = await request.post(buildUrl(Routes.AUTH_LOGIN), {
            data: {
                username: 'mor_2314',
                password: '83r5^_',
            },
        });

        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body).toHaveProperty('token');
        expect(typeof body.token).toBe('string');
        expect(body.token.length).toBeGreaterThan(0);
    });

    test('Invalid login returns the expected authentication message @sanity', async ({ request }) => {
        const response = await request.post(buildUrl(Routes.AUTH_LOGIN), {
            data: {
                username: 'invalid_user',
                password: 'invalid_password',
            },
        });

        expect(response.status()).toBe(401);

        const bodyText = await response.text();
        expect(bodyText).toBe('username or password is incorrect');
    });

    test('Get all products returns a populated array @sanity', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_ALL_PRODUCTS));

        expect(response.status()).toBe(200);

        const products = await response.json();
        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);

        const firstProduct = products[0];
        expect(firstProduct).toHaveProperty('id');
        expect(firstProduct).toHaveProperty('title');
        expect(firstProduct).toHaveProperty('price');
        expect(firstProduct).toHaveProperty('category');
        expect(firstProduct).toHaveProperty('image');
    });

    test('Get product by ID returns the expected product @sanity', async ({ request }) => {
        const productId = Number(process.env.PRODUCT_ID || 1);
        const response = await request.get(buildUrl(Routes.GET_PRODUCT_BY_ID, { id: productId }));

        expect(response.status()).toBe(200);

        const product = await response.json();
        expect(product.id).toBe(productId);
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('image');
    });

    test('Products with a limit return the requested count @sanity', async ({ request }) => {
        const limit = Number(process.env.LIMIT || 3);
        const response = await request.get(buildUrl(Routes.GET_PRODUCTS_WITH_LIMIT, { limit }));

        expect(response.status()).toBe(200);

        const products = await response.json();
        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBe(limit);
    });

    test('Create, update, and delete product workflow succeeds @regression', async ({ request }) => {
        const createPayload = {
            title: 'Playwright Product',
            price: 99.99,
            description: 'Created through Playwright API tests',
            image: 'https://example.com/product.png',
            category: 'electronics',
        };

        const createResponse = await request.post(buildUrl(Routes.CREATE_PRODUCT), {
            data: createPayload,
        });

        expect(createResponse.status()).toBe(201);
        const createdProduct = await createResponse.json();
        expect(createdProduct).toHaveProperty('id');

        const productId = createdProduct.id;
        const updateResponse = await request.put(buildUrl(Routes.UPDATE_PRODUCT, { id: productId }), {
            data: {
                ...createPayload,
                title: 'Updated Playwright Product',
                price: 119.99,
            },
        });

        expect(updateResponse.status()).toBe(200);
        const updatedProduct = await updateResponse.json();
        expect(updatedProduct.title).toBe('Updated Playwright Product');
        expect(updatedProduct.price).toBe(119.99);

        const deleteResponse = await request.delete(buildUrl(Routes.DELETE_PRODUCT, { id: productId }));
        expect(deleteResponse.status()).toBe(200);

        const deletedProductText = await deleteResponse.text();
        expect(deletedProductText).toBe('');
    });

    test('Get user by ID returns the expected user payload @sanity', async ({ request }) => {
        const userId = Number(process.env.USER_ID || 1);
        const response = await request.get(buildUrl(Routes.GET_USER_BY_ID, { id: userId }));

        expect(response.status()).toBe(200);

        const user = await response.json();
        expect(user.id).toBe(userId);
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('name');
    });

    test('User schema matches the defined contract @regression', async ({ request }) => {
        const userId = Number(process.env.USER_ID || 1);
        const response = await request.get(buildUrl(Routes.GET_USER_BY_ID, { id: userId }));

        expect(response.status()).toBe(200);

        const user = await response.json();
        const schema = DataProvider.readJson(path.resolve(__dirname, '../../api/schemas/user_api_schema.json'));
        const ajv = new Ajv();

        expect(ajv.validate(schema, user)).toBeTruthy();
        if (!ajv.validate(schema, user)) {
            console.log(ajv.errors);
        }
    });

    test('Get cart by ID returns the expected cart structure @sanity', async ({ request }) => {
        const cartId = Number(process.env.CART_ID || 1);
        const response = await request.get(buildUrl(Routes.GET_CART_BY_ID, { id: cartId }));

        expect(response.status()).toBe(200);

        const cart = await response.json();
        expect(cart.id).toBe(cartId);
        expect(cart).toHaveProperty('userId');
        expect(Array.isArray(cart.products)).toBeTruthy();
        expect(cart.products.length).toBeGreaterThan(0);
    });

    test('Cart schema matches the defined contract @regression', async ({ request }) => {
        const cartId = Number(process.env.CART_ID || 1);
        const response = await request.get(buildUrl(Routes.GET_CART_BY_ID, { id: cartId }));

        expect(response.status()).toBe(200);

        const cart = await response.json();
        const schema = DataProvider.readJson(path.resolve(__dirname, '../../api/schemas/cart_api_schema.json'));
        const ajv = new Ajv();

        expect(ajv.validate(schema, cart)).toBeTruthy();
        if (!ajv.validate(schema, cart)) {
            console.log(ajv.errors);
        }
    });
});
