'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/Sidebar';
import { Badge } from '@/components/Modal';
import { audit, resultStyle } from '@/lib/data';

export default function AuditPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('All results');

  const filtered = audit.filter((a) => {
    const m = (a.actor + a.action + a.target).toLowerCase().includes(query.toLowerCase());
    return m && (result === 'All results' || a.result === result.toLowerCase());
  });

  const th: React.CSSProperties = { fontSize: 11.5, fontWeight: 600, color: '#8f8880', letterSpacing: '.04em', textTransform: 'uppercase' };
  const cols = '150px 1.4fr 1.8fr 1fr 120px';

  return (
    <>
      <PageHeader title="Audit Logs" sub="Immutable record of every access event" />
      <div style={{ flex: 1, overflow: 'auto', padding: '26px 30px 46px' }}>
        <div style={{ maxWidth: 1180 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search actor, action, target…" style={{ flex: 1, minWidth: 220, padding: '10px 14px', border: '1px solid rgba(33,31,27,.14)', borderRadius: 9, background: '#fbfaf7', fontSize: 13.5 }} />
            <select value={result} onChange={(e) => setResult(e.target.value)} style={{ padding: '10px 14px', border: '1px solid rgba(33,31,27,.14)', borderRadius: 9, background: '#fbfaf7', fontSize: 13.5, cursor: 'pointer' }}>
              {['All results', 'success', 'denied', 'info'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div style={{ background: '#fbfaf7', border: '1px solid rgba(33,31,27,.08)', borderRadius: 13, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '12px 18px', borderBottom: '1px solid rgba(33,31,27,.08)' }}>
              <div style={th}>Timestamp</div><div style={th}>Actor</div><div style={th}>Action</div><div style={th}>Result</div><div style={th}>IP</div>
            </div>
            {filtered.map((a, i) => {
              const rs = resultStyle(a.result);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', padding: '12px 18px', borderTop: '1px solid rgba(33,31,27,.055)' }}>
                  <div style={{ fontSize: 12, color: '#8f8880', fontVariantNumeric: 'tabular-nums' }}>{a.time}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.actor}</div>
                  <div style={{ fontSize: 13, color: '#55504a' }}>{a.action} <b style={{ color: '#211f1b' }}>{a.target}</b></div>
                  <div><Badge bg={rs.bg} fg={rs.fg}>{a.result}</Badge></div>
                  <div style={{ fontSize: 12, color: '#8f8880', fontVariantNumeric: 'tabular-nums' }}>{a.ip}</div>
                </div>
              );
            })}
            {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#8f8880', fontSize: 13.5 }}>No matching events.</div>}
          </div>
        </div>
      </div>
    </>
  );
}
