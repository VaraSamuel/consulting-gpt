import { MedicalAssessment } from '@/types/medical_assessment';

export async function getMedicalAssessment(technologyId: string): Promise<MedicalAssessment> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/technologies/${technologyId}/billable-items`
    );
    if (!response.ok) {
      console.error(`Failed to fetch medical assessment: ${response.status}`);
      throw new Error(`Error fetching medical assessment for technology ID ${technologyId}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching medical assessment:`, error);
    throw new Error(`Error fetching medical assessment for technology ID ${technologyId}`);
  }
}
