import inquirer from 'inquirer';
import fs from 'fs';
import logger from './logger';

const questions = [
  {
    type: 'input',
    name: 'gridUrl',
    message:
      'What is your selenium grid Url? \n  Example: http://selenium-grid:4444/wd/hub\n'
  },
  {
    type: 'input',
    name: 'baselineDir',
    message:
      'Where would you like your baseline image directory? \n  Example: ./baseline\n'
  },
  {
    type: 'input',
    name: 'latestDir',
    message:
      'Where would you like your latest image directory? \n  Example: ./latest\n'
  },
  {
    type: 'input',
    name: 'generatedDir',
    message:
      'Where would you like your generated differences image directory? \n  Example: ./generatedDiffs\n'
  },
  {
    type: 'input',
    name: 'reportdDir',
    message:
      'Where would you like your report directory? \n  Example: ./report\n'
  }
];

function init() {
  logger.info('init', '🐛 Welcome to Aye Spy 👀');
  return inquirer.prompt(questions).then(answers => {
    const dir = `${process.cwd()}/ayespy-config.json`;

    const config = Object.assign(answers, {
      scenarios: [
        {
          url: 'http://YOURSITE/',
          label: 'label',
          viewports: [{ height: 1500, width: 1024, label: 'large' }]
        }
      ]
    });

    return fs.writeFile(dir, JSON.stringify(config, null, 4), 'utf8', err => {
      if (err) new Error(err);
      logger.info('init', `Aye Spy config created at: ${dir}`);
    });
  });
}

export default init;
