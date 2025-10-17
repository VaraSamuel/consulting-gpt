'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Siren, Microscope, Diff, Notebook, Key } from 'lucide-react';

import getTechnology from '@/actions/getTechnology';
import { getComparisonAxes } from '@/actions/getComparisonAxes';
import { getRelatedPatents } from '@/actions/getRelatedPatents';
import { getRelatedPapers } from '@/actions/getRelatedPapers';
import { BackToTopButton } from '@/app/components/back-to-top-button';
import { getMarketAnalysis } from '@/actions/getMarketAnalysis';
import { MarketAnalysis } from '@/types/market-analysis';
import { ComparisonAxis } from '@/types/comparison-axis';
import { RelatedPatent } from '@/types/related-patent';
import { getPcaVisualizationData } from '@/actions/getPcaVisualizationData';
import { getMedicalAssessment } from '@/actions/getMedicalAssessment';
import { ReportDownloader } from '../components/ReportDownloader';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useAnalysisStatus } from '../hooks/useAnalysisStatus';
import { ComparisonAxesSection } from '../components/ComparisonAxesSection';
import { RelatedPatentsSection } from '../components/RelatedPatentsSection';
import { RelatedPapersSection } from '../components/RelatedPapersSectionModular';
import { MarketAnalysisSection } from '../components/MarketAnalysisSection';
import { PcaVisualizationSection } from '../components/PcaVisualizationSection';
import { MedicalAssessmentSection } from '../components/MedicalAssessmentSection';
import { Technology } from '@/types/technology';

interface TechnologyPageProps {
  params: Promise<{
    technologyId: string;
  }>;
}

