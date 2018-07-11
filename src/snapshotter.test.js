/* globals jest expect */
import webdriver, { By, until } from './__mocks__/selenium-webdriver';
import SnapShotter from './snapshotter';
import seleniumMock from './__mocks__/seleniumMock';
import logger from './logger';

jest.mock('fs');

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

  it('Sets default values for height and width', () => {
    const config = {
      gridUrl: 'https://lol.com'
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
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
      config.waitForSelector,
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
      removeSelectors: ['selector1', 'selector2']
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(mockSnapshot.driver.executeScript.mock.calls.length).toBe(2);
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
      onBeforeScript: './src/__mocks__/seleniumMock.js'
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(seleniumMock).toBeCalledWith(mockSnapshot.driver);
  });

  it('Executes the onReady script', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      onReadyScript: './src/__mocks__/seleniumMock.js'
    };

    const mockSnapshot = new SnapShotter(config, { webdriver, By, until });
    await mockSnapshot.takeSnap();
    expect(seleniumMock).toBeCalledWith(mockSnapshot.driver);
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
});
