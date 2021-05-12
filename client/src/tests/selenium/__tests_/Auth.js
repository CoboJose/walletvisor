const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
import { getAsyncElementByCss, login, sleep } from "../helpers";

const PAGE = "http://localhost:3000/";
const TIMEOUT = 30000;
const BROWSER = 'chrome';

const USER_1 = "selenium1@walletvisortest.test";
const USER_1_NAME = "'J8DPsOUvs2cqkB2iXheG0hSE5K73'";
//const USER_SIGNUP = "seleniumsignup@walletvisortest.test";
const PASSWORD = "c@npL€Ex*P4$s";

describe('Auth/Auth', () => {
  jest.setTimeout(TIMEOUT);
  let driver;

  beforeEach(async function() {
    driver = await new Builder().forBrowser(BROWSER).setChromeOptions(new chrome.Options().headless().windowSize({width:1920, height:1080})).build();
    await driver.get(PAGE);
  })
  afterEach(async function() {
    await driver.quit();
  })


  it('should Log In with the correct data', async function() {
    await login(driver, USER_1, PASSWORD);

    const welcomeMSG = await getAsyncElementByCss(driver,".temporal p");
    expect(await welcomeMSG.getText()).toBe("Welcome, " + USER_1_NAME);
  });

  it('should not log in with incorrect data', async function() {
    await login(driver, USER_1, "Bad Pass");

    const errorMsg = await getAsyncElementByCss(driver,".serverError");
    expect(await errorMsg.getText()).toBe("INVALID_PASSWORD");
  });
  
  it('should not sign up with incorrect data', async function() {
    await driver.findElement(By.css(".switchBtn")).click()
    await driver.findElement(By.css(".formInput:nth-child(1) > input")).clear()
    await driver.findElement(By.css(".formInput:nth-child(1) > input")).sendKeys("not@email")
    await driver.findElement(By.css(".formInput:nth-child(2) > input")).clear()
    await driver.findElement(By.css(".formInput:nth-child(2) > input")).sendKeys("PASSWORD")
    await driver.findElement(By.css(".buttonAndSpinner > button")).click()

    const errorMsg = await driver.findElement(By.css(".errormsg"))
    expect(await errorMsg.getText()).toBe("The email must follow this pattern: example@domain.com")
  });
  
  it('should logout correctly', async function() {
    await login(driver, USER_1, PASSWORD);
    sleep(1.5)
    const logOutBtn = await getAsyncElementByCss(driver,"button:nth-child(2)");
    logOutBtn.click();

    const logInBtn = await getAsyncElementByCss(driver,".buttonAndSpinner > button");
    expect(await logInBtn.getText()).toBe("Log In")
  });

  /*
  it('should sign Up with the correct data', async function() {
    await driver.findElement(By.css(".switchBtn")).click()

    await driver.findElement(By.css(".formInput:nth-child(1) > input")).clear()
    await driver.findElement(By.css(".formInput:nth-child(1) > input")).sendKeys(USER_SIGNUP)
    await driver.findElement(By.css(".formInput:nth-child(2) > input")).clear()
    await driver.findElement(By.css(".formInput:nth-child(2) > input")).sendKeys(PASSWORD)
    await driver.findElement(By.css(".buttonAndSpinner > button")).click()
    sleep(1)
    const logOutBtn = await getAsyncElementByCss(driver,"button:nth-child(2)")
    expect(await logOutBtn.getText()).toBe("Log out")
  });*/
  
})


