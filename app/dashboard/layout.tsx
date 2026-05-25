'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Lädt...</div>;
  }

  if (!session) {
    return null;
  }

  const navItems = [
    { label: 'Übersicht', href: '/dashboard', icon: '📊' },
    { label: 'Anfragen', href: '/dashboard/anfragen', icon: '📋' },
    { label: 'Interessenten', href: '/dashboard/interessenten', icon: '👥' },
    { label: 'Matchmaking', href: '/dashboard/matchmaking', icon: '🎯' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          backgroundColor: '#003366',
          color: 'white',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #e0e0e0',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '30px',
            marginTop: 0,
          }}
        >
          Easy-B2B
        </h2>

        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                marginBottom: '8px',
                borderRadius: '6px',
                textDecoration: 'none',
                color: pathname === item.href ? '#003366' : 'white',
                backgroundColor:
                  pathname === item.href ? '#FF9900' : 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                if (pathname !== item.href) {
                  el.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                if (pathname !== item.href) {
                  el.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ marginRight: '8px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '16px' }}>
          <p style={{ fontSize: '12px', margin: '0 0 8px 0', opacity: 0.8 }}>
            Angemeldet als:
          </p>
          <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 16px 0' }}>
            {session.user?.email}
          </p>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF9900';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
