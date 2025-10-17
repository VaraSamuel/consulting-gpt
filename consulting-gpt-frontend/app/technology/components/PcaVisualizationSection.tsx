'use client';

import { SectionSkeleton } from './SectionSkeleton';
import { PcaScatterPlot } from './PcaScatterPlot';
import { AnalysisStatusResponse } from '@/actions/getAnalysisStatus';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface PcaVisualizationSectionProps {
  analysisStatus: AnalysisStatusResponse | null;
  pcaVisualizationData: any;
  technologyName: string;
  isLoaded: boolean;
}

export function PcaVisualizationSection({
  analysisStatus,
  pcaVisualizationData,
  technologyName,
  isLoaded,
}: PcaVisualizationSectionProps) {
  const status = analysisStatus?.components?.pcaVisualization?.status || 'pending';

  if (status === 'complete' && isLoaded) {
    return (
      <div id="pca-visualization">
        <PcaScatterPlot
          visualizationData={pcaVisualizationData}
          yourTechnologyName={technologyName}
        />
      </div>
    );
  }

  return (
    <SectionSkeleton
      title="PCA Visualization"
      description="Principal Component Analysis visualization of technology landscape"
      icon={<ChartBarIcon className="h-6 w-6" />}
      status={status as 'pending' | 'processing' | 'error'}
      errorMessage={analysisStatus?.components?.pcaVisualization?.errorMessage || undefined}
    />
  );
}
