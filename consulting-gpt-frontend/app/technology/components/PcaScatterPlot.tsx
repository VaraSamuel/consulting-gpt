'use client';

import {
  ResponsiveScatterPlot,
  ScatterPlotDatum,
  ScatterPlotNodeProps,
  ScatterPlotRawSerie,
} from '@nivo/scatterplot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PresentationChartLineIcon } from '@heroicons/react/24/outline'; // Changed BeakerIcon back or choose one
import { PcaVisualizationData, PcaPoint, PcaLoading } from '@/types/pca'; // Adjusted import
import { useState } from 'react';

interface PcaScatterPlotProps {
  visualizationData: PcaVisualizationData | null; // Use the new main type
  yourTechnologyName?: string;
}

// Helper to transform data for Nivo - PcaPoint is equivalent to old TransformedPcaDataItem
const transformDataForNivo = (
  points: PcaPoint, // Changed from transformedData
  yourTechName?: string
): ScatterPlotRawSerie<ScatterPlotDatum>[] => {
  const seriesData: ScatterPlotDatum[] = [];
  const yourTechData: ScatterPlotDatum[] = [];

  Object.entries(points).forEach(([name, coords]) => {
    const point = { x: coords[0], y: coords[1], name };
    if (name === yourTechName) {
      yourTechData.push(point);
    } else {
      seriesData.push(point);
    }
  });

  const series: ScatterPlotRawSerie<ScatterPlotDatum>[] = [
    {
      id: 'Related Technologies',
      data: seriesData,
    },
  ];

  if (yourTechData.length > 0) {
    series.push({
      id: 'Your Technology',
      data: yourTechData,
    });
  }
  return series;
};

// Helper function to interpret PCA loadings
const interpretPcAxis = (allLoadings: PcaLoading[], pcNumber: 1 | 2, topN: number = 3): string => {
  if (!allLoadings || allLoadings.length === 0) {
    return 'Not available';
  }

  const relevantLoadings = allLoadings
    .map((loading) => ({
      axis: loading.axis,
      value: pcNumber === 1 ? loading.pc1_loading : loading.pc2_loading,
    }))
    .filter((l) => l.value !== 0) // Consider only non-zero loadings for this PC
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)) // Sort by absolute value
    .slice(0, topN);

  if (relevantLoadings.length === 0) {
    return 'No significant contributing factors';
  }

  const positiveContributors = relevantLoadings.filter((l) => l.value > 0);
  const negativeContributors = relevantLoadings.filter((l) => l.value < 0);

  let description = '';

  if (positiveContributors.length > 0) {
    description += `High values correlate with ${positiveContributors.map((l) => `${l.axis} (${l.value.toFixed(2)})`).join(', ')}. `;
  }
  if (negativeContributors.length > 0) {
    description += `Low values correlate with ${negativeContributors.map((l) => `${l.axis} (${Math.abs(l.value).toFixed(2)})`).join(', ')}.`;
  }

  if (description.trim() === '') {
    // Fallback if all topN had zero relevant loading (unlikely with filter)
    return `Primary factors: ${relevantLoadings.map((l) => `${l.axis} (${l.value.toFixed(2)})`).join(', ')}`;
  }

  return description.trim();
};

// Helper function to get top N loadings for display
const getTopLoadingsForDisplay = (
  allLoadings: PcaLoading[],
  pcNumber: 1 | 2,
  topN: number = 3
): { axis: string; value: number }[] => {
  if (!allLoadings || allLoadings.length === 0) {
    return [];
  }
  return allLoadings
    .map((loading) => ({
      axis: loading.axis,
      value: pcNumber === 1 ? loading.pc1_loading : loading.pc2_loading,
    }))
    .filter((l) => l.value !== 0)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, topN);
};

