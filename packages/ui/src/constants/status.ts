export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export const statuses = [
  { value: Status.ACTIVE, label: 'Active' },
  { value: Status.INACTIVE, label: 'Inactive' },
  // { value: Status.ARCHIVED, label: 'Archived' },
];
