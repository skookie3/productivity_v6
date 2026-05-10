'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/')
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">Focus</div>
        <h1 className="auth-title">Connexion</h1>
        <p className="auth-subtitle">Connecte-toi pour synchroniser tes données</p>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="ton@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="error-text">{error}</p>}
          
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <p className="auth-link-text">
          Pas encore de compte ?{' '}
          <Link href="/auth/sign-up">Créer un compte</Link>
        </p>
      </div>
      
      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a1f;
          padding: 20px;
          font-family: 'Inter', -apple-system, 'SF Pro Display', sans-serif;
        }
        
        .auth-card {
          background: #2c2c35;
          border-radius: 16px;
          padding: 32px;
          width: 100%;
          max-width: 380px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        
        .auth-logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          text-align: center;
          margin-bottom: 24px;
          letter-spacing: -0.03em;
        }
        
        .auth-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
          text-align: center;
          letter-spacing: -0.02em;
        }
        
        .auth-subtitle {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.5);
          margin: 0 0 24px;
          text-align: center;
        }
        
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .form-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
        }
        
        .form-field input {
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 0.9rem;
          color: #fff;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }
        
        .form-field input::placeholder {
          color: rgba(255,255,255,0.3);
        }
        
        .form-field input:focus {
          border-color: rgba(255,255,255,0.3);
        }
        
        .error-text {
          font-size: 0.85rem;
          color: #ef4444;
          margin: 0;
          text-align: center;
        }
        
        .auth-btn {
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 12px;
          padding: 14px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
          margin-top: 8px;
        }
        
        .auth-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.2);
        }
        
        .auth-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .auth-link-text {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          text-align: center;
          margin: 20px 0 0;
        }
        
        .auth-link-text a {
          color: #fff;
          text-decoration: underline;
        }
        
        .auth-link-text a:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  )
}
