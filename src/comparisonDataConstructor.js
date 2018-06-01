import fs from 'fs';
import logger from './logger';

const validateScenarioData = async comparisonData =>
  new Promise(resolve => {
    comparisonData.map(imageData => {
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
      resolve(comparisonData);
    });
  });

const createImageObject = async scenarioData =>
  new Promise(async resolve => {
    const comparisonData = [];
    scenarioData.scenarios.map(scenario => {
      const data = {
        label: scenario.label,
        baseline: `${scenarioData.baseline}/${scenario.label}.png`,
        latest: `${scenarioData.latest}/${scenario.label}.png`,
        generatedDiffs: `${scenarioData.generatedDiffs}/${scenario.label}.png`,
        tolerance: scenario.tolerance ? scenario.tolerance : 0
      };

      comparisonData.push(data);
    });
    resolve(await validateScenarioData(comparisonData));
  });

export default createImageObject;
