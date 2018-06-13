import logger from './logger';

const comparisonDataConstructor = (fs, config) =>
  new Promise(async resolve => {
    const comparisonData = [];    
    config.scenarios.forEach(scenario => {
      if (!scenario.viewports)
        throw `${scenario.label} has no viewpoorts array defined`;
      if (scenario.viewports.some(viewport => !viewport.height))
        throw `${scenario.label} has no height set`;
      if (scenario.viewports.some(viewport => !viewport.width))
        throw `${scenario.label} has no width set`;
      if (scenario.viewports.some(viewport => !viewport.label))
        throw `${scenario.label} has no label set`;

      scenario.viewports.forEach(viewport => {
        const baselinePath = `${config.baseline}/${scenario.label}-${viewport.label}.png`;
        const latestPath = `${config.latest}/${scenario.label}-${viewport.label}.png`;
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
