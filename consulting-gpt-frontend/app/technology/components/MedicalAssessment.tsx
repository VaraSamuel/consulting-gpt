import { BillableItem } from '@/types/medical_assessment';
import { LightBulbIcon } from '@heroicons/react/24/outline';

interface MedicalAssessmentProps {
  medicalAssociation: string;
  recommendations: string;
  billableItems: BillableItem[];
  totalFee: number;
}

export const MedicalAssessment: React.FC<MedicalAssessmentProps> = ({
  medicalAssociation,
  recommendations,
  billableItems,
  totalFee,
}) => {
  const recommendationsList = recommendations
    ? recommendations.split('\n').filter((rec) => rec.trim() !== '')
    : [];

  return (
    <div className="my-1">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Hypothetical Recommendation based Guidelines
        </h2>
        {/* Recommendations Section */}
        {recommendationsList.length > 0 && (
          <>
            <hr className="my-6 border-gray-200" />
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <LightBulbIcon className="h-5 w-5" />
                Recommendations
              </h3>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
                {recommendationsList.map((rec, index) => (
                  <li key={index} className="pl-2">
                    {/* Remove the leading number and period from the string itself if it exists */}
                    {rec.replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </div>
      <div className="mb-4 mt-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Billable items based on identified medical Association: {medicalAssociation}
        </h2>
      </div>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                HCPCS Code
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                Description
              </th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">
                Fee (USD)
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                Status/Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {billableItems.map((item) => (
              <tr key={item.id} className={item.fee === 0 ? 'bg-yellow-50' : ''}>
                <td className="px-4 py-2 font-mono text-sm text-gray-800">{item.hcpcs_code}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{item.description}</td>
                <td className="px-4 py-2 text-right text-sm text-gray-900">
                  {item.fee === 0 ? (
                    <span className="text-gray-400">$0.00</span>
                  ) : (
                    `$${item.fee.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  )}
                </td>
                <td className="px-4 py-2 text-xs">
                  {item.fee === 0 ? (
                    <span className="inline-flex items-center gap-1 rounded bg-yellow-100 px-2 py-1 text-yellow-800">
                      <svg
                        className="h-4 w-4 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Fee data not found in CMS
                    </span>
                  ) : (
                    <span className="text-green-700">Billable</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-4 mt-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mt-2 rounded bg-emerald-50 px-4 py-2 font-medium text-emerald-700 shadow md:mt-0">
          Total Fee:{' '}
          <span className="font-bold">
            ${totalFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      {/* Optional: Alert if any missing fee data */}
      {billableItems.some((item) => item.fee === 0) && (
        <div className="mt-4 flex items-center gap-2 rounded bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
          <svg
            className="h-5 w-5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Some items are missing fee data and are not included in the total.
        </div>
      )}
    </div>
  );
};
