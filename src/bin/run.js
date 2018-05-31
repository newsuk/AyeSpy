#!/usr/bin/env node

import program from 'commander';
import logger, { setupLogger } from '../logger';
import SnapShotter from './snapshotter';
import getScreenshots from '../get-screenshots';

setupLogger();

program
  .version('0.0.1')
  .command('snap')
  .action(async () => {
    const config = {
      gridUrl: 'http://selenium-grid.tnl-dev.ntch.co.uk:4444/wd/hub',
      scenarios: [
        {
          url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
          label: 'homepage',
          height: 2000,
          width: 500
        },
        {
          url:
            'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/profile/fiona-hamilton',
          label: 'author-profile'
        }
      ]
    };

    logger.info('run', 'Getting snapshots... 📸 ');

    await getScreenshots(SnapShotter, config);
  });

program.parse(process.argv);
