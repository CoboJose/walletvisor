const { Builder, By } = require('selenium-webdriver');
import { getElementByCss } from "../helpers";
describe('Tracker', () => {
  jest.setTimeout(30000);
  let driver;

  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    await driver.get("http://localhost:3000/")
  })

  afterEach(async function() {
    await driver.quit();
  })

  it('Sign Up', async function() {
    //await driver.findElement(By.css(".BtnSwitch")).click()
    await driver.findElement(By.css("input:nth-child(2)")).clear()
    await driver.findElement(By.css("input:nth-child(2)")).sendKeys("seleniumtests@test.com")
    await driver.findElement(By.css("input:nth-child(4)")).sendKeys("clear")
    await driver.findElement(By.css("input:nth-child(4)")).sendKeys("c0n^pL€Ex*P4$s")
    await driver.findElement(By.css(".BtnSubmit")).click()

    const logOutBtn = await getElementByCss(driver,"button:nth-child(1)")
    expect(await logOutBtn.getText()).toBe("Log out")
  })
})