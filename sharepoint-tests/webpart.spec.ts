import { test, expect } from "@playwright/test";
import { products } from "./product";

let page;
test.describe("Web Part Tests", () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto(process.env.SPFX_URI || "/");
    await page.waitForLoadState("load");
  });

  test("should have webpart Tenant Manager & webpart ui", async () => {
    const addWebPartButton = page.getByLabel("Add a new web part in column");
    await addWebPartButton.click();
    const tenantManagerPart = page
      .getByLabel("Local web parts. Use left and")
      .getByLabel("Add web part Tenant Manager");
    await expect(tenantManagerPart).toBeVisible();
    await tenantManagerPart.click();
    await expect(page.locator(".ControlZone-drag")).toBeVisible();
  });
  test("should have Overiview and Product tab", async () => {
    const outerList = page.locator('ul[role="list"]:first-of-type');
    const outerListItems = outerList.locator('> li[role="listitem"]');
    await expect(outerListItems).toHaveCount(6);

    const firstLiDiv = outerListItems.locator('div[name="Overview"]');
    await expect(firstLiDiv).toBeVisible();

    const secondLiDiv = outerListItems.locator('div[name="Products"]');
    await expect(secondLiDiv).toBeVisible();
  });
  test("should have four products", async () => {
    const outerList = page.locator('ul[role="list"]:first-of-type');
    const outerListItems = outerList.locator('> li[role="listitem"]');
    const nestedProductList = outerListItems
      .nth(1)
      .locator('ul[role="list"]:first-of-type');
    const nestedProducts = nestedProductList.locator('li[role="listitem"]');
    await expect(nestedProducts).toHaveCount(4);
  });
  
  for (const product of products) {
    test(`"${product.name}" should verify product detail`, async () => {
      const productTitle = page.getByRole("link", { name: product.name });
      await expect(productTitle).toBeVisible();
      await productTitle.click();

      const versionLocator = page.locator(`text=${product.version}`);
      await expect(versionLocator).toBeVisible();
  
      const descriptionLocator = page.locator(`text=${product.description}`);
      await expect(descriptionLocator).toBeVisible();
    })
    test(`"${product.name}" should have ${product.tab} tabs`, async () => {
      const tabs = await page.locator('button[role="tab"]')
      await expect(tabs).toHaveCount(product.tab)
    });
    test(`should update licensing of "${product.name}" and verify success message`, async () => {
      await handleLicensing(page);
    });
  }
});

async function handleLicensing(page) {
 

  await page.getByRole("textbox", { name: "Licensing" }).fill("hello");

  const checkbox = await page.locator('i[data-icon-name="CheckMark"]');
  const isChecked = await checkbox.isChecked();

  if (!isChecked) {
    await checkbox.click();
  } else {
    console.log("Checkbox is already checked, skipping click.");
  }
  await page.getByRole("button", { name: "Submit" }).click();

  const successMessage = page.locator("text=Successfully Updated");
  await expect(successMessage).toBeVisible();
}
export { page };

// test.describe("SharePoint Tests", () => {
//   let page;

//   test.beforeAll(async ({ browser }) => {
//     const context = await browser.newContext();
//     page = await context.newPage();

//     await page.goto(process.env.SPFX_URI);

//     await page.waitForLoadState("load");
//   });

//   test("Adding web part at SharePoint", async () => {
//     const addWebPartButton = await page.getByLabel("Add a new web part in column");
//     await expect(addWebPartButton).toBeVisible();
//     await addWebPartButton.click();

//     const tenantManagerPart = page
//       .getByLabel("Local web parts. Use left and")
//       .getByLabel("Add web part Tenant Manager");
//     await tenantManagerPart.waitFor({ state: "visible" });

//     await expect(tenantManagerPart).toBeVisible();
//     await tenantManagerPart.click();
//     const webPartUi = await page.locator('.ControlZone-drag')
//     await expect(webPartUi).toBeVisible()
//   });

//   test("should verify four product is render", async () => {
//     const outerList = page.locator('ul[role="list"]:first-of-type');
//     const outerListItems = outerList.locator('> li[role="listitem"]');
//     await expect(outerListItems).toHaveCount(6);

//     const firstLiDiv = outerListItems.locator('div[name="Overview"]');
//     await expect(firstLiDiv).toBeVisible();

//     const secondLiDiv = outerListItems.locator('div[name="Products"]');
//     await expect(secondLiDiv).toBeVisible();

//     const nestedProductList = outerListItems
//       .nth(1)
//       .locator('ul[role="list"]:first-of-type');
//     const nestedProducts = nestedProductList.locator('li[role="listitem"]');
//     await expect(nestedProducts).toHaveCount(4);

//   });

//   const products = [
//     { name: "Alert Plus by Bamboo" },
//     { name: "Knowledge Base by Bamboo" },
//     { name: "List Rollup by Bamboo" },
//     { name: "Simple List Search by Bamboo" },
//   ];

//   for (const product of products) {
//     test(`should update "${product.name}" and verify success message`, async () => {

//       const productTitle = page.getByRole("link", { name: product.name });
//       await expect(productTitle).toBeVisible();
//       await productTitle.click();

//       await page.getByRole("textbox", { name: "Licensing" }).fill("hello");

//       const checkbox = await page.locator('i[data-icon-name="CheckMark"]');
//       const isChecked = await checkbox.isChecked();

//       if (!isChecked) {
//         await checkbox.click();
//       } else {
//         console.log("Checkbox is already checked, skipping click.");
//       }
//       await page.getByRole("button", { name: "Submit" }).click();

//       const successMessage = page.locator("text=Successfully Updated");
//       await expect(successMessage).toBeVisible();
//     });
//   }
// });
