/* eslint-disable import/no-dynamic-require*/

import fs from 'fs';
import path from 'path';
import jimp from 'jimp';
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
      mobileDeviceName,
      cookies,
      cropToSelector,
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
    this._mobileDeviceName = mobileDeviceName;
    this._cookies = cookies;
    this._cropToSelector = cropToSelector;
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

    const capability = mobileDeviceName
      ? this.getMobileBrowserCapability()
      : browserCapability();

    this._driver = new this._webdriver.Builder()
      .usingServer(gridUrl)
      .withCapabilities(capability)
      .build();
  }

  get driver() {
    return this._driver;
  }

  getMobileBrowserCapability() {
    return {
      browserName: 'chrome',
      version: '*',
      'goog:chromeOptions': {
        mobileEmulation: {
          deviceName: this._mobileDeviceName
        },
        args: ['incognito']
      }
    };
  }

  async snooze(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async removeTheSelectors() {
    for (let i = 0; i < this._removeSelectors.length; i++) {
      const script = `document.querySelectorAll('${
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

  getElementDimensions(selector) {
    return this._driver
      .findElement(this._By.css(selector))
      .getRect()
      .then(dimensions => {
        if (!dimensions)
          throw new Error(
            `"cropToSelector" (${selector}') could not be found on the page.`
          );
        return dimensions;
      });
  }

  async writeCroppedScreenshot(filename, screenshot, selector) {
    logger.info('Cropping', `selector: ${selector}`);
    const { x, y, width, height } = await this.getElementDimensions(selector);

    await jimp
      .read(Buffer.from(screenshot, 'base64'))
      .then(image => image.crop(x, y, width, height))
      .then(cropped => cropped.write(filename));
  }

  writeScreenshot(filename, screenshot) {
    fs.writeFileSync(filename, screenshot, 'base64');
  }

  async takeSnap() {
    try {
      logger.info(
        'Snapshotting',
        `${this._label}-${this._viewportLabel} : Url: ${this._url}`
      );
      await this.driver.get(this._url);

      await this._driver
        .manage()
        .window()
        .setRect({
          width: this._width,
          height: this._height
        });

      if (this._onBeforeScript) await this.executeScript(this._onBeforeScript);

      if (this._cookies) await this.applyCookies();

      if (this._waitForSelector) await this.waitForSelector();

      if (this._onReadyScript) await this.executeScript(this._onReadyScript);

      if (this._removeSelectors) await this.removeTheSelectors();

      if (this.wait) await this.snooze(this.wait);

      const filename = `${this._latest}/${this._label}-${
        this._viewportLabel
      }.png`;
      const screenshot = await this.driver.takeScreenshot();

      if (this._cropToSelector) {
        await this.writeCroppedScreenshot(
          filename,
          screenshot,
          this._cropToSelector
        );
      } else {
        this.writeScreenshot(filename, screenshot);
      }
    } catch (err) {
      logger.error(
        'snapshotter',
        `❌  Unable to take snapshot for ${this._label}-${
          this._viewportLabel
        }! ❌   : ${err}`
      );

      process.exitCode = 1;
    } finally {
      await this.driver.quit();
    }
  }
}
