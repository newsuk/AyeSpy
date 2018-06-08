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
import { generateLocalReport, generateRemoteReport } from '../generateReport';
import uploadRemote from '../uploadRemote';
import fetchRemote from '../fetchRemote';
import deleteRemote from '../deleteRemote';

setupLogger();

program
  .version('0.0.1')
  .command('snap')
  .option(
    '-b, --browser [browser]',
    'Select the browser to run your tests on. E.G. chrome, firefox, etc.'
  )
  .option('c, --config [config]', 'Path to your config')
  .option('r, --remote', 'Upload new baseline to remote storage')
  .action(async options => {
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require

    config.browser = options.browser;
    logger.info('run', 'Getting snapshots... 📸 ');
    createDirectories(fs, config);
    await getScreenshots(SnapShotter, config);
    if (options.remote) await uploadRemote('latest', config);
  });

program
  .command('update-baseline')
  .option(
    '-b, --browser [browser]',
    'Select the browser to run your tests on. E.G. chrome, firefox, etc.'
  )
  .option('c, --config [config]', 'Path to your config')
  .option('r, --remote', 'Upload new baseline to remote storage')
  .action(async options => {
    if (!options.browser) throw 'no browser specified';
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require
    config.browser = options.browser;

    createDirectories(fs, config);
    await updateBaselineShots(fs, config).catch(error => {
      logger.error('run', error);
    });
    if (options.remote) await uploadRemote('baseline', config);
  });

program
  .command('compare')
  .option(
    '-b, --browser [browser]',
    'Select the browser to run your tests on. E.G. chrome, firefox, etc.'
  )
  .option('c, --config [config]', 'Path to your config')
  .option('r, --remote', 'Upload new baseline to remote storage')
  .action(async options => {
    if (!options.browser) throw 'no browser specified';
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require
    config.browser = options.browser;

    createDirectories(fs, config);

    const diffsPath = path.resolve(config.generatedDiffs);
    fs.readdirSync(diffsPath).forEach(file => {
      fs.unlinkSync(`${diffsPath}/${file}`);
    });

    if (options.remote) {
      await deleteRemote('generatedDiffs', config);
      for (let i = 0; i < config.scenarios.length; i++) {
        await fetchRemote(
          config,
          'baseline',
          `${config.scenarios[i].label}.png`
        );
      }
    }

    const comparisonData = await comparisonDataConstructor(config);

    for (let i = 0; i < comparisonData.length; i++) {
      if (!(await isEqual(comparisonData[i]))) {
        await createDiffImage(comparisonData[i]);
      }
    }

    if (options.remote) await uploadRemote('generatedDiffs', config);

    //TODO: write logger to fail builds
  });

program
  .command('generate-report')
  .option('c, --config [config]', 'Path to your config')
  .option('r, --remote', 'Upload new baseline to remote storage')
  .option(
    '-b, --browser [browser]',
    'Select the browser to run your tests on. E.G. chrome, firefox, etc.'
  )
  .action(options => {
    const config = require(path.resolve(options.config)); // eslint-disable-line import/no-dynamic-require
    config.browser = options.browser;

    const generateReport = options.remote
      ? generateRemoteReport
      : generateLocalReport;

    generateReport(config);
  });

program.parse(process.argv);
