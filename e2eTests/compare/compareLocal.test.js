/* globals expect */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import config from './compareConfig';

function cleanState(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => fs.unlinkSync(`${dir}/${file}`));
    fs.rmdirSync(dir);
  }
}

describe('e2e Tests compare shots locally', () => {
  let dirPath;
  let reportPath;

  beforeEach(() => {
    dirPath = path.resolve(config.generatedDiffs);
    reportPath = path.resolve(config.report);
    
    cleanState(reportPath);
    cleanState(dirPath); 
  });

  it('Compares the latest images with the baseline images and generate a report', () => {
    try {
      execSync(
        'node ./lib/bin/run.js compare --browser chrome --config e2eTests/compare/compareConfig.json'
      ).toString();
    } catch (err) {
      expect(err.status).toBe(1);
      const images = fs.readdirSync(dirPath);
      const report = fs.readdirSync(reportPath);
      expect(images).toEqual(['fail-large.png']);
      expect(report).toEqual(['index.html']);
    }
  });
});
