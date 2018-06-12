import logger from './logger';

const comparisonDataConstructor = (fs, config) =>
  new Promise(async resolve => {
    const comparisonData = config.scenarios.map(scenario => {
      const baselinePath = `${config.baseline}/${scenario.label}.png`;
      const latestPath = `${config.latest}/${scenario.label}.png`;
      const generatedDiffsPath = `${config.generatedDiffs}/${
        scenario.label
      }.png`;

      const latestFileExists = fs.access(latestPath, err => {
        return err ? true : false;
      });

      const baselineFileExists = fs.access(baselinePath, err => {
        return err ? true : false;
      });

      if (!latestFileExists || !baselineFileExists) {
        logger.error(
          'comparison data construction',
          `File not present, please check both ${baselinePath} and ${latestPath} exist`
        );
        process.exit(1);
      }

      return {
        label: scenario.label,
        baseline: baselinePath,
        latest: latestPath,
        generatedDiffs: generatedDiffsPath,
        tolerance: scenario.tolerance ? scenario.tolerance : 0
      };
    });

    resolve(comparisonData);
  });

export default comparisonDataConstructor;
