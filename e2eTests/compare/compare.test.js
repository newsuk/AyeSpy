/* globals expect */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import config from './compareConfig';

describe('e2e Tests compare shots locally', () => {
  let dirPath;

  beforeEach(() => {
    dirPath = path.resolve(config.generatedDiffs);

    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => fs.unlinkSync(`${dirPath}/${file}`));
      fs.rmdirSync(dirPath);
    }
  });

  it('Compares the latest images with the baseline images', async () => {
    const stdout = await execSync(
      'node ./lib/bin/run.js compare --browser chrome --config e2eTests/compare/compareConfig.json'
    ).toString();

    //pipe stdout to Jest console
    console.log(stdout);
    const files = fs.readdirSync(dirPath);
    expect(files).toEqual(['fail-large.png']);
  });
});
