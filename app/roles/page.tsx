'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/Sidebar';
import Modal, { BtnGhost, BtnPrimary, fieldStyle, labelStyle } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { roles as seedRoles, grants as seedGrants, users } from '@/lib/data';
import { SYSTEMS, Role, Level } from '@/lib/types';

export default function RolesPage() {
  const toast = useToast();
  const [roles, setRoles] = useState<Role[]>(seedRoles);
  const [grants, setGrants] = useState<Record<string, Record<string, Level>>>(seedGrants);
  const [selKey, setSelKey] = useState('admin');
  const [edit, setEdit] = useState<{ key: string; name: string; desc: string; grants: Record<string, Level> } | null>(null);

  const permCount = (k: string) => Object.values(grants[k] || {}).reduce((a, b) => a + b, 0);
  const roleUsers = (name: string) => users.filter((u) => u.role === name).length;
  const sel = roles.find((r) => r.key === selKey)!;
  const g = grants[selKey] || {};

  function saveEdit() {
    if (!edit) return;
    setRoles(roles.map((r) => (r.key === edit.key ? { ...r, name: edit.name, desc: edit.desc } : r)));
    setGrants({ ...grants, [edit.key]: edit.grants });
    toast(`Role “${edit.name}” updated`);
    setEdit(null);
  }
  const mark = (lvl: number, need: number) => lvl >= need
    ? <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 15 }}>●</span>
    : <span style={{ color: '#d8d0c4', fontSize: 15 }}>–</span>;

  const matTh: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#8f8880', letterSpacing: '.04em', textTransform: 'uppercase' };

  return (
    <>
      <PageHeader title="Roles & Permissions" sub="Define what each role can access" />
      <div style={{ flex: 1, overflow: 'auto', padding: '26px 30px 46px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18, maxWidth: 1180 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {roles.map((r) => {
              const active = r.key === selKey;
              return (
                <button key={r.key} onClick={() => setSelKey(r.key)} style={{ textAlign: 'left', border: `1px solid ${active ? 'var(--accent)' : 'rgba(33,31,27,.08)'}`, background: active ? '#fff' : '#fbfaf7', borderRadius: 12, padding: '15px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: r.dot }} /><span style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</span></div>
                  <div style={{ fontSize: 12, color: '#8f8880', marginTop: 7, lineHeight: 1.4 }}>{r.desc}</div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 11, fontSize: 12, color: '#55504a' }}><span><b>{roleUsers(r.name)}</b> users</span><span><b>{permCount(r.key)}</b> permissions</span></div>
                </button>
              );
            })}
          </div>

          <div style={{ background: '#fbfaf7', border: '1px solid rgba(33,31,27,.08)', borderRadius: 13, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div><div style={{ fontSize: 17, fontWeight: 700 }}>{sel.name}</div><div style={{ fontSize: 12.5, color: '#8f8880', marginTop: 3 }}>{roleUsers(sel.name)} members · {permCount(sel.key)} permissions granted</div></div>
              <BtnGhost onClick={() => setEdit({ key: sel.key, name: sel.name, desc: sel.desc, grants: { ...(grants[sel.key] || {}) } })} style={{ padding: '8px 14px' }}>Edit role</BtnGhost>
            </div>
            <div style={{ marginTop: 20, border: '1px solid rgba(33,31,27,.08)', borderRadius: 11, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '11px 16px', background: '#f4efe7' }}>
                <div style={matTh}>System</div><div style={{ ...matTh, textAlign: 'center' }}>Read</div><div style={{ ...matTh, textAlign: 'center' }}>Write</div><div style={{ ...matTh, textAlign: 'center' }}>Admin</div>
              </div>
              {SYSTEMS.map((sy) => (
                <div key={sy} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid rgba(33,31,27,.06)' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{sy}</div>
                  <div style={{ textAlign: 'center' }}>{mark(g[sy] || 0, 1)}</div>
                  <div style={{ textAlign: 'center' }}>{mark(g[sy] || 0, 2)}</div>
                  <div style={{ textAlign: 'center' }}>{mark(g[sy] || 0, 3)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {edit && (
        <Modal title="Edit role" sub="Changes apply to everyone assigned to this role." width={530} onClose={() => setEdit(null)}
          footer={<><BtnGhost onClick={() => setEdit(null)}>Cancel</BtnGhost><BtnPrimary onClick={saveEdit}>Save changes</BtnPrimary></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <label style={labelStyle()}>Role name<input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} style={fieldStyle()} /></label>
            <label style={labelStyle()}>Description<textarea value={edit.desc} onChange={(e) => setEdit({ ...edit, desc: e.target.value })} rows={2} style={{ ...fieldStyle(), resize: 'vertical' }} /></label>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: '#8f8880', marginBottom: 9 }}>Permissions per system</div>
              <div style={{ border: '1px solid rgba(33,31,27,.08)', borderRadius: 11, overflow: 'hidden' }}>
                {SYSTEMS.map((sy) => (
                  <div key={sy} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', borderBottom: '1px solid rgba(33,31,27,.06)' }}>
                    <span style={{ fontSize: 13.5 }}>{sy}</span>
                    <select value={edit.grants[sy] || 0} onChange={(e) => { const v = Number(e.target.value) as Level; const gr = { ...edit.grants }; if (v === 0) delete gr[sy]; else gr[sy] = v; setEdit({ ...edit, grants: gr }); }} style={{ padding: '7px 11px', border: '1px solid rgba(33,31,27,.14)', borderRadius: 8, background: '#fff', fontSize: 12.5, cursor: 'pointer', minWidth: 120 }}>
                      <option value={0}>No access</option><option value={1}>Read</option><option value={2}>Write</option><option value={3}>Admin</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
