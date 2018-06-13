/* globals jest expect */

import webdriver from 'selenium-webdriver';
import SnapShotter from './snapshotter';

jest.mock('fs');
jest.mock('selenium-webdriver');

describe('The snapshotter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Takes navigates to a page and snaps', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      label: 'test',
      url: 'http://lolcats.com'
    };

    const mockSnapshot = new SnapShotter(config);
    await mockSnapshot.takeSnap();

    expect(mockSnapshot.driver.get).toBeCalledWith(config.url);
    expect(mockSnapshot.driver.takeScreenshot.mock.calls.length).toBe(1);
  });

  it('Sets default values for height and width', () => {
    const config = {
      gridUrl: 'https://lol.com'
    };

    const mockSnapshot = new SnapShotter(config);
    expect(mockSnapshot.driver.setRect).toBeCalledWith({
      height: 1024,
      width: 700
    });
  });

  it('Uses chrome and firefox', () => {
    new SnapShotter({
      gridUrl: 'https://lol.com',
      browser: 'firefox'
    });

    new SnapShotter({
      gridUrl: 'https://lol.com',
      browser: 'chrome'
    });

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

    const mockSnapshot = new SnapShotter(config);
    await mockSnapshot.takeSnap();
    expect(mockSnapshot.driver.wait.mock.calls.length).toBe(1);
    expect(mockSnapshot.driver.wait).toBeCalledWith(
      config.waitForSelector,
      10000
    );
  });
  // it('Throws an error if it cant find the selector')
  // it('Closes the browser if an error is thrown')
});
