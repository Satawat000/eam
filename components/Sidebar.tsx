'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Dashboard', icon: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M14 14h6v6h-6z', 'M4 14h6v6H4z'] },
  { href: '/users', label: 'Users', icon: ['M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2', 'M9.5 10a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4', 'M21 20v-2a4 4 0 0 0-3-3.8', 'M15 3.7a3.2 3.2 0 0 1 0 6.2'] },
  { href: '/roles', label: 'Roles & Permissions', icon: ['M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z'] },
  { href: '/requests', label: 'Requests', icon: ['M8 4h9a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M9 9h6', 'M9 13h6', 'M9 17h3'] },
  { href: '/audit', label: 'Audit Logs', icon: ['M4 6h16', 'M4 12h16', 'M4 18h10'] },
];

function Icon({ paths, color }: { paths: string[]; color: string }) {
  return (
    <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

export default function Sidebar({ pending }: { pending: number }) {
  const path = usePathname();
  return (
    <aside style={{ width: 250, flex: 'none', background: '#fbfaf7', borderRight: '1px solid rgba(33,31,27,.09)', display: 'flex', flexDirection: 'column', padding: '20px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 6px 22px' }}>
        <div style={{ width: 28, height: 28, flex: 'none', background: 'var(--accent)', transform: 'rotate(45deg)', borderRadius: 6 }} />
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-.2px' }}>Vantage</div>
          <div style={{ fontSize: 11, color: '#8f8880' }}>Access Management</div>
        </div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV.map((n) => {
          const active = n.href === '/' ? path === '/' : path.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13, width: '100%', padding: '10px 12px', borderRadius: 9, color: '#55504a', fontSize: 14, textDecoration: 'none' }}>
              {active && <span style={{ position: 'absolute', inset: 0, borderRadius: 9, background: 'color-mix(in srgb, var(--accent) 12%, transparent)', boxShadow: 'inset 3px 0 0 var(--accent)' }} />}
              <span style={{ position: 'relative', display: 'flex', width: 19, height: 19, flex: 'none' }}><Icon paths={n.icon} color={active ? 'var(--accent)' : '#8a847c'} /></span>
              <span style={{ position: 'relative' }}>{n.label}</span>
              {n.href === '/requests' && pending > 0 && (
                <span style={{ position: 'relative', marginLeft: 'auto', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600, minWidth: 19, height: 19, padding: '0 6px', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pending}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 8px', borderTop: '1px solid rgba(33,31,27,.08)' }}>
        <div style={{ width: 34, height: 34, flex: 'none', borderRadius: '50%', background: '#2c2925', color: '#f1ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 600 }}>AS</div>
        <div style={{ lineHeight: 1.25 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Aran Suphachai</div>
          <div style={{ fontSize: 11, color: '#8f8880' }}>Security Admin</div>
        </div>
      </div>
    </aside>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 30px 18px', borderBottom: '1px solid rgba(33,31,27,.07)' }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.4px' }}>{title}</div>
        <div style={{ fontSize: 13, color: '#8f8880', marginTop: 3 }}>{sub}</div>
      </div>
      {action && <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>{action}</div>}
    </div>
  );
}
