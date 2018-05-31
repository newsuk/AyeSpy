#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import logger, { setupLogger } from '../logger';
import SnapShotter from './snapshotter';
import getScreenshots from '../get-screenshots';

setupLogger();

program
  .version('0.0.1')
  .command('snap')
  .option(
    '-b, --browser [browser]',
    'Select the browser to run your tests on. E.G. chrome, firefox, etc.'
  )
  .option('c, --config [config]', 'Path to your config')
  .action(async options => {
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require

    config.browser = options.browser;

    console.log(config);
    logger.info('run', 'Getting snapshots... 📸 ');
    await getScreenshots(SnapShotter, config);
  });

program.parse(process.argv);
