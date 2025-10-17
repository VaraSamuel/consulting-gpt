interface AnalysisStatusSummary {
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
}

interface AnalysisStatusResponse {
  technologyId: number;
  components: Record<string, AnalysisStatusSummary>;
  overall: string;
  pollingRecommendation: {
    intervalMs: number;
  };
}

export default async function getAnalysisStatus(
  technologyId: string
): Promise<AnalysisStatusResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/technologies/${technologyId}/analysis-status`,
    {
      cache: 'no-store', // Always fetch fresh data for real-time updates
      next: { revalidate: 0 }, // Ensure no caching
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch analysis status');
  }

  const response = await res.json();

  // Ensure we have reasonable polling intervals (minimum 15 seconds, maximum 60 seconds)
  if (response.pollingRecommendation) {
    response.pollingRecommendation.intervalMs = Math.max(
      15000,
      Math.min(60000, response.pollingRecommendation.intervalMs || 18000)
    );
  } else {
    response.pollingRecommendation = { intervalMs: 18000 }; // Default to 18 seconds
  }

  return response;
}

export type { AnalysisStatusResponse, AnalysisStatusSummary };
