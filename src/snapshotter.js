/* eslint-disable import/no-dynamic-require*/

import fs from 'fs';
import jimp from 'jimp';
import logger from './logger';
import { executeScriptWithDriver } from './executeScript';

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
      removeElements,
      hideElements,
      waitForElement,
      wait,
      url = 'http://localhost:80',
      viewportLabel = 'viewportLabel',
      onBeforeScript,
      onReadyScript
    },
    selenium,
    onComplete,
    onError
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
    this._removeElements = removeElements;
    this._hideElements = hideElements;
    this._waitForElement = waitForElement;
    this._url = url;
    this.wait = wait;
    this._onBeforeScript = onBeforeScript;
    this._onReadyScript = onReadyScript;
    this._viewportLabel = viewportLabel;
    this._By = selenium.By;
    this._until = selenium.until;
    this._webdriver = selenium.webdriver;
    this._onComplete = onComplete;
    this._onError = onError;

    const browserCapability = this._browser.includes('chrome')
      ? this._webdriver.Capabilities.chrome
      : this._webdriver.Capabilities.firefox;

    this._capability = mobileDeviceName
      ? this.getMobileBrowserCapability()
      : browserCapability();
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
    for (let i = 0; i < this._removeElements.length; i++) {
      const script = `document.querySelectorAll('${
        this._removeElements[i]
      }').forEach(element => element.remove())`;

      await this.driver.executeScript(script);
    }
  }

  async hideTheSelectors() {
    for (let i = 0; i < this._hideElements.length; i++) {
      const script = `document.querySelectorAll('${
        this._hideElements[i]
      }').forEach(element => element.style.opacity = '0')`;

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

  async waitForElement() {
    const timeout = 10000;
    const element = await this.driver.findElement(
      this._By.css(this._waitForElement)
    );

    try {
      await this.driver.wait(this._until.elementIsVisible(element), timeout);
    } catch (error) {
      console.log(''); // eslint-disable-line no-console // space for progress bar
      logger.error(
        'snapshotter',
        `❌  Unable to find the specified waitForElement element on the page! ❌ ${error}`
      );
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
    logger.verbose('Cropping', `selector: ${selector}`);
    const { x, y, width, height } = await this.getElementDimensions(selector);

    await jimp
      .read(Buffer.from(screenshot, 'base64'))
      .then(image => image.crop(x, y, width, height))
      .then(cropped => cropped.write(filename));
  }

  writeScreenshot(filename, screenshot) {
    fs.writeFileSync(filename, screenshot, 'base64');
  }

  handleScriptError(error) {
    logger.error(
      'snapshotter',
      `❌  Unable to run script for scenario: ${
        this._label
      } \n  due to: ${error}`
    );
  }

  async takeSnap() {
    try {
      this._driver = await new this._webdriver.Builder()
        .usingServer(this._gridUrl)
        .withCapabilities(this._capability)
        .build();
    } catch (err) {
      this._onError();
      logger.error(
        'snapshotter',
        `❌  Unable to connect to the grid at ${this._gridUrl}`
      );
      process.exitCode = 1;
      return;
    }

    try {
      logger.verbose(
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

      if (this._onBeforeScript)
        await executeScriptWithDriver(this._driver, this._onBeforeScript).catch(
          this.handleScriptError
        );

      if (this._cookies) await this.applyCookies();

      if (this._waitForElement) await this.waitForElement();

      if (this._onReadyScript)
        await executeScriptWithDriver(this._driver, this._onReadyScript).catch(
          this.handleScriptError
        );

      if (this._hideElements) await this.hideTheSelectors();

      if (this._removeElements) await this.removeTheSelectors();

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

      this._onComplete();
    } catch (err) {
      this._onError();
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
