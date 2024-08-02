import React from "react";

export const LoadingModal: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-xl font-semibold text-gray-700">로딩중...</p>
      </div>
    </div>
  );
};

export const ReviewDetailLoadingModal: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-xl font-semibold text-gray-700">로딩중...</p>
    </div>
  );
};

export const ReviewDetailSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-4 animate-pulse">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mt-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mt-2"></div>
        </div>
        <div className="md:w-2/3 flex flex-col">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg mb-2 h-60"></div>
          <div className="flex justify-end space-x-2 mb-4">
            <div className="h-8 bg-gray-300 rounded w-20"></div>
            <div className="h-8 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="mt-4">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReviewItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full h-full flex flex-col animate-pulse">
      <div className="w-full h-96 bg-gray-300"></div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-1"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>
        <div className="h-12 bg-gray-300 rounded w-full mb-2"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};
