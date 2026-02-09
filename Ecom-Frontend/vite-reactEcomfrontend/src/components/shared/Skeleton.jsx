/**
 * @file Full-page skeleton placeholder — animated pulsing grid shown during initial page loads.
 *
 * @description
 * - Renders 50 rows × 30 small gray blocks with CSS `animate-pulse`.
 * - Used as a loading placeholder before page content is available.
 *
 * @usage AdminLayout — shown while admin panel data loads initially.
 */
import React from "react";

const SkeletonFullPage = () => {
  return (
    <div className="animate-pulse min-h-screen px-4 py-6">
      <div className="space-y-3">
        {Array.from({ length: 50 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex">
            {Array.from({ length: 30 }).map((_, segIndex) => (
              <div
                key={segIndex}
                className="h-3 w-6 bg-gray-700 rounded-sm mr-1 last:mr-0"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonFullPage;
