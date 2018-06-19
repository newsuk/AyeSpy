/* globals expect */

import { execSync, spawn, spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import selenium from 'selenium-standalone';
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

  it('Takes snapshot of web page', async () => {
    //install selenium-standalone
    console.log('about to install selenium');
    const selInstallOutput = await spawnSync('selenium-standalone install');
    selInstallOutput.stdout.on('data', data => {
      console.log(`stdout: ${data}`);
    });
    console.log('after installing selenium');

    //start selenium-standalone on a child/background process
    // console.log('about to start selenium');
    // const selStartOutput = await spawnSync(
    //   'selenium-standalone start'
    // ).toString();
    // console.log(selStartOutput);

    // await execSync('selenium-standalone install');
    // spawn('selenium-standalone start');
    // const stdout = await execSync('selenium-standalone start').toString();
    // console.log(stdout);

    //run the test
    // console.log('about to run test');
    // const stdout = await execSync(
    //   'node ./lib/bin/run.js snap --browser chrome --config e2eTests/snap/snapConfig.json'
    // ).toString();

    //pipe stdout to Jest console
    // console.log(stdout);
    // const files = fs.readdirSync(dirPath);
    // expect(files).toEqual(['image-large.png']);

    //shut down selenium
  });
});
