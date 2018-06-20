/* globals expect */

import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import config from './snapConfig';

describe('e2e Tests taking snaps', () => {
  let dirPath;

  beforeEach(() => {
    dirPath = path.resolve(config.latest);

    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => fs.unlinkSync(`${dirPath}/${file}`));
      fs.rmdirSync(dirPath);
    }
  });

  it('should successfully take a snapshot', async () => {
    let exitCode = 0;

    try{
      execSync('node ./lib/bin/run.js snap --browser chrome --config e2eTests/snap/snapConfig.json');
    }catch (error) {
      exitCode = error.status;
    }

    expect(exitCode).toEqual(0);
    const latestDirFiles = fs.readdirSync(dirPath);
    expect(latestDirFiles).toEqual(['image-large.png']);
  });

});
