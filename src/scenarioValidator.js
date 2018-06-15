const scenariioValidator = scenario => {
  if (!scenario.viewports)
    throw `${scenario.label} has no viewports array defined`;
  if (scenario.viewports.some(viewport => !viewport.height))
    throw `${scenario.label} has no height set`;
  if (scenario.viewports.some(viewport => !viewport.width))
    throw `${scenario.label} has no width set`;
  if (scenario.viewports.some(viewport => !viewport.label))
    throw `${scenario.label} has no label set`;
};

export default scenariioValidator;
