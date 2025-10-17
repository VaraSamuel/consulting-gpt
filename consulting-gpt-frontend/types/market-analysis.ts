interface MarketAnalysisRaw {
  id: number;
  score: number;
  explanation: string;
  confidence: number;
  technology_id: number;
  related_technology_id: number;
  axis_id: number;
}

export interface MarketAnalysis {
  id: number;
  score: number;
  explanation: string;
  confidence: number;
  technologyId: number;
  relatedTechnologyId: number;
  axisId: number;
}

export const mapMarketAnalysis = (marketAnalysisRaw: MarketAnalysisRaw[]): MarketAnalysis[] => {
  return marketAnalysisRaw.map((item: MarketAnalysisRaw) => {
    return {
      id: item.id,
      score: item.score,
      explanation: item.explanation,
      confidence: item.confidence,
      technologyId: item.technology_id,
      relatedTechnologyId: item.related_technology_id,
      axisId: item.axis_id,
    };
  });
};
