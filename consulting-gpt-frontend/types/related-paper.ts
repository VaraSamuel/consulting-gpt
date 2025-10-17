export interface RelatedPaperRaw {
  paper_id: string;
  title: string;
  abstract: string;
  authors: string;
  publication_date: string;
  journal: string;
  url: string;
  citation_count: number;
  col: number;
  id: number;
  technology_id: number;
}

export interface RelatedPaper {
  paperId: string;
  title: string;
  abstract: string;
  authors: string;
  publicationDate: string;
  journal: string;
  url: string;
  citationCount: number;
  col: number;
  id: number;
  technologyId: number;
}

export const mapRelatedPapers = (paperRaw: RelatedPaperRaw[]): RelatedPaper[] => {
  return paperRaw.map((item: RelatedPaperRaw) => {
    return {
      paperId: item.paper_id,
      title: item.title,
      abstract: item.abstract,
      authors: item.authors,
      publicationDate: item.publication_date,
      journal: item.journal,
      url: item.url,
      citationCount: item.citation_count,
      col: item.col,
      id: item.id,
      technologyId: item.technology_id,
    };
  });
};
