import pug from 'pug';
import path from 'path';
import fs from 'fs';
import logger from './logger';
import { listRemoteKeys, uploadRemoteKeys } from './remoteActions';

const createReportData = config => {
  const report = [];

  for (let i = 0; i < config.scenarios.length; i++) {
    const scenario = config.scenarios[i];
    scenario.viewports.forEach(viewport => {
      const name = `${scenario.label}-${viewport.label}`;
      const imageName = `${name}.png`;

      const baselinePath = path.relative(
        config.report,
        `${config.baseline}/${imageName}`
      );
      const latestPath = path.relative(
        config.report,
        `${config.latest}/${imageName}`
      );
      const generatedAbsolutePath = path.resolve(
        `${config.generatedDiffs}/${imageName}`
      );
      const generatedDiffsPath = path.relative(
        config.report,
        `${config.generatedDiffs}/${imageName}`
      );

      if (fs.existsSync(generatedAbsolutePath)) {
        logger.info('generate-report', `found diff for ${name}`);
        const scenarioData = {
          label: name,
          baseline: baselinePath,
          latest: latestPath,
          generatedDiff: generatedDiffsPath
        };

        report.push(scenarioData);
      }
    });
  }
  return report;
};
const createRemoteReportData = (url, diffs) =>
  diffs.map(diff => {
    const [browser, key, scenario] = diff.Key.split('/'); //eslint-disable-line no-unused-vars
    const scenarioName = scenario.split('.png')[0];

    return {
      label: scenarioName,
      baseline: `${url}${browser}/baseline/${scenario}`,
      latest: `${url}${browser}/latest/${scenario}`,
      generatedDiff: `${url}${browser}/generatedDiffs/${scenario}`
    };
  });

const generateLocalReport = async config =>
  writeReport(config, createReportData(config));

const writeReport = (config, reportsData) => {
  const templatePath = path.join(__dirname, '../templates/report.pug');
  const compileTemplate = pug.compileFile(templatePath);
  const reportPresentation = compileTemplate({ reportsData });
  const reportDir = path.resolve(config.report);

  try {
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);
    fs.writeFileSync(`${reportDir}/index.html`, reportPresentation);
    logger.info('generate-report', 'successfully created report!');
    return `${reportDir}/index.html`;
  } catch (err) {
    logger.error(err);
    process.exitCode = 1;
  }
};

const generateRemoteReport = async config => {
  const filteredResults = await listRemoteKeys('generatedDiffs', config);
  const url = `https://s3-${config.remoteRegion}.amazonaws.com/${
    config.remoteBucketName
  }/`;
  await writeReport(config, createRemoteReportData(url, filteredResults));
  await uploadRemoteKeys('report', config);
};

export { generateLocalReport, generateRemoteReport };