const TechnologyPage: React.FC<TechnologyPageProps> = ({ params }) => {
  // State for the technology ID
  const [technologyId, setTechnologyId] = useState<string>('');

  // State for data
  const [technology, setTechnology] = useState<Technology | null>(null);
  const [comparisonAxes, setComparisonAxes] = useState<ComparisonAxis[]>([]);
  const [relatedPatents, setRelatedPatents] = useState<RelatedPatent[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [marketAnalysisData, setMarketAnalysisData] = useState<MarketAnalysis[]>([]);
  const [pcaVisualizationData, setPcaVisualizationData] = useState<any>(null);
  const [medicalAssessment, setMedicalAssessment] = useState<any>(null);

  // Track which components have been loaded
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set());

  // Initialize params
  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setTechnologyId(resolvedParams.technologyId);
    };
    initializeParams();
  }, [params]);

  // Use analysis status hook for real-time updates
  const {
    analysisStatus,
    isLoading: statusLoading,
    refetch,
    isPolling,
  } = useAnalysisStatus({
    technologyId,
    enabled: !!technologyId,
  });

  // Load basic technology information immediately (always available)
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

  // Progressive data loading based on analysis status
  useEffect(() => {
    if (!analysisStatus || !technologyId) return;

    const { components } = analysisStatus;

    // Load comparison axes when complete
    if (
      components.comparisonAxes?.status === 'complete' &&
      !loadedComponents.has('comparisonAxes')
    ) {
      getComparisonAxes(technologyId)
        .then((data) => {
          setComparisonAxes(data);
          setLoadedComponents((prev) => new Set(prev).add('comparisonAxes'));
        })
        .catch(console.error);
    }

    // Load related patents when complete
    if (
      components.relatedPatents?.status === 'complete' &&
      !loadedComponents.has('relatedPatents')
    ) {
      getRelatedPatents(technologyId)
        .then((data) => {
          setRelatedPatents(data);
          setLoadedComponents((prev) => new Set(prev).add('relatedPatents'));
        })
        .catch(console.error);
    }

    // Load related papers when complete
    if (components.relatedPapers?.status === 'complete' && !loadedComponents.has('relatedPapers')) {
      getRelatedPapers(technologyId)
        .then((data) => {
          setPapers(data);
          setLoadedComponents((prev) => new Set(prev).add('relatedPapers'));
        })
        .catch(console.error);
    }

    // Load market analysis when complete
    if (
      components.marketAnalysis?.status === 'complete' &&
      !loadedComponents.has('marketAnalysis')
    ) {
      getMarketAnalysis(technologyId)
        .then((data) => {
          setMarketAnalysisData(data);
          setLoadedComponents((prev) => new Set(prev).add('marketAnalysis'));
        })
        .catch(console.error);
    }

    // Load PCA visualization when complete
    if (
      components.pcaVisualization?.status === 'complete' &&
      !loadedComponents.has('pcaVisualization')
    ) {
      getPcaVisualizationData(technologyId)
        .then((data) => {
          setPcaVisualizationData(data);
          setLoadedComponents((prev) => new Set(prev).add('pcaVisualization'));
        })
        .catch(console.error);
    }

    // Load medical assessment when complete
    if (
      components.medicalAssessment?.status === 'complete' &&
      !loadedComponents.has('medicalAssessment')
    ) {
      getMedicalAssessment(technologyId)
        .then((data) => {
          setMedicalAssessment(data);
          setLoadedComponents((prev) => new Set(prev).add('medicalAssessment'));
        })
        .catch(console.error);
    }
  }, [analysisStatus, technologyId, loadedComponents]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  // Show loading state if technology data is not loaded yet
  if (!technology) {
    return (
      <div className="container mx-auto p-4 px-4">
        <div className="space-y-6" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <ProgressIndicator
            analysisStatus={analysisStatus}
            isLoading={statusLoading}
            technologyId={technologyId}
            isPolling={isPolling}
            onRefresh={refetch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 px-4">
      <ReportDownloader
        reportName="Medical-Technology-Analysis-Report.pdf"
        analysisStatus={analysisStatus}
      >
        <div className="space-y-6" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Progress Indicator */}
          <ProgressIndicator
            analysisStatus={analysisStatus}
            isLoading={statusLoading}
            technologyId={technologyId}
            isPolling={isPolling}
            onRefresh={refetch}
          />
          {/* Technology Overview - Always show since it's immediately available */}
          <div id="overview">
            <Card className="border-0 bg-white/90 py-0 shadow-lg backdrop-blur-sm">
              <CardHeader className="rounded-t-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-6 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
                  <Microscope className="h-5 w-5" />
                  Technology Overview
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Full details of your technology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <Siren className="h-4 w-4" />
                      Technology Name
                    </div>
                    <p className="text-sm font-medium text-gray-600">{technology.name}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <Diff className="h-4 w-4" />
                      Number of Axes
                    </div>
                    <p className="text-sm font-medium text-gray-600">{technology.numOfAxes}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <Notebook className="h-4 w-4" />
                      Generated Problem statement
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {technology.problemStatement}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <Key className="h-4 w-4" />
                      Generated Search Keywords
                    </div>
                    <p className="text-sm font-medium text-gray-600">{technology.searchKeywords}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-gray-700">Technology Abstract</h4>
                  <p className="text-sm font-medium leading-relaxed text-gray-600">
                    {technology.abstract}
                  </p>
                </div>
                {/* <div className="flex gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Complexity: {1}
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Est. Duration: {2} weeks
              </Badge>
            </div> */}
              </CardContent>
            </Card>
          </div>{' '}
          {/* Comparison Axes Section */}
          <ComparisonAxesSection
            analysisStatus={analysisStatus}
            comparisonAxes={comparisonAxes}
            technologyName={technology?.name}
            isLoaded={loadedComponents.has('comparisonAxes')}
          />
          {/* Section 3: Related Patents */}
          <RelatedPatentsSection
            analysisStatus={analysisStatus}
            relatedPatents={relatedPatents}
            isLoaded={loadedComponents.has('relatedPatents')}
            formatDate={formatDate}
          />
          {/* Section 4: Related Papers */}
          <RelatedPapersSection
            analysisStatus={analysisStatus}
            papers={papers}
            isLoaded={loadedComponents.has('relatedPapers')}
            formatDate={formatDate}
          />
          {/* Section 5: Market Analysis Insights */}
          <MarketAnalysisSection
            analysisStatus={analysisStatus}
            technologyId={technology.id}
            marketAnalysisData={marketAnalysisData}
            comparisonAxes={comparisonAxes}
            relatedPatents={relatedPatents}
            isLoaded={loadedComponents.has('marketAnalysis')}
          />
          {/* Section 6: PCA Visualization */}
          <PcaVisualizationSection
            analysisStatus={analysisStatus}
            pcaVisualizationData={pcaVisualizationData}
            technologyName={technology?.name}
            isLoaded={loadedComponents.has('pcaVisualization')}
          />
          {/* Section 7: Medical Assessment */}
          <MedicalAssessmentSection
            analysisStatus={analysisStatus}
            medicalAssessment={medicalAssessment}
            isLoaded={loadedComponents.has('medicalAssessment')}
          />
          <BackToTopButton />
        </div>
      </ReportDownloader>
    </div>
  );
};

export default TechnologyPage;
