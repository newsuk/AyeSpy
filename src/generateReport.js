import pug from 'pug';
import path from 'path';
import fs from 'fs';
import logger from './logger';

const createReportData = config => {
  const report = [];

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
        generatedDiff: generatedDiffsPath
      };

      report.push(scenarioData);
    }
  }
  return report;
};

export default async config => {
  const reportsData = createReportData(config);

  const templatePath = path.join(__dirname, '../templates/report.pug');
  const compileTemplate = pug.compileFile(templatePath);
  const reportPresentation = compileTemplate({ reportsData });
  const reportDir = path.resolve(config.report);

  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);
  fs.writeFileSync(`${reportDir}/index.html`, reportPresentation);
  logger.info('generate-report', 'successfully created report!');
};
