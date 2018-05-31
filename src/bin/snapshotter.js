import webdriver from 'selenium-webdriver';
import fs from 'fs';
import logger from '../logger';

export default class SnapShotter {
  constructor({ gridUrl, width = 700, height = 1024 }) {
    this.driver = new webdriver.Builder()
      .usingServer(gridUrl)
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();

    this.driver
      .manage()
      .window()
      .setRect({ width, height });
  }

  async takeSnap(url, label) {
    logger.info(`Scenario: ${label}`, `Url: ${url}`);
    await this.driver.get(url);
    const screenShot = await this.driver.takeScreenshot();
    fs.writeFileSync(`./newsnaps/${label}.png`, screenShot, 'base64');
    await this.driver.quit();
  }
}
