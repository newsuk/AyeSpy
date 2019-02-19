/* globals jest expect */
import { executeScriptWithDriver, executeScript } from './executeScript';
import onBeforeSuiteMock from './__mocks__/onBeforeSuiteMock.js';
import { By } from './__mocks__/selenium-webdriver';

jest.mock('onBeforeSuiteMock');

describe('executeScript', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute a custom script with a driver', () => {
    const pathToScript = './src/__mocks__/onBeforeSuiteMock.js';
    const driverStub = {};

    executeScriptWithDriver(driverStub, pathToScript);

    expect(onBeforeSuiteMock).toHaveBeenCalledTimes(1);
    expect(onBeforeSuiteMock).toHaveBeenCalledWith(driverStub, By);
  });

  it('should execute a custom script without a driver', () => {
    const pathToScript = './src/__mocks__/onBeforeSuiteMock.js';

    executeScript(pathToScript);

    expect(onBeforeSuiteMock).toHaveBeenCalledTimes(1);
  });
});
