import { test as setup ,expect} from '@playwright/test'
import {STORAGE_STATE} from '../playwright.config'


setup('authentication' ,async ({page}) =>{
    await page.goto("/");

    await expect(page).toHaveTitle("Sign in to your account");

    await page.fill('input[type="email"]', process.env.OFFICE365_EMAIL || "");
    await page.click('input[type="submit"]');
    await page.fill('input[type="password"]', process.env.OFFICE365_PASSWORD || "");
    await page.click('input[type="submit"]');
    await page.click('input[type="submit"]');
    await page.context().storageState({path : STORAGE_STATE})
})