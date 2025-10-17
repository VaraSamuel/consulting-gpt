export interface RelatedPatentRaw {
  id: number;
  name: string;
  abstract: string;
  document_id: string;
  type: string;
  cluster: number;
  url: string;
  publication_date: string;
  inventors: string;
  assignees: string;
  col: number;
  technology_id: number;
}

export interface RelatedPatent {
  id: number;
  name: string;
  abstract: string;
  documentId: string;
  type: string;
  cluster: number;
  url: string;
  publicationDate: string;
  inventors: string;
  assignees: string;
  col: number;
  technologyId: number;
}
