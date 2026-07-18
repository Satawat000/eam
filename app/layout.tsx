import './globals.css';
import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import { ToastProvider } from '@/components/Toast';
import { requests } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Enterprise Access Management',
  description: 'Vantage Financial Group — Access Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pending = requests.filter((r) => r.status === 'pending').length;
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div style={{ minHeight: '100vh', display: 'flex' }}>
            <Sidebar pending={pending} />
            <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
