import { useState, useCallback } from 'react';

export const usePagination = (defaultPageSize = 15, onPageChange) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [total, setTotal] = useState(0);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  }, [onPageChange]);

  const handleRowsPerPageChange = useCallback((event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
    if (onPageChange) {
      onPageChange(0);
    }
  }, [onPageChange]);

  return {
    page,
    setPage,
    rowsPerPage,
    total,
    setTotal,
    handlePageChange,
    handleRowsPerPageChange,
    // used for building request parameters
    getPaginationParams: useCallback(() => ({
      pageNumber: page + 1,
      pageSize: rowsPerPage
    }), [page, rowsPerPage])
  };
}; 