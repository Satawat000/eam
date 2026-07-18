import { PageHeader } from '@/components/Sidebar';
import { Badge } from '@/components/Modal';
import Link from 'next/link';
import { users, audit, requests, resultStyle } from '@/lib/data';
import { DEPARTMENTS } from '@/lib/types';

export default function Dashboard() {
  const pending = requests.filter((r) => r.status === 'pending').length;
  const deptCounts = DEPARTMENTS.map((d) => ({ dept: d, count: users.filter((u) => u.dept === d).length })).filter((x) => x.count > 0).sort((a, b) => b.count - a.count);
  const maxDept = Math.max(...deptCounts.map((d) => d.count), 1);
  const week = [9, 14, 11, 18, 7, 22, 16];
  const maxW = Math.max(...week);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const stats = [
    { label: 'Total users', value: users.length, delta: '+2 this week', deltaColor: '#3c6b46' },
    { label: 'Active roles', value: 6, delta: '2 with elevated access', deltaColor: '#8f8880' },
    { label: 'Pending requests', value: pending, delta: pending ? 'Awaiting your review' : 'All clear', deltaColor: pending ? '#8a6d2b' : '#3c6b46' },
    { label: 'Connected systems', value: 8, delta: 'All monitored', deltaColor: '#8f8880' },
  ];

  const panel: React.CSSProperties = { background: '#fbfaf7', border: '1px solid rgba(33,31,27,.08)', borderRadius: 13, padding: 20 };

  return (
    <>
      <PageHeader title="Overview" sub="Access posture across Vantage Financial Group" />
      <div style={{ flex: 1, overflow: 'auto', padding: '26px 30px 46px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1180 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ ...panel, padding: '18px 18px 16px' }}>
                <div style={{ fontSize: 12.5, color: '#8f8880' }}>{s.label}</div>
                <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-1px', marginTop: 8 }}>{s.value}</div>
                <div style={{ fontSize: 12, marginTop: 6, color: s.deltaColor }}>{s.delta}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
            <div style={panel}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>Access requests</div>
                <div style={{ fontSize: 12, color: '#8f8880' }}>last 7 days</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 150, marginTop: 22 }}>
                {week.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', height: 110 }}>
                      <div style={{ width: '100%', background: 'color-mix(in srgb, var(--accent) 78%, #d8cfc2)', borderRadius: '6px 6px 0 0', height: `${Math.round((v / maxW) * 100)}%` }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#8f8880' }}>{days[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={panel}>
              <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16 }}>Users by department</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {deptCounts.map((d) => (
                  <div key={d.dept}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                      <span>{d.dept}</span><span style={{ color: '#8f8880' }}>{d.count}</span>
                    </div>
                    <div style={{ height: 7, background: '#ece6dc', borderRadius: 20, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.round((d.count / maxDept) * 100)}%`, background: 'var(--accent)', borderRadius: 20 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={panel}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>Recent activity</div>
              <Link href="/audit" style={{ fontSize: 12.5, fontWeight: 600 }}>View audit log →</Link>
            </div>
            {audit.slice(0, 5).map((a, i) => {
              const rs = resultStyle(a.result);
              const initials = a.actor === 'System' ? 'SY' : a.actor === 'Unknown' ? '??' : a.actor.split(' ').map((w) => w[0]).slice(0, 2).join('');
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 2px', borderTop: '1px solid rgba(33,31,27,.06)' }}>
                  <div style={{ width: 30, height: 30, flex: 'none', borderRadius: '50%', background: '#ece6dc', color: '#55504a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{initials}</div>
                  <div style={{ fontSize: 13, flex: 1 }}><span style={{ fontWeight: 600 }}>{a.actor}</span> <span style={{ color: '#55504a' }}>{a.action.toLowerCase()}</span> <span style={{ fontWeight: 500 }}>{a.target}</span></div>
                  <Badge bg={rs.bg} fg={rs.fg}>{a.result}</Badge>
                  <div style={{ fontSize: 11.5, color: '#8f8880', width: 96, textAlign: 'right' }}>{a.time.replace('Jul 17 · ', '')}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
