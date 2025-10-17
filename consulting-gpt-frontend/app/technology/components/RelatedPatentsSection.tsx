'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadCsv } from '@/lib/download';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { RelatedPatent } from '@/types/related-patent';
import { SectionSkeleton } from './SectionSkeleton';
import { AnalysisStatusResponse } from '@/actions/getAnalysisStatus';

interface RelatedPatentsSectionProps {
  analysisStatus: AnalysisStatusResponse | null;
  relatedPatents: RelatedPatent[];
  isLoaded: boolean;
  formatDate: (dateString: string) => string;
}

export function RelatedPatentsSection({
  analysisStatus,
  relatedPatents,
  isLoaded,
  formatDate,
}: RelatedPatentsSectionProps) {
  const status = analysisStatus?.components?.relatedPatents?.status || 'pending';
  const hasPatents = Array.isArray(relatedPatents) && relatedPatents.length > 0;

  const handleDownloadPatents = () => {
    if (!hasPatents) return;

    const rows = relatedPatents.map((doc, idx) => ({
      '#': idx + 1,
      Title: doc.name || 'N/A',
      Type: doc.type || 'N/A',
      'Document ID': doc.documentId || 'N/A',
      'Publication Date': doc.publicationDate ? formatDate(doc.publicationDate) : 'N/A',
      Inventors: Array.isArray(doc.inventors)
        ? doc.inventors.join(', ')
        : doc.inventors || 'N/A',
      Assignees: Array.isArray(doc.assignees)
        ? doc.assignees.join(', ')
        : doc.assignees || 'N/A',
      Summary: doc.abstract || 'N/A',
      'Patent Link': doc.documentId ? `https://patents.google.com/${doc.documentId}` : 'N/A',
    }));

    const suffix =
      relatedPatents[0]?.documentId || relatedPatents[0]?.name || 'related-patents';
    const fileSafe = suffix.replace(/[^a-z0-9_-]+/gi, '-').toLowerCase();

    downloadCsv(`related-patents-${fileSafe}`, rows);
  };

  if (status === 'complete' && isLoaded) {
    return (
      <div id="patents">
        <Card className="border-0 bg-white/90 py-0 shadow-lg backdrop-blur-sm">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4 text-white">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                  Related Patents
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Some related patents to your technology
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadPatents}
                disabled={!hasPatents}
                className="border-white/50 text-white hover:bg-white/10 hover:text-white sm:self-end"
              >
                Download CSV
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            {hasPatents ? (
              <div className="space-y-5">
                {relatedPatents.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 shadow-sm"
                  >
                    <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                      <h4 className="text-md font-semibold text-gray-800">{doc.name || 'N/A'}</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${
                            doc.type === 'patent'
                              ? 'border-sky-500 text-sky-700'
                              : 'border-amber-500 text-amber-700'
                          }`}
                        >
                          {doc.type || 'N/A'}
                        </Badge>
                        {doc.documentId && (
                          <Badge variant="secondary" className="text-xs">
                            ID: {doc.documentId}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {doc.abstract && (
                      <p className="mb-2 text-sm leading-relaxed text-gray-600">
                        <span className="font-medium text-gray-700">Abstract:</span>{' '}
                        {doc.abstract.length > 200
                          ? `${doc.abstract.substring(0, 200)}...`
                          : doc.abstract}
                      </p>
                    )}

                    <div className="mb-2 grid grid-cols-1 gap-1 text-xs text-gray-600 sm:grid-cols-2">
                      {doc.publicationDate && (
                        <p>
                          <span className="font-medium">Published:</span>{' '}
                          {formatDate(doc.publicationDate)}
                        </p>
                      )}
                      {doc.inventors && (Array.isArray(doc.inventors) ? doc.inventors.length > 0 : true) && (
                        <p className="truncate">
                          <span className="font-medium">Inventors:</span>{' '}
                          {Array.isArray(doc.inventors) ? doc.inventors.join(', ') : doc.inventors}
                        </p>
                      )}
                      {doc.assignees && (Array.isArray(doc.assignees) ? doc.assignees.length > 0 : true) && (
                        <p className="truncate">
                          <span className="font-medium">Assignees:</span>{' '}
                          {Array.isArray(doc.assignees) ? doc.assignees.join(', ') : doc.assignees}
                        </p>
                      )}
                    </div>

                    {doc.documentId && (
                      <div className="mt-3">
                        <a
                          href={`https://patents.google.com/${doc.documentId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          View patent <ExternalLinkIcon className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">
                No related patents or papers found for this technology.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div id="patents">
      <SectionSkeleton
        title="Related Patents"
        description="Some related patents to your technology"
        icon={<DocumentMagnifyingGlassIcon className="h-5 w-5" />}
        status={status as 'pending' | 'processing' | 'error'}
        errorMessage={analysisStatus?.components?.relatedPatents?.errorMessage || undefined}
      />
    </div>
  );
}
