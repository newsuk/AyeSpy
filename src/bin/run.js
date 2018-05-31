#!/usr/bin/env node

import program from 'commander';
import SnapShotter from './snapshotter';
import getScreenshots from '../get-screenshots';

program
  .version('0.0.1')
  .command('snap')
  .action(async () => {
    const config = {
      scenarios: [
        {
          url: 'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/',
          label: 'homepage'
        },
        {
          url:
            'http://cps-render-ci.elb.tnl-dev.ntch.co.uk/profile/fiona-hamilton',
          label: 'author-profile'
        }
      ]
    };

    getScreenshots(SnapShotter, config);
  });

program.parse(process.argv);
