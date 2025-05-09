import React from "react";

const CourseCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-lg flex flex-col h-full animate-pulse">
      {/* Skeleton for image */}
      <div className="w-full h-80 overflow-hidden bg-gray-200 rounded-md border border-gray/20"></div>

      <div className="p-3 text-left flex-grow flex flex-col">
        {/* Skeleton for title */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

        {/* Skeleton for educator name */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>

        {/* Skeleton for ratings */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-10"></div>
        </div>

        {/* Skeleton for stats */}
        <div className="flex items-center gap-4 pb-2 border-b border-gray pt-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 w-px bg-gray-500/40"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 w-px bg-gray-500/40"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>

        {/* Skeleton for price */}
        <div className="flex justify-between mt-auto pt-3">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      {/* Skeleton for top-left tag */}
      <div className="absolute top-2 left-2 h-6 w-16 bg-gray-200 rounded-xl"></div>

      {/* Skeleton for discount tag */}
      <div className="absolute top-2 right-2 h-6 w-16 bg-gray-200 rounded-xl"></div>
    </div>
  );
};

export default CourseCardSkeleton;
