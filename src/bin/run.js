#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import fs from 'fs';
import logger, { setupLogger } from '../logger';
import SnapShotter from '../snapshotter';
import getScreenshots from '../get-screenshots';
import isEqual from '../comparer';
import createDirectories from '../create-directories';
import createDiffImage from '../createDiffs';
import comparisonDataConstructor from '../comparisonDataConstructor';
import updateBaselineShots from '../update-baseline-shots';
import generateReport from '../generateReport';

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
    createDirectories(fs, config);
    await getScreenshots(SnapShotter, config);
  });

program
  .command('update-baseline')
  .option('c, --config [config]', 'Path to your config')
  .action(async options => {
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require

    createDirectories(fs, config);
    await updateBaselineShots(fs, config).catch(error => {
      logger.error('run', error);
    });
  });

program
  .command('compare')
  .option('c, --config [config]', 'Path to your config')
  .action(async options => {
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require
    createDirectories(fs, config);
    const comparisonData = await comparisonDataConstructor(config);

    const failedScenarios = [];

    for (let i = 0; i < comparisonData.length; i++) {
      const equal = await isEqual(comparisonData[i]);
      if (!equal) failedScenarios.push(comparisonData[i]);
    }

    failedScenarios.forEach(async scenario => await createDiffImage(scenario));

    //TODO: write logger to fail builds
  });

program
  .command('generate-report')
  .option('c, --config [config]', 'Path to your config')
  .action(async options => {
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require
    generateReport(config);
  });

program.parse(process.argv);
