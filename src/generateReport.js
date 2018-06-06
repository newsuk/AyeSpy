import pug from 'pug';
import path from 'path';
import fs from 'fs';
import logger from './logger';

const createReportData = config => {
  const reportsData = [];

  for (let i = 0; i < config.scenarios.length; i++) {
    const imageName = `${config.scenarios[i].label}.png`;
    const baselinePath = path.resolve(`${config.baseline}/${imageName}`);
    const latestPath = path.resolve(`${config.latest}/${imageName}`);
    const generatedDiffsPath = path.resolve(
      `${config.generatedDiffs}/${imageName}`
    );

    if (fs.existsSync(generatedDiffsPath)) {
      logger.info(
        'generate-report',
        `found diff for ${config.scenarios[i].label}`
      );
      const scenarioData = {
        label: config.scenarios[i].label,
        baseline: baselinePath,
        latest: latestPath,
        comparison: generatedDiffsPath
      };

      reportsData.push(scenarioData);
    }
  }

  logger.info(
    'generate-report',
    `full array of reports data is ${reportsData}`
  );
  return reportsData;
};

export default async config => {
  const reportsData = createReportData(config);

  const templatePath = path.join(__dirname, '../templates/report.pug');
  const compileTemplate = pug.compileFile(templatePath);
  const dextrosePresentation = compileTemplate({ reportsData });
  const reportDir = path.resolve(config.report);

  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);
  fs.writeFileSync(`${reportDir}/index.html`, dextrosePresentation);
  logger.info('generate-report', 'successfully created report!');
};
