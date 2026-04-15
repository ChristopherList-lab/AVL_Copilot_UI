import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthScreen, Field } from '../components/AuthScreen';
import { useAuth } from '../lib/auth';

export function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = (form.get('email') ?? '').toString().trim();
    const password = (form.get('password') ?? '').toString();
    if (!email || !password) {
      setError('Enter an email and password.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch {
      setError('Sign in failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      eyebrow="// Sign In"
      title="Welcome back."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Password" name="password" type="password" autoComplete="current-password" required />
        {error && (
          <div className="mb-6 font-mono text-[11px] uppercase tracking-widest text-red-400">{error}</div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-black font-mono font-black uppercase tracking-[0.3em] text-xs py-4 hover:bg-white transition-all rounded-full disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
        <div className="mt-6 text-center">
          <Link
            to="/forgot"
            className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </AuthScreen>
  );
}
