import { mapRelatedPatent } from '@/app/mappers/related-patent-mapper';
import { RelatedPatent } from '@/types/related-patent';

export async function getRelatedPatents(technologyId: string): Promise<RelatedPatent[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/technologies/${technologyId}/related`
    );
    if (!res.ok) {
      console.error(`Failed to fetch related documents: ${res.status}`);
      return [];
    }
    const data = mapRelatedPatent(await res.json());
    return data;
  } catch (error) {
    console.error(`Error fetching related documents:`, error);
    return [];
  }
}
