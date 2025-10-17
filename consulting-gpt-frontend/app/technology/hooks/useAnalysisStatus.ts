'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import getAnalysisStatus, { AnalysisStatusResponse } from '@/actions/getAnalysisStatus';

interface UseAnalysisStatusProps {
  technologyId: string;
  enabled?: boolean;
}

export function useAnalysisStatus({ technologyId, enabled = true }: UseAnalysisStatusProps) {
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingActiveRef = useRef(false);

  const fetchStatus = useCallback(async () => {
    if (!enabled) return null;

    try {
      setError(null);
      const status = await getAnalysisStatus(technologyId);
      setAnalysisStatus(status);
      setIsLoading(false);
      return status;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis status');
      setIsLoading(false);
      return null;
    }
  }, [technologyId, enabled]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
    isPollingActiveRef.current = false;
  }, []);

  const startPolling = useCallback(async () => {
    if (!enabled || isPollingActiveRef.current) return;

    isPollingActiveRef.current = true;

    const poll = async (): Promise<void> => {
      if (!isPollingActiveRef.current) return;

      try {
        const status = await getAnalysisStatus(technologyId);
        setAnalysisStatus(status);

        // Check if all components are complete or have errors
        const allCompleteOrError = Object.values(status.components).every(
          (component) => component.status === 'complete' || component.status === 'error'
        );

        if (allCompleteOrError) {
          console.log('Analysis complete, stopping polling');
          stopPolling();
          return;
        }

        // Continue polling if still active
        if (isPollingActiveRef.current) {
          const interval = Math.max(15000, status.pollingRecommendation?.intervalMs || 18000);
          pollingRef.current = setTimeout(poll, interval);
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Continue polling on error, but with a longer interval to reduce load
        if (isPollingActiveRef.current) {
          pollingRef.current = setTimeout(poll, 30000); // 30 seconds on error
        }
      }
    };

    // Start the polling loop
    poll();
  }, [technologyId, enabled, stopPolling]);

  useEffect(() => {
    if (!enabled) {
      stopPolling();
      return;
    }

    // Initial fetch
    fetchStatus().then((status) => {
      if (status) {
        // Check if we need to start polling
        const allCompleteOrError = Object.values(status.components).every(
          (component) => component.status === 'complete' || component.status === 'error'
        );

        if (!allCompleteOrError) {
          // Small delay before starting polling to avoid immediate re-fetch
          setTimeout(
            () => {
              startPolling();
            },
            Math.max(15000, status.pollingRecommendation?.intervalMs || 18000)
          );
        } else {
          console.log('Analysis already complete, no polling needed');
        }
      }
    });

    return () => {
      stopPolling();
    };
  }, [technologyId, enabled, fetchStatus, startPolling, stopPolling]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    stopPolling();
    fetchStatus().then((status) => {
      if (status) {
        const allCompleteOrError = Object.values(status.components).every(
          (component) => component.status === 'complete' || component.status === 'error'
        );

        if (!allCompleteOrError) {
          startPolling();
        }
      }
    });
  }, [fetchStatus, startPolling, stopPolling]);

  return {
    analysisStatus,
    isLoading,
    error,
    refetch,
    isPolling: isPollingActiveRef.current,
  };
}
