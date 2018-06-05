import webdriver, { By, until } from 'selenium-webdriver';
import fs from 'fs';
import logger from './logger';

export default class SnapShotter {
  constructor({
    latest,
    gridUrl,
    width = 700,
    height = 1024,
    browser = 'chrome'
  }) {
    this.latest = latest;
    const browserCapability = browser.includes('chrome')
      ? webdriver.Capabilities.chrome
      : webdriver.Capabilities.firefox;

    this._driver = new webdriver.Builder()
      .usingServer(gridUrl)
      .withCapabilities(browserCapability())
      .build();

    this._driver
      .manage()
      .window()
      .setRect({ width, height });
  }

  get driver() {
    return this._driver;
  }

  async removeSelectors(selectors) {
    for (let i = 0; i < selectors.length; i++) {
      const script = `$('${
        selectors[i]
      }').forEach(element => element.style.display = "none")`;

      await this._driver.executeScript(script);
    }
  }

  async takeSnap(scenario) {
    logger.info(`Scenario: ${scenario.label}`, `Url: ${scenario.url}`);
    await this.driver.get(scenario.url);

    if (scenario.removeSelectors) {
      await this.removeSelectors(scenario.removeSelectors);
    }

    if (scenario.waitForSelector) {
      const element = await this.driver.findElement(
        By.css(scenario.waitForSelector)
      );
      await this.driver.wait(until.elementIsVisible(element), 10000);
    }

    const screenShot = await this._driver.takeScreenshot();
    fs.writeFileSync(
      `${this.latest}/${scenario.label}.png`,
      screenShot,
      'base64'
    );
    await this.driver.quit();
  }
}
