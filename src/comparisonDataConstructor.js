import fs from 'fs';
import logger from './logger';

const validateScenarioData = comparisonData => {
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
  });
};

const createImageObject = scenarioData => {
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
  validateScenarioData(comparisonData);
  return comparisonData;
};

export default createImageObject;
