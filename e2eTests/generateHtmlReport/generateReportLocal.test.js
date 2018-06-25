/* globals expect */

import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import config from './generateReportConfig';

describe('e2e Tests for generating html report locally', () => {
  let dirPath;

  beforeEach(() => {
    dirPath = path.resolve(config.report);

    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => fs.unlinkSync(`${dirPath}/${file}`));
      fs.rmdirSync(dirPath);
    }
  });
  it('generates the report', () => {
    let exitCode = 0;

    try {
      const stdout = execSync(
        'node ./lib/bin/run.js generate-report --browser chrome --config e2eTests/generateHtmlReport/generateReportConfig.json'
      ).toString();
      //pipe stdout to Jest console
      console.log(stdout);
    } catch (error) {
      exitCode = error.status;
    }

    expect(exitCode).toEqual(0);
    const latestDirFiles = fs.readdirSync(dirPath);
    expect(latestDirFiles).toEqual(['index.html']);
  });
});
