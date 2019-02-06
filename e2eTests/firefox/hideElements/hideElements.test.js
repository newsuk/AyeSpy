/* globals expect */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import config from './hideElementsConfig';

function cleanState(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => fs.unlinkSync(`${dir}/${file}`));
    fs.rmdirSync(dir);
  }
}

describe('e2e Tests hide elements', () => {
  let latestMockImagesPath;

  beforeEach(() => {
    latestMockImagesPath = path.resolve(config.latest);

    cleanState(latestMockImagesPath);
  });

  it('hides elements using zero opacity', () => {
    let exitCode = 0;

    try {
      const snapOutput = execSync(
        'node ./lib/bin/run.js snap --browser firefox --config e2eTests/firefox/hideElements/hideElementsConfig.json'
      ).toString();
      console.log(snapOutput);
      const compareOutput = execSync(
        'node ./lib/bin/run.js compare --browser firefox --config e2eTests/firefox/hideElements/hideElementsConfig.json'
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
