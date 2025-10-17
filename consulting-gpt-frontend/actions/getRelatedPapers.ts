import { mapRelatedPapers, RelatedPaper } from '@/types/related-paper';

export async function getRelatedPapers(technologyId: string): Promise<RelatedPaper[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/technologies/${technologyId}/papers`
    );
    if (!response.ok) {
      console.error(`Failed to fetch related documents: ${response.status}`);
      return [];
    }
    const data = mapRelatedPapers(await response.json());
    return data;
  } catch (error) {
    console.error(`Error fetching related documents:`, error);
    return [];
  }
}
