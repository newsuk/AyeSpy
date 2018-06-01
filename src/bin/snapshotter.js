import webdriver from 'selenium-webdriver';
import fs from 'fs';
import logger from '../logger';

export default class SnapShotter {
  constructor({ gridUrl, width = 700, height = 1024, browser = 'chrome' }) {
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

  async takeSnap(scenario) {
    logger.info(`Scenario: ${scenario.label}`, `Url: ${scenario.url}`);
    await this._driver.get(scenario.url);
    const screenShot = await this._driver.takeScreenshot();
    fs.writeFileSync(`./newsnaps/${scenario.label}.png`, screenShot, 'base64');
    await this.driver.quit();
  }
}
