/* globals jest expect */
import { executeScriptWithDriver, executeScript } from './executeScript';
import onBeforeSuiteMock from './__mocks__/onBeforeSuiteMock.js';
import { By } from './__mocks__/selenium-webdriver';

jest.mock('onBeforeSuiteMock');

describe('executeScript', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('withDriver', () => {
    let pathToScript;
    let driverStub;

    beforeEach(() => {
      pathToScript = './src/__mocks__/onBeforeSuiteMock.js';
      driverStub = {};
    });

    it('should execute a custom script', async () => {
      await executeScriptWithDriver(driverStub, pathToScript);

      expect(onBeforeSuiteMock).toHaveBeenCalledTimes(1);
      expect(onBeforeSuiteMock).toHaveBeenCalledWith(driverStub, By);
    });

    it('should throw an error if the given script does not exist', () => {
      pathToScript = './nonExistantScript.js';

      return expect(
        executeScriptWithDriver(driverStub, pathToScript)
      ).rejects.toThrow(
        'Error: Could not find the file: ./nonExistantScript.js'
      );
    });

    it('should throw an error if the script fails', () => {
      pathToScript = './src/__mocks__/failingOnBeforeSuiteMock.js';

      return expect(
        executeScriptWithDriver(driverStub, pathToScript)
      ).rejects.toThrow('Boom!');
    });
  });

  describe('withoutDriver', () => {
    let pathToScript = './src/__mocks__/onBeforeSuiteMock.js';

    it('should execute a custom script', () => {
      executeScript(pathToScript);

      return expect(onBeforeSuiteMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the given script does not exist', () => {
      pathToScript = './nonExistantScript.js';

      return expect(executeScript(pathToScript)).rejects.toThrow(
        'Error: Could not find the file: ./nonExistantScript.js'
      );
    });

    it('should throw an error if the given script fails', () => {
      pathToScript = './src/__mocks__/failingOnBeforeSuiteMock.js';

      return expect(executeScript(pathToScript)).rejects.toThrow('Boom!');
    });
  });
});
