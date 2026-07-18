import type { User, Role, AccessRequest, AuditEvent, Level } from './types';

export const users: User[] = [
  { id: 'u1', name: 'Aran Suphachai', initials: 'AS', email: 'aran.s@vantagefg.com', dept: 'Security', role: 'Administrator', status: 'active', last: 'Online', empId: 'VF-0001', access: ['Admin Portal', 'AWS Console', 'SAP ERP', 'Data Warehouse'] },
  { id: 'u2', name: 'Nattapong Klahan', initials: 'NK', email: 'natt.k@vantagefg.com', dept: 'Engineering', role: 'Engineer', status: 'active', last: '12m ago', empId: 'VF-0142', access: ['GitHub', 'AWS Console', 'Data Warehouse'] },
  { id: 'u3', name: 'Preeya Wattana', initials: 'PW', email: 'preeya.w@vantagefg.com', dept: 'Finance', role: 'Finance Manager', status: 'active', last: '1h ago', empId: 'VF-0087', access: ['SAP ERP', 'Payroll (Workday)'] },
  { id: 'u4', name: 'Marcus Lindqvist', initials: 'ML', email: 'marcus.l@vantagefg.com', dept: 'Risk', role: 'Analyst', status: 'active', last: '3h ago', empId: 'VF-0203', access: ['Data Warehouse', 'Salesforce CRM'] },
  { id: 'u5', name: 'Sasithorn Prayong', initials: 'SP', email: 'sasi.p@vantagefg.com', dept: 'Operations', role: 'Administrator', status: 'active', last: 'Yesterday', empId: 'VF-0034', access: ['Admin Portal', 'SAP ERP'] },
  { id: 'u6', name: 'David Chen', initials: 'DC', email: 'd.chen@contractor.io', dept: 'Engineering', role: 'Contractor', status: 'suspended', last: '3 days ago', empId: 'VF-C019', access: ['GitHub'] },
  { id: 'u7', name: 'Yuki Tanaka', initials: 'YT', email: 'yuki.t@vantagefg.com', dept: 'Legal', role: 'Auditor', status: 'active', last: '2h ago', empId: 'VF-0111', access: ['Data Warehouse', 'Admin Portal'] },
  { id: 'u8', name: 'Chalida Boonmee', initials: 'CB', email: 'chalida.b@vantagefg.com', dept: 'People', role: 'Analyst', status: 'invited', last: 'Not yet', empId: 'VF-0219', access: ['Payroll (Workday)'] },
  { id: 'u9', name: 'Roberto Silva', initials: 'RS', email: 'r.silva@vantagefg.com', dept: 'Finance', role: 'Analyst', status: 'active', last: '40m ago', empId: 'VF-0176', access: ['SAP ERP', 'Data Warehouse'] },
  { id: 'u10', name: 'Anong Srisai', initials: 'AN', email: 'anong.s@vantagefg.com', dept: 'Operations', role: 'Engineer', status: 'active', last: '5h ago', empId: 'VF-0158', access: ['AWS Console', 'Admin Portal'] },
];

export const roles: Role[] = [
  { key: 'admin', name: 'Administrator', dot: '#a23b2d', desc: 'Full control over identities, roles and every connected system.' },
  { key: 'finmgr', name: 'Finance Manager', dot: '#9c5a3c', desc: 'Manage financial systems and approve finance-scoped requests.' },
  { key: 'engineer', name: 'Engineer', dot: '#3a4a5c', desc: 'Write access to code, cloud and data infrastructure.' },
  { key: 'auditor', name: 'Auditor', dot: '#5c503a', desc: 'Read-only visibility across all systems for compliance.' },
  { key: 'analyst', name: 'Analyst', dot: '#4a5c3a', desc: 'Read and query business data; no configuration rights.' },
  { key: 'contractor', name: 'Contractor', dot: '#8f8880', desc: 'Time-boxed, minimal access with automatic expiry.' },
];

// role key -> system -> level (1 read, 2 write, 3 admin)
export const grants: Record<string, Record<string, Level>> = {
  admin: { 'Admin Portal': 3, 'AWS Console': 3, 'SAP ERP': 3, 'Salesforce CRM': 3, 'GitHub': 3, 'Data Warehouse': 3, 'Payroll (Workday)': 3, 'VPN': 3 },
  finmgr: { 'SAP ERP': 2, 'Salesforce CRM': 2, 'Data Warehouse': 1, 'Payroll (Workday)': 2, 'VPN': 1 },
  engineer: { 'AWS Console': 2, 'GitHub': 2, 'Data Warehouse': 1, 'VPN': 1 },
  auditor: { 'Admin Portal': 1, 'SAP ERP': 1, 'Data Warehouse': 1, 'Salesforce CRM': 1, 'VPN': 1 },
  analyst: { 'Data Warehouse': 1, 'Salesforce CRM': 1, 'VPN': 1 },
  contractor: { 'GitHub': 2, 'VPN': 1 },
};

