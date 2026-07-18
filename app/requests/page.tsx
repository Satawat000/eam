'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/Sidebar';
import Modal, { Badge, BtnGhost, BtnPrimary, fieldStyle, labelStyle } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { requests as seedRequests } from '@/lib/data';
import { SYSTEMS, AccessRequest, RequestStatus } from '@/lib/types';

export default function RequestsPage() {
  const toast = useToast();
  const [requests, setRequests] = useState<AccessRequest[]>(seedRequests);
  const [tab, setTab] = useState<RequestStatus>('pending');
  const [decision, setDecision] = useState<{ id: string; action: 'approve' | 'deny'; who: string; system: string; level: string } | null>(null);
  const [draft, setDraft] = useState<{ system: string; level: string; reason: string } | null>(null);
  const [draftErr, setDraftErr] = useState(false);

  const tabs: [RequestStatus, string][] = [['pending', 'Pending'], ['approved', 'Approved'], ['denied', 'Denied']];
  const filtered = requests.filter((r) => r.status === tab);

  function confirmDecision() {
    if (!decision) return;
    const ns: RequestStatus = decision.action === 'approve' ? 'approved' : 'denied';
    setRequests(requests.map((r) => (r.id === decision.id ? { ...r, status: ns, approver: 'Aran S.' } : r)));
    toast(decision.action === 'approve' ? 'Access granted' : 'Request denied');
    setDecision(null);
  }
  function submitRequest() {
    if (!draft) return;
    if (!draft.reason.trim()) return setDraftErr(true);
    const nr: AccessRequest = { id: 'r' + Date.now(), who: 'Aran Suphachai', initials: 'AS', dept: 'Security', system: draft.system, level: draft.level as any, reason: draft.reason.trim(), date: 'Just now', status: 'pending' };
    setRequests([nr, ...requests]);
    setTab('pending');
    setDraft(null);
    toast('Request submitted for approval');
  }

  return (
    <>
      <PageHeader title="Access Requests" sub="Review and act on pending approvals"
        action={<BtnPrimary onClick={() => { setDraft({ system: 'Salesforce CRM', level: 'Read', reason: '' }); setDraftErr(false); }} style={{ padding: '10px 16px' }}>+ New request</BtnPrimary>} />

      <div style={{ flex: 1, overflow: 'auto', padding: '26px 30px 46px' }}>
        <div style={{ maxWidth: 1000 }}>
          <div style={{ display: 'flex', gap: 4, background: '#ece6dc', padding: 4, borderRadius: 11, width: 'fit-content', marginBottom: 18 }}>
            {tabs.map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{ border: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 8, background: tab === k ? '#fbfaf7' : 'transparent', color: tab === k ? '#211f1b' : '#8f8880' }}>{l} <span style={{ opacity: .6 }}>{requests.filter((r) => r.status === k).length}</span></button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((r) => (
              <div key={r.id} style={{ background: '#fbfaf7', border: '1px solid rgba(33,31,27,.08)', borderRadius: 13, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ width: 38, height: 38, flex: 'none', borderRadius: '50%', background: '#ece6dc', color: '#55504a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>{r.initials}</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 14 }}><span style={{ fontWeight: 600 }}>{r.who}</span> <span style={{ color: '#8f8880' }}>· {r.dept}</span></div>
                  <div style={{ fontSize: 13, color: '#55504a', marginTop: 4 }}>Requesting <b>{r.level}</b> on <b>{r.system}</b></div>
                  <div style={{ fontSize: 12.5, color: '#8f8880', marginTop: 5, fontStyle: 'italic' }}>“{r.reason}”</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, color: '#8f8880' }}>{r.date}</div>
                {r.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <BtnGhost onClick={() => setDecision({ id: r.id, action: 'deny', who: r.who, system: r.system, level: r.level })} style={{ padding: '9px 16px', fontSize: 13 }}>Deny</BtnGhost>
                    <BtnPrimary onClick={() => setDecision({ id: r.id, action: 'approve', who: r.who, system: r.system, level: r.level })} style={{ padding: '9px 18px', fontSize: 13 }}>Approve</BtnPrimary>
                  </div>
                ) : (
                  <Badge bg={r.status === 'approved' ? '#e3ede4' : '#f2e0dc'} fg={r.status === 'approved' ? '#3c6b46' : '#a23b2d'}>{r.status === 'approved' ? 'Approved' : 'Denied'}</Badge>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: 44, textAlign: 'center', color: '#8f8880', fontSize: 13.5, background: '#fbfaf7', border: '1px dashed rgba(33,31,27,.14)', borderRadius: 13 }}>Nothing here yet.</div>}
          </div>
        </div>
      </div>

      {decision && (
        <Modal title={decision.action === 'approve' ? 'Approve access?' : 'Deny request?'} width={420} onClose={() => setDecision(null)}
          footer={<><BtnGhost onClick={() => setDecision(null)}>Cancel</BtnGhost>
            <button onClick={confirmDecision} style={{ border: 0, background: decision.action === 'deny' ? '#a23b2d' : 'var(--accent)', color: '#fff', padding: '10px 18px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>{decision.action === 'approve' ? 'Approve' : 'Deny'}</button></>}>
          <div style={{ fontSize: 13.5, color: '#55504a', lineHeight: 1.5 }}>
            {decision.action === 'approve'
              ? `Grant ${decision.who} ${decision.level} access to ${decision.system}. This will be logged and the user notified immediately.`
              : `Deny ${decision.who}’s request for ${decision.level} access to ${decision.system}. They will be notified with your decision.`}
          </div>
        </Modal>
      )}

      {draft && (
        <Modal title="New access request" sub="Request will be routed to the resource owner for approval." width={460} onClose={() => setDraft(null)}
          footer={<><BtnGhost onClick={() => setDraft(null)}>Cancel</BtnGhost><BtnPrimary onClick={submitRequest}>Submit request</BtnPrimary></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <label style={labelStyle()}>System<select value={draft.system} onChange={(e) => setDraft({ ...draft, system: e.target.value })} style={{ ...fieldStyle(), cursor: 'pointer' }}>{SYSTEMS.map((o) => <option key={o}>{o}</option>)}</select></label>
            <label style={labelStyle()}>Access level<select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })} style={{ ...fieldStyle(), cursor: 'pointer' }}><option>Read</option><option>Write</option><option>Admin</option></select></label>
            <label style={labelStyle()}>Business justification<textarea value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} rows={3} placeholder="Why do you need this access?" style={{ ...fieldStyle(), resize: 'vertical' }} /></label>
            {draftErr && <div style={{ fontSize: 12.5, color: '#a23b2d' }}>Please add a short justification.</div>}
          </div>
        </Modal>
      )}
    </>
  );
}
