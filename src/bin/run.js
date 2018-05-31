#!/usr/bin/env node

import program from 'commander';
import logger, { setupLogger } from '../logger';

setupLogger();

program
  .version('0.0.1')
  .command('update')
  .action(() => {
    logger.info('run', 'we have done no work yet');
  });

program.parse(process.argv);