export const requests: AccessRequest[] = [
  { id: 'r1', who: 'Nattapong K.', initials: 'NK', dept: 'Engineering', system: 'AWS Console', level: 'Admin', reason: 'Deploying the new payments service to prod.', date: '2h ago', status: 'pending' },
  { id: 'r2', who: 'Preeya W.', initials: 'PW', dept: 'Finance', system: 'SAP ERP', level: 'Write', reason: 'Month-end close journal entries.', date: '5h ago', status: 'pending' },
  { id: 'r3', who: 'Marcus L.', initials: 'ML', dept: 'Risk', system: 'Data Warehouse', level: 'Read', reason: 'Quarterly credit-risk modelling.', date: 'Yesterday', status: 'pending' },
  { id: 'r4', who: 'Sasithorn P.', initials: 'SP', dept: 'Operations', system: 'Admin Portal', level: 'Admin', reason: 'Onboarding the new branch region.', date: '2 days ago', status: 'approved', approver: 'Aran S.' },
  { id: 'r5', who: 'David Chen', initials: 'DC', dept: 'Engineering', system: 'GitHub', level: 'Write', reason: 'Contractor repo access — expired.', date: '3 days ago', status: 'denied', approver: 'Aran S.' },
];

export const audit: AuditEvent[] = [
  { time: 'Jul 17 · 14:22', actor: 'Aran Suphachai', action: 'Approved request for', target: 'Sasithorn P. → Admin Portal', result: 'success', ip: '10.4.2.19' },
  { time: 'Jul 17 · 13:58', actor: 'Nattapong K.', action: 'Signed in to', target: 'AWS Console', result: 'success', ip: '10.4.7.33' },
  { time: 'Jul 17 · 11:40', actor: 'System', action: 'Auto-revoked expired grant', target: 'David Chen → GitHub', result: 'info', ip: '—' },
  { time: 'Jul 17 · 10:12', actor: 'Unknown', action: 'Failed sign-in to', target: 'Admin Portal', result: 'denied', ip: '203.0.113.7' },
  { time: 'Jul 17 · 09:33', actor: 'Preeya W.', action: 'Requested access to', target: 'SAP ERP (Write)', result: 'info', ip: '10.4.2.88' },
  { time: 'Jul 16 · 17:05', actor: 'Aran Suphachai', action: 'Denied request for', target: 'David Chen → GitHub', result: 'denied', ip: '10.4.2.19' },
  { time: 'Jul 16 · 16:20', actor: 'Marcus L.', action: 'Exported report from', target: 'Data Warehouse', result: 'success', ip: '10.4.9.14' },
  { time: 'Jul 16 · 15:47', actor: 'System', action: 'Rotated service key for', target: 'Payments API', result: 'info', ip: '—' },
  { time: 'Jul 16 · 12:03', actor: 'Sasithorn P.', action: 'Updated role for', target: 'Analyst → Finance Manager', result: 'success', ip: '10.4.3.51' },
  { time: 'Jul 16 · 08:59', actor: 'Unknown', action: 'Blocked access attempt from', target: 'VPN (geo-fenced)', result: 'denied', ip: '198.51.100.22' },
];

// ---- style helpers ----
export function statusStyle(s: string) {
  if (s === 'active') return { bg: '#e3ede4', fg: '#3c6b46', label: 'Active' };
  if (s === 'suspended') return { bg: '#f2e0dc', fg: '#a23b2d', label: 'Suspended' };
  return { bg: '#f2ecdc', fg: '#8a6d2b', label: 'Invited' };
}
export function resultStyle(r: string) {
  if (r === 'success') return { bg: '#e3ede4', fg: '#3c6b46' };
  if (r === 'denied') return { bg: '#f2e0dc', fg: '#a23b2d' };
  return { bg: '#eae5db', fg: '#6b655c' };
}
export function avatar(dept: string) {
  const map: Record<string, string> = { Security: '#2c2925', Engineering: '#3a4a5c', Finance: '#4a5c3a', Risk: '#5c3a4a', Operations: '#4a3a5c', Legal: '#5c503a', People: '#3a5c58' };
  return { bg: map[dept] || '#55504a', fg: '#f1ede6' };
}
