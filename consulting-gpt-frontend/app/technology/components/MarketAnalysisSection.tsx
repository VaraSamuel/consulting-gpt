'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLinkIcon, TrendingUpIcon, LightbulbIcon } from 'lucide-react';
import { ChartPieIcon } from '@heroicons/react/24/outline';
import { SectionSkeleton } from './SectionSkeleton';
import { MarketAnalysisDetail } from './MarketAnalysisDetail';
import { AnalysisStatusResponse } from '@/actions/getAnalysisStatus';
import { MarketAnalysis } from '@/types/market-analysis';
import { ComparisonAxis } from '@/types/comparison-axis';
import { RelatedPatent } from '@/types/related-patent';
import { get } from 'http';
import getTechnology from '@/actions/getTechnology';
import { useEffect, useState } from 'react';
import { Technology } from '@/types/technology';

interface MarketAnalysisSectionProps {
  analysisStatus: AnalysisStatusResponse | null;
  technologyId: string;
  marketAnalysisData: MarketAnalysis[];
  comparisonAxes: ComparisonAxis[];
  relatedPatents: RelatedPatent[];
  isLoaded: boolean;
}

export function MarketAnalysisSection({
  analysisStatus,
  technologyId,
  marketAnalysisData,
  comparisonAxes,
  relatedPatents,
  isLoaded,
}: MarketAnalysisSectionProps) {
  const [technology, setTechnology] = useState<Technology | null>(null);

  const status = analysisStatus?.components?.marketAnalysis?.status || 'pending';

  useEffect(() => {
    if (!technologyId) return;

    const loadTechnology = async () => {
      try {
        const tech = await getTechnology(technologyId);
        setTechnology(tech);
      } catch (error) {
        console.error('Error loading technology:', error);
      }
    };

    loadTechnology();
  }, [technologyId]);

  // Pre-process/Group the Market Analysis Data
  const groupedMarketAnalysis = (marketAnalysisData || []).reduce<Record<number, MarketAnalysis[]>>(
    (acc, item) => {
      if (!acc[item.relatedTechnologyId]) {
        acc[item.relatedTechnologyId] = [];
      }
      acc[item.relatedTechnologyId].push(item);
      return acc;
    },
    {}
  );

  if (status === 'complete' && isLoaded) {
    return (
      <div id="market-analysis">
        <Card className="border-0 bg-white/90 py-0 shadow-lg backdrop-blur-sm">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-6 text-white">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
              <ChartPieIcon className="h-6 w-6" />
              Market Analysis Insights
            </CardTitle>
            <CardDescription className="text-cyan-100">
              Comparative analysis against related patents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Market Analysis Summary - Hero Section */}
            {technology?.marketAnalysisSummary && (
              <div className="mb-8">
                <Card className="border-l-4 border-l-amber-400 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-md transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                        <LightbulbIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Market Analysis Summary
                          </h3>
                          <TrendingUpIcon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="prose prose-sm max-w-none text-gray-700">
                          {technology.marketAnalysisSummary.split('\n').map((paragraph, index) => {
                            if (paragraph.trim() === '') return null;
                            return (
                              <p
                                key={index}
                                className="mb-3 text-sm leading-relaxed last:mb-0 md:text-base"
                              >
                                {paragraph.trim()}
                              </p>
                            );
                          })}
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-amber-700">
                          <div className="h-1 w-1 rounded-full bg-amber-400"></div>
                          <span className="font-medium">AI-Generated Market Insights</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Detailed Market Analysis */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                  <ChartPieIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detailed Comparative Analysis
                  </h3>
                  <p className="text-sm text-gray-600">
                    In-depth comparison with related patents and technologies
                  </p>
                </div>
              </div>
              {Object.keys(groupedMarketAnalysis).length > 0 ? (
                Object.entries(groupedMarketAnalysis).map(([relatedPatentId, analyses]) => {
                  // Find the related patent from your relatedPatents array
                  const relatedPatent = relatedPatents?.find(
                    (patent) => patent.id === parseInt(relatedPatentId)
                  );
                  const relatedPatentTitle = relatedPatent
                    ? relatedPatent.name || `Related Patent ID: ${relatedPatentId}`
                    : `Related Patent ID: ${relatedPatentId}`;

                  return (
                    <div
                      key={relatedPatentId}
                      className="rounded-xl border border-gray-200 bg-gradient-to-br from-slate-50 to-gray-50/70 p-6 shadow-md transition-all hover:shadow-lg"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h4 className="text-lg font-semibold text-gray-800">
                          Comparison with:{' '}
                          <span className="text-blue-600">{relatedPatentTitle}</span>
                        </h4>
                        {relatedPatent?.url && (
                          <a
                            href={relatedPatent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 hover:underline"
                          >
                            View Patent <ExternalLinkIcon className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <div className="space-y-4">
                        {analyses.map((item) => {
                          const axis = comparisonAxes?.find((ax) => ax.id === item.axisId);
                          const axisName = axis?.axisName || `Axis ID: ${item.axisId}`;

                          return (
                            <MarketAnalysisDetail key={item.id} item={item} axisName={axisName} />
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
                  <ChartPieIcon className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    No detailed analysis available
                  </p>
                  <p className="text-xs text-gray-400">
                    Comparative analysis data will appear here once generated
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SectionSkeleton
      title="Market Analysis Insights"
      description="Comparative analysis against related patents"
      icon={<ChartPieIcon className="h-6 w-6" />}
      status={status as 'pending' | 'processing' | 'error'}
      errorMessage={analysisStatus?.components?.marketAnalysis?.errorMessage || undefined}
    />
  );
}
