import program from 'commander';

program
  .version('0.0.1')
  .command('update')
  .action(() => {
    console.error('we have done no work yet');
  });

program.parse(process.argv);
