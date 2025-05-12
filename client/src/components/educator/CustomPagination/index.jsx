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
  const pageSize = table.getState().pagination.pageSize;
  const totalRows =
    table.getFilteredRowModel().rows.length ||
    table.getCoreRowModel().rows.length;
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

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
    <div className="flex justify-between items-center space-y-4 mt-4 mb-10">
      {/* Results Display */}
      <div className="text-sm text-gray-600">
        Hiển thị {startRow} đến {endRow} của {totalRows} kết quả
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>

        {/* Page Numbers */}
        {renderedPageNumbers.map((pageNumber, index) =>
          pageNumber === -1 ? (
            <span key={index} className="px-4 py-2 text-sm text-gray-700">
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
          Sau
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
