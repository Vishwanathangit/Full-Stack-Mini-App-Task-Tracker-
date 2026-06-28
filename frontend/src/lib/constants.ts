export const DEFAULT_TASK_FILTERS = {
  status: '' as const,
  priority: '' as const,
  sortBy: 'createdAt',
  sortDir: 'desc' as const,
  page: 0,
  size: 9,
};

export const TASK_STATUS_LABELS = {
  TODO: 'To Do',
  DOING: 'In Progress',
  DONE: 'Completed',
};

export const TASK_PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};
