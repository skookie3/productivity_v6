'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">Focus</div>
          <div className="success-icon">✉️</div>
          <h1 className="auth-title">Vérifie ton email</h1>
          <p className="auth-subtitle">
            Un email de confirmation a été envoyé à <strong>{email}</strong>.
            Clique sur le lien pour activer ton compte.
          </p>
          <Link href="/auth/login" className="auth-btn-link">
            Retour à la connexion
          </Link>
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
            text-align: center;
          }
          
          .auth-logo {
            font-size: 1.5rem;
            font-weight: 800;
            color: #fff;
            margin-bottom: 24px;
            letter-spacing: -0.03em;
          }
          
          .success-icon {
            font-size: 3rem;
            margin-bottom: 16px;
          }
          
          .auth-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #fff;
            margin: 0 0 12px;
            letter-spacing: -0.02em;
          }
          
          .auth-subtitle {
            font-size: 0.9rem;
            color: rgba(255,255,255,0.6);
            margin: 0 0 24px;
            line-height: 1.5;
          }
          
          .auth-subtitle strong {
            color: #fff;
          }
          
          .auth-btn-link {
            display: block;
            background: rgba(255,255,255,0.12);
            border: 1.5px solid rgba(255,255,255,0.25);
            border-radius: 12px;
            padding: 14px;
            font-size: 0.95rem;
            font-weight: 700;
            color: #fff;
            text-decoration: none;
            transition: all 0.15s;
          }
          
          .auth-btn-link:hover {
            background: rgba(255,255,255,0.2);
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">Focus</div>
        <h1 className="auth-title">Créer un compte</h1>
        <p className="auth-subtitle">Synchronise tes habitudes sur tous tes appareils</p>
        
        <form onSubmit={handleSignUp} className="auth-form">
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
          
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="error-text">{error}</p>}
          
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
        
        <p className="auth-link-text">
          Déjà un compte ?{' '}
          <Link href="/auth/login">Se connecter</Link>
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
