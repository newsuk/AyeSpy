import webdriver from 'selenium-webdriver';
import fs from 'fs';

export default class SnapShotter {
  constructor(gridUrl) {
    this.driver = new webdriver.Builder()
      .usingServer(gridUrl)
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();
  }

  async takeSnap(url, label) {
    console.log(`URL and Label: ${url}, ${label}`);
    await this.driver.get(url);
    const screenShot = await this.driver.takeScreenshot();
    fs.writeFileSync(`./newsnaps/${label}.png`, screenShot, 'base64');
    await this.driver.quit();
  }
}
