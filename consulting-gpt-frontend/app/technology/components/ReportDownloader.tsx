'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useReactToPrint } from 'react-to-print';
import { AnalysisStatusResponse } from '@/actions/getAnalysisStatus';

interface ReportDownloaderProps {
  children: React.ReactNode;
  reportName?: string;
  analysisStatus?: AnalysisStatusResponse | null;
}

export const ReportDownloader: React.FC<ReportDownloaderProps> = ({
  children,
  reportName = 'Medical-Technology-Analysis-Report',
  analysisStatus,
}) => {
  const reportContentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Check if analysis is complete
  const isAnalysisComplete = analysisStatus
    ? Object.values(analysisStatus.components).every((component) => component.status === 'complete')
    : false;

  // Set up the print handler - using the correct TypeScript types
  const handlePrint = useReactToPrint({
    contentRef: reportContentRef,
    documentTitle: reportName,
    onBeforePrint: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  return (
    <div>
      {/* Print-specific styles that will only apply during printing */}
      <style jsx global>{`
        @media print {
          /* Hide UI elements not meant for printing */
          .hide-from-pdf {
            display: none !important;
          }

          /* Override any problematic colors with print-friendly alternatives */
          * {
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Ensure content fits on pages nicely */
          body {
            margin: 0;
            padding: 0;
          }

          /* Add page breaks where needed */
          .page-break {
            page-break-after: always;
          }
        }
      `}</style>

      <div className="hide-from-pdf mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Technology Analysis Report</h2>
        {isAnalysisComplete ? (
          <Button onClick={handlePrint} disabled={isPrinting} variant="outline" size="sm">
            {isPrinting ? (
              <>
                <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        ) : (
          <div className="text-sm text-gray-500">
            Analysis in progress - PDF will be available when complete
          </div>
        )}
      </div>

      {/* The content to be printed - this ref is crucial */}
      <div ref={reportContentRef} className="print-container rounded bg-white p-4 shadow">
        {children}
      </div>
    </div>
  );
};
