import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 sm:w-15 aspect-square border-4 border-gray-300 border-t-4 border-t-dark-1 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
