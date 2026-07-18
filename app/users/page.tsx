'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/Sidebar';
import Modal, { Badge, BtnGhost, BtnPrimary, fieldStyle, labelStyle } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { users as seedUsers, roles, statusStyle, avatar } from '@/lib/data';
import { SYSTEMS, DEPARTMENTS, User } from '@/lib/types';

export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('All Departments');
  const [selUser, setSelUser] = useState<User | null>(null);
  const [invite, setInvite] = useState<{ name: string; email: string; dept: string; role: string } | null>(null);
  const [inviteErr, setInviteErr] = useState('');
  const [manage, setManage] = useState<{ userId: string; name: string; status: string; access: string[] } | null>(null);

  const filtered = users.filter((u) => {
    const m = (u.name + u.email + u.role).toLowerCase().includes(query.toLowerCase());
    return m && (dept === 'All Departments' || u.dept === dept);
  });

  function submitInvite() {
    if (!invite) return;
    if (!invite.name.trim()) return setInviteErr('Please enter a name.');
    if (!/.+@.+\..+/.test(invite.email)) return setInviteErr('Please enter a valid email address.');
    const initials = invite.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    const nu: User = { id: 'u' + Date.now(), name: invite.name.trim(), initials, email: invite.email.trim(), dept: invite.dept, role: invite.role, status: 'invited', last: 'Not yet', empId: 'VF-' + (Math.floor(Math.random() * 900) + 100), access: [] };
    setUsers([nu, ...users]);
    setInvite(null);
    toast('Invitation sent to ' + nu.email);
  }
  function saveManage() {
    if (!manage) return;
    setUsers(users.map((u) => (u.id === manage.userId ? { ...u, access: manage.access, status: manage.status as any } : u)));
    toast('Access updated for ' + manage.name);
    setManage(null);
  }

  const th: React.CSSProperties = { fontSize: 11.5, fontWeight: 600, color: '#8f8880', letterSpacing: '.04em', textTransform: 'uppercase' };
  const cols = '2.4fr 1.3fr 1.4fr 1fr 1fr 40px';

  return (
    <>
      <PageHeader title="Users" sub="Manage identities, roles and account status"
        action={<BtnPrimary onClick={() => { setInvite({ name: '', email: '', dept: 'Engineering', role: 'Analyst' }); setInviteErr(''); }} style={{ padding: '10px 16px' }}>+ Invite user</BtnPrimary>} />

      <div style={{ flex: 1, overflow: 'auto', padding: '26px 30px 46px' }}>
        <div style={{ maxWidth: 1180 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, role…" style={{ flex: 1, minWidth: 220, padding: '10px 14px', border: '1px solid rgba(33,31,27,.14)', borderRadius: 9, background: '#fbfaf7', fontSize: 13.5 }} />
            <select value={dept} onChange={(e) => setDept(e.target.value)} style={{ padding: '10px 14px', border: '1px solid rgba(33,31,27,.14)', borderRadius: 9, background: '#fbfaf7', fontSize: 13.5, cursor: 'pointer' }}>
              {['All Departments', ...DEPARTMENTS].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div style={{ background: '#fbfaf7', border: '1px solid rgba(33,31,27,.08)', borderRadius: 13, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '12px 18px', borderBottom: '1px solid rgba(33,31,27,.08)' }}>
              <div style={th}>User</div><div style={th}>Department</div><div style={th}>Role</div><div style={th}>Status</div><div style={th}>Last active</div><div />
            </div>
            {filtered.map((u) => {
              const st = statusStyle(u.status); const av = avatar(u.dept);
              return (
                <div key={u.id} onClick={() => setSelUser(u)} style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', padding: '13px 18px', borderTop: '1px solid rgba(33,31,27,.055)', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{ width: 34, height: 34, flex: 'none', borderRadius: '50%', background: av.bg, color: av.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 600 }}>{u.initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: '#8f8880', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: '#55504a' }}>{u.dept}</div>
                  <div style={{ fontSize: 13, color: '#55504a' }}>{u.role}</div>
                  <div><Badge bg={st.bg} fg={st.fg}>{st.label}</Badge></div>
                  <div style={{ fontSize: 12.5, color: '#8f8880' }}>{u.last}</div>
                  <div style={{ color: '#b8b0a5', fontSize: 16, textAlign: 'right' }}>›</div>
                </div>
              );
            })}
            {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#8f8880', fontSize: 13.5 }}>No users match your filters.</div>}
          </div>
        </div>
      </div>

      {/* USER DETAIL */}
      {selUser && (() => {
        const st = statusStyle(selUser.status); const av = avatar(selUser.dept);
        return (
          <Modal title={selUser.name} sub={selUser.email} onClose={() => setSelUser(null)}
            footer={<>
              <BtnGhost onClick={() => setSelUser(null)}>Close</BtnGhost>
              <BtnPrimary onClick={() => { setManage({ userId: selUser.id, name: selUser.name, status: selUser.status, access: [...selUser.access] }); setSelUser(null); }}>Manage access</BtnPrimary>
            </>}>
            <div style={{ marginTop: -6, marginBottom: 16 }}><Badge bg={st.bg} fg={st.fg}>{st.label}</Badge></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[['Department', selUser.dept], ['Role', selUser.role], ['Employee ID', selUser.empId], ['Last active', selUser.last]].map(([k, v]) => (
                <div key={k}><div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: '#8f8880' }}>{k}</div><div style={{ fontSize: 14, marginTop: 4 }}>{v}</div></div>
              ))}
            </div>
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: '#8f8880', marginBottom: 9 }}>System access</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selUser.access.length ? selUser.access.map((a) => <span key={a} style={{ fontSize: 12, padding: '5px 11px', borderRadius: 8, background: '#ece6dc', color: '#55504a' }}>{a}</span>) : <span style={{ fontSize: 13, color: '#8f8880' }}>No systems granted yet.</span>}
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* INVITE */}
      {invite && (
        <Modal title="Invite user" sub="They’ll receive an email to activate their account." width={470} onClose={() => setInvite(null)}
          footer={<><BtnGhost onClick={() => setInvite(null)}>Cancel</BtnGhost><BtnPrimary onClick={submitInvite}>Send invite</BtnPrimary></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <label style={labelStyle()}>Full name<input value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} placeholder="e.g. Somchai Jaidee" style={fieldStyle()} /></label>
            <label style={labelStyle()}>Work email<input value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} placeholder="name@vantagefg.com" style={fieldStyle()} /></label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <label style={labelStyle()}>Department<select value={invite.dept} onChange={(e) => setInvite({ ...invite, dept: e.target.value })} style={{ ...fieldStyle(), cursor: 'pointer' }}>{DEPARTMENTS.map((o) => <option key={o}>{o}</option>)}</select></label>
              <label style={labelStyle()}>Role<select value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })} style={{ ...fieldStyle(), cursor: 'pointer' }}>{roles.map((r) => <option key={r.key}>{r.name}</option>)}</select></label>
            </div>
            {inviteErr && <div style={{ fontSize: 12.5, color: '#a23b2d' }}>{inviteErr}</div>}
          </div>
        </Modal>
      )}

      {/* MANAGE ACCESS */}
      {manage && (
        <Modal title="Manage access" sub={manage.name} width={470} onClose={() => setManage(null)}
          footer={<><BtnGhost onClick={() => setManage(null)}>Cancel</BtnGhost><BtnPrimary onClick={saveManage}>Save changes</BtnPrimary></>}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: '#8f8880', marginBottom: 9 }}>Account status</div>
          <div style={{ display: 'flex', gap: 4, background: '#ece6dc', padding: 4, borderRadius: 10, width: 'fit-content' }}>
            {['active', 'suspended'].map((s) => (
              <button key={s} onClick={() => setManage({ ...manage, status: s })} style={{ position: 'relative', border: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '7px 18px', borderRadius: 7, background: manage.status === s ? '#fbfaf7' : 'transparent', boxShadow: manage.status === s ? '0 1px 3px rgba(0,0,0,.1)' : 'none', color: '#55504a', textTransform: 'capitalize' }}>{s}</button>
            ))}
          </div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: '#8f8880', margin: '22px 0 9px' }}>System access — tap to grant or revoke</div>
          <div style={{ border: '1px solid rgba(33,31,27,.08)', borderRadius: 11, overflow: 'hidden' }}>
            {SYSTEMS.map((sy) => {
              const on = manage.access.includes(sy);
              return (
                <button key={sy} onClick={() => setManage({ ...manage, access: on ? manage.access.filter((x) => x !== sy) : [...manage.access, sy] })} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 12, padding: '11px 14px', border: 0, borderBottom: '1px solid rgba(33,31,27,.06)', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 13.5, color: '#211f1b' }}>{sy}</span>
                  {on ? <span style={{ width: 22, height: 22, flex: 'none', borderRadius: 6, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✓</span> : <span style={{ width: 22, height: 22, flex: 'none', borderRadius: 6, border: '1.5px solid rgba(33,31,27,.2)' }} />}
                </button>
              );
            })}
          </div>
        </Modal>
      )}
    </>
  );
}
