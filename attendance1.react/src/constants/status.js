export const STATUS = {
    ACTIVE: 'Active',
    ARCHIVED: 'Archived'
  };
  
  export const isActive = (status) => status === STATUS.ACTIVE;
  export const isArchived = (status) => status === STATUS.ARCHIVED;