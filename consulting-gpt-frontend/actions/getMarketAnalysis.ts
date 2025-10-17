import { mapMarketAnalysis, MarketAnalysis } from '@/types/market-analysis';

export async function getMarketAnalysis(technologyId: string): Promise<MarketAnalysis[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/technologies/${technologyId}/market-analysis`
    );
    if (!response.ok) {
      console.error(`Failed to fetch market analysis: ${response.status}`);
      return [];
    }
    const data = mapMarketAnalysis(await response.json());
    return data;
  } catch (error) {
    console.error(`Error fetching market analysis:`, error);
    return [];
  }
}
