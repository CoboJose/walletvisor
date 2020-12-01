const { Builder, By } = require('selenium-webdriver');
import { getAsyncElementByCss } from "../helpers";

const PAGE = "http://localhost:3000/";
const TIMEOUT = 30000;
const BROWSER = 'chrome';

const USER_1 = "selenium1@walletvisortest.test";
const USER_SIGNUP = "seleniumsignup@walletvisortest.test";
const PASSWORD = "c@npL€Ex*P4$s";

describe('Auth/Auth', () => {
  jest.setTimeout(TIMEOUT);
  let driver;

  beforeEach(async function() {
    driver = await new Builder().forBrowser(BROWSER).build()
    await driver.get(PAGE)
  })

  afterEach(async function() {
    await driver.quit();
  })

  it('should Log In with the correct data', async function() {
    await driver.findElement(By.css("input:nth-child(2)")).clear()
    await driver.findElement(By.css("input:nth-child(2)")).sendKeys(USER_1)
    await driver.findElement(By.css("input:nth-child(4)")).clear()
    await driver.findElement(By.css("input:nth-child(4)")).sendKeys(PASSWORD)
    await driver.findElement(By.css(".BtnSubmit")).click()

    const logOutBtn = await getAsyncElementByCss(driver,"button:nth-child(1)")
    expect(await logOutBtn.getText()).toBe("Log out")
  });
  /*
  it('should not log in with incorrect data', async function() {

  });
  
  it('should sign Up with the correct data', async function() {
    await driver.findElement(By.css(".BtnSwitch")).click()
    await driver.findElement(By.css("input:nth-child(2)")).clear()
    await driver.findElement(By.css("input:nth-child(2)")).sendKeys(USER_SIGNUP)
    await driver.findElement(By.css("input:nth-child(4)")).sendKeys("clear")
    await driver.findElement(By.css("input:nth-child(4)")).sendKeys(PASSWORD)
    await driver.findElement(By.css(".BtnSubmit")).click()

    const logOutBtn = await getAsyncElementByCss(driver,"button:nth-child(1)")
    expect(await logOutBtn.getText()).toBe("Log out")
  });

  it('should not sign up with incorrect data', async function() {

  });

  it('should auto login when remember me is selected and the page is refreshed', async function() {

  });

  it('should logout correctly', async function() {
    
  });
  */
})


