const puppeteer = require('puppeteer');

// The browser instance created for each test
let browser;

// Create the browser before each test
beforeEach(async (done) => {
  browser = await puppeteer.launch({
    // headless: false 
  });
  done();
});

// Close the browser after each test
afterEach(async (done) => {
  await browser.close(); 
  done();
});

/**
 * Page title matches the assignment
 */
test('Title', async () => {
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  expect(title).toBe('PathFinder');
});


test('Language Btn',async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  // await page.waitForTimeout(500);
  const elem = await page.$(".newCardButton");
  console.log(elem);
  // const cont = await (await elem.getProperty('value')).jsonValue();
  const text = await page.evaluate(element => element.textContent, elem);

  console.log(text);
  expect(text).toBe("New Card");
});