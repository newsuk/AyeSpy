/* globals jest expect */
import executeScript from './executeScript';

jest.mock('require');

describe('executeScript', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute a custom script', async () => {
    const pathToScript = '../__mocks__/onReadyScriptMock.js';
    const driverStub = {};
    const scriptStub = jest.fn();
    require.mockImplementation(() => scriptStub);

    await executeScript(driverStub, pathToScript);
    expect(scriptStub).toHaveBeenCalledTimes(1);
  });
});
