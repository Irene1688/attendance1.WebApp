import { useState, useCallback } from 'react';

export const useSorting = (defaultOrderBy = '', defaultOrder = 'asc', onSortChange) => {
  const [order, setOrder] = useState(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);

  const handleSort = useCallback((property, newOrder) => {
    setOrder(newOrder);
    setOrderBy(property);
    console.log(property, newOrder);
    if (onSortChange) {
      onSortChange({
        orderBy: property,
        order: newOrder
      });
    }
  }, [onSortChange]);

  return {
    order,
    orderBy,
    handleSort,
    // used for building request parameters
    getSortParams: useCallback(() => ({
      orderBy: orderBy.toLowerCase(),
      isAscending: order === 'asc'
    }), [order, orderBy])
  };
}; 