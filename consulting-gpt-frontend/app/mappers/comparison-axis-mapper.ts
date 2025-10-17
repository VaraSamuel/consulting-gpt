import { ComparisonAxis, ComparisonAxisRaw } from '@/types/comparison-axis';

export const mapComparisonAxis = (axisRaw: ComparisonAxisRaw[]): ComparisonAxis[] => {
  return axisRaw.map((item: ComparisonAxisRaw) => {
    return {
      axisName: item.axis_name,
      extreme1: item.extreme1,
      extreme2: item.extreme2,
      weight: item.weight,
      id: item.id,
      technologyId: item.technology_id,
    };
  });
};
