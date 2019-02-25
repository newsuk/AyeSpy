/* globals jest expect */
import jimp from 'jimp';
import webdriver, { By, until } from './__mocks__/selenium-webdriver';
import SnapShotter from './snapshotter';
import { executeScriptWithDriver } from './executeScript';
import logger from './logger';

jest.mock('fs');
jest.mock('jimp');
jest.mock('./executeScript');

const onComplete = jest.fn();
const onError = jest.fn();

function createMockSnapshotter(config) {
  return new SnapShotter(config, { webdriver, By, until }, onComplete, onError);
}

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

    const mockSnapshot = createMockSnapshotter(config);
    await mockSnapshot.takeSnap();

    expect(mockSnapshot.driver.get).toBeCalledWith(config.url);
    expect(mockSnapshot.driver.takeScreenshot.mock.calls.length).toBe(1);
  });

  it('Sets default values for height and width', async () => {
    const config = {
      gridUrl: 'https://lol.com'
    };

    const mockSnapshot = createMockSnapshotter(config);
    await mockSnapshot.takeSnap();

    expect(mockSnapshot.driver.setRect).toBeCalledWith({
      height: 1024,
      width: 700
    });
  });

  it('Uses chrome and firefox', () => {
    createMockSnapshotter({
      gridUrl: 'https://lol.com',
      browser: 'firefox'
    });

    createMockSnapshotter({
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
      waitForElement: 'selector'
    };

    const mockSnapshot = createMockSnapshotter(config);
    await mockSnapshot.takeSnap();

    expect(mockSnapshot.driver.wait.mock.calls.length).toBe(1);
    expect(mockSnapshot.driver.wait).toBeCalledWith(
      { _selector: config.waitForElement },
      10000
    );
  });

  it('Waits for IFrame selector', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      waitForIFrameElement: {
        frame: 'frame-selector',
        element: 'element-selector'
      }
    };

    const mockSnapshot = createMockSnapshotter(config);
    await mockSnapshot.takeSnap();

    expect(until.elementLocated).toBeCalledWith(
      config.waitForIFrameElement.element
    );
    expect(mockSnapshot.driver.switchTo().defaultContent).toBeCalled();
  });

  it('logs when it cannot find the IFrame selector', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      waitForIFrameElement: {
        frame: 'frame-selector',
        element: 'element-selector'
      }
    };

    until.elementLocated = jest.fn().mockImplementationOnce(() => {
      throw new Error('sad times');
    });
    logger.error = jest.fn();

    const mockSnapshot = createMockSnapshotter(config);
    await mockSnapshot.takeSnap();

    expect(logger.error.mock.calls.length).toBe(1);
    expect(mockSnapshot.driver.switchTo().defaultContent).toBeCalled();
  });

  it('takes a cropped snapshot', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      cropToSelector: '.thisIsASelector'
    };

    await createMockSnapshotter(config).takeSnap();

    expect(jimp.read).toHaveBeenCalled();
  });

  it('Closes the browser if an error is thrown', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      waitForElement: 'selector'
    };

    By.css = jest.fn().mockImplementationOnce(() => {
      throw new Error('sad times');
    });

    const mockSnapshot = createMockSnapshotter(config);
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

    const mockSnapshot = createMockSnapshotter(config);
    await mockSnapshot.takeSnap();

    expect(mockSnapshot.driver.executeScript.mock.calls.length).toBe(2);
  });

  it('Hides Selectors', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://test.com/',
      label: '1homepage',
      hideElements: ['selector1', 'selector2']
    };

    const mockSnapshot = createMockSnapshotter(config);
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

    const mockSnapshot = createMockSnapshotter(config);
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

    const mockSnapshot = createMockSnapshotter(config);
    await mockSnapshot.takeSnap();

    expect(mockSnapshot.driver.addCookie.mock.calls.length).toBe(2);
  });

  it('Executes the onBefore script', async () => {
    const executeScriptMock = jest.fn();
    executeScriptWithDriver.mockImplementation(executeScriptMock);

    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      onBeforeScript: './src/__mocks__/onReadyScriptMock.js'
    };

    const mockSnapshot = createMockSnapshotter(config);
    await mockSnapshot.takeSnap();

    expect(executeScriptMock).toBeCalledTimes(1);
    expect(executeScriptMock).toBeCalledWith(
      mockSnapshot.driver,
      config.onBeforeScript
    );
  });

  it('Executes the onReady script', async () => {
    const executeScriptMock = jest.fn();
    executeScriptWithDriver.mockImplementation(executeScriptMock);

    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      onReadyScript: './src/__mocks__/onReadyScriptMock.js'
    };

    const mockSnapshot = createMockSnapshotter(config);
    await mockSnapshot.takeSnap();

    expect(executeScriptMock).toBeCalledTimes(1);
    expect(executeScriptMock).toBeCalledWith(
      mockSnapshot.driver,
      config.onReadyScript
    );
  });

  it('Throws an error if incorrect script file is provided', async () => {
    const executeScriptMock = () => {
      throw new Error('file not found');
    };
    executeScriptWithDriver.mockImplementation(executeScriptMock);
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      onReadyScript: '/brokenfile.js'
    };

    logger.error = jest.fn();
    const mockSnapshot = createMockSnapshotter(config);
    await mockSnapshot.takeSnap();

    expect(logger.error.mock.calls.length).toBe(1);
  });

  it('Returns the mobile browser capabilities when called with a mobile emulator', async () => {
    const mockSnapshot = (SnapShotter.prototype.getMobileBrowserCapability = jest.fn());

    createMockSnapshotter({
      gridUrl: 'https://lol.com',
      mobileDeviceName: 'test'
    });

    expect(mockSnapshot.mock.calls.length).toBe(1);
  });

  it('Returns the desktop capabilities when called with a non-mobile browser', async () => {
    const mockSnapshot = (SnapShotter.prototype.getMobileBrowserCapability = jest.fn());

    createMockSnapshotter({
      gridUrl: 'https://lol.com',
      browser: 'chrome'
    });

    expect(mockSnapshot.mock.calls.length).toBe(0);
  });

  it('runs the onError callback after an error screenshot', async () => {
    const executeScriptMock = () => {
      throw new Error('sad');
    };
    executeScriptWithDriver.mockImplementation(executeScriptMock);

    try {
      await createMockSnapshotter({
        gridUrl: 'https://lol.com',
        browser: 'chrome',
        onBeforeScript: 'willthrow'
      }).takeSnap();
    } finally {
      expect(onError.mock.calls.length).toBe(1);
    }
  });

  it('runs the on-complete callback after finishing snapping', async () => {
    try {
      await createMockSnapshotter({
        gridUrl: 'https://lol.com',
        browser: 'chrome'
      }).takeSnap();
    } finally {
      expect(onComplete.mock.calls.length).toBe(1);
    }
  });

  it('quits gracefully if connecting to the grid fails', async () => {
    class Builder {
      build() {
        const wrap = {
          get: jest
            .fn()
            .mockImplementation(() => new Error('failed requesting grid'))
        };
        return wrap;
      }
    }
    webdriver.Builder = Builder;

    try {
      await createMockSnapshotter({
        gridUrl: 'https://ERRRORURL.com',
        browser: 'chrome'
      }).takeSnap();
    } finally {
      expect(onError).toBeCalled();
      expect(process.exitCode).toBe(1);
    }
  });
});
