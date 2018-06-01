export default async (createDiffs, comparisonData) =>
  comparisonData.map(async imageData => {
    await createDiffs(imageData);
  });
