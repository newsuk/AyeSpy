/* globals expect */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import config from './updateBaselineConfig';

describe('e2e Tests updating baseline shots locally', () => {
  let dirPath;

  beforeEach(() => {
    dirPath = path.resolve(config.baseline);

    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => fs.unlinkSync(`${dirPath}/${file}`));
      fs.rmdirSync(dirPath);
    }
  });

  it('Updates the baseline directory', async () => {
    const stdout = await execSync(
      'node ./lib/bin/run.js update-baseline --browser chrome --config e2eTests/updateBaseline/updateBaselineConfig.json'
    ).toString();

    //pipe stdout to Jest console
    console.log(stdout);
    const files = fs.readdirSync(dirPath);
    expect(files).toEqual(['testImage.png']);
  });
});
