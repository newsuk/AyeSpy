#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import fs from 'fs';
import logger, { setupLogger } from '../logger';
import SnapShotter from '../snapshotter';
import getScreenshots from '../get-screenshots';
import isEqual from '../comparer';
import createDiffImage from '../createDiffs';
import comparisonDataConstructor from '../comparisonDataConstructor';
import updateBaselineShots from '../update-baseline-shots';

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
    await getScreenshots(fs, SnapShotter, config);
  });

program
  .command('update-baseline')
  .option('c, --config [config]', 'Path to your config')
  .action(async options => {
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require

    await updateBaselineShots(fs, config).catch(error => {
      logger.error('run', error);
    });
  });

program
  .command('compare')
  .option('c, --config [config]', 'Path to your config')
  .action(async options => {
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require
    const comparisonData = await comparisonDataConstructor(config);

    const failedScenarios = [];

    for (let i = 0; i < comparisonData.length; i++) {
      const equal = await isEqual(comparisonData[i]);
      if (!equal) failedScenarios.push(comparisonData[i]);
    }

    failedScenarios.forEach(async scenario => await createDiffImage(scenario));
  });

program.parse(process.argv);
