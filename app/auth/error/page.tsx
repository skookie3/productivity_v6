import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a1f',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, 'SF Pro Display', sans-serif",
    }}>
      <div style={{
        background: '#2c2c35',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '380px',
        border: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#fff',
          marginBottom: '24px',
          letterSpacing: '-0.03em',
        }}>Focus</div>
        
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
        
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#fff',
          margin: '0 0 12px',
          letterSpacing: '-0.02em',
        }}>Erreur d&apos;authentification</h1>
        
        <p style={{
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.6)',
          margin: '0 0 24px',
          lineHeight: 1.5,
        }}>
          Une erreur est survenue lors de l&apos;authentification. Réessaie ou contacte le support.
        </p>
        
        <Link href="/auth/login" style={{
          display: 'block',
          background: 'rgba(255,255,255,0.12)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          borderRadius: '12px',
          padding: '14px',
          fontSize: '0.95rem',
          fontWeight: 700,
          color: '#fff',
          textDecoration: 'none',
        }}>
          Retour à la connexion
        </Link>
      </div>
    </div>
  )
}
