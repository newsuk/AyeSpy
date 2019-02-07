/* globals expect jest */
import fs from 'fs';
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
    fs.existsSync.mockReturnValue(true);
    fs.writeFileSync.mockReturnValue(true);
  });

  it('generate remote report data called successfully', async () => {
    await generateRemoteReport({ config });
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(uploadRemoteKeys).toHaveBeenCalledTimes(1);
  });

  it('generate local report data called successfully', async () => {
    delete config.remoteBucketName;
    delete config.remoteRegion;
    const localReport = await generateLocalReport(config);
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(localReport).toEqual('mock/resolved/path/index.html');
  });
});
