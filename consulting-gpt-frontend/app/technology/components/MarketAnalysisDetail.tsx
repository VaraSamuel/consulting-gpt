'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { MarketAnalysis } from '@/types/market-analysis';

interface MarketAnalysisDetailProps {
  item: MarketAnalysis;
  axisName: string;
}

const EXPLANATION_TRUNCATE_LENGTH = 250; // Adjust as needed

export const MarketAnalysisDetail: React.FC<MarketAnalysisDetailProps> = ({ item, axisName }) => {
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  let scoreColor = 'text-gray-700';
  if (item.score >= 0.7) scoreColor = 'text-green-600';
  else if (item.score >= 0.3 && item.score < 0.7) scoreColor = 'text-yellow-600';
  else if (item.score < 0.3) scoreColor = 'text-red-600';

  const confidencePercentage = (item.confidence * 100).toFixed(0);

  const toggleExplanation = () => {
    setShowFullExplanation(!showFullExplanation);
  };

  const displayExplanation = showFullExplanation
    ? item.explanation
    : `${item.explanation.substring(0, EXPLANATION_TRUNCATE_LENGTH)}${item.explanation.length > EXPLANATION_TRUNCATE_LENGTH ? '...' : ''}`;

  return (
    <div className="rounded-md border border-gray-200/80 bg-white p-4 shadow-sm">
      <h4 className="text-md mb-1 font-medium text-gray-700">
        Regarding Axis: <span className="font-semibold">{axisName}</span>
      </h4>
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <p className={`text-xl font-bold ${scoreColor}`}>Score: {item.score.toFixed(2)}</p>
        <div className="flex flex-col text-sm text-gray-600">
          <span>Confidence: {confidencePercentage}%</span>
          <div className="mt-0.5 h-2 w-24 rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${confidencePercentage}%` }}
            />
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-gray-600">
        <span className="font-medium text-gray-700">Explanation:</span> {displayExplanation}
      </p>
      {item.explanation.length > EXPLANATION_TRUNCATE_LENGTH && (
        <Button
          variant="link"
          size="sm"
          onClick={toggleExplanation}
          className="mt-1 h-auto p-0 text-xs text-blue-600 hover:text-blue-700"
        >
          {showFullExplanation ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  );
};
