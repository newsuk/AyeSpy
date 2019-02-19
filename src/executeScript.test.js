/* globals jest expect */
import executeScript from './executeScript';
import onBeforeSuiteMock from './__mocks__/onBeforeSuiteMock.js';
import { By } from './__mocks__/selenium-webdriver';

jest.mock('onBeforeSuiteMock');

describe('executeScript', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute a custom script', () => {
    const pathToScript = './src/__mocks__/onBeforeSuiteMock.js';
    const driverStub = {};

    executeScript(driverStub, pathToScript);

    expect(onBeforeSuiteMock).toHaveBeenCalledTimes(1);
    expect(onBeforeSuiteMock).toHaveBeenCalledWith(driverStub, By);
  });
});
