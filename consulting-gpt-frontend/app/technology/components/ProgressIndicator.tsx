'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { AnalysisStatusResponse } from '@/actions/getAnalysisStatus';

interface ProgressIndicatorProps {
  analysisStatus: AnalysisStatusResponse | null;
  isLoading: boolean;
  technologyId?: string;
  isPolling?: boolean;
  onRefresh?: () => void;
}

const componentDisplayNames: Record<string, string> = {
  comparisonAxes: 'Comparison Axes',
  relatedPatents: 'Patent Analysis',
  relatedPapers: 'Research Papers',
  marketAnalysis: 'Market Analysis',
  pcaVisualization: 'PCA Visualization',
  medicalAssessment: 'Medical Assessment',
  clusterAnalysis: 'Cluster Analysis',
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'complete':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'processing':
      return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'complete':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'error':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
};

export function ProgressIndicator({
  analysisStatus,
  isLoading,
  technologyId,
  isPolling = false,
  onRefresh,
}: ProgressIndicatorProps) {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Update last updated time when analysis status changes
  useEffect(() => {
    if (analysisStatus) {
      setLastUpdated(new Date());
    }
  }, [analysisStatus]);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  if (isLoading || !analysisStatus) {
    return (
      <Card className="border-0 bg-white/90 shadow-lg backdrop-blur-sm">
        <CardHeader className="rounded-t-lg bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4 text-white">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Loader2 className="h-5 w-5 animate-spin" />
            Analysis Progress
          </CardTitle>
          <CardDescription className="text-purple-100">Initializing analysis...</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Checking status...</span>
                <span>--/--</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const components = analysisStatus.components;
  const componentEntries = Object.entries(components);
  const completedCount = componentEntries.filter(
    ([_, status]) => status.status === 'complete'
  ).length;
  const totalCount = componentEntries.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card className="border-0 bg-white/90 shadow-lg backdrop-blur-sm">
      <CardHeader className="rounded-t-lg bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <CheckCircle className="h-5 w-5" />
              Analysis Progress
            </CardTitle>
            <CardDescription className="text-purple-100">
              Real-time tracking of analysis components
            </CardDescription>
          </div>
          {technologyId && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Overall Progress</span>
              <span>
                {completedCount}/{totalCount} components complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-gray-600">
              <span className="flex items-center gap-1">
                {progressPercentage === 100 ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Analysis complete!
                  </>
                ) : isPolling ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                    Auto-updating...
                  </>
                ) : (
                  'Analysis in progress...'
                )}
              </span>
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Component Status List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Component Status</h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {componentEntries.map(([componentName, status]) => (
                <div key={componentName} className="flex items-center gap-2">
                  {getStatusIcon(status.status)}
                  <span className="flex-1 text-sm text-gray-700">
                    {componentDisplayNames[componentName] || componentName}
                  </span>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(status.status)}`}>
                    {status.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Error Messages */}
          {componentEntries.some(([_, status]) => status.status === 'error') && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
              <h5 className="mb-2 text-sm font-medium text-red-800">Errors Detected:</h5>
              <div className="space-y-1">
                {componentEntries
                  .filter(([_, status]) => status.status === 'error')
                  .map(([componentName, status]) => (
                    <p key={componentName} className="text-xs text-red-700">
                      <strong>{componentDisplayNames[componentName]}:</strong>{' '}
                      {status.errorMessage || 'Unknown error'}
                    </p>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
