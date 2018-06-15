import logger from './logger';
import scenarioValidator from './scenarioValidator';

const comparisonDataConstructor = (fs, config) =>
  new Promise(async resolve => {
    const comparisonData = [];
    config.scenarios.forEach(scenario => {
      scenarioValidator(scenario);

      scenario.viewports.forEach(viewport => {
        const baselinePath = `${config.baseline}/${scenario.label}-${
          viewport.label
        }.png`;
        const latestPath = `${config.latest}/${scenario.label}-${
          viewport.label
        }.png`;
        const generatedDiffsPath = `${config.generatedDiffs}/${
          scenario.label
        }-${viewport.label}.png`;

        if (!fs.existsSync(latestPath) || !fs.existsSync(baselinePath)) {
          logger.error(
            'comparison data construction',
            `File not present, please check both ${baselinePath} and ${latestPath} exist`
          );
          process.exit(1);
        }

        comparisonData.push({
          label: `${scenario.label}-${viewport.label}`,
          baseline: baselinePath,
          latest: latestPath,
          generatedDiffs: generatedDiffsPath,
          tolerance: scenario.tolerance ? scenario.tolerance : 0
        });
      });
    });
    resolve(comparisonData);
  });

export default comparisonDataConstructor;
