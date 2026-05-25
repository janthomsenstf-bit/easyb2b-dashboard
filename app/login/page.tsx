'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email oder Passwort ungültig');
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#003366',
            textAlign: 'center',
          }}
        >
          Easy-B2B
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          Dashboard für Operatoren
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#fee',
                color: '#c00',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '6px',
                color: '#333',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              placeholder="operator@easyb2b.de"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '6px',
                color: '#333',
              }}
            >
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              backgroundColor: loading ? '#999' : '#003366',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#001a4d';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#003366';
              }
            }}
          >
            {loading ? 'Wird angemeldet...' : 'Anmelden'}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #eee',
            fontSize: '12px',
            color: '#999',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 8px 0' }}>
            Test-Credentials:
          </p>
          <p style={{ margin: '4px 0' }}>
            <code style={{ backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
              operator@easyb2b.de
            </code>
          </p>
          <p style={{ margin: '0' }}>
            <code style={{ backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
              operator123
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
