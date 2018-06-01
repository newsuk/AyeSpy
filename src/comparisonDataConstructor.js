import fs from 'fs';
import logger from './logger';

const validateScenarioData = comparisonData =>
  new Promise(resolve => {
    comparisonData.forEach(imageData => {
      if (!fs.existsSync(imageData.baseline)) {
        logger.error(
          'comparison data construction',
          `Baseline image is not present for the scenario: ${imageData.label}`
        );
        process.exit(1);
      }

      if (!fs.existsSync(imageData.latest)) {
        logger.error(
          'comparison data construction',
          `Latest image is not present for the scenario: ${imageData.label}`
        );
        process.exit(1);
      }
    });
    resolve();
  });

const comparisonDataConstructor = config =>
  new Promise(async resolve => {
    const comparisonData = [];
    config.scenarios.map(scenario => {
      const data = {
        label: scenario.label,
        baseline: `${config.baseline}/${scenario.label}.png`,
        latest: `${config.latest}/${scenario.label}.png`,
        generatedDiffs: `${config.generatedDiffs}/${scenario.label}.png`,
        tolerance: scenario.tolerance ? scenario.tolerance : 0
      };

      comparisonData.push(data);
    });

    await validateScenarioData(comparisonData);
    resolve(comparisonData);
  });

export default comparisonDataConstructor;
