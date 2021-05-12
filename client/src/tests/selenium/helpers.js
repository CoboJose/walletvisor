const {By, until } = require('selenium-webdriver');

export const getAsyncElementByCss = async (driver, css, timeout = 3000) => {
    const el = await driver.wait(until.elementLocated(By.css(css)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

export const login = async (driver, user, pass) => {
    await driver.findElement(By.css(".formInput:nth-child(1) > input")).clear()
    await driver.findElement(By.css(".formInput:nth-child(1) > input")).sendKeys(user)
    await driver.findElement(By.css(".formInput:nth-child(2) > input")).clear()
    await driver.findElement(By.css(".formInput:nth-child(2) > input")).sendKeys(pass)
    await driver.findElement(By.css(".buttonAndSpinner > button")).click()
}

export const addTransaction = async (driver, transaction) => {
    const title = await getAsyncElementByCss(driver, ".trk-addtrn .left > .input-field:nth-child(1) > input");
    await title.sendKeys(transaction.title);
    const amount = await getAsyncElementByCss(driver, ".trk-addtrn .right input");
    await amount.sendKeys(transaction.amount);
    const submit = await getAsyncElementByCss(driver, ".trk-addtrn .btn-submit");
    await submit.click();
}

export function sleep(seconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < (seconds*1000));
}