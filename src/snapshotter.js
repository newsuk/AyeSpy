import webdriver, { By, until } from 'selenium-webdriver';
import fs from 'fs';
import logger from './logger';

export default class SnapShotter {
  constructor({
    label,
    latest,
    gridUrl,
    viewports,
    width = 700,
    height = 1024,
    browser = 'chrome',
    cookies,
    removeSelectors,
    waitForSelector,
    url,
    viewportLabel
  }) {
    this._label = label;
    this._latest = latest;
    this._gridUrl = gridUrl;
    this._viewports = viewports;
    this._width = width;
    this._height = height;
    this._browser = browser;
    this._cookies = cookies;
    this._removeSelectors = removeSelectors;
    this._waitForSelector = waitForSelector;
    this._url = url;
    this._viewportLabel = viewportLabel;

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

  async removeTheSelectors() {
    for (let i = 0; i < this._removeSelectors.length; i++) {
      const script = `$('${
        this._removeSelectors[i]
      }').forEach(element => element.style.display = "none")`;

      await this.driver.executeScript(script);
    }
  }

  async takeSnap() {
    try {
      const timeout = 10000;
      logger.info(
        'Snapshotting',
        `${this._label}-${this._viewportLabel} : Url: ${this._url}`
      );
      await this.driver.get(this._url);
  
      if (this._cookies) {
        for (let i = 0; i < this._cookies.length; i++) {
          const { name, value } = this._cookies[i];
  
          await this.driver.manage().addCookie({ name, value });
        }
  
        await this.driver.get(this._url);
      }
  
      if (this._removeSelectors) {
        await this.removeTheSelectors();
      }
  
      if (this._waitForSelector) {
        const element = await this.driver.findElement(
          By.css(this._waitForSelector)
        );
  
        try {
          await this.driver.wait(until.elementIsVisible(element), timeout);
        } catch (error) {
          logger.error(
            'snapshotter',
            `❌  Unable to find the specified waitForSelector element on the page! ❌ ${error}`
          );
        }
      }
  
      const screenShot = await this.driver.takeScreenshot();
      fs.writeFileSync(
        `${this._latest}/${this._label}-${this._viewportLabel}.png`,
        screenShot,
        'base64'
      );
    }
    catch(err){

    }
    finally {
      await this.driver.quit();
    }
    
  }
}
