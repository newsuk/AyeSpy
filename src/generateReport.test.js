/* globals expect jest */
import { generateRemoteReport, generateLocalReport } from './generateReport';
import { uploadRemoteKeys } from './remoteActions';

jest.mock('fs');
jest.mock('pug');
jest.mock('path');
jest.mock('./remoteActions');

describe('generate Report', () => {
  const config = {
    baseline: './e2eTests/baseline',
    latest: './e2eTests/latest',
    generatedDiffs: './e2eTests/generatedDiffs',
    report: './e2eTests/reports',
    browser: 'chrome',
    branch: 'branch',
    remoteBucketName: 'mockRemoteBucketName',
    remoteRegion: 'mockRemoteRegion',
    scenarios: [
      {
        url: 'http://testurl.com/',
        label: 'test_article',
        viewports: [{ height: 768, width: 1024, label: 'desktop' }]
      },
      {
        url: 'http://testurl1.com/',
        label: 'test_article1',
        viewports: [{ height: 614, width: 314, label: 'mobile' }]
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generate remote report data called successfully', async () => {
    await generateRemoteReport(config);
    expect(uploadRemoteKeys).toHaveBeenCalledTimes(1);
  });

  it('generate local report data called successfully', async () => {
    const localReport = await generateLocalReport(config);
    expect(localReport).toEqual('mock/resolved/path/index.html');
  });
});
