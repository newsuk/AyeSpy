/* globals expect */

import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import config from './snapConfig';

describe('e2e Tests taking snaps locally', () => {
  let dirPath;

  beforeEach(() => {
    dirPath = path.resolve(config.latest);
  });

  it('should successfully take a snapshot', async () => {
    let exitCode = 0;

    try {
      const stdout = execSync(
        'node ./lib/bin/run.js snap --browser firefox --config e2eTests/firefox/snap/snapConfig.json'
      ).toString();
      //pipe stdout to Jest console
      console.log(stdout);
    } catch (error) {
      exitCode = error.status;
    }

    expect(exitCode).toEqual(0);
    const latestDirFiles = fs.readdirSync(dirPath);
    expect(latestDirFiles).toEqual(['image-large.png']);
  });
});
