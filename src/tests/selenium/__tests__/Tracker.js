const { Builder, By } = require('selenium-webdriver');
import { addTransaction, getAsyncElementByCss, login, sleep} from "../helpers";

const PAGE = "http://localhost:3000/";
const TIMEOUT = 30000;
const BROWSER = 'chrome';

const USER_1 = "selenium1@walletvisortest.test";
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

  it('should add a transaction, show the correct balance, update it, and delete it', async function() {
    await login(driver, USER_1, PASSWORD);

    //ADD
    const t = {title:'test', amount:'50'};
    await addTransaction(driver,t);

    let transaction = await getAsyncElementByCss(driver, ".trk-trn:nth-child(1) .title");
    expect(await transaction.getText()).toBe("test");

    //Balance
    const balance = await getAsyncElementByCss(driver, ".balance > .amount");
    expect(await balance.getText()).toBe("-50 €");

    //Update
    await transaction.click();
    const updtBtn = await getAsyncElementByCss(driver, ".details .btn-update");
    await updtBtn.click();
    const title = await getAsyncElementByCss(driver, ".trk-updt-trn > .left > .input-field:nth-child(1) > input");
    await title.clear();
    await title.sendKeys("updated");
    const submitUpdateBtn = await getAsyncElementByCss(driver, ".trk-updt-trn .btn-submit");
    await submitUpdateBtn.click()
    sleep(1);

    transaction = await getAsyncElementByCss(driver, ".trk-trn:nth-child(1) .title");
    expect(await transaction.getText()).toBe("updated");

    //Delete
    const delBtn = await getAsyncElementByCss(driver, ".details .btn-delete");
    await delBtn.click()
    sleep(1)
    
    transaction = await driver.findElements(By.css(".trk-trn:nth-child(1) .title"));
    expect(transaction).toHaveLength(0);
  });
})