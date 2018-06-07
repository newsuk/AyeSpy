import pug from 'pug';
import path from 'path';
import AWS from 'aws-sdk';
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
const createRemoteReportData = (url, diffs) =>
  diffs.map(diff => {
    const scenarioNameChunks = diff.Key.split('/');
    const scenarioName = scenarioNameChunks[
      scenarioNameChunks.length - 1
    ].split('.png')[0];

    return {
      label: scenarioName,
      baseline: `${url}baseline/${diff.Key}`,
      latest: `${url}latest/${diff.Key}`,
      generatedDiff: `${url}generatedDiff/${diff.Key}`
    };
  });

const generateLocalReport = async config => {
  const reportsData = createReportData(config);

  const templatePath = path.join(__dirname, '../templates/report.pug');
  const compileTemplate = pug.compileFile(templatePath);
  const reportPresentation = compileTemplate({ reportsData });
  const reportDir = path.resolve(config.report);

  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);
  fs.writeFileSync(`${reportDir}/index.html`, reportPresentation);
  logger.info('generate-report', 'successfully created report!');
};

const generateRemoteReport = async config =>
  new Promise((resolve, reject) => {
    const s3 = new AWS.S3();
    const params = { Bucket: config.remoteBucketName };

    s3.listObjectsV2(params, (error, data) => {
      if (error) reject(error);

      const diffs = data.Contents.filter(item =>
        item.Key.includes(`${config.browser}/generatedDiffs`)
      );

      const url = s3.endpoint.href;

      console.log(createRemoteReportData(url, diffs));

      resolve();
    });
  });

export { generateLocalReport, generateRemoteReport };
