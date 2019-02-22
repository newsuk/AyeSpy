/* globals expect */

import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import config from './onBeforeSuiteScriptConfig';

describe('e2e Tests running onBeforeSuiteScript', () => {
  let dirPath;

  beforeEach(() => {
    dirPath = path.resolve(config.latest);

    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => fs.unlinkSync(`${dirPath}/${file}`));
      fs.rmdirSync(dirPath);
    }
  });

  it('should successfully run the script before taking a snapshot', async () => {
    let exitCode = 0;
    let stdout;
    try {
      stdout = execSync(
        'node ./lib/bin/run.js snap --browser chrome --config e2eTests/generic/onBeforeSuiteScript/onBeforeSuiteScriptConfig.json'
      ).toString();
      //pipe stdout to Jest console
      console.log(stdout);
    } catch (error) {
      exitCode = error.status;
    }

    expect(stdout).toEqual(expect.stringContaining('Script has Run!'));
    expect(exitCode).toEqual(0);
  });
});
