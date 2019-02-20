/* globals jest expect */
import jimp from 'jimp';
import webdriver, { By, until } from './__mocks__/selenium-webdriver';
import SnapShotter from './snapshotter';
import { executeScriptWithDriver } from './executeScript';
import logger from './logger';

jest.mock('fs');
jest.mock('jimp');
jest.mock('./executeScript');

const onComplete = () => {};
const onError = () => {};

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

    const mockSnapshot = new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    );
    await mockSnapshot.takeSnap();

    expect(mockSnapshot.driver.get).toBeCalledWith(config.url);
    expect(mockSnapshot.driver.takeScreenshot.mock.calls.length).toBe(1);
  });

  it('Sets default values for height and width', async () => {
    const config = {
      gridUrl: 'https://lol.com'
    };

    const mockSnapshot = new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    );
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
      { webdriver, By, until },
      onComplete,
      onError
    );

    new SnapShotter(
      {
        gridUrl: 'https://lol.com',
        browser: 'chrome'
      },
      { webdriver, By, until },
      onComplete,
      onError
    );

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

    const mockSnapshot = new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    );
    await mockSnapshot.takeSnap();
    expect(mockSnapshot.driver.wait.mock.calls.length).toBe(1);
    expect(mockSnapshot.driver.wait).toBeCalledWith(
      { _selector: config.waitForElement },
      10000
    );
  });

  it('takes a cropped snapshot', async () => {
    const config = {
      gridUrl: 'https://lol.com',
      url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
      label: '1homepage',
      cropToSelector: '.thisIsASelector'
    };

    await new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    ).takeSnap();

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

    const mockSnapshot = new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    );
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

    const mockSnapshot = new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    );
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

    const mockSnapshot = new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    );
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

    const mockSnapshot = new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    );
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

    const mockSnapshot = new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    );
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

    const mockSnapshot = new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    );
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

    const mockSnapshot = new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    );
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
    const mockSnapshot = new SnapShotter(
      config,
      { webdriver, By, until },
      onComplete,
      onError
    );
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
      { webdriver, By, until },
      onComplete,
      onError
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
      { webdriver, By, until },
      onComplete,
      onError
    );

    expect(mockSnapshot.mock.calls.length).toBe(0);
  });

  it('runs the onError callback after an error screenshot', async () => {
    const mockOnError = jest.fn();

    const executeScriptMock = () => {
      throw new Error('sad');
    };
    executeScriptWithDriver.mockImplementation(executeScriptMock);

    try {
      await new SnapShotter(
        {
          gridUrl: 'https://lol.com',
          browser: 'chrome',
          onBeforeScript: 'willthrow'
        },
        { webdriver, By, until },
        onComplete,
        mockOnError
      ).takeSnap();
    } finally {
      expect(mockOnError.mock.calls.length).toBe(1);
    }
  });

  it('runs the on-complete callback after finishing snapping', async () => {
    const mockOnComplete = jest.fn();
    try {
      await new SnapShotter(
        {
          gridUrl: 'https://lol.com',
          browser: 'chrome'
        },
        { webdriver, By, until },
        mockOnComplete,
        onError
      ).takeSnap();
    } finally {
      expect(mockOnComplete.mock.calls.length).toBe(1);
    }
  });

  it('quits gracefully if connecting to the grid fails', async () => {
    const mockOnError = jest.fn();
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
      await new SnapShotter(
        {
          gridUrl: 'https://ERRRORURL.com',
          browser: 'chrome'
        },
        { webdriver, By, until },
        onComplete,
        mockOnError
      ).takeSnap();
    } finally {
      expect(mockOnError).toBeCalled();
      expect(process.exitCode).toBe(1);
    }
  });
});
