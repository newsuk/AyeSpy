#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import logger, { setupLogger } from '../logger';
import SnapShotter from './snapshotter';
import getScreenshots from '../get-screenshots';
import getComparisons from '../get-comparisons';
import getDiffImages from '../get-diffImages';
import comparer from './comparer';
import createDiffs from './createDiffs';
import comparisonDataConstructor from '../comparisonDataConstructor';

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

    logger.info('run', 'Getting snapshots... 📸 ');
    await getScreenshots(SnapShotter, config);
  });

program
  .command('compare')
  .option('c, --config [config]', 'Path to your config')
  .action(async options => {
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require
    let comparisonData = comparisonDataConstructor(config);

    comparisonData = await getComparisons(comparer, comparisonData);
    await getDiffImages(createDiffs, comparisonData);
  });

program.parse(process.argv);
