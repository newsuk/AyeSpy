/* globals jest expect */
import webdriver, { By, until } from './__mocks__/selenium-webdriver';
import jimp from './__mocks__/jimp';
import SnapShotter from './snapshotter';
import seleniumMock from './__mocks__/onReadyScriptMock';
import logger from './logger';

jest.mock('fs');
jest.mock('jimp');

describe('The snapshotter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Navigates to a page and snaps', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      label: 'test',
      url: 'http://lolcats.com'
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();

    expect(mockSnapshot.driver.get).toBeCalledWith(config.url);
    expect(mockSnapshot.driver.takeScreenshot.mock.calls.length).toBe(1);
  });

  it('Sets default values for height and width', async () => {
    const config = {
      gridUrl: 'https://lol.com'
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(mockSnapshot.driver.setRect).toBeCalledWith({
      height: 1024,
      width: 700
    });
  });

  it('Uses chrome and firefox', () => {
    new SnapShotter(
      {
        gridUrl: 'https://lol.com',
        browser: 'firefox'
      },
      { webdriver, By, until }
    );

    new SnapShotter(
      {
        gridUrl: 'https://lol.com',
        browser: 'chrome'
      },
      { webdriver, By, until }
    );

    expect(webdriver.Capabilities.chrome.mock.calls.length).toBe(1);
    expect(webdriver.Capabilities.firefox.mock.calls.length).toBe(1);
  });

  it('Waits for selectors', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      waitForSelector: 'selector'
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(mockSnapshot.driver.wait.mock.calls.length).toBe(1);
    expect(mockSnapshot.driver.wait).toBeCalledWith(
      { _selector: config.waitForSelector },
      10000
    );
  });

  it('Closes the browser if an error is thrown', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      waitForSelector: 'selector'
    };

    By.css = () => {
      throw new Error('sad times');
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(mockSnapshot.driver.quit.mock.calls.length).toBe(1);
  });

  it('Removes Selectors', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      removeElements: ['selector1', 'selector2']
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(mockSnapshot.driver.executeScript.mock.calls.length).toBe(2);
  });

  xit('takes a cropped snapshot', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      cropToSelector: '.thisIsASelector'
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(jimp.read).toHaveBeenCalled();
  });

  it('implicitly waits if specified', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://test.co.uk/',
      label: '1homepage',
      wait: 2000
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    mockSnapshot.snooze = jest.fn();
    await mockSnapshot.takeSnap();
    expect(mockSnapshot.snooze.mock.calls.length).toBe(1);
  });

  it('Adds cookies', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      cookies: [
        {
          name: 'cookiename',
          value: 'cookievalue'
        },
        {
          name: 'anothercookiename',
          value: 'anothercookievalue'
        }
      ]
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(mockSnapshot.driver.addCookie.mock.calls.length).toBe(2);
  });

  it('Executes the onBefore script', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      onBeforeScript: './src/__mocks__/onReadyScriptMock.js'
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(seleniumMock).toBeCalledWith(mockSnapshot.driver, By);
  });

  it('Executes the onReady script', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      onReadyScript: './src/__mocks__/onReadyScriptMock.js'
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(seleniumMock).toBeCalledWith(mockSnapshot.driver, By);
  });

  it('Throws an error if incorrect script file is provided', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      onReadyScript: '/brokenfile.js'
    };

    logger.error = jest.fn();
    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(logger.error.mock.calls.length).toBe(1);
  });

  it('Returns the mobile browser capabilities when called with a mobile emulator', async () => {
    const mockSnapshot = (SnapShotter.prototype.getMobileBrowserCapability = jest.fn());
    new SnapShotter(
      {
        gridUrl: 'https://lol.com',
        mobileDeviceName: 'test'
      },
      { webdriver, By, until }
    );

    expect(mockSnapshot.mock.calls.length).toBe(1);
  });

  it('Returns the desktop capabilities when called with a non-mobile browser', async () => {
    const mockSnapshot = (SnapShotter.prototype.getMobileBrowserCapability = jest.fn());
    new SnapShotter(
      {
        gridUrl: 'https://lol.com',
        browser: 'chrome'
      },
      { webdriver, By, until }
    );

    expect(mockSnapshot.mock.calls.length).toBe(0);
  });
});
