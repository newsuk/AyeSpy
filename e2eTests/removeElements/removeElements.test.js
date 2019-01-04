/* globals expect */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import config from './removeElementsConfig';

function cleanState(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => fs.unlinkSync(`${dir}/${file}`));
    fs.rmdirSync(dir);
  }
}

describe('e2e Tests remove elements', () => {
  let latestMockImagesPath;

  beforeEach(() => {
    latestMockImagesPath = path.resolve(config.latest);

    cleanState(latestMockImagesPath);
  });

  it('remove elements from webpage and compares', () => {
    let exitCode = 0;

    try {
      const snapOutput = execSync(
        'node ./lib/bin/run.js snap --browser chrome --config e2eTests/removeElements/removeElementsConfig.json'
      ).toString();
      console.log(snapOutput);

      const compareOutput = execSync(
        'node ./lib/bin/run.js compare --browser chrome --config e2eTests/removeElements/removeElementsConfig.json'
      ).toString();
      console.log(compareOutput);
    } catch (err) {
      console.log(err.stdout.toString());
      console.log(err.stderr.toString());
      exitCode = err.status;
    }

    expect(exitCode).toEqual(0);
  });
});
