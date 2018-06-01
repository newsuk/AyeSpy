import webdriver from 'selenium-webdriver';
import fs from 'fs';
import logger from '../logger';

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

    this.driver = new webdriver.Builder()
      .usingServer(gridUrl)
      .withCapabilities(browserCapability())
      .build();

    this.driver
      .manage()
      .window()
      .setRect({ width, height });
  }

  async takeSnap(scenario) {
    logger.info(`Scenario: ${scenario.label}`, `Url: ${scenario.url}`);
    await this.driver.get(scenario.url);
    const screenShot = await this.driver.takeScreenshot();
    fs.writeFileSync(
      `${this.latest}/${scenario.label}.png`,
      screenShot,
      'base64'
    );
    await this.driver.quit();
  }
}
