/* eslint-disable import/no-dynamic-require*/

import fs from 'fs';
import path from 'path';
import logger from './logger';

export default class SnapShotter {
  constructor(
    {
      label = 'label',
      latest = __dirname,
      gridUrl = 'http://localhost:4444',
      width = 700,
      height = 1024,
      browser = 'chrome',
      cookies,
      removeSelectors,
      waitForSelector,
      wait,
      url = 'http://localhost:80',
      viewportLabel = 'viewportLabel',
      onBeforeScript,
      onReadyScript
    },
    selenium
  ) {
    this._label = label;
    this._latest = latest;
    this._gridUrl = gridUrl;
    this._width = width;
    this._height = height;
    this._browser = browser;
    this._cookies = cookies;
    this._removeSelectors = removeSelectors;
    this._waitForSelector = waitForSelector;
    this._url = url;
    this.wait = wait;
    this._onBeforeScript = onBeforeScript;
    this._onReadyScript = onReadyScript;
    this._viewportLabel = viewportLabel;
    this._By = selenium.By;
    this._until = selenium.until;
    this._webdriver = selenium.webdriver;

    const browserCapability = browser.includes('chrome')
      ? this._webdriver.Capabilities.chrome
      : this._webdriver.Capabilities.firefox;

    this._driver = new this._webdriver.Builder()
      .usingServer(gridUrl)
      .withCapabilities(browserCapability())
      .build();

    this._driver
      .manage()
      .window()
      .setRect({
        width,
        height
      });
  }

  get driver() {
    return this._driver;
  }

  async snooze(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async removeTheSelectors() {
    for (let i = 0; i < this._removeSelectors.length; i++) {
      const script = `$('${
        this._removeSelectors[i]
      }').forEach(element => element.remove())`;

      await this.driver.executeScript(script);
    }
  }

  async applyCookies() {
    for (let i = 0; i < this._cookies.length; i++) {
      const { name, value } = this._cookies[i];

      await this.driver.manage().addCookie({
        name,
        value
      });
    }

    await this.driver.get(this._url);
  }

  async waitForSelector() {
    const timeout = 10000;
    const element = await this.driver.findElement(
      this._By.css(this._waitForSelector)
    );

    try {
      await this.driver.wait(this._until.elementIsVisible(element), timeout);
    } catch (error) {
      logger.error(
        'snapshotter',
        `❌  Unable to find the specified waitForSelector element on the page! ❌ ${error}`
      );
    }
  }

  async executeScript(script) {
    try {
      const scriptToExecute = require(path.resolve(script));
      await scriptToExecute(this._driver);
    } catch (error) {
      logger.error('snapshotter', `❌  Unable to run script due to: ${error}`);
    }
  }

  async takeSnap() {
    try {
      logger.info(
        'Snapshotting',
        `${this._label}-${this._viewportLabel} : Url: ${this._url}`
      );
      await this.driver.get(this._url);

      if (this._onBeforeScript) await this.executeScript(this._onBeforeScript);

      if (this._cookies) await this.applyCookies();

      if (this._waitForSelector) await this.waitForSelector();

      if (this._onReadyScript) await this.executeScript(this._onReadyScript);

      if (this._removeSelectors) await this.removeTheSelectors();

      if (this.wait) await this.snooze(this.wait);

      fs.writeFileSync(
        `${this._latest}/${this._label}-${this._viewportLabel}.png`,
        await this.driver.takeScreenshot(),
        'base64'
      );
    } catch (err) {
      logger.error(
        'snapshotter',
        `❌  Unable to take snapshot for ${this._label}-${
          this._viewportLabel
        }! ❌   : ${err}`
      );
    } finally {
      await this.driver.quit();
    }
  }
}
