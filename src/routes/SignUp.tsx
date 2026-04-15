import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthScreen, Field } from '../components/AuthScreen';
import { useAuth } from '../lib/auth';

export function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = (form.get('name') ?? '').toString().trim();
    const email = (form.get('email') ?? '').toString().trim();
    const role = (form.get('role') ?? '').toString().trim();
    const password = (form.get('password') ?? '').toString();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await signUp({ name, email, role, password });
      navigate('/', { replace: true });
    } catch {
      setError('Sign up failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      eyebrow="// Sign Up"
      title="Create your account."
      footer={
        <>
          Have an account?{' '}
          <Link to="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Name" name="name" autoComplete="name" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Role" name="role" placeholder="Audio Engineer, LD, A1…" autoComplete="organization-title" />
        <Field label="Password" name="password" type="password" autoComplete="new-password" required />
        {error && (
          <div className="mb-6 font-mono text-[11px] uppercase tracking-widest text-red-400">{error}</div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-black font-mono font-black uppercase tracking-[0.3em] text-xs py-4 hover:bg-white transition-all rounded-full disabled:opacity-60"
        >
          {submitting ? 'Creating…' : 'Create Account'}
        </button>
      </form>
    </AuthScreen>
  );
}
