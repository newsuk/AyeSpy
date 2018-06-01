#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import logger, { setupLogger } from '../logger';
import SnapShotter from '../snapshotter';
import getScreenshots from '../get-screenshots';
import isDifferent from '../comparer';
import createDiffImage from '../createDiffs';
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

    //TODO: check and create dirs

    logger.info('run', 'Getting snapshots... 📸 ');
    await getScreenshots(SnapShotter, config);
  });

program
  .command('compare')
  .option('c, --config [config]', 'Path to your config')
  .action(async options => {
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require
    const comparisonData = await comparisonDataConstructor(config);

    const failedScenarios = comparisonData.filter(
      async scenario => await isDifferent(scenario)
    );

    failedScenarios.forEach(async scenario => await createDiffImage(scenario));
  });

program.parse(process.argv);
