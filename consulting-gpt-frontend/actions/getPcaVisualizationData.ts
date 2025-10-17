import { PcaVisualizationData } from '@/types/pca';

export async function getPcaVisualizationData(technologyId: string): Promise<PcaVisualizationData> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/technologies/${technologyId}/visualization?show_clusters=true&viz_type=pca&show_labels=true&show_annotations=true`
    );
    if (!response.ok) {
      console.error(`Failed to fetch PCA data: ${response.status}`);
      throw new Error(`Error fetching PCA data for technology ID ${technologyId}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching PCA data:`, error);
    throw new Error(`Failed to fetch PCA data for technology ID ${technologyId}`);
  }
}
