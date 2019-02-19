/* globals jest expect */
import executeScript from './executeScript';

describe('executeScript', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.only('should execute a custom script', () => {
    const pathToScript = './src/__mocks__/onBeforeSuiteMock.js';
    const driverStub = {};

    const mock = executeScript(driverStub, pathToScript);

    console.log(mock.mock);

    expect(mock).toHaveBeenCalledTimes(1);
  });
});
