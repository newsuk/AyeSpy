export default async (comparer, comparisonData) =>
  comparisonData.map(async imageData => {
    await comparer(imageData);
  });
