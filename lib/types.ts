export type Status = 'active' | 'suspended' | 'invited';
export type Level = 0 | 1 | 2 | 3; // none / read / write / admin
export type Result = 'success' | 'denied' | 'info';
export type RequestStatus = 'pending' | 'approved' | 'denied';

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  dept: string;
  role: string;
  status: Status;
  last: string;
  empId: string;
  access: string[];
}

export interface Role {
  key: string;
  name: string;
  dot: string;
  desc: string;
}

export interface AccessRequest {
  id: string;
  who: string;
  initials: string;
  dept: string;
  system: string;
  level: 'Read' | 'Write' | 'Admin';
  reason: string;
  date: string;
  status: RequestStatus;
  approver?: string;
}

export interface AuditEvent {
  time: string;
  actor: string;
  action: string;
  target: string;
  result: Result;
  ip: string;
}

export const SYSTEMS = [
  'Admin Portal', 'AWS Console', 'SAP ERP', 'Salesforce CRM',
  'GitHub', 'Data Warehouse', 'Payroll (Workday)', 'VPN',
];

export const DEPARTMENTS = [
  'Engineering', 'Finance', 'Operations', 'Risk', 'Legal', 'People', 'Security',
];
