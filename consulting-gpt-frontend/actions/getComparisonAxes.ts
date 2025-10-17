import { mapComparisonAxis } from '@/app/mappers/comparison-axis-mapper';
import { ComparisonAxis } from '@/types/comparison-axis';

export async function getComparisonAxes(technologyId: string): Promise<ComparisonAxis[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/technologies/${technologyId}/comparison-axes`
    );
    if (!response.ok) {
      console.error(`Failed to fetch comparison axes: ${response.status}`);
      return [];
    }
    return mapComparisonAxis(await response.json());
  } catch (error) {
    console.error(`Error fetching comparison axes:`, error);
    return [];
  }
}
