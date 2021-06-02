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


test('New Card Btn',async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const elem = await page.$(".newCardButton");
  const text = await page.evaluate(element => element.textContent, elem);
  expect(text).toBe("New Card");
});

test('empty pie',async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const elem = await page.$("pie0");
  expect(elem).toBe(null);
});

test('empty card set',async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  const elem = await page.$("initCardSet");
  expect(elem).toBe(null);
});

/*
  Removed because new front end changes
  No more adding / deleting cards
 */
// test('Initial Piechart Load', async () => {
//   const page = await browser.newPage();   
//   await page.goto('http://localhost:3000/');
//   await page.click(".newCardButton");
//   await page.waitForTimeout(500);
//   const elem = await page.$("#pie0");
//   expect(elem._remoteObject.description).toBe("div#pie0");

// });