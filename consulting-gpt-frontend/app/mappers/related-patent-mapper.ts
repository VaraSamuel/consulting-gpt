import { RelatedPatent, RelatedPatentRaw } from '@/types/related-patent';

export const mapRelatedPatent = (axisRaw: RelatedPatentRaw[]): RelatedPatent[] => {
  return axisRaw.map((item: RelatedPatentRaw) => {
    return {
      id: item.id,
      name: item.name,
      abstract: item.abstract,
      documentId: item.document_id,
      type: item.type,
      cluster: item.cluster,
      url: item.url,
      publicationDate: item.publication_date,
      inventors: item.inventors,
      assignees: item.assignees,
      col: item.col,
      technologyId: item.technology_id,
    };
  });
};
