'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { SectionSkeleton } from './SectionSkeleton';
import { MedicalAssessment } from './MedicalAssessment';
import { AnalysisStatusResponse } from '@/actions/getAnalysisStatus';

interface MedicalAssessmentSectionProps {
  analysisStatus: AnalysisStatusResponse | null;
  medicalAssessment: any;
  isLoaded: boolean;
}

export function MedicalAssessmentSection({
  analysisStatus,
  medicalAssessment,
  isLoaded,
}: MedicalAssessmentSectionProps) {
  const status = analysisStatus?.components?.medicalAssessment?.status || 'pending';

  if (status === 'complete' && isLoaded) {
    return (
      <div id="medical-assessment">
        <Card className="border-0 bg-white/90 py-0 shadow-lg backdrop-blur-sm">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-6 text-white">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
              <BanknotesIcon className="h-5 w-5" />
              Medical Assessment & Billable Items
            </CardTitle>
            <CardDescription className="text-emerald-100">
              Medical assessment and associated billable items
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <MedicalAssessment
              medicalAssociation={medicalAssessment?.medical_association || 'N/A'}
              recommendations={
                medicalAssessment?.recommendations || 'No recommendations available.'
              }
              billableItems={medicalAssessment?.billable_items || []}
              totalFee={medicalAssessment?.total_fee || 0}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SectionSkeleton
      title="Medical Assessment & Billable Items"
      description="Medical assessment and associated billable items"
      icon={<BanknotesIcon className="h-5 w-5" />}
      status={status as 'pending' | 'processing' | 'error'}
      errorMessage={analysisStatus?.components?.medicalAssessment?.errorMessage || undefined}
    />
  );
}
