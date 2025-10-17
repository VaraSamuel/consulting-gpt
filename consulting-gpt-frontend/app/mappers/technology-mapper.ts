import { Technology, TechnologyRaw } from '@/types/technology';

export const mapTechnology = (technologyRaw: TechnologyRaw): Technology => {
  return {
    id: technologyRaw.id,
    name: technologyRaw.name,
    abstract: technologyRaw.abstract,
    numOfAxes: technologyRaw.num_of_axes,
    searchKeywords: technologyRaw.search_keywords,
    problemStatement: technologyRaw.problem_statement,
    marketAnalysisSummary: technologyRaw.market_analysis_summary,
    createdAt: technologyRaw.created_at,
    updatedAt: technologyRaw.updated_at,
  };
};
