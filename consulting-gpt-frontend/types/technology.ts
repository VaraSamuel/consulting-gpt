export interface Technology {
  id: string;
  name: string;
  abstract: string;
  numOfAxes: number;
  searchKeywords: string | null;
  problemStatement: string | null;
  marketAnalysisSummary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyRaw {
  id: string;
  name: string;
  abstract: string;
  num_of_axes: number;
  search_keywords: string | null;
  problem_statement: string | null;
  market_analysis_summary: string | null;
  created_at: string;
  updated_at: string;
}
