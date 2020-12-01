const {By, until } = require('selenium-webdriver');

export const getAsyncElementByCss = async (driver, css, timeout = 2000) => {
    const el = await driver.wait(until.elementLocated(By.css(css)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

export function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}