'use client';
import { ReactNode } from 'react';

export default function Modal({ title, sub, width = 460, onClose, children, footer }: {
  title: string; sub?: string; width?: number; onClose: () => void; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,21,.42)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width, maxWidth: '100%', maxHeight: '88vh', overflow: 'auto', background: '#fbfaf7', borderRadius: 16, padding: 26, boxShadow: '0 24px 60px rgba(0,0,0,.28)' }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: '#8f8880', marginTop: 4 }}>{sub}</div>}
        <div style={{ marginTop: 20 }}>{children}</div>
        {footer && <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 22 }}>{footer}</div>}
      </div>
    </div>
  );
}

export function BtnGhost({ children, ...p }: any) {
  return <button {...p} style={{ border: '1px solid rgba(33,31,27,.16)', background: '#fff', padding: '10px 18px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', color: '#55504a', ...(p.style || {}) }}>{children}</button>;
}
export function BtnPrimary({ children, ...p }: any) {
  return <button {...p} style={{ border: 0, background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', ...(p.style || {}) }}>{children}</button>;
}
export function Badge({ bg, fg, children }: { bg: string; fg: string; children: ReactNode }) {
  return <span style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: bg, color: fg, fontWeight: 600 }}>{children}</span>;
}
export function fieldStyle(): React.CSSProperties {
  return { display: 'block', width: '100%', marginTop: 7, padding: '10px 12px', border: '1px solid rgba(33,31,27,.14)', borderRadius: 9, background: '#fff', fontSize: 13.5, fontWeight: 400 };
}
export function labelStyle(): React.CSSProperties {
  return { fontSize: 12.5, fontWeight: 600, color: '#55504a' };
}
