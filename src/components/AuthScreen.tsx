import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from '../i18n/useTranslation'
import ThemeSwitcher from './ThemeSwitcher'
import LanguageSwitcher from './LanguageSwitcher'
import Logo from './Logo'

export default function AuthScreen() {
  const { signIn, signUp } = useAuth()
  const { t } = useTranslation()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)

    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password)

    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (mode === 'signup') {
      setInfo(t('auth.accountCreated'))
    }
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-sm flex-col justify-center gap-6 p-6">
      <div className="flex justify-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col items-center text-center">
        <Logo size={56} animated />
        <h1 className="mt-3 font-display text-xl font-semibold text-fg">LabCosmetic</h1>
        <p className="mt-1 text-sm text-fg/50">
          {mode === 'signin' ? t('auth.signInSubtitle') : t('auth.signUpSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.email')}
          className="rounded border border-border bg-panel px-3 py-2 text-sm text-fg placeholder:text-fg/40 focus:border-accent focus:outline-none"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.password')}
          className="rounded border border-border bg-panel px-3 py-2 text-sm text-fg placeholder:text-fg/40 focus:border-accent focus:outline-none"
        />

        {error && <p className="text-sm text-danger">{error}</p>}
        {info && <p className="text-sm text-success">{info}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
        >
          {submitting ? t('auth.submitting') : mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin')
          setError(null)
          setInfo(null)
        }}
        className="text-sm text-fg/50 hover:text-fg"
      >
        {mode === 'signin' ? t('auth.switchToSignUp') : t('auth.switchToSignIn')}
      </button>
    </div>
  )
}