// Helper function to generate quadrant descriptions
const getQuadrantDescriptions = (
  pc1Interp: string,
  pc2Interp: string
): { topRight: string; topLeft: string; bottomLeft: string; bottomRight: string } => {
  const pc1PositiveSense = 'Positive PC1 attributes';
  const pc1NegativeSense = 'Negative PC1 attributes';
  const pc2PositiveSense = 'Positive PC2 attributes';
  const pc2NegativeSense = 'Negative PC2 attributes';

  return {
    topRight: `Characterized by high PC1 values (e.g., ${pc1PositiveSense}) and high PC2 values (e.g., ${pc2PositiveSense}).`,
    topLeft: `Characterized by low PC1 values (e.g., ${pc1NegativeSense}) and high PC2 values (e.g., ${pc2PositiveSense}).`,
    bottomLeft: `Characterized by low PC1 values (e.g., ${pc1NegativeSense}) and low PC2 values (e.g., ${pc2NegativeSense}).`,
    bottomRight: `Characterized by high PC1 values (e.g., ${pc1PositiveSense}) and low PC2 values (e.g., ${pc2NegativeSense}).`,
  };
};

export const PcaScatterPlot: React.FC<PcaScatterPlotProps> = ({
  visualizationData,
  yourTechnologyName,
}) => {
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
  const [hoveredClusterId, setHoveredClusterId] = useState<number | null>(null);

  // Compute active cluster for highlighting
  const activeClusterId = hoveredClusterId ?? selectedClusterId;

  // No need to check for array anymore if backend sends a single object
  if (!visualizationData || !visualizationData.pca_view || !visualizationData.pca_view.points) {
    return (
      <Card className="border-0 bg-white/90 py-0 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <PresentationChartLineIcon className="h-5 w-5" />
            PCA Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-500">
            PCA data, PCA view, or points data is not available.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Use the new data structure
  const actualPcaData = visualizationData as PcaVisualizationData;

  const nivoData = transformDataForNivo(actualPcaData.pca_view.points, yourTechnologyName);

  // Update how variance and descriptions are accessed
  const pc1Variance = (actualPcaData.pca_view.variance_explained[0] * 100).toFixed(2);
  const pc2Variance = (actualPcaData.pca_view.variance_explained[1] * 100).toFixed(2);
  const totalVariance = (
    (actualPcaData.pca_view.variance_explained[0] + actualPcaData.pca_view.variance_explained[1]) *
    100
  ).toFixed(2);

  // Use the helper function to get dynamic descriptions
  const pc1Interpretation = interpretPcAxis(actualPcaData.pca_view.loadings, 1);
  const pc2Interpretation = interpretPcAxis(actualPcaData.pca_view.loadings, 2);

  // Dynamic axis legends
  const pc1Legend = `PC1 (Explains ${pc1Variance}%)`;
  const pc2Legend = `PC2 (Explains ${pc2Variance}%)`;

  const topPc1Loadings = getTopLoadingsForDisplay(actualPcaData.pca_view.loadings, 1, 3);
  const topPc2Loadings = getTopLoadingsForDisplay(actualPcaData.pca_view.loadings, 2, 3);

  const quadrantDescriptions = getQuadrantDescriptions(pc1Interpretation, pc2Interpretation);

  const clusters = actualPcaData.cluster_view?.clusters || [];
  const yourTechnologyCluster = clusters.find((c) => c.contains_target);

  // Function to check if a point is in the active cluster
  const isNodeInActiveCluster = (nodeName: string): boolean => {
    if (!activeClusterId) return false;
    const cluster = clusters.find((c) => c.id === activeClusterId);

    // For "Your Technology", use the contains_target property
    if (nodeName === yourTechnologyName) {
      return cluster?.contains_target || false;
    }

    // For other technologies, use exact name matching
    return cluster?.members.some((member) => member.name === nodeName) || false;
  };

  const CustomNode: React.FC<ScatterPlotNodeProps<ScatterPlotDatum>> = ({
    node,
    blendMode,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onClick,
  }) => {
    // Access properties from the node object
    const currentX = node.x;
    const currentY = node.y;
    const baseSize = node.size; // Nivo calculates this based on nodeSize prop or defaults
    const baseColor = node.color; // Nivo calculates this based on colors prop or defaults

    let finalSize = node.serieId === 'Your Technology' ? 14 : 10; // Base size override
    let finalColor = baseColor; // Start with Nivo's provided color
    let opacity = 0.85;

    const nodeName = (node.data as any).name as string;
    const isYourTech = node.serieId === 'Your Technology';

    if (activeClusterId) {
      const isInActiveCluster = isNodeInActiveCluster(nodeName);

      if (isInActiveCluster) {
        // Point is in the active cluster - make it visible
        finalSize = isYourTech ? 16 : 12;
        opacity = 1;
        // Keep the original colors (set by Nivo's colors prop)
        if (isYourTech) {
          finalColor = '#ff6384';
        } else {
          finalColor = '#36a2eb';
        }
      } else {
        // Point is NOT in active cluster
        if (isYourTech) {
          // Hide "Your Technology" when not in active cluster
          opacity = 0.15;
          finalSize = 8;
          finalColor = '#ff6384'; // Keep color but very faint
        } else {
          // Dim other technologies
          opacity = 0.3;
          finalSize = 8;
          finalColor = '#cbd5e1'; // Muted color for dimmed points
        }
      }
    } else {
      // No active cluster - show all with default styling
      if (isYourTech) {
        finalColor = '#ff6384';
        opacity = 1;
      } else {
        finalColor = '#36a2eb';
        opacity = 0.85;
      }
    }

    // Nivo's event handlers expect the node and the event.
    // We need to wrap them if we're attaching to a standard SVG element.
    const handleMouseEnter = (event: React.MouseEvent<SVGCircleElement>) => {
      onMouseEnter?.(node, event);
    };
    const handleMouseMove = (event: React.MouseEvent<SVGCircleElement>) => {
      onMouseMove?.(node, event);
    };
    const handleMouseLeave = (event: React.MouseEvent<SVGCircleElement>) => {
      onMouseLeave?.(node, event);
    };
    const handleClick = (event: React.MouseEvent<SVGCircleElement>) => {
      onClick?.(node, event);
    };

    return (
      <circle
        cx={currentX}
        cy={currentY}
        r={finalSize / 2} // Nivo's size is diameter-like, so divide by 2 for radius
        fill={finalColor}
        stroke="none" // Remove border outline for cleaner look
        strokeWidth={0}
        style={{ mixBlendMode: blendMode, opacity: opacity }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    );
  };

  return (
    <Card className="border-0 bg-white/90 py-0 shadow-lg backdrop-blur-sm">
      <CardHeader className="rounded-t-lg bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-6 text-white">
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
          <PresentationChartLineIcon className="h-6 w-6" />
          PCA Visualization: Technology Landscape
        </CardTitle>
        <CardDescription className="text-teal-100">
          This plot shows how related technologies/patents are positioned based on their key
          characteristics. The first two principal components explain{' '}
          <strong>{totalVariance}%</strong> of the total variance.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div style={{ height: '500px' }}>
          <ResponsiveScatterPlot
            data={nivoData}
            margin={{ top: 60, right: 140, bottom: 90, left: 90 }} // Increased bottom margin for longer legend
            xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            colors={['#36a2eb', '#ff6384']} // Explicit colors: Related Technologies, Your Technology
            blendMode="multiply"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: pc1Legend, // Dynamic legend
              legendPosition: 'middle',
              legendOffset: 65, // May need adjustment based on interpretation length
              truncateTickAt: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: pc2Legend, // Dynamic legend
              legendPosition: 'middle',
              legendOffset: -70,
              truncateTickAt: 0,
            }}
            tooltip={({ node }) => (
              <div
                style={{
                  background: 'white',
                  padding: '9px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  fontSize: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <strong>{String((node.data as any).name) || 'N/A'}</strong>
                <br />
                PC1: {Number(node.formattedX).toFixed(3)}
                <br />
                PC2: {Number(node.formattedY).toFixed(3)}
              </div>
            )}
            nodeComponent={CustomNode}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 130,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            markers={[
              {
                // Horizontal line at y=0
                axis: 'y',
                value: 0,
                lineStyle: { stroke: '#aaa', strokeWidth: 1, strokeDasharray: '4 4' },
              },
              {
                // Vertical line at x=0
                axis: 'x',
                value: 0,
                lineStyle: { stroke: '#aaa', strokeWidth: 1, strokeDasharray: '4 4' },
              },
            ]}
          />
        </div>

        {/* --- CLUSTER SECTION MOVED HERE --- */}
        {clusters.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md mb-2 font-semibold text-gray-800">Technology Clusters:</h4>
            <div className="space-y-2">
              {clusters.map((cluster) => {
                // Sort members by distance to center, show top 3
                const topMembers = [...cluster.members]
                  .sort((a, b) => a.distance - b.distance)
                  .slice(0, 3);
                return (
                  <div
                    key={cluster.id}
                    className={`rounded border p-3 transition-all duration-150 ease-in-out hover:shadow-md
                      ${cluster.id === activeClusterId ? 'border-teal-500 bg-teal-50 shadow-lg' : 'border-gray-200 bg-white'}
                      ${cluster.contains_target ? 'ring-2 ring-pink-500 ring-offset-1 ring-offset-background' : ''}`}
                    onMouseEnter={() => setHoveredClusterId(cluster.id)}
                    onMouseLeave={() => setHoveredClusterId(null)}
                    // onClick={() =>
                    //   setSelectedClusterId(selectedClusterId === cluster.id ? null : cluster.id)
                    // }
                    style={{ cursor: 'pointer' }}
                  >
                    <h5 className="font-semibold text-gray-700">
                      {cluster.name}
                      {cluster.contains_target && (
                        <span className="ml-2 text-xs font-normal text-pink-600">
                          (Contains Your Technology)
                        </span>
                      )}
                    </h5>
                    <div className="text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Center:</span> ({cluster.center[0].toFixed(2)}
                        , {cluster.center[1].toFixed(2)}) &nbsp;|&nbsp;
                        <span className="font-medium">Spread:</span> {cluster.spread.toFixed(2)}
                        &nbsp;|&nbsp;
                        <span className="font-medium">Members:</span> {cluster.members.length}
                      </div>
                      <div>
                        <span className="font-medium">Top members:</span>{' '}
                        {topMembers.map((m) => m.name).join(', ')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              <span>
                <b>Tip:</b> Hover to preview, click to persistently highlight a cluster. Click again
                to deselect.
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="text-md mb-1 font-semibold text-gray-800">Interpreting the Axes:</h4>
            <div>
              <strong className="block text-gray-700">Principal Component 1 (X-axis):</strong>
              <p className="text-xs text-gray-600">{pc1Interpretation}</p>
              <ul className="mt-1 list-inside list-disc pl-4 text-xs text-gray-500">
                {topPc1Loadings.map((l) => (
                  <li key={`pc1-${l.axis}`}>
                    {l.axis}: {l.value.toFixed(3)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <strong className="block text-gray-700">Principal Component 2 (Y-axis):</strong>
              <p className="text-xs text-gray-600">{pc2Interpretation}</p>
              <ul className="mt-1 list-inside list-disc pl-4 text-xs text-gray-500">
                {topPc2Loadings.map((l) => (
                  <li key={`pc2-${l.axis}`}>
                    {l.axis}: {l.value.toFixed(3)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-md mb-1 font-semibold text-gray-800">
              Understanding the Quadrants:
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
              <div className="rounded border border-gray-200 p-2">
                <strong className="block text-gray-700">Top-Right (High PC1, High PC2):</strong>
                <p className="text-gray-600">
                  Technologies here tend to exhibit characteristics associated with the positive
                  ends of both PC1 and PC2.
                </p>
              </div>
              <div className="rounded border border-gray-200 p-2">
                <strong className="block text-gray-700 ">Top-Left (Low PC1, High PC2):</strong>
                <p className="text-gray-600">
                  Technologies here tend to exhibit characteristics associated with the negative end
                  of PC1 and the positive end of PC2.
                </p>
              </div>
              <div className="rounded border border-gray-200 p-2">
                <strong className="block text-gray-700">Bottom-Left (Low PC1, Low PC2):</strong>
                <p className="text-gray-600">
                  Technologies here tend to exhibit characteristics associated with the negative
                  ends of both PC1 and PC2.
                </p>
              </div>
              <div className="rounded border border-gray-200 p-2">
                <strong className="block text-gray-700">Bottom-Right (High PC1, Low PC2):</strong>
                <p className="text-gray-600">
                  Technologies here tend to exhibit characteristics associated with the positive end
                  of PC1 and the negative end of PC2.
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Refer to the &quot;Interpreting the Axes&quot; section above to understand what
              high/low PC1 and PC2 values signify based on the data.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
