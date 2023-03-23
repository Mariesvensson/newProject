// @ts-check
const { test, expect } = require('@playwright/test');



test('Inputfeild to be empty', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/');

 let placeholdertext = page.getByPlaceholder('Search recepie or ingredient')

  await expect(placeholdertext).toHaveText('');
});

test('Check if main is not empty after search', async ({ page }) => {

  await page.goto('http://127.0.0.1:5500/');

  await page.getByPlaceholder('Search recepie or ingredient').click();
  await page.getByPlaceholder('Search recepie or ingredient').fill('pasta');
  await page.getByPlaceholder('Search recepie or ingredient').press('Enter');


   let recepies =  page.locator('#main-content')
   let textContent = await recepies.textContent();
   let isNotEmpty = textContent !== null;

   expect(isNotEmpty).toBe(true);

  
});


test('Check if shoppinglist is not empty after adding to it', async ({ page }) => {

  await page.goto('http://127.0.0.1:5500/');

  await page.getByPlaceholder('Search recepie or ingredient').click();
  await page.getByPlaceholder('Search recepie or ingredient').fill('pasta');
  await page.getByPlaceholder('Search recepie or ingredient').press('Enter');
  await page.locator('#save-button').first().click();
  await page.getByRole('button', { name: 'Show favorites 1' }).click();
  await page.getByRole('button', { name: 'Add to shoppinglist' }).click();
  await page.getByRole('button', { name: 'Shopping list' }).click();


   let shoppinglist =  page.locator('#shopping-list')
   let textContent = await shoppinglist.textContent();
   let isNotEmpty = textContent !== null && textContent.trim().length > 0;

   expect(isNotEmpty).toBe(true);

  
});








  

