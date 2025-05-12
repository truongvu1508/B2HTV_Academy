import React from "react";

/**
 * CustomPagination - A reusable pagination component
 * @param {Object} props
 * @param {Object} props.table - React Table instance
 * @param {Function} [props.onPageChange] - Optional custom page change handler
 * @param {Array} [props.pageNumbers] - Optional custom page numbers array
 */
const CustomPagination = ({
  table,
  onPageChange,
  pageNumbers: customPageNumbers,
}) => {
  const pageNumbers = [];
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  const generatePageNumbers = () => {
    if (customPageNumbers) {
      return customPageNumbers;
    }

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, -1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(
          1,
          -1,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          -1,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          -1,
          totalPages
        );
      }
    }

    return pageNumbers;
  };

  const renderedPageNumbers = generatePageNumbers();

  const handlePageChange = (pageNumber) => {
    if (onPageChange) {
      onPageChange(pageNumber);
    } else {
      table.setPageIndex(pageNumber - 1);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {/* Previous Button */}
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Trang trước
      </button>

      {/* Page Numbers */}
      {renderedPageNumbers.map((pageNumber, index) =>
        pageNumber === -1 ? (
          <span
            key={`ellipsis-${index}`}
            className="px-4 py-2 text-sm text-gray-500"
          >
            ...
          </span>
        ) : (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-4 py-2 text-sm font-medium border rounded-md 
              ${
                currentPage === pageNumber
                  ? "bg-blue-500 text-white border-blue-500"
                  : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
              }`}
          >
            {pageNumber}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Trang sau
      </button>
    </div>
  );
};

export default CustomPagination;
