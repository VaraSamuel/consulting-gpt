'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface SectionSkeletonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'processing' | 'error';
  className?: string;
  errorMessage?: string;
}

export function SectionSkeleton({
  title,
  description,
  icon,
  status,
  className = '',
  errorMessage,
}: SectionSkeletonProps) {
  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'error':
        return errorMessage || 'An error occurred';
      default:
        return 'Analysis pending...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'from-blue-500 to-indigo-600';
      case 'error':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <Card className={`border-0 bg-white/90 py-0 shadow-lg backdrop-blur-sm ${className}`}>
      <CardHeader
        className={`rounded-t-lg bg-gradient-to-r ${getStatusColor()} px-6 py-6 text-white`}
      >
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
          {status === 'processing' ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
          {title}
        </CardTitle>
        <CardDescription className="text-gray-100">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="mb-4 flex items-center gap-2">
          {status === 'processing' && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
          <span
            className={`text-sm font-medium ${
              status === 'error'
                ? 'text-red-600'
                : status === 'processing'
                  ? 'text-blue-600'
                  : 'text-gray-600'
            }`}
          >
            {getStatusMessage()}
          </span>
        </div>

        {status !== 'error' && (
          <>
            {/* Table-like skeleton for data sections */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-2/3" />
              </div>
            </div>

            {/* Additional content skeleton */}
            <div className="mt-6 space-y-3">
              <Skeleton className="h-4 w-1/4" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </>
        )}

        {status === 'error' && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">
              Unable to load this section. Please try refreshing the page or contact support if the
              issue persists.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
