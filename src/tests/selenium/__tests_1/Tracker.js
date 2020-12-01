const { Builder, By } = require('selenium-webdriver');
import { getAsyncElementByCss} from "../helpers";

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

  it('should show the correct balance', async function() {
    
  });
  /*
  it('should add a new transaction, then update it, then delete it', async function() {
    
  });

  it('should not add a transaction with incorrect data', async function() {
    
  });

  it('should not update a transaction with incorrect data', async function() {
    
  });
  */
})