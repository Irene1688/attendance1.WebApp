export const STATUS = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived'
};

export const isActive = (status) => status === 'ACTIVE';
export const isArchived = (status) => status === 'ARCHIVED';